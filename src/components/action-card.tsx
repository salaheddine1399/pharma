import type { LucideIcon } from "lucide-react";
import CardIcon from "./card-icon";
import ActionButton from "./action-button";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ActionCard({
  icon,
  title,
  description,
}: ActionCardProps) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <div className="flex flex-col items-center">
        <CardIcon Icon={icon} />

        <h3 className="text-xl font-semibold text-[#3d8b78] mb-4">{title}</h3>

        <p className="text-center text-gray-600 mb-8">{description}</p>

        <ActionButton href="#">Commencer</ActionButton>
      </div>
    </div>
  );
}
