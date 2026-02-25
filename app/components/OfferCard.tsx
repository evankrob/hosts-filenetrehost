"use client";

import { Star, Bed, Bath, DollarSign } from "lucide-react";
import { type TripOffer } from "@/app/lib/data";
import AmenityBadge from "./AmenityBadge";

interface Props {
  offer: TripOffer;
  nights: number;
}

export default function OfferCard({ offer, nights }: Props) {
  return (
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-200">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={offer.propertyImages[0]}
          alt={offer.propertyName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.style.background = "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)";
              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 text-5xl">🏡</div>`;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <h3 className="text-white font-bold text-base drop-shadow">{offer.propertyName}</h3>
        </div>
      </div>

      <div className="p-5">
        {/* Host info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              {offer.hostAvatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{offer.hostName}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-gray-700">{offer.hostRating}</span>
                <span className="text-xs text-gray-400">({offer.hostReviews} reviews)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">${offer.pricePerNight.toLocaleString()}</p>
            <p className="text-xs text-gray-500">/ night</p>
          </div>
        </div>

        {/* Property specs */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-gray-400" />
            <span>{offer.bedrooms} bd</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-gray-400" />
            <span>{offer.bathrooms} ba</span>
          </div>
          <div className="flex items-center gap-1 ml-auto text-gray-900">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="font-semibold">${offer.totalPrice.toLocaleString()}</span>
            <span className="text-gray-500 font-normal">total · {nights}n</span>
          </div>
        </div>

        {/* Host message */}
        <div className="bg-gray-50 rounded-xl p-3.5 mb-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Host&apos;s message</p>
          <p className="text-sm text-gray-700 leading-relaxed">{offer.message}</p>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {offer.amenities.slice(0, 5).map((amenity) => (
            <AmenityBadge key={amenity} amenity={amenity} size="sm" />
          ))}
          {offer.amenities.length > 5 && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-full">
              +{offer.amenities.length - 5} more
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
          >
            Accept Offer
          </button>
          <button className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all">
            Message
          </button>
        </div>
      </div>
    </article>
  );
}
