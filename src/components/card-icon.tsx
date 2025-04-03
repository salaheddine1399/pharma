import type { LucideIcon } from "lucide-react";

interface CardIconProps {
  Icon: LucideIcon;
}

export default function CardIcon({ Icon }: CardIconProps) {
  return (
    <div className="bg-[#e4f5f0] p-4 rounded-full mb-6 w-16 h-16 flex items-center justify-center">
      <Icon className="h-6 w-6 text-[#3d8b78]" />
    </div>
  );
}
