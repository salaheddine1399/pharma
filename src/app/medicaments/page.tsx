"use client";

import Sidebar from "@/components/sidebar";
import UserAvatar from "@/components/user-avatar";
import { Menu, Search, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase"; // Import Supabase client

export default function MedicamentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  interface Medicament {
    code: string;
    denomination_du_medicament: string;
    composition_qualitative_et_quantitative: string;
    proprietes_pharmacodynamiques?: string;
    forme_pharmaceutique: string;
    image_url?: string;
  }

  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const pageSize = 10;

  // Function to clean the medicament name and keep everything before the comma
  const cleanMedicamentName = (name: string) => {
    const match = name.match(/^[^,]*/); // Match everything before the first comma
    return match ? match[0].trim() : name; // Return the matched part before the comma
  };

  // Function to clean the composition field and remove everything after the dots
  const cleanComposition = (composition: string) => {
    const match = composition.match(/^[^\.]+/); // Match everything before the first dot
    return match ? match[0].trim() : composition; // Return the cleaned composition or the original composition if no match
  };
  const extractClassePharmaco = (pharmacodynamicsText: string) => {
    const explicitClassMatch = pharmacodynamicsText.match(
      /Classe\spharmacothérapeutique\s*[:|-\s]*([^\n,;:]+)/
    );

    if (explicitClassMatch) {
      return explicitClassMatch[1].trim(); // Return the matched class name
    }

    const classBeforeATCMatch = pharmacodynamicsText.match(
      /^([^,;:\n]+)(?=\s*Code ATC)/
    );

    if (classBeforeATCMatch) {
      return classBeforeATCMatch[1].trim(); // Return the matched class name before "Code ATC"
    }

    return "Non disponible"; // Default return if no match is found
  };

  const extractCodeAtc = (pharmacodynamicsText: string) => {
    const match = pharmacodynamicsText.match(
      /Code ATC\s*[:|-]?\s*([A-Za-z0-9]+)/
    );
    return match ? match[1].trim() : "Non disponible"; // Return the cleaned Code ATC or a default message
  };

  // Fetch medicaments with pagination
  const fetchMedicaments = async (page: number, query: string) => {
    let queryBuilder = supabase
      .from("medicaments")
      .select("*", { count: "exact" });

    if (query && query.trim() !== "") {
      queryBuilder = queryBuilder.or(
        `denomination_du_medicament.ilike.%${query}%,` +
          `composition_qualitative_et_quantitative.ilike.%${query}%`
      );
    }

    const { data, count, error } = await queryBuilder.range(
      (page - 1) * pageSize,
      page * pageSize - 1
    );

    if (error) {
      console.error("Error fetching data: ", error);
    } else {
      setMedicaments(data || []);
      setTotalPages(Math.ceil(count! / pageSize));
    }
  };

  useEffect(() => {
    fetchMedicaments(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="min-h-screen bg-[#EEF7F2]">
      {/* Header */}
      <header className="bg-[#388075] text-white py-10 px-6 sm:px-10 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo-white.svg"
            alt="Pharmaintex"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className="font-bold text-white text-lg">PHARMINTEX</span>
        </div>
        <div className="flex items-center gap-4">
          <UserAvatar initials="TA" />
          <button aria-label="Menu" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Home Button */}
      <div className="px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#388075] hover:text-[#2d6b61] transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="text-sm">← Retour à l&apos;accueil</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-6 bg-white shadow-md flex flex-col sm:flex-row items-center justify-between rounded-lg mt-4 mx-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#184C42]">
            Trouvez un médicament
          </h2>
          <p className="text-gray-500 text-sm">Entrez votre recherche...</p>
          <div className="mt-3 relative w-full sm:w-[500px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Médicament/DCI"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3d8b78]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <Image
          src="/medicaments-illustration.svg"
          alt="Illustration"
          width={100}
          height={100}
          className="h-24 w-auto mt-4 sm:mt-0"
        />
      </div>

      {/* Medicaments Results */}
      <div className="px-6 sm:px-12 py-4">
        <h2 className="text-xl font-bold">Résultats ({medicaments.length})</h2>
        <p className="text-gray-500 text-sm mb-6">
          Voici les médicaments avec leurs informations
        </p>

        <div className="space-y-4">
          {medicaments.map((med) => (
            <div
              key={med.code}
              className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="w-full sm:w-50 h-50 flex-shrink-0 bg-gray-100 flex items-center justify-center p-4">
                <Image
                  src={med.image_url || "/default-img.jpg"}
                  alt={cleanMedicamentName(med.denomination_du_medicament)}
                  className="max-h-full max-w-full object-contain"
                  width={500}
                  height={500}
                />
              </div>

              <div className="flex-1 p-5">
                <h3 className="text-xl font-bold text-[#388075]">
                  {cleanMedicamentName(med.denomination_du_medicament)}
                </h3>

                <div className="mt-3 space-y-1.5">
                  <div className="flex">
                    <span className="text-gray-500 w-64">DCI:</span>
                    <span className="font-medium">
                      {cleanComposition(
                        med.composition_qualitative_et_quantitative
                      )}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="text-gray-500 w-64">Code ATC:</span>
                    <span className="font-medium">
                      {extractCodeAtc(med.proprietes_pharmacodynamiques || "")}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="text-gray-500 w-64">
                      Classe pharmacothérapeutique:
                    </span>
                    <span className="font-medium">
                      {extractClassePharmaco(
                        med.proprietes_pharmacodynamiques || ""
                      )}
                    </span>
                  </div>

                  <div className="flex">
                    <span className="text-gray-500 w-64">
                      Forme Pharmaceutique:
                    </span>
                    <span className="font-medium">
                      {med.forme_pharmaceutique}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center p-5">
                <Link
                  href={`/medicaments/${med.code}`}
                  className="bg-[#388075] hover:bg-[#2D6A62] text-white px-4 py-2 rounded flex items-center gap-2 transition-colors whitespace-nowrap"
                >
                  <span>Plus d&apos;informations</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-[#388075] text-white disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-[#388075]">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-[#388075] text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
