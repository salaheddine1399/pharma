import Link from "next/link";

interface ActionCardProps {
  title: string;
  description: string;
}

export default function ActionCard({ title, description }: ActionCardProps) {
  return (
    <div>
      {/* Title */}
      <h3 className="text-lg font-semibold text-[#3d8b78]">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 mt-2">{description}</p>

      {/* Button */}
      <Link
        href="#"
        className="bg-[#3d8b78] text-white px-5 py-2 rounded-md flex items-center gap-2 mt-4 hover:bg-[#347a68] transition-colors"
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
  );
}
