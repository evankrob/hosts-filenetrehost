import Link from "next/link";
import { Calendar, Users, DollarSign, MessageSquare, MapPin, Clock } from "lucide-react";
import { type TripRequest, formatDateRange, nightsBetween } from "@/app/lib/data";
import AmenityBadge from "./AmenityBadge";

interface Props {
  trip: TripRequest;
}

export default function TripCard({ trip }: Props) {
  const nights = nightsBetween(trip.startDate, trip.endDate);
  const isNew = new Date(trip.createdAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  return (
    <Link href={`/trip/${trip.id}`}>
      <article className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer relative">
        {/* Status badges */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isNew && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
              New
            </span>
          )}
          {trip.status === "open" ? (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              Open
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
              Closed
            </span>
          )}
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4 pr-20">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}>
            {trip.travelerAvatar}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{trip.travelerName}</p>
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{trip.destination}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {trip.description}
        </p>

        {/* Trip details */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Calendar className="w-3 h-3" />
              <span>Dates</span>
            </div>
            <p className="text-xs font-semibold text-gray-900">{formatDateRange(trip.startDate, trip.endDate)}</p>
            <p className="text-xs text-gray-500">{nights} nights</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Users className="w-3 h-3" />
              <span>Guests</span>
            </div>
            <p className="text-xs font-semibold text-gray-900">{trip.numGuests} people</p>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <DollarSign className="w-3 h-3" />
              <span>Budget</span>
            </div>
            <p className="text-xs font-semibold text-gray-900">${trip.budget.toLocaleString()}</p>
            <p className="text-xs text-gray-500">total</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {trip.amenities.slice(0, 4).map((amenity) => (
            <AmenityBadge key={amenity} amenity={amenity} size="sm" />
          ))}
          {trip.amenities.length > 4 && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full">
              +{trip.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>
              <span className="font-semibold text-gray-900">{trip.offerCount}</span> offer{trip.offerCount !== 1 ? "s" : ""} received
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="w-3 h-3" />
            <span>Posted {new Date(trip.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        </div>

        {/* CTA hint on hover */}
        {trip.status === "open" && (
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span
              className="inline-flex items-center text-xs font-semibold"
              style={{ color: "#FF385C" }}
            >
              Make an offer →
            </span>
          </div>
        )}
      </article>
    </Link>
  );
}
