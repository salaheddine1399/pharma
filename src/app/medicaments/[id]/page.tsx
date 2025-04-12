"use client"; // Ensure this component is treated as client-side

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, AlertCircle, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/sidebar";
import UserAvatar from "@/components/user-avatar";
import supabase from "@/lib/supabase";
import { useParams } from "next/navigation";

interface Medication {
  code: string;
  denomination_du_medicament: string | null;
  composition_qualitative_et_quantitative: string | null;
  forme_pharmaceutique: string | null;
  donnees_cliniques: string | null;
  indications_therapeutiques: string | null;
  proprietes_pharmacodynamiques: string | null;
  titulaire_de_l_authorisation_de_mise_sur_le_marche: string | null;
  image_url?: string;
  interactions?: any[];
  equivalences?: any[];
  classe_therapeutique?: string;
}

export default function MedicamentDetailPage() {
  const params = useParams();
  // Use params.id instead of params.code
  const code = params.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medication, setMedication] = useState<Medication | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to clean the medicament name and keep everything before the comma
  const cleanMedicamentName = (name: string | null) => {
    if (!name) return "Nom non disponible";
    const match = name.match(/^[^,]*/);
    return match ? match[0].trim() : name;
  };

  // Function to clean the composition field and remove everything after the dots
  const cleanComposition = (composition: string | null) => {
    if (!composition) return "Non disponible";
    const match = composition.match(/^[^\.]+/);
    return match ? match[0].trim() : composition;
  };

  const extractClassePharmaco = (pharmacodynamicsText: string | null) => {
    if (!pharmacodynamicsText) return "Non disponible";

    // Case 1: Look for "Classe pharmacothérapeutique : ..." and capture after the colon
    const explicitClassMatch = pharmacodynamicsText.match(
      /Classe\spharmacothérapeutique\s*[:|-\s]*([^\n,;:]+)/
    );

    if (explicitClassMatch) {
      return explicitClassMatch[1].trim();
    }

    // Case 2: If "Code ATC" is present, capture everything before it as the class
    const classBeforeATCMatch = pharmacodynamicsText.match(
      /^([^,;:\n]+)(?=\s*Code ATC)/
    );

    if (classBeforeATCMatch) {
      return classBeforeATCMatch[1].trim();
    }

    return "Non disponible";
  };

  const extractCodeAtc = (pharmacodynamicsText: string | null) => {
    if (!pharmacodynamicsText) return "Non disponible";

    const match = pharmacodynamicsText.match(
      /Code ATC\s*[:|-]?\s*([A-Za-z0-9]+)/
    );
    return match ? match[1].trim() : "Non disponible";
  };

  // Simulated data - in a real app, you would fetch this based on the ID
  // Fetch medicament data based on the code
  useEffect(() => {
    const fetchMedicament = async () => {
      if (!code) {
        console.log("No code provided");
        setIsLoading(false);
        setError("Code du médicament non spécifié");
        return;
      }

      console.log("Fetching data for code:", code);
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("medicaments")
          .select("*")
          .eq("code", code);

        console.log("Raw response:", { data, error: fetchError });

        if (fetchError) {
          console.error("Error fetching medicament:", fetchError);
          setError("Erreur lors de la récupération des données");
          return;
        }

        // Check if we have data
        if (data && data.length > 0) {
          console.log("Found medicament data:", data[0]);

          // Transform the data into the expected format
          try {
            const medicationData: Medication = {
              code: data[0].code,
              denomination_du_medicament: data[0].denomination_du_medicament,
              composition_qualitative_et_quantitative:
                data[0].composition_qualitative_et_quantitative,
              forme_pharmaceutique: data[0].forme_pharmaceutique,
              donnees_cliniques: data[0].donnees_cliniques,
              indications_therapeutiques: data[0].indications_therapeutiques,
              proprietes_pharmacodynamiques:
                data[0].proprietes_pharmacodynamiques,
              titulaire_de_l_authorisation_de_mise_sur_le_marche:
                data[0].titulaire_de_l_authorisation_de_mise_sur_le_marche,
              // Add a default image URL since it's not in your schema
              image_url: "/default-medication.png",
              // Extract classe_therapeutique from pharmacodynamics
              classe_therapeutique: extractClassePharmaco(
                data[0].proprietes_pharmacodynamiques
              ),
              // Empty arrays for interactions and equivalences
              interactions: [],
              equivalences: [],
            };

            console.log("Transformed medication data:", medicationData);
            setMedication(medicationData);
          } catch (transformError) {
            console.error("Error transforming data:", transformError);
            setError("Erreur lors du traitement des données");
          }
        } else {
          console.log("No data found for code:", code);
          setError("Médicament non trouvé");
        }
      } catch (exception) {
        console.error("Exception during fetch:", exception);
        setError("Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicament();
  }, [code]);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEF7F2] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
          <p className="text-teal-700">Chargement des informations...</p>
        </div>
      </div>
    );
  }
  if (error || !medication) {
    return (
      <div className="min-h-screen bg-[#EEF7F2] flex justify-center items-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            {error || "Médicament non trouvé"}
          </h2>
          <p className="text-gray-600 mb-6">
            Nous n'avons pas pu trouver les informations pour ce médicament. Il
            est possible que le code soit incorrect.
          </p>
          <Link
            href="/medicaments"
            className="bg-[#388075] hover:bg-[#2D6A62] text-white px-6 py-2 rounded flex items-center gap-2 transition-colors w-max mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à la liste</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link
          href="/medicaments"
          className="flex items-center text-[#388075] hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des médicaments
        </Link>
      </div>
      {/* Top navigation space */}
      <div className="pb-4 mb-8"></div>

      {/* Medication Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
          <img
            src={"/default-img.jpg"}
            alt={cleanMedicamentName(medication.denomination_du_medicament)}
            className="max-w-full h-auto max-h-48 object-contain"
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-xl font-medium text-teal-700 mb-4">
            {cleanMedicamentName(medication.denomination_du_medicament)}
          </h1>

          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-medium">DCI:</span>{" "}
              {cleanComposition(
                medication.composition_qualitative_et_quantitative
              )}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Code ATC:</span>{" "}
              {extractCodeAtc(medication.proprietes_pharmacodynamiques)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Classe pharmacothérapeutique:</span>{" "}
              {extractClassePharmaco(
                medication.proprietes_pharmacodynamiques || ""
              )}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Forme Pharmaceutique:</span>{" "}
              {medication.forme_pharmaceutique || "Non spécifié"}
            </p>
          </div>

          <div className="mt-6">
            <div className="bg-yellow-300 rounded-full py-2 px-4 inline-flex items-center gap-2 float-right">
              <div className="bg-black rounded-full p-1">
                <AlertCircle className="h-4 w-4 text-yellow-300" />
              </div>
              <span className="font-medium">Interactions médicamenteuses</span>
              <div className="bg-black rounded-full p-1">
                <span className="text-white text-xs font-bold h-4 w-4 flex items-center justify-center">
                  i
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b pb-4 mb-8"></div>

      {/* Medication Description */}
      <div className="mb-12">
        <h2 className="text-lg font-medium text-teal-700 mb-4">
          Informations sur le médicament
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {medication.indications_therapeutiques || "Non spécifié"}
        </p>
      </div>

      <div className="border-b pb-4 mb-8"></div>

      {/* Interactions Section */}
      <div className="border rounded-lg mb-6 overflow-hidden ">
        <div
          className="flex justify-between items-center p-4 cursor-pointer bg-white"
          onClick={() =>
            setExpandedSection(
              expandedSection === "interactions" ? "" : "interactions"
            )
          }
        >
          <h3 className="font-medium">Interactions médicamenteuses</h3>
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </div>
        <div className="p-4 border-t bg-white">
          <p className="text-gray-600 text-sm mb-6">
            Ce médicament ne peut pas être consommé avec ces médicaments:
          </p>
          <div className="border-t pt-4">
            {medication.interactions.map((med, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center">
                  <Image
                    src={med.img}
                    alt={med.name}
                    width={120}
                    height={120}
                    className="max-w-full h-auto"
                    unoptimized
                  />
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-teal-700 mb-2">
                    {med.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">DCI:</span> {med.dci}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">C.Therapeutique:</span>{" "}
                        {med.therapeutic}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Laboratoire:</span>{" "}
                        {med.lab}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm">
                      Contre indication
                    </span>
                    <button className="bg-teal-600 text-white p-2 rounded">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equivalences Section */}
      <div className="border rounded-lg mb-6 overflow-hidden">
        <div
          className="flex justify-between items-center p-4 cursor-pointer bg-white"
          onClick={() =>
            setExpandedSection(
              expandedSection === "equivalences" ? "" : "equivalences"
            )
          }
        >
          <h3 className="font-medium">Les équivalences</h3>
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </div>
        <div className="p-4 border-t bg-white">
          <p className="text-gray-600 text-sm mb-6">
            Les médicaments qui peuvent être consommés à la place de ce
            médicament
          </p>
          <div className="border-t pt-4">
            {medication.equivalences.map((med, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center">
                  <Image
                    src={med.img}
                    alt={med.name}
                    width={120}
                    height={120}
                    className="max-w-full h-auto"
                    unoptimized
                  />
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-teal-700 mb-2">
                    {med.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">DCI:</span> {med.dci}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">C.Therapeutique:</span>{" "}
                        {med.therapeutic}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Laboratoire:</span>{" "}
                        {med.lab}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-teal-600 text-white p-2 rounded">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
