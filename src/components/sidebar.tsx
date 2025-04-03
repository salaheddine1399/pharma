"use client";

import Link from "next/link";
import {
  Search,
  Plus,
  Maximize,
  FileText,
  Home,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {" "}
      {/* Sidebar on the right */}
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      {/* Sidebar */}
      <div className="relative w-[320px] h-full bg-white shadow-lg flex flex-col p-6">
        {/* User Profile */}
        <div className="flex flex-col items-center relative mb-6">
          <div className="relative">
            <div className="bg-[#63B3ED] rounded-full h-20 w-20 flex items-center justify-center text-2xl font-semibold">
              TA
            </div>
            {/* Green Online Indicator */}
            <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <h3 className="font-semibold mt-2">Anouar Manaa</h3>
          <Link href="#" className="text-sm text-gray-500 hover:underline">
            Paramètres du compte &gt;
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-2 flex-grow">
          <Link
            href="/medicaments"
            className="flex items-center gap-3 p-3 rounded-full bg-[#D5F4EF] text-[#388075]"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Trouver un médicament</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100"
          >
            <Search className="h-5 w-5 text-gray-600" />
            <span>Analyse des risques</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100"
          >
            <FileText className="h-5 w-5 text-gray-600" />
            <span>Quizes</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <Link
            href="#"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnecter</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
