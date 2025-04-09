"use client";

import { useState } from "react";
import { Menu, Pen, Scan } from "lucide-react";

import ActionCard from "@/components/action-card";
import Image from "next/image";
import UserAvatar from "@/components/user-avatar";
import Sidebar from "@/components/sidebar";

export default function Analyse() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <main className="min-h-screen bg-[#f8fbf8]">
      {/* Header */}
      <header className="bg-[#388075] text-white  py-10 px-10 flex  justify-between items-center">
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

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-[#3d8b78]">
          Vérifier les risques
        </h2>
        <p className="text-gray-600 mt-1 mb-8 max-w-2xl">
          Saisissez les médicaments de votre prescription à la main ou en
          passant par le scan d&apos;ordonnance pour vérifier les risques.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          <ActionCard
            icon={Pen}
            title="Saisir des médicaments"
            description="Saisissez vos médicaments prescrits à la main pour vérifier les risques potentiels et garantir l'exactitude des informations."
            href="/saisir-meds"
          />

          <ActionCard
            icon={Scan} // Updated to use Scan icon instead of Maximize
            title="Scanner une ordonnance"
            description="Utilisez la fonction de scan pour vérifier rapidement les risques associés à votre ordonnance."
            href="/scanner"
          />
        </div>
      </section>

      {/* Illustration */}
      <div className="flex justify-end px-6 pb-6">
        <Image
          src="/illustration.svg"
          alt="Pharmaintex"
          width={857}
          height={443}
          className="mr-2 object-contain"
        />
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </main>
  );
}
