import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import CardIcon from "./card-icon";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export default function ActionCard({
  icon,
  title,
  description,
  href,
}: ActionCardProps) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <div className="flex flex-col items-center">
        <CardIcon Icon={icon} />

        <h3 className="text-xl font-semibold text-[#3d8b78] mb-4">{title}</h3>

        <p className="text-center text-gray-600 mb-8">{description}</p>

        <Link
          href={href}
          className="bg-[#3d8b78] text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-[#347a68] transition-colors"
          style={{
            borderRadius: "6px",
            padding: "10px 16px",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          Commencer
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
