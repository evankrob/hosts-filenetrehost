import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  MessageSquare,
  Share2,
  Flag,
} from "lucide-react";
import {
  getTripById,
  getOffersForTrip,
  MOCK_TRIP_REQUESTS,
  formatDateRange,
  nightsBetween,
} from "@/app/lib/data";
import AmenityBadge from "@/app/components/AmenityBadge";
import OfferCard from "@/app/components/OfferCard";
import MakeOfferPanel from "./MakeOfferPanel";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MOCK_TRIP_REQUESTS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const trip = getTripById(id);
  if (!trip) return { title: "Trip Not Found" };

  const nights = nightsBetween(trip.startDate, trip.endDate);
  const title = `${trip.destination} Trip – ${trip.numGuests} guests, ${nights} nights | StayBid`;
  const desc = `${trip.travelerName} is looking for a vacation rental in ${trip.destination} for ${trip.numGuests} guests. Budget: $${trip.budget.toLocaleString()}. ${trip.description.slice(0, 120)}...`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://staybid.com/trip/${id}`,
      type: "article",
    },
    alternates: {
      canonical: `https://staybid.com/trip/${id}`,
    },
  };
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params;
  const trip = getTripById(id);
  if (!trip) notFound();

  const offers = getOffersForTrip(id);
  const nights = nightsBetween(trip.startDate, trip.endDate);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Vacation Rental Request: ${trip.destination}`,
    description: trip.description,
    startDate: trip.startDate,
    endDate: trip.endDate,
    location: {
      "@type": "Place",
      name: trip.destination,
      address: { "@type": "PostalAddress", addressRegion: trip.region },
    },
    organizer: { "@type": "Person", name: trip.travelerName },
    offers: { "@type": "Offer", price: trip.budget, priceCurrency: "USD" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Sticky top nav */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <Link
              href="/browse"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All trips
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-all" title="Share">
                <Share2 className="w-4 h-4 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-all" title="Report">
                <Flag className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Trip details */}
            <div className="lg:col-span-2">

              {/* Status + destination */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    trip.status === "open"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {trip.status === "open" ? "Open for offers" : "Closed"}
                </span>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Posted {new Date(trip.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Vacation Rental Wanted: {trip.destination}
              </h1>

              {/* Traveler */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
                >
                  {trip.travelerAvatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{trip.travelerName}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Looking in {trip.destination}</span>
                  </div>
                </div>
              </div>

              {/* Key details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    CHECK-IN / CHECK-OUT
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{formatDateRange(trip.startDate, trip.endDate)}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{nights} nights</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1.5">
                    <Users className="w-3.5 h-3.5" />
                    GUESTS
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{trip.numGuests} {trip.numGuests === 1 ? "person" : "people"}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    BUDGET
                  </div>
                  <p className="font-bold text-gray-900 text-sm">${trip.budget.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs mt-0.5">total · ~${Math.round(trip.budget / nights).toLocaleString()}/night</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="font-bold text-gray-900 mb-3">About this trip</h2>
                <p className="text-gray-700 leading-relaxed">{trip.description}</p>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                <h2 className="font-bold text-gray-900 mb-4">Requested amenities</h2>
                <div className="flex flex-wrap gap-2.5">
                  {trip.amenities.map((amenity) => (
                    <AmenityBadge key={amenity} amenity={amenity} size="md" />
                  ))}
                </div>
              </div>

              {/* Offers section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <h2 className="text-xl font-bold text-gray-900">
                    {offers.length > 0
                      ? `${offers.length} offer${offers.length !== 1 ? "s" : ""} from hosts`
                      : "No offers yet"}
                  </h2>
                </div>

                {offers.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                    <p className="text-amber-700 font-semibold mb-1">Be the first to make an offer!</p>
                    <p className="text-amber-600 text-sm">
                      This traveler is waiting to hear from hosts like you. Use the panel on the right to send your offer.
                    </p>
                  </div>
                )}

                {offers.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {offers.map((offer) => (
                      <OfferCard key={offer.id} offer={offer} nights={nights} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Make offer panel */}
            <div className="lg:col-span-1">
              <MakeOfferPanel trip={trip} nights={nights} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
