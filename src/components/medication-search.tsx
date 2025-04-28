"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase"; // Import Supabase client

interface Medication {
  code: string;
  denomination_du_medicament: string | null;
  composition_qualitative_et_quantitative: string | null;
  proprietes_pharmacodynamiques: string | null;
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
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>(
    []
  );
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>(
    []
  );

  const pageSize = 10;

  // Function to clean the medicament name and keep everything before the comma
  const cleanMedicamentName = (name: string) => {
    if (!name) return ""; // If name is null or undefined, return an empty string

    // Match everything before the first comma (including parentheses if any)
    const match = name.match(/^[^,]*/); // This will match everything before the first comma
    return match ? match[0].trim() : name; // Return the matched part before the comma
  };

  // Function to clean the composition field and remove everything after the dots
  const cleanComposition = (composition: string) => {
    const match = composition.match(/^[^\.]+/); // Match everything before the first dot
    return match ? match[0].trim() : composition; // Return the cleaned composition or the original composition if no match
  };

  const extractCodeAtc = (pharmacodynamicsText: string) => {
    // Use regex to capture the Code ATC after "Code ATC :"
    const match = pharmacodynamicsText.match(
      /Code ATC\s*[:|-]?\s*([A-Za-z0-9]+)/
    );
    return match ? match[1].trim() : "Non disponible"; // Return the cleaned Code ATC or a default message
  };

  const extractClassePharmaco = (pharmacodynamicsText: string) => {
    // Case 1: Look for "Classe pharmacothérapeutique : ..." and capture after the colon
    const explicitClassMatch = pharmacodynamicsText.match(
      /Classe\spharmacothérapeutique\s*[:|-\s]*([^\n,;:]+)/
    );

    if (explicitClassMatch) {
      return explicitClassMatch[1].trim(); // Return the matched class name
    }

    // Case 2: If "Code ATC" is present, capture everything before it as the class
    const classBeforeATCMatch = pharmacodynamicsText.match(
      /^([^,;:\n]+)(?=\s*Code ATC)/
    );

    if (classBeforeATCMatch) {
      return classBeforeATCMatch[1].trim(); // Return the matched class name before "Code ATC"
    }

    return "Non disponible"; // Default return if no match is found
  };

  // Function to fetch medications from Supabase
  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase.from("medicaments").select("*"); // Fetch all medications (adjust as needed)

      if (error) throw error;

      setMedications(data as Medication[]);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  useEffect(() => {
    fetchMedications(); // Fetch medications when the component mounts
  }, []);

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
    // Filter medications based on the search term
    const filtered = medications.filter((medication) => {
      const medicationName = medication.denomination_du_medicament || "";
      return medicationName
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setFilteredMedications(filtered);
  };

  // Add medication to the selection
  const handleAddMedication = (medication: Medication) => {
    if (selectedMedications.length < 2) {
      setSelectedMedications((prev) => [...prev, medication]);
      setSearchTerm(""); // Clear search term after selection
      setFilteredMedications([]); // Clear dropdown list after selection
    } else {
      alert("Vous pouvez sélectionner seulement deux médicaments.");
    }
  };

  // Remove medication from the selection
  const handleRemoveMedication = (code: string) => {
    setSelectedMedications(
      selectedMedications.filter((med) => med.code !== code)
    );
  };

  // Handle start analysis button click
  const handleStartAnalysis = () => {
    if (selectedMedications.length === 0) {
      alert("Veuillez sélectionner au moins un médicament.");
      return;
    }

    // Create a new URLSearchParams object with existing params (profile data)
    const resultsParams = new URLSearchParams(searchParams.toString());

    // Add only medication codes to the URL
    selectedMedications.forEach((med, index) => {
      // Add only the medication code (medCode) to the URL
      resultsParams.append(`medCode${index}`, med.code);
      // Extract and add the ATC code to the URL
      const atcCode = extractCodeAtc(med.proprietes_pharmacodynamiques || "");
      resultsParams.append(`atcCode${index}`, atcCode);
    });

    // Add flag to show sidebar if profile data exists
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

    // Navigate to results page with all parameters
    router.push(`/resultat?${resultsParams.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-teal-600 mb-1">
          Saisir des médicaments
        </h1>
        <p className="text-gray-500 mb-4">Trouvez des médicaments...</p>

        <div className="relative" ref={searchContainerRef}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Médicament/DCI"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          {/* Display the dropdown list of filtered medications */}
          {filteredMedications.length > 0 && (
            <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10">
              {filteredMedications.slice(0, pageSize).map((medication) => (
                <div
                  key={medication.code} // Use 'code' as the unique identifier
                  onClick={() => handleAddMedication(medication)}
                  className="cursor-pointer px-4 py-2 hover:bg-teal-100"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 mr-4">
                      <Image
                        src={"/default-img.jpg"} // Use a placeholder image
                        alt={`Image du médicament ${
                          medication.denomination_du_medicament || "inconnu"
                        }`}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <span>
                      {cleanMedicamentName(
                        medication.denomination_du_medicament || ""
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        {selectedMedications.map((medication) => (
          <div
            key={medication.code} // Use code as the unique identifier
            className="flex items-start border-b border-gray-100 py-6"
          >
            <div className="w-36 h-36 bg-gray-100 flex-shrink-0 mr-6 flex items-center justify-center rounded-sm overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={"/default-img.jpg"} // Use a placeholder image
                  alt={`Image du médicament ${
                    medication.denomination_du_medicament || "inconnu"
                  }`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-medium text-teal-600 mb-3">
                {cleanMedicamentName(
                  medication.denomination_du_medicament || ""
                )}
              </h2>
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
                  <span className="text-gray-500">Code ATC : </span>
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
            Démarrer l&apos;analyse
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
