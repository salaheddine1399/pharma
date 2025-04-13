"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
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

export default function AnalysisResults() {
  const searchParams = useSearchParams();
  const [showSidebar, setShowSidebar] = useState(false);
  const [patientProfile, setPatientProfile] = useState({
    pathologies: {
      renal: false,
      hepatic: false,
      other: false,
    },
    gender: "",
    ageGroup: "",
    pregnancyStatus: "",
  });

  useEffect(() => {
    // Check if we should show the sidebar
    const sidebarParam = searchParams.get("showSidebar");
    setShowSidebar(sidebarParam === "true");

    // If sidebar should be shown, parse the patient profile data
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
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4">
        {/* Header */}
        <div className="border-b pb-4 pt-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-medium text-teal-700">
                Résultats d'analyse
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Vous trouverez ci-dessous la liste des risques potentiels
              </p>
            </div>
            <Button
              asChild
              className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700"
            >
              <Link href="/add-profile">
                Lancer une nouvelle analyse{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
                    <h3 className="text-lg text-gray-500">Tranche d'âge</h3>
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
            {/* Risk indicator */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <div className="text-7xl font-bold text-red-500">90%</div>
                    <div className="text-red-500 font-medium text-xl">
                      Risque élevé
                    </div>
                  </div>
                  <div className="max-w-md text-gray-500 text-center md:text-right">
                    Les interactions médicamenteuses possibles entre ces
                    produits sont considérées comme étant à haut risque.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning badge */}
            <div className="mb-6">
              <Badge className="px-4 py-2 text-base bg-red-500 hover:bg-red-600 rounded-full">
                <span>Associations déconseillés</span>
                <div className="ml-2 bg-white text-red-500 rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </Badge>
            </div>

            {/* Explanation */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-teal-700 mb-3">
                Explication
              </h3>
              <p className="text-gray-600">
                Lorem ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
                <Button
                  variant="link"
                  className="text-teal-600 font-medium p-0 h-auto"
                >
                  Afficher Plus.
                </Button>
              </p>
            </div>

            {/* Alternatives */}
            <div>
              <h3 className="text-xl font-medium text-teal-700 mb-4">
                Liste des alternatives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-100 border-0">
                  <CardContent className="p-4 flex justify-center">
                    <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center p-2">
                      <Image
                        src="/api/placeholder/100/100"
                        alt="Lansopomp"
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-100 border-0">
                  <CardContent className="p-4 flex justify-center">
                    <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center p-2 relative">
                      <Image
                        src="/api/placeholder/100/100"
                        alt="Lanzomed"
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-yellow-200 rounded-full p-1">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
