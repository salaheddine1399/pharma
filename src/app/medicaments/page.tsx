"use client";
import Sidebar from "@/components/sidebar";
import UserAvatar from "@/components/user-avatar";
import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function MedicamentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EEF7F2]">
      {/* Header */}
      <header className="bg-[#388075] text-white py-10 px-10 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo-white.svg"
            alt="Pharmaintex"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className="font-bold text-white text-lg">PHARMAINTEX</span>
        </div>
        <div className="flex items-center gap-4">
          <UserAvatar initials="TA" />
          <button aria-label="Menu" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-6 bg-white shadow-md flex items-center justify-between rounded-lg mt-4 mx-6">
        <div>
          <h2 className="text-xl font-bold text-[#184C42]">
            Trouvez un médicament
          </h2>
          <p className="text-gray-500 text-sm">Entrez votre recherche...</p>
          <div className="mt-3 relative w-[500px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Médicament/DCI"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d8b78]"
            />
          </div>
        </div>
        <Image
          src="/medicaments-illustration.svg"
          alt="Illustration"
          width={100}
          height={100}
          className="h-24 w-auto"
        />
      </div>

      {/* Results */}

      <div className="p-6">
        <h3 className="text-xl font-bold">Résultats (2)</h3>
        <p className="text-gray-500 text-sm">
          Voici les médicaments avec leurs informations
        </p>

        {[
          {
            name: "LANZOPOMP 30 mg",
            img: "https://www.pharmnet-dz.com/ImageHandler.ashx?imageurl=/img/medics/6273.png",
            dci: "LANSOPRAZOLE",
            lab: "WORLD MEDECINE",
            therapeutic: "GASTRO-ENTEROLOGIE",
          },
          {
            name: "LANZOMED 30 mg",
            img: "https://www.pharmnet-dz.com/ImageHandler.ashx?imageurl=/img/medics/6273.png",
            dci: "LANSOPRAZOLE",
            lab: "WORLD MEDECINE",
            therapeutic: "GASTRO-ENTEROLOGIE",
          },
        ].map((med, index) => (
          <div
            key={index}
            className="mt-4 p-4 bg-white rounded-lg shadow-md flex items-center gap-4"
          >
            <img
              src={med.img}
              alt={med.name}
              className="h-24 w-24 rounded-md"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-[#184C42]">
                {med.name}
              </h4>
              <p className="text-sm text-gray-500">
                DCI: {med.dci} - Laboratoire: {med.lab}
              </p>
              <p className="text-sm text-gray-500">
                C. Thérapeutique: {med.therapeutic}
              </p>
            </div>
            <button className="bg-[#3d8b78] text-white px-4 py-2 rounded-md hover:bg-[#347a68]">
              <Link href={`/medicaments/${index}`}>Plus d’informations →</Link>
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
