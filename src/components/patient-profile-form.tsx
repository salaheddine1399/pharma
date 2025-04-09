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
import { ArrowRight } from "lucide-react";

export default function PatientProfileForm() {
  const [pathologies, setPathologies] = useState({
    renal: false,
    hepatic: false,
    other: false,
  });

  const handlePathologyChange = (
    value: boolean,
    type: "renal" | "hepatic" | "other"
  ) => {
    setPathologies({
      ...pathologies,
      [type]: value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="border-b pb-4 mb-8">
        <h1 className="text-2xl font-medium text-emerald-700">
          Profil du patient
        </h1>
        <p className="text-gray-500">
          Veuillez fournir plus de détails sur votre patient
        </p>
      </div>

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
                  checked={pathologies.renal}
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
                  checked={pathologies.hepatic}
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
                  checked={pathologies.other}
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
            <Select>
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
            <Select>
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
            <Select>
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

      <div className="flex justify-end mt-12 space-x-4">
        <Button
          variant="outline"
          className="text-emerald-700 border-emerald-700"
        >
          Ignorer
        </Button>
        <Button className="bg-emerald-700 hover:bg-emerald-800">
          Ajouter profil de patient <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
