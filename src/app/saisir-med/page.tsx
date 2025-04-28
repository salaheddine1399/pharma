import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import MedicationSearch from "@/components/medication-search";

// Loading fallback for the page
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      <span className="ml-2 text-gray-500">Chargement de la page...</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={<LoadingFallback />}>
        <MedicationSearch />
      </Suspense>
    </main>
  );
}
