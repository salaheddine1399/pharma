import { Menu, Pen, Maximize } from "lucide-react";
import Logo from "@/components/logo";
import ActionCard from "@/components/action-card";
//import Illustration from "@/components/illustration";
import UserAvatar from "@/components/user-avatar";

export default function Analyse() {
  return (
    <main className="min-h-screen bg-[#f8fbf8]">
      {/* Header */}
      <header className="bg-[#3d8b78] text-white py-4 px-6 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <UserAvatar initials="TA" />
          <button aria-label="Menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-[#3d8b78]">
          Vérifier les risques
        </h2>
        <p className="text-gray-600 mt-1 mb-8">
          Saisissez les médicaments de votre prescription à la main ou en
          passant par le scan d&apos;ordonnance pour vérifier les risques
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          <ActionCard
            icon={Pen}
            title="Saisir des médicaments"
            description="Saisissez vos médicaments prescrits à la main pour vérifier les risques potentiels et garantir l'exactitude des informations."
          />

          <ActionCard
            icon={Maximize}
            title="Scanner une ordonnance"
            description="Utilisez la fonction de scan pour vérifier rapidement les risques associés à votre ordonnance."
          />
        </div>

        {/* Illustration */}
        <div className="flex justify-end mt-12"></div>
      </div>
    </main>
  );
}
