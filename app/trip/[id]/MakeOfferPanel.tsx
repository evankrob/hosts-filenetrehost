"use client";

import { useState } from "react";
import { CheckCircle, Star, Send, ChevronDown, ChevronUp } from "lucide-react";
import type { TripRequest } from "@/app/lib/data";

interface Props {
  trip: TripRequest;
  nights: number;
}

export default function MakeOfferPanel({ trip, nights }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    propertyName: "",
    pricePerNight: Math.round(trip.budget / nights),
    bedrooms: 2,
    bathrooms: 1,
    message: "",
    hostName: "",
    hostEmail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPrice = form.pricePerNight * nights;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.propertyName.trim()) e.propertyName = "Property name is required";
    if (form.pricePerNight <= 0) e.pricePerNight = "Enter a valid price";
    if (!form.message.trim() || form.message.length < 20) e.message = "Please write at least 20 characters";
    if (!form.hostName.trim()) e.hostName = "Your name is required";
    if (!form.hostEmail.trim() || !form.hostEmail.includes("@")) e.hostEmail = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="sticky top-32">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-md">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-green-500" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Offer sent! 🎉</h3>
          <p className="text-sm text-gray-600 mb-1">
            Your offer for <strong>{trip.destination}</strong> has been delivered to {trip.travelerName}.
          </p>
          <p className="text-xs text-gray-400">They&apos;ll receive an email notification right away.</p>
          <div className="mt-5 p-4 bg-gray-50 rounded-xl text-left">
            <p className="text-xs font-semibold text-gray-500 mb-2">Your offer</p>
            <p className="text-sm font-semibold text-gray-900">{form.propertyName}</p>
            <p className="text-sm text-gray-600">${form.pricePerNight}/night · ${totalPrice.toLocaleString()} total · {nights} nights</p>
          </div>
          <button
            onClick={() => { setSubmitted(false); setForm({ ...form, message: "", propertyName: "" }); }}
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
          >
            Send another offer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-32">
      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mb-4">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Traveler&apos;s budget</p>
              <p className="text-2xl font-bold text-gray-900">${trip.budget.toLocaleString()}</p>
              <p className="text-xs text-gray-500">~${Math.round(trip.budget / nights).toLocaleString()}/night · {nights} nights</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{trip.numGuests} guests</p>
              <p className="text-xs text-gray-500 mt-0.5">{trip.status === "open" ? "🟢 Accepting offers" : "🔴 Closed"}</p>
            </div>
          </div>
        </div>

        {trip.status === "open" && (
          <div className="p-5">
            {!expanded ? (
              <button
                onClick={() => setExpanded(true)}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:shadow-md"
                style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
              >
                <Send className="w-4 h-4" />
                Make an Offer
              </button>
            ) : (
              <button
                onClick={() => setExpanded(false)}
                className="w-full py-3 rounded-xl font-semibold text-gray-700 text-sm flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 transition-all"
              >
                <ChevronUp className="w-4 h-4" /> Hide form
              </button>
            )}
          </div>
        )}

        {trip.status === "closed" && (
          <div className="p-5 text-center">
            <p className="text-sm text-gray-500">This trip is no longer accepting offers.</p>
          </div>
        )}
      </div>

      {/* Offer form */}
      {expanded && trip.status === "open" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Your Offer</h3>
            <p className="text-xs text-gray-500 mt-0.5">Complete all fields to send your offer to {trip.travelerName}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Property name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Property name *</label>
              <input
                type="text"
                placeholder="e.g. Sunset Ridge Cabin"
                value={form.propertyName}
                onChange={(e) => setForm({ ...form, propertyName: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.propertyName ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-rose-200 focus:border-rose-400"
                }`}
              />
              {errors.propertyName && <p className="text-red-500 text-xs mt-1">{errors.propertyName}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Price per night *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">$</span>
                <input
                  type="number"
                  min={1}
                  value={form.pricePerNight}
                  onChange={(e) => setForm({ ...form, pricePerNight: Number(e.target.value) })}
                  className={`w-full pl-6 pr-3 py-2.5 rounded-lg border text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                    errors.pricePerNight ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-rose-200 focus:border-rose-400"
                  }`}
                />
              </div>
              {errors.pricePerNight && <p className="text-red-500 text-xs mt-1">{errors.pricePerNight}</p>}
              <p className="text-xs text-gray-400 mt-1">Total: ${totalPrice.toLocaleString()} for {nights} nights</p>
            </div>

            {/* Beds / Baths */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bedrooms</label>
                <select
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} bd</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bathrooms</label>
                <select
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                >
                  {[1,1.5,2,2.5,3,3.5,4,5].map((n) => <option key={n} value={n}>{n} ba</option>)}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message to traveler *</label>
              <textarea
                rows={4}
                placeholder={`Hi ${trip.travelerName}! My property would be perfect for your ${trip.destination} trip because...`}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 transition-all ${
                  errors.message ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-rose-200 focus:border-rose-400"
                }`}
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            {/* Host info */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your info</p>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.hostName}
                    onChange={(e) => setForm({ ...form, hostName: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.hostName ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-rose-200 focus:border-rose-400"
                    }`}
                  />
                  {errors.hostName && <p className="text-red-500 text-xs mt-1">{errors.hostName}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.hostEmail}
                    onChange={(e) => setForm({ ...form, hostEmail: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.hostEmail ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-rose-200 focus:border-rose-400"
                    }`}
                  />
                  {errors.hostEmail && <p className="text-red-500 text-xs mt-1">{errors.hostEmail}</p>}
                </div>
              </div>
            </div>

            {/* Host rating hint */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-700">Add your Airbnb profile link in the message to build trust with travelers.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:shadow-md"
              style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
            >
              <Send className="w-4 h-4" /> Send Offer
            </button>

            <p className="text-xs text-center text-gray-400">
              Free to offer · No commission until booking confirmed
            </p>
          </form>
        </div>
      )}

      {/* Tips box */}
      {!expanded && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-gray-400" /> Tips for a great offer
          </h4>
          <ul className="space-y-2">
            {[
              "Mention specific amenities they requested",
              "Include a personal welcome message",
              "Offer a slight discount off your listed rate",
              "Share your host rating and reviews",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-rose-400 mt-0.5 flex-shrink-0">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
