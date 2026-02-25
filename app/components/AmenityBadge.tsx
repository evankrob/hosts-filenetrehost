import { type Amenity } from "@/app/lib/data";
import {
  Wifi,
  Waves,
  Thermometer,
  PawPrint,
  ChefHat,
  Car,
  Flame,
  Wind,
  Anchor,
  Mountain,
  Utensils,
  Zap,
  Shirt,
  Dumbbell,
  Snowflake,
} from "lucide-react";

const AMENITY_CONFIG: Record<Amenity, { icon: React.ReactNode; color: string }> = {
  WiFi: { icon: <Wifi className="w-3.5 h-3.5" />, color: "bg-blue-50 text-blue-700 border-blue-200" },
  Pool: { icon: <Waves className="w-3.5 h-3.5" />, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  "Hot Tub": { icon: <Thermometer className="w-3.5 h-3.5" />, color: "bg-orange-50 text-orange-700 border-orange-200" },
  "Pet Friendly": { icon: <PawPrint className="w-3.5 h-3.5" />, color: "bg-green-50 text-green-700 border-green-200" },
  Kitchen: { icon: <ChefHat className="w-3.5 h-3.5" />, color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  Parking: { icon: <Car className="w-3.5 h-3.5" />, color: "bg-gray-100 text-gray-700 border-gray-300" },
  Fireplace: { icon: <Flame className="w-3.5 h-3.5" />, color: "bg-red-50 text-red-700 border-red-200" },
  "Air Conditioning": { icon: <Wind className="w-3.5 h-3.5" />, color: "bg-sky-50 text-sky-700 border-sky-200" },
  Beachfront: { icon: <Anchor className="w-3.5 h-3.5" />, color: "bg-teal-50 text-teal-700 border-teal-200" },
  "Mountain View": { icon: <Mountain className="w-3.5 h-3.5" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "BBQ Grill": { icon: <Utensils className="w-3.5 h-3.5" />, color: "bg-amber-50 text-amber-700 border-amber-200" },
  "EV Charger": { icon: <Zap className="w-3.5 h-3.5" />, color: "bg-lime-50 text-lime-700 border-lime-200" },
  "Washer/Dryer": { icon: <Shirt className="w-3.5 h-3.5" />, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  Gym: { icon: <Dumbbell className="w-3.5 h-3.5" />, color: "bg-purple-50 text-purple-700 border-purple-200" },
  "Ski-in/Ski-out": { icon: <Snowflake className="w-3.5 h-3.5" />, color: "bg-slate-100 text-slate-700 border-slate-300" },
};

interface Props {
  amenity: Amenity;
  size?: "sm" | "md";
}

export default function AmenityBadge({ amenity, size = "sm" }: Props) {
  const config = AMENITY_CONFIG[amenity];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 border rounded-full font-medium ${config.color} ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      {config.icon}
      {amenity}
    </span>
  );
}
