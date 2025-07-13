"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase";

interface Medication {
  code: string;
  denomination_du_medicament: string | null;
  composition_qualitative_et_quantitative: string | null;
  proprietes_pharmacodynamiques: string | null;
  nom_commercial?: string;
  dosage?: string;
  boite_ou_flacon?: string;
  source?: "original" | "algerian"; // Pour identifier la source
}

interface AlgerianMed {
  id: number;
  numero_dans_la_base: string;
  dci: string;
  nom_commercial: string;
  forme: string;
  dosage: string;
  boite_ou_flacon: string;
}

// Type pour les résultats de recherche combinés
interface SearchResult {
  id: string;
  displayName: string;
  dci: string;
  dosage?: string;
  boite?: string;
  source: "original" | "algerian";
  originalData: Medication | AlgerianMed;
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      <span className="ml-2 text-gray-500">Chargement...</span>
    </div>
  );
}

// Main component to be exported
export default function MedicationSearchWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MedicationSearch />
    </Suspense>
  );
}

// The component that uses useSearchParams
function MedicationSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [filteredMedications, setFilteredMedications] = useState<
    SearchResult[]
  >([]);
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>(
    []
  );

  const pageSize = 10;
  const MAX_MEDICATIONS = 10; // Limite maximum de médicaments sélectionnables

  // Function to clean the medicament name and keep everything before the comma
  const cleanMedicamentName = (name: string) => {
    if (!name) return "";
    const match = name.match(/^[^,]*/);
    return match ? match[0].trim() : name;
  };

  // Function to clean the composition field and remove everything after the dots
  const cleanComposition = (composition: string) => {
    if (!composition) return "";
    const match = composition.match(/^[^\.]+/);
    return match ? match[0].trim() : composition;
  };

  const extractCodeAtc = (pharmacodynamicsText: string) => {
    if (!pharmacodynamicsText) return "Non disponible";
    const match = pharmacodynamicsText.match(
      /Code ATC\s*[:|-]?\s*([A-Za-z0-9]+)/i
    );
    return match ? match[1].trim() : "Non disponible";
  };

  const extractClassePharmaco = (pharmacodynamicsText: string) => {
    if (!pharmacodynamicsText) return "Non disponible";

    const explicitClassMatch = pharmacodynamicsText.match(
      /Classe\spharmacothérapeutique\s*[:|-\s]*([^\n,;:]+)/
    );

    if (explicitClassMatch) {
      return explicitClassMatch[1].trim();
    }

    const classBeforeATCMatch = pharmacodynamicsText.match(
      /^([^,;:\n]+)(?=\s*Code ATC)/
    );

    if (classBeforeATCMatch) {
      return classBeforeATCMatch[1].trim();
    }

    return "Non disponible";
  };

  // Fonction pour rechercher dans les deux tables
  const searchInBothTables = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredMedications([]);
      return;
    }

    setIsSearching(true);
    try {
      // Recherche dans la table medicaments (originale)
      const { data: originalMeds, error: originalError } = await supabase
        .from("medicaments")
        .select(
          "code, denomination_du_medicament, composition_qualitative_et_quantitative, proprietes_pharmacodynamiques"
        )
        .or(
          `denomination_du_medicament.ilike.%${searchTerm}%,composition_qualitative_et_quantitative.ilike.%${searchTerm}%`
        )
        .limit(pageSize);

      // Recherche dans la table medicaments_algerie
      const { data: algerianMeds, error: algerianError } = await supabase
        .from("medicaments_algerie")
        .select(
          "id, numero_dans_la_base, dci, nom_commercial, forme, dosage, boite_ou_flacon"
        )
        .or(`nom_commercial.ilike.%${searchTerm}%,dci.ilike.%${searchTerm}%`)
        .limit(pageSize);

      if (originalError) {
        console.error("Error searching original medications:", originalError);
      }
      if (algerianError) {
        console.error("Error searching Algerian medications:", algerianError);
      }

      // Convertir les résultats en format unifié
      const originalResults: SearchResult[] = (originalMeds || []).map(
        (med) => ({
          id: `orig_${med.code}`,
          displayName: cleanMedicamentName(
            med.denomination_du_medicament || ""
          ),
          dci: cleanComposition(
            med.composition_qualitative_et_quantitative || ""
          ),
          source: "original" as const,
          originalData: med,
        })
      );

      const algerianResults: SearchResult[] = (algerianMeds || []).map(
        (med) => ({
          id: `alg_${med.id}`,
          displayName: med.nom_commercial,
          dci: med.dci,
          dosage: med.dosage,
          boite: med.boite_ou_flacon,
          source: "algerian" as const,
          originalData: med,
        })
      );

      // Combiner les résultats
      const combinedResults = [...originalResults, ...algerianResults];
      setFilteredMedications(combinedResults);
    } catch (error) {
      console.error("Error searching medications:", error);
      setFilteredMedications([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchInBothTables(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setFilteredMedications([]);
      }
    }

    if (filteredMedications.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filteredMedications]);

  // Filter medications based on search term
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Add medication to the selection
  const handleAddMedication = async (searchResult: SearchResult) => {
    if (selectedMedications.length >= MAX_MEDICATIONS) {
      alert(
        `Vous pouvez sélectionner au maximum ${MAX_MEDICATIONS} médicaments.`
      );
      return;
    }

    try {
      let finalMedication: Medication;

      if (searchResult.source === "original") {
        // Si c'est un médicament original, l'utiliser directement
        const originalMed = searchResult.originalData as Medication;
        finalMedication = {
          ...originalMed,
          source: "original",
        };
      } else {
        // Si c'est un médicament algérien, récupérer les données complètes
        const algerianMed = searchResult.originalData as AlgerianMed;

        const { data: originMed, error } = await supabase
          .from("medicaments")
          .select(
            "code, denomination_du_medicament, composition_qualitative_et_quantitative, proprietes_pharmacodynamiques"
          )
          .eq("code", algerianMed.numero_dans_la_base)
          .single();

        if (error || !originMed) {
          console.error("Origin medication not found:", error);
          // Si pas trouvé, créer un objet basique avec les données algériennes
          finalMedication = {
            code: `alg_${algerianMed.id}`,
            denomination_du_medicament: algerianMed.nom_commercial,
            composition_qualitative_et_quantitative: algerianMed.dci,
            proprietes_pharmacodynamiques: null,
            nom_commercial: algerianMed.nom_commercial,
            dosage: algerianMed.dosage,
            boite_ou_flacon: algerianMed.boite_ou_flacon,
            source: "algerian",
          };
        } else {
          // Fusionner les données
          finalMedication = {
            code: originMed.code,
            denomination_du_medicament: originMed.denomination_du_medicament,
            composition_qualitative_et_quantitative:
              originMed.composition_qualitative_et_quantitative,
            proprietes_pharmacodynamiques:
              originMed.proprietes_pharmacodynamiques,
            nom_commercial: algerianMed.nom_commercial,
            dosage: algerianMed.dosage,
            boite_ou_flacon: algerianMed.boite_ou_flacon,
            source: "algerian",
          };
        }
      }

      // Vérifier si le médicament n'est pas déjà sélectionné
      const exists = selectedMedications.some(
        (m) => m.code === finalMedication.code
      );
      if (!exists) {
        setSelectedMedications((prev) => [...prev, finalMedication]);
      } else {
        alert("Ce médicament est déjà sélectionné.");
      }

      setSearchTerm("");
      setFilteredMedications([]);
    } catch (err) {
      console.error("Error adding medication:", err);
    }
  };

  // Remove medication from the selection
  const handleRemoveMedication = (code: string) => {
    setSelectedMedications(
      selectedMedications.filter((med) => med.code !== code)
    );
  };

  // Clear all selected medications
  const handleClearAll = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir effacer tous les médicaments sélectionnés ?"
      )
    ) {
      setSelectedMedications([]);
    }
  };

  // Handle start analysis button click
  const handleStartAnalysis = () => {
    if (selectedMedications.length === 0) {
      alert("Veuillez sélectionner au moins un médicament.");
      return;
    }

    const resultsParams = new URLSearchParams(searchParams.toString());

    selectedMedications.forEach((med) => {
      resultsParams.append("medCodes", med.code);
      const atcCode = extractCodeAtc(med.proprietes_pharmacodynamiques || "");
      resultsParams.append("atcCodes", atcCode);
    });

    if (
      searchParams.has("gender") ||
      searchParams.has("ageGroup") ||
      searchParams.has("renal") ||
      searchParams.has("hepatic") ||
      searchParams.has("other") ||
      searchParams.has("pregnancyStatus")
    ) {
      resultsParams.append("showSidebar", "true");
    }

    router.push(`/resultat?${resultsParams.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-teal-600 mb-1">
          Saisir des médicaments
        </h1>
        <p className="text-gray-500 mb-4">
          Trouvez des médicaments français et algériens... (Maximum{" "}
          {MAX_MEDICATIONS} médicaments)
        </p>

        <div className="relative" ref={searchContainerRef}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Médicament/DCI (français ou algérien)"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {isSearching && (
            <div className="absolute right-3 top-3">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          )}

          {/* Display the dropdown list of filtered medications */}
          {filteredMedications.length > 0 && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10 max-h-80 overflow-y-auto">
              {filteredMedications.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleAddMedication(result)}
                  className="cursor-pointer px-4 py-3 hover:bg-teal-100 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-4">
                      <Image
                        src="/default-img.jpg"
                        alt={`Image ${result.displayName}`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {result.displayName}
                        </span>
                        {result.dosage && (
                          <span className="text-sm text-gray-600">
                            {result.dosage}
                          </span>
                        )}
                        {result.source === "algerian" && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Algérie
                          </span>
                        )}
                        {result.source === "original" && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            France
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        DCI: {result.dci}
                        {result.boite && ` • ${result.boite}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Display selected medications count and clear all button */}
      {selectedMedications.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {selectedMedications.length} médicament
            {selectedMedications.length > 1 ? "s" : ""} sélectionné
            {selectedMedications.length > 1 ? "s" : ""}
            {selectedMedications.length >= MAX_MEDICATIONS && (
              <span className="text-orange-600 ml-2">(Limite atteinte)</span>
            )}
          </span>
          <button
            onClick={handleClearAll}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            Tout effacer
          </button>
        </div>
      )}

      <div className="border-t border-gray-200 pt-4">
        {selectedMedications.map((medication, index) => (
          <div
            key={medication.code}
            className="flex items-start border-b border-gray-100 py-6"
          >
            <div className="w-36 h-36 bg-gray-100 flex-shrink-0 mr-6 flex items-center justify-center rounded-sm overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src="/default-img.jpg"
                  alt={`Image du médicament ${
                    medication.denomination_du_medicament || "inconnu"
                  }`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full font-medium">
                  #{index + 1}
                </span>
                <h2 className="text-xl font-medium text-teal-600">
                  {medication.nom_commercial ||
                    cleanMedicamentName(
                      medication.denomination_du_medicament || ""
                    )}
                  {medication.dosage ? ` ${medication.dosage}` : ""}
                  {medication.boite_ou_flacon
                    ? ` - ${medication.boite_ou_flacon}`
                    : ""}
                </h2>
                {medication.source === "algerian" && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Algérie
                  </span>
                )}
                {medication.source === "original" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    France
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div>
                  <span className="text-gray-500">DCI: </span>
                  <span className="text-gray-700">
                    {cleanComposition(
                      medication.composition_qualitative_et_quantitative || ""
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Code ATC: </span>
                  <span className="text-gray-700">
                    {extractCodeAtc(
                      medication.proprietes_pharmacodynamiques || ""
                    )}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500">
                    Classe pharmacothérapeutique:{" "}
                  </span>
                  <span className="text-gray-700">
                    {extractClassePharmaco(
                      medication.proprietes_pharmacodynamiques || ""
                    )}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemoveMedication(medication.code)}
              className="ml-4 px-4 py-2 text-red-500 border border-red-500 rounded-lg flex items-center hover:bg-red-50 transition-colors"
            >
              Effacer <X className="ml-1 h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {selectedMedications.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleStartAnalysis}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md flex items-center transition-colors"
          >
            Démarrer l&apos;analyse ({selectedMedications.length} médicament
            {selectedMedications.length > 1 ? "s" : ""})
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
