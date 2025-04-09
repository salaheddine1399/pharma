"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";

export default function MedicationSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedications, setSelectedMedications] = useState([
    {
      id: 1,
      name: "LANZOPOMP 30 mg",
      dci: "LANSOPRAZOLE",
      laboratory: "WORLD MEDECINE",
      therapeuticClass: "GASTRO-ENTEROLOGIE",
      image: "/lanzopomp.png",
    },
    {
      id: 2,
      name: "LANZOMED 30 mg",
      dci: "LANSOPRAZOLE",
      laboratory: "WORLD MEDECINE",
      therapeuticClass: "GASTRO-ENTEROLOGIE",
      image: "/lanzomed.png",
    },
  ]);

  const handleRemoveMedication = (id: number) => {
    setSelectedMedications(selectedMedications.filter((med) => med.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-teal-600 mb-1">
          Saisir des médicaments
        </h1>
        <p className="text-gray-500 mb-4">Trouvez des médicaments...</p>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Médicament/DCI"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        {selectedMedications.map((medication) => (
          <div
            key={medication.id}
            className="flex items-start border-b border-gray-100 py-6"
          >
            <div className="w-36 h-36 bg-gray-100 flex-shrink-0 mr-6 flex items-center justify-center rounded-sm overflow-hidden">
              <div className="relative w-full h-full">
                <Image
                  src={medication.image || "/placeholder.svg"}
                  alt={medication.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-medium text-teal-600 mb-3">
                {medication.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div>
                  <span className="text-gray-500">DCI: </span>
                  <span className="text-gray-700">{medication.dci}</span>
                </div>
                <div>
                  <span className="text-gray-500">Laboratoire : </span>
                  <span className="text-gray-700">{medication.laboratory}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500">C.Therapeutique: </span>
                  <span className="text-gray-700">
                    {medication.therapeuticClass}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemoveMedication(medication.id)}
              className="ml-4 px-4 py-2 text-red-500 border border-red-500 rounded-lg flex items-center hover:bg-red-50 transition-colors"
            >
              Effacer <X className="ml-1 h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {selectedMedications.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md flex items-center transition-colors">
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
