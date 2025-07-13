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
import supabase from "@/lib/supabase";

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

  // Static data from PDF
  const staticInteractions: Interaction[] = [
    {
      medication1: "SERVAL (Sertraline) 50mg",
      medication2: "ARIFY (Aripiprazole) 15mg",
      type: "Précaution d'emploi",
      effects:
        "Risque modéré d'augmentation des taux plasmatiques d'aripiprazole (par inhibition modérée de CYP2D6). Risque rare mais grave : symptômes extrapyramidaux (akathisie), voire syndrome malin des neuroleptiques.",
      remarks: "Surveillance clinique recommandée.",
    },
    {
      medication1: "CLORAXENE (clorazépate) 10mg",
      medication2: "ARIFY (Aripiprazole) 15mg",
      type: "Précaution d'emploi",
      effects:
        "Risque de sédation excessive, hypotension, dépression respiratoire.",
      remarks:
        "Surveillance recommandée, surtout en cas d'association avec la clozapine ou par voie parentérale.",
    },
    {
      medication1: "CLORAXENE (clorazépate) 10mg",
      medication2: "ANTAG (oméprazole) 20mg",
      type: "Prendre en compte",
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

    // Load static results from PDF only
    const staticInteractions = [
      {
        medication1: "SERVAL (Sertraline) 50mg",
        medication2: "ARIFY (Aripiprazole) 15mg",
        type: "Précaution d'emploi",
        effects:
          "Risque modéré d'augmentation des taux plasmatiques d'aripiprazole (par inhibition modérée de CYP2D6). Risque rare mais grave : symptômes extrapyramidaux (akathisie), voire syndrome malin des neuroleptiques.",
        remarks: "Surveillance clinique recommandée.",
      },
      {
        medication1: "CLORAXENE (clorazépate) 10mg",
        medication2: "ARIFY (Aripiprazole) 15mg",
        type: "Précaution d'emploi",
        effects:
          "Risque de sédation excessive, hypotension, dépression respiratoire.",
        remarks:
          "Surveillance recommandée, surtout en cas d'association avec la clozapine ou par voie parentérale.",
      },
      {
        medication1: "CLORAXENE (clorazépate) 10mg",
        medication2: "ANTAG (oméprazole) 20mg",
        type: "Prendre en compte",
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

    setMedications(staticMeds);
    setInteractions(staticInteractions);
    setIsLoading(false);
  }, [searchParams]);

  // Function to get risk level and data based on interactions
  const getRiskData = () => {
    const interactionCount = interactions.length;

    if (interactionCount === 0) {
      return {
        count: "0",
        level: "Aucune interaction détectée",
        color: "text-green-500",
        bgColor: "bg-green-100",
        description:
          "Aucune interaction significative n'a été détectée entre ces médicaments.",
        emoji: "✅",
        breakdown: [],
      };
    }

    // Count interactions by type
    const majeurCount = interactions.filter(
      (int) =>
        int.type === "Association contre-indiquée" ||
        int.type === "Associations déconseillées"
    ).length;

    const modereCount = interactions.filter(
      (int) =>
        int.type === "Associations faisant l'objet de précautions d'emploi" ||
        int.type === "Précaution d'emploi"
    ).length;

    const mineurCount = interactions.filter(
      (int) =>
        int.type === "Prendre en compte" || int.type === "À prendre en compte"
    ).length;

    // Create breakdown array
    const breakdown = [];
    if (majeurCount > 0) breakdown.push(`Majeur (${majeurCount})`);
    if (modereCount > 0) breakdown.push(`Modéré (${modereCount})`);
    if (mineurCount > 0) breakdown.push(`Mineur (${mineurCount})`);

    // Determine highest risk level for styling
    let color = "text-green-600";
    let bgColor = "bg-green-50";
    let level = "À prendre en compte";
    let emoji = "ℹ️";
    let description = "Des interactions sont possibles entre ces produits.";

    if (majeurCount > 0) {
      color = "text-red-500";
      bgColor = "bg-red-100";
      level = "Risque élevé";
      emoji = "❌";
      description = "Des interactions majeures ont été détectées.";
    } else if (modereCount > 0) {
      color = "text-orange-500";
      bgColor = "bg-orange-100";
      level = "Risque modéré";
      emoji = "⚠️";
      description = "Des interactions modérées ont été détectées.";
    } else if (mineurCount > 0) {
      color = "text-yellow-500";
      bgColor = "bg-yellow-100";
      level = "Risque mineur";
      emoji = "⚖️";
      description = "Des interactions mineures ont été détectées.";
    }

    return {
      count: interactionCount.toString(),
      level,
      color,
      bgColor,
      description,
      emoji,
      breakdown,
    };
  };

  // Function to determine if interaction is mineur, modéré, or majeur
  const getInteractionSeverity = (type: string) => {
    switch (type) {
      case "Association contre-indiquée":
      case "Associations déconseillées":
        return "majeur";
      case "Associations faisant l'objet de précautions d'emploi":
      case "Précaution d'emploi":
        return "modéré";
      case "Prendre en compte":
      case "À prendre en compte":
        return "mineur";
      default:
        return "mineur";
    }
  };

  const riskData = getRiskData();

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
                {/* Risk indicator */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="text-center md:text-left mb-4 md:mb-0">
                        <div className="flex items-center justify-center md:justify-start mb-2">
                          <div
                            className={`text-7xl font-bold ${riskData.color}`}
                          >
                            {riskData.count}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          interactions détectées
                        </div>
                        {riskData.breakdown.length > 0 && (
                          <div className="space-y-1">
                            {riskData.breakdown.map((item, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-600"
                              >
                                • {item}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="max-w-md text-gray-600 text-center md:text-right">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${riskData.bgColor} ${riskData.color}`}
                        >
                          Niveau d&apos;interaction: {riskData.level}
                        </div>
                        <p className="text-gray-500">{riskData.description}</p>
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

                {/* Warning badges - only if interactions exist */}
                {interactions.length > 0 && (
                  <div className="mb-6">
                    {interactions.some(
                      (int) => int.type === "Association contre-indiquée"
                    ) && (
                      <Badge className="px-4 py-2 text-base bg-red-500 hover:bg-red-600 rounded-full mr-2 mb-2">
                        <span>Associations contre-indiquées ❌</span>
                        <div className="ml-2 bg-white text-red-500 rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm">
                          {
                            interactions.filter(
                              (int) =>
                                int.type === "Association contre-indiquée"
                            ).length
                          }
                        </div>
                      </Badge>
                    )}

                    {interactions.some(
                      (int) => int.type === "Associations déconseillées"
                    ) && (
                      <Badge className="px-4 py-2 text-base bg-orange-500 hover:bg-orange-600 rounded-full mr-2 mb-2">
                        <span>Associations déconseillées ⚠️</span>
                        <div className="ml-2 bg-white text-orange-500 rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm">
                          {
                            interactions.filter(
                              (int) => int.type === "Associations déconseillées"
                            ).length
                          }
                        </div>
                      </Badge>
                    )}

                    {interactions.some(
                      (int) => int.type === "Associations à prendre en compte"
                    ) && (
                      <Badge className="px-4 py-2 text-base bg-yellow-500 hover:bg-yellow-600 rounded-full mb-2">
                        <span>Précautions d&apos;emploi ⚖️</span>
                        <div className="ml-2 bg-white text-yellow-500 rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm">
                          {
                            interactions.filter(
                              (int) =>
                                int.type === "Associations à prendre en compte"
                            ).length
                          }
                        </div>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Interactions listing */}
                {interactions.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="text-xl font-medium text-teal-700 mb-3">
                      Interactions détectées
                    </h3>
                    <div className="space-y-4">
                      {interactions.map((interaction, index) => {
                        const severity = getInteractionSeverity(
                          interaction.type
                        );

                        // Function to get interaction styling and emoji based on severity
                        const getInteractionStyle = (severity: string) => {
                          switch (severity) {
                            case "majeur":
                              return {
                                borderColor: "border-l-red-500",
                                badgeColor: "bg-red-100 text-red-800",
                                emoji: "❌",
                              };
                            case "mineur":
                              return {
                                borderColor: "border-l-yellow-500",
                                badgeColor: "bg-yellow-100 text-yellow-800",
                                emoji: "⚖️",
                              };
                            default:
                              return {
                                borderColor: "border-l-gray-500",
                                badgeColor: "bg-gray-100 text-gray-800",
                                emoji: "ℹ️",
                              };
                          }
                        };

                        const style = getInteractionStyle(severity);

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
                                <Badge className={style.badgeColor}>
                                  {style.emoji} {severity}
                                </Badge>
                              </div>
                              <p className="text-gray-700">
                                {interaction.effects}
                              </p>
                              {interaction.remarks && (
                                <p className="text-gray-500 text-sm mt-2">
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
                          0 interactions
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
