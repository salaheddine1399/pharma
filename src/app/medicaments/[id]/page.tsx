"use client"; // Ensure this component is treated as client-side

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/sidebar";
import UserAvatar from "@/components/user-avatar";

interface MedicationInteraction {
  name: string;
  img: string;
  dci: string;
  lab: string;
  therapeutic: string;
}

interface Medication {
  id: string;
  name: string;
  img: string;
  dci: string;
  lab: string;
  therapeutic: string;
  description: string;
  interactions: MedicationInteraction[];
  equivalences: MedicationInteraction[];
}

export default function MedicamentDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medication, setMedication] = useState<Medication | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("");

  const id = "1"; // Static ID for testing purposes (replace this with dynamic logic as needed)

  // Simulated data - in a real app, you would fetch this based on the ID
  useEffect(() => {
    // Mock data for demonstration
    const medicationData: Medication = {
      id: id,
      name: "LANZOPOMP 30 mg",
      img: "https://www.pharmnet-dz.com/ImageHandler.ashx?imageurl=/img/medics/6273.png",
      dci: "LANSOPRAZOLE",
      lab: "WORLD MEDECINE",
      therapeutic: "GASTRO-ENTEROLOGIE",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
      interactions: [
        {
          name: "LANZOMED 30 mg",
          img: "https://www.pharmnet-dz.com/ImageHandler.ashx?imageurl=/img/medics/6273.png",
          dci: "LANSOPRAZOLE",
          lab: "WORLD MEDECINE",
          therapeutic: "GASTRO-ENTEROLOGIE",
        },
      ],
      equivalences: [
        {
          name: "LANZOMED 30 mg",
          img: "https://www.pharmnet-dz.com/ImageHandler.ashx?imageurl=/img/medics/6273.png",
          dci: "LANSOPRAZOLE",
          lab: "WORLD MEDECINE",
          therapeutic: "GASTRO-ENTEROLOGIE",
        },
      ],
    };
    setMedication(medicationData);
  }, [id]);

  if (!medication) {
    return (
      <div className="min-h-screen bg-[#EEF7F2] p-10 flex justify-center items-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Top navigation space */}
      <div className="pb-4 mb-8"></div>

      {/* Medication Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
          <Image
            src={medication.img}
            alt={medication.name}
            width={200}
            height={200}
            className="max-w-full h-auto"
            unoptimized
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-xl font-medium text-teal-700 mb-4">
            {medication.name}
          </h1>
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-medium">DCI:</span> {medication.dci}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">C.Therapeutique:</span>{" "}
              {medication.therapeutic}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Laboratoire:</span> {medication.lab}
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
          {medication.description}
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
