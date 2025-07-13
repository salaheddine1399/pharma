"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// This is the main component that will be exported
export default function AnalysisResultsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnalysisResults />
    </Suspense>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <span className="ml-2 text-gray-500">Chargement des résultats...</span>
      </div>
    </div>
  );
}

// Component that uses useSearchParams, now safely wrapped in Suspense
function AnalysisResults() {
  const searchParams = useSearchParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [medications, setMedications] = useState<
    { cis: string; atc: string; name: string }[]
  >([]);
  interface Interaction {
    medication1: string;
    medication2: string;
    type: string;
    effects: string;
    remarks: string;
    severity: string; // Added severity field
  }
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientProfile, setPatientProfile] = useState({
    pathologies: { renal: false, hepatic: false, other: false },
    gender: "",
    ageGroup: "",
    pregnancyStatus: "",
  });

  // Static data from PDF with severity levels
  const staticInteractions: Interaction[] = [
    {
      medication1: "SERVAL (Sertraline) 50mg",
      medication2: "ARIFY (Aripiprazole) 15mg",
      type: "Précaution d'emploi",
      severity: "Modéré",
      effects:
        "Risque modéré d'augmentation des taux plasmatiques d'aripiprazole (par inhibition modérée de CYP2D6). Risque rare mais grave : symptômes extrapyramidaux (akathisie), voire syndrome malin des neuroleptiques.",
      remarks: "Surveillance clinique recommandée.",
    },
    {
      medication1: "CLORAXENE (clorazépate) 10mg",
      medication2: "ARIFY (Aripiprazole) 15mg",
      type: "Précaution d'emploi",
      severity: "Modéré",
      effects:
        "Risque de sédation excessive, hypotension, dépression respiratoire.",
      remarks:
        "Surveillance recommandée, surtout en cas d'association avec la clozapine ou par voie parentérale.",
    },
    {
      medication1: "CLORAXENE (clorazépate) 10mg",
      medication2: "ANTAG (oméprazole) 20mg",
      type: "Prendre en compte",
      severity: "Mineur",
      effects:
        "L'oméprazole peut inhiber le métabolisme des benzodiazépines oxydées comme le clorazépate (via CYP2C19), entraînant une accumulation et un risque accru de sédation ou de toxicité. Des cas de troubles de la marche et de coma prolongé ont été rapportés.",
      remarks:
        "Surveillance clinique et éventuelle réduction posologique du benzodiazépine recommandées.",
    },
  ];

  const staticMeds = [
    { cis: "n/a", atc: "", name: "SERVAL (Sertraline) 50mg" },
    { cis: "n/a", atc: "", name: "ARIFY (Aripiprazole) 15mg" },
    { cis: "n/a", atc: "", name: "CLORAXENE (clorazépate) 10mg" },
    { cis: "n/a", atc: "", name: "ANTAG (oméprazole) 20mg" },
  ];

  useEffect(() => {
    const sidebarParam = searchParams.get("showSidebar");
    setShowSidebar(sidebarParam === "true");

    if (sidebarParam === "true") {
      const renal = searchParams.get("renal") === "true";
      const hepatic = searchParams.get("hepatic") === "true";
      const other = searchParams.get("other") === "true";
      const gender = searchParams.get("gender") || "";
      const ageGroup = searchParams.get("ageGroup") || "";
      const pregnancyStatus = searchParams.get("pregnancyStatus") || "";

      setPatientProfile({
        pathologies: { renal, hepatic, other },
        gender,
        ageGroup,
        pregnancyStatus,
      });
    }

    setMedications(staticMeds);
    setInteractions(staticInteractions);
    setIsLoading(false);
  }, [searchParams]);

  // Function to get interaction count and summary
  const getInteractionSummary = () => {
    if (interactions.length === 0) {
      return {
        count: 0,
        totalInteractions: "Aucune interaction détectée",
        interactionTypes: [],
        mainColor: "text-green-500",
        mainBgColor: "bg-green-100",
        description:
          "Aucune interaction significative n'a été détectée entre ces médicaments.",
      };
    }

    const interactionTypes = [];
    const precautionCount = interactions.filter(
      (int) => int.type === "Précaution d'emploi"
    ).length;
    const toPonderCount = interactions.filter(
      (int) => int.type === "Prendre en compte"
    ).length;

    if (precautionCount > 0) {
      interactionTypes.push(`Précaution d'emploi (${precautionCount})`);
    }
    if (toPonderCount > 0) {
      interactionTypes.push(`À prendre en compte (${toPonderCount})`);
    }

    return {
      count: interactions.length,
      totalInteractions: `${interactions.length} interactions détectées`,
      interactionTypes,
      mainColor: "text-orange-500",
      mainBgColor: "bg-orange-100",
      description: "Des interactions ont été détectées entre ces médicaments.",
    };
  };

  const interactionSummary = getInteractionSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4">
        {/* Header */}
        <div className="border-b pb-4 pt-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-medium text-teal-700">
                Résultats d&apos;analyse
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Vous trouverez ci-dessous la liste des risques potentiels
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
              <Button
                asChild
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
              <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/add-profile">
                  Lancer une nouvelle analyse{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar area - always present but may be empty */}
          <div className="md:col-span-1">
            {showSidebar ? (
              <div className="border-r pr-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-medium text-teal-700 mb-4">
                      Profil du patient
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg text-gray-500">Pathologie</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="renal"
                          checked={patientProfile.pathologies.renal}
                          disabled
                        />
                        <label
                          htmlFor="renal"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Insuffisance Renal
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hepatique"
                          checked={patientProfile.pathologies.hepatic}
                          disabled
                        />
                        <label
                          htmlFor="hepatique"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Insuffisance Hépatique
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="autre"
                          checked={patientProfile.pathologies.other}
                          disabled
                        />
                        <label
                          htmlFor="autre"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Autre Pathologie
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg text-gray-500">
                      Tranche d&apos;âge
                    </h3>
                    <Select disabled value={patientProfile.ageGroup}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tranche d'âge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-18">0-18 ans</SelectItem>
                        <SelectItem value="19-30">19-30 ans</SelectItem>
                        <SelectItem value="31-45">31-45 ans</SelectItem>
                        <SelectItem value="46-60">46-60 ans</SelectItem>
                        <SelectItem value="61+">61+ ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg text-gray-500">Sexe</h3>
                    <Select disabled value={patientProfile.gender}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sexe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homme">Homme</SelectItem>
                        <SelectItem value="femme">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-500 mb-4">
                      Grossesse-Allaitement
                    </h2>
                    <Select disabled value={patientProfile.pregnancyStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Enceinte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non">Non</SelectItem>
                        <SelectItem value="enceinte">Enceinte</SelectItem>
                        <SelectItem value="allaitement">Allaitement</SelectItem>
                        <SelectItem value="fertilite">Fertilité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              // Empty div to maintain layout when sidebar is not shown
              <div className="border-r pr-6 h-full"></div>
            )}
          </div>

          {/* Main content area - always 2/3 columns */}
          <div className="md:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                <span className="ml-2 text-gray-500">
                  Chargement des données...
                </span>
              </div>
            ) : error ? (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="text-center text-red-500">{error}</div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Interaction Summary Card */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="text-center md:text-left mb-4 md:mb-0">
                        <div className="flex items-center justify-center md:justify-start mb-2">
                          <div
                            className={`text-7xl font-bold ${interactionSummary.mainColor}`}
                          >
                            {interactionSummary.count}
                          </div>
                        </div>
                        <div
                          className={`font-medium text-xl ${interactionSummary.mainColor}`}
                        >
                          {interactionSummary.totalInteractions}
                        </div>
                      </div>
                      <div className="max-w-md text-gray-600 text-center md:text-right">
                        <div className="space-y-2 mb-3">
                          {interactionSummary.interactionTypes.map(
                            (type, index) => (
                              <div
                                key={index}
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mr-2 ${
                                  type.includes("Précaution")
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {type}
                              </div>
                            )
                          )}
                        </div>
                        <p className="text-gray-500">
                          {interactionSummary.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medications list */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-teal-700 mb-3">
                    Médicaments analysés
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medications.map((med, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-lg">{med.name}</h4>
                          <p className="text-sm text-gray-500">
                            Code CIS: {med.cis}
                          </p>
                          <p className="text-sm text-gray-500">
                            Code ATC: {med.atc || "Non spécifié"}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Interactions listing */}
                {interactions.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-xl font-medium text-teal-700 mb-3">
                      Interactions détectées
                    </h3>
                    <div className="space-y-4">
                      {interactions.map((interaction, index) => {
                        // Function to get interaction styling and emoji based on severity
                        const getInteractionStyle = (severity: string) => {
                          switch (severity) {
                            case "Modéré":
                              return {
                                borderColor: "border-l-yellow-500",
                                badgeColor: "bg-yellow-100 text-yellow-800",
                                severityBadgeColor: "bg-yellow-500 text-white",
                                emoji: "⚠️",
                              };
                            case "Mineur":
                              return {
                                borderColor: "border-l-green-500",
                                badgeColor: "bg-green-100 text-green-800",
                                severityBadgeColor: "bg-green-500 text-white",
                                emoji: "ℹ️",
                              };
                            default:
                              return {
                                borderColor: "border-l-gray-500",
                                badgeColor: "bg-gray-100 text-gray-800",
                                severityBadgeColor: "bg-gray-500 text-white",
                                emoji: "ℹ️",
                              };
                          }
                        };

                        const style = getInteractionStyle(interaction.severity);

                        return (
                          <Card
                            key={index}
                            className={`border-l-4 ${style.borderColor}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">
                                  {interaction.medication1} +{" "}
                                  {interaction.medication2}
                                </h4>
                                <div className="flex flex-col items-end gap-1">
                                  <Badge className={style.severityBadgeColor}>
                                    {interaction.severity}
                                  </Badge>
                                  <Badge className={style.badgeColor}>
                                    {style.emoji} {interaction.type}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2">
                                {interaction.effects}
                              </p>
                              {interaction.remarks && (
                                <p className="text-gray-500 text-sm">
                                  {interaction.remarks}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <p className="text-gray-500 text-lg font-medium mb-2">
                          Aucune interaction n&apos;a été détectée entre les
                          médicaments sélectionnés.
                        </p>
                        <Badge className="bg-green-100 text-green-800 px-3 py-1">
                          0 interactions détectées
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* General recommendations */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-teal-700 mb-3">
                    Recommandations générales
                  </h3>
                  <p className="text-gray-600">
                    Cette analyse est basée sur les informations disponibles
                    dans notre base de données. Veuillez consulter un
                    professionnel de santé avant de prendre toute décision
                    concernant votre traitement médicamenteux.
                    <Button
                      variant="link"
                      className="text-teal-600 font-medium p-0 h-auto ml-1"
                    >
                      Afficher Plus.
                    </Button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
