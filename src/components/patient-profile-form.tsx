"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, AlertCircle, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function PatientProfileForm() {
  const router = useRouter();

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

  const [validationError, setValidationError] = useState(false);

  const handlePathologyChange = (
    value: boolean,
    type: "renal" | "hepatic" | "other"
  ) => {
    setPatientProfile({
      ...patientProfile,
      pathologies: {
        ...patientProfile.pathologies,
        [type]: value,
      },
    });
    // Clear validation error when user selects something
    setValidationError(false);
  };

  const handleSelectChange = (value: string, field: string) => {
    setPatientProfile({
      ...patientProfile,
      [field]: value,
    });
    // Clear validation error when user selects something
    setValidationError(false);
  };

  // Function to check if at least one option is selected
  const isProfileValid = () => {
    return (
      patientProfile.pathologies.renal ||
      patientProfile.pathologies.hepatic ||
      patientProfile.pathologies.other ||
      patientProfile.gender !== "" ||
      patientProfile.ageGroup !== "" ||
      patientProfile.pregnancyStatus !== ""
    );
  };

  const handleAddProfile = () => {
    // Check if at least one option is selected
    if (!isProfileValid()) {
      setValidationError(true);
      return;
    }

    // Encode the patient profile data as URL search params
    const queryParams = new URLSearchParams();

    // Add pathologies
    queryParams.append("renal", patientProfile.pathologies.renal.toString());
    queryParams.append(
      "hepatic",
      patientProfile.pathologies.hepatic.toString()
    );
    queryParams.append("other", patientProfile.pathologies.other.toString());

    // Add other fields (only if they have values)
    if (patientProfile.gender) {
      queryParams.append("gender", patientProfile.gender);
    }

    if (patientProfile.ageGroup) {
      queryParams.append("ageGroup", patientProfile.ageGroup);
    }

    if (patientProfile.pregnancyStatus) {
      queryParams.append("pregnancyStatus", patientProfile.pregnancyStatus);
    }

    // Add a flag to show the sidebar
    queryParams.append("showSidebar", "true");

    // Navigate to the results page with query parameters
    router.push(`/saisir-med?${queryParams.toString()}`);
  };

  const handleIgnore = () => {
    // Navigate to the results page without any profile data
    router.push("/saisir-med");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="border-b pb-4 mb-8">
        {/* Breadcrumb/Home Button Option */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#388075] hover:text-[#2d6b61] transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm">← Retour à l'accueil</span>
          </Link>
        </div>
        <h1 className="text-2xl font-medium text-emerald-700">
          Profil du patient
        </h1>
        <p className="text-gray-500">
          Veuillez fournir plus de détails sur votre patient
        </p>
      </div>

      {validationError && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-500">
            Veuillez sélectionner au moins une option avant de continuer.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-emerald-700 mb-4">
              Pathologie
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insuffisance-renal"
                  checked={patientProfile.pathologies.renal}
                  onCheckedChange={(checked) =>
                    handlePathologyChange(checked as boolean, "renal")
                  }
                />
                <label
                  htmlFor="insuffisance-renal"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Insuffisance Renal
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insuffisance-hepatique"
                  checked={patientProfile.pathologies.hepatic}
                  onCheckedChange={(checked) =>
                    handlePathologyChange(checked as boolean, "hepatic")
                  }
                />
                <label
                  htmlFor="insuffisance-hepatique"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Insuffisance Hépatique
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autre-pathologie"
                  checked={patientProfile.pathologies.other}
                  onCheckedChange={(checked) =>
                    handlePathologyChange(checked as boolean, "other")
                  }
                />
                <label
                  htmlFor="autre-pathologie"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Autre Pathologie
                </label>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-emerald-700 mb-4">Sexe</h2>
            <Select
              onValueChange={(value) => handleSelectChange(value, "gender")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sexe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homme">Homme</SelectItem>
                <SelectItem value="femme">Femme</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-emerald-700 mb-4">
              Tranche d&apos;âge
            </h2>
            <Select
              onValueChange={(value) => handleSelectChange(value, "ageGroup")}
            >
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

          <div>
            <h2 className="text-lg font-medium text-emerald-700 mb-4">
              Grossesse-Allaitement
            </h2>
            <Select
              onValueChange={(value) =>
                handleSelectChange(value, "pregnancyStatus")
              }
            >
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

      <div className="flex justify-end mt-12 space-x-4">
        <Button
          variant="outline"
          className="text-emerald-700 border-emerald-700"
          onClick={handleIgnore}
        >
          Ignorer
        </Button>
        <Button
          className="bg-emerald-700 hover:bg-emerald-800"
          onClick={handleAddProfile}
        >
          Ajouter profil de patient <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
