"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { ALL_AMENITIES, type Amenity, POPULAR_DESTINATIONS } from "@/app/lib/data";
import AmenityBadge from "@/app/components/AmenityBadge";

const STEPS = ["Destination", "Dates & Guests", "Amenities", "Details", "Done"];

function PostTripForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    numGuests: 2,
    budget: 1500,
    amenities: [] as Amenity[],
    description: "",
    name: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const dest = searchParams.get("destination");
    if (dest) setForm((f) => ({ ...f, destination: dest }));
  }, [searchParams]);

  const toggleAmenity = (amenity: Amenity) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !form.destination.trim()) e.destination = "Please enter a destination";
    if (step === 1) {
      if (!form.startDate) e.startDate = "Please select a check-in date";
      if (!form.endDate) e.endDate = "Please select a check-out date";
      if (form.startDate && form.endDate && form.endDate <= form.startDate)
        e.endDate = "Check-out must be after check-in";
    }
    if (step === 3) {
      if (!form.description.trim() || form.description.length < 20)
        e.description = "Please describe your trip in at least 20 characters";
      if (!form.name.trim()) e.name = "Please enter your name";
      if (!form.email.trim() || !form.email.includes("@")) e.email = "Please enter a valid email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < STEPS.length - 2) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setStep(STEPS.length - 1);
  };

  const progress = ((step) / (STEPS.length - 1)) * 100;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-10 text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your trip is live! 🎉</h1>
          <p className="text-gray-600 leading-relaxed mb-2">
            Your request for <strong>{form.destination}</strong> has been posted. Hosts are already being notified.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Check your email at <strong>{form.email}</strong> for confirmation and offer notifications.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/browse")}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
            >
              Browse other trip requests
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(0); setForm({ destination: "", startDate: "", endDate: "", numGuests: 2, budget: 1500, amenities: [], description: "", name: "", email: "" }); }}
              className="w-full py-3.5 rounded-xl font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
            >
              Post another trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}>
            <Sparkles className="w-4 h-4" />
            Free to post
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Your Trip Request</h1>
          <p className="text-gray-600">Tell hosts what you need — they&apos;ll reach out with their best offers</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.slice(0, -1).map((s, i) => (
              <span key={s} className={`text-xs font-medium ${i <= step ? "text-gray-900" : "text-gray-400"}`}>
                {s}
              </span>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #FF385C 0%, #FF7245 100%)"
              }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8">

            {/* Step 0 — Destination */}
            {step === 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Where do you want to go?</h2>
                    <p className="text-sm text-gray-500">Be as specific or broad as you like</p>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="e.g. Lake Tahoe, CA or Outer Banks, NC"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className={`w-full px-4 py-3.5 rounded-xl border text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 transition-all ${
                      errors.destination ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-rose-200 focus:border-rose-400"
                    }`}
                  />
                  {errors.destination && <p className="text-red-500 text-xs mt-1.5">{errors.destination}</p>}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-3">Popular destinations</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_DESTINATIONS.map((dest) => (
                      <button
                        key={dest.name}
                        type="button"
                        onClick={() => setForm({ ...form, destination: dest.name })}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                          form.destination === dest.name
                            ? "border-rose-400 bg-rose-50 text-rose-700"
                            : "border-gray-200 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        <span>{dest.emoji}</span>
                        <span>{dest.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 — Dates & Guests */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">When & how many?</h2>
                    <p className="text-sm text-gray-500">Set your travel window and group size</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                    <input
                      type="date"
                      min={today}
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                        errors.startDate ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-violet-200 focus:border-violet-400"
                      }`}
                    />
                    {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                    <input
                      type="date"
                      min={form.startDate || today}
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                        errors.endDate ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-violet-200 focus:border-violet-400"
                      }`}
                    />
                    {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> Number of guests</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, numGuests: Math.max(1, form.numGuests - 1) })}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:border-gray-500 transition-all"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">{form.numGuests}</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, numGuests: Math.min(30, form.numGuests + 1) })}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:border-gray-500 transition-all"
                    >
                      +
                    </button>
                    <span className="text-gray-500 text-sm">{form.numGuests === 1 ? "person" : "people"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" /> Total budget</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      min={100}
                      step={100}
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">Total trip budget (not per night). Hosts will try to beat this price.</p>
                </div>
              </div>
            )}

            {/* Step 2 — Amenities */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">What amenities do you need?</h2>
                    <p className="text-sm text-gray-500">Select all that apply — this is your wishlist</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {ALL_AMENITIES.map((amenity) => {
                    const selected = form.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`transition-all duration-150 ${selected ? "ring-2 ring-rose-400 ring-offset-1" : ""}`}
                      >
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium transition-all ${
                          selected
                            ? "border-rose-400 bg-rose-50 text-rose-700"
                            : "border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                        }`}>
                          <AmenityBadge amenity={amenity} size="sm" />
                        </span>
                      </button>
                    );
                  })}
                </div>

                {form.amenities.length > 0 && (
                  <div className="mt-5 p-3.5 bg-rose-50 rounded-xl border border-rose-100">
                    <p className="text-xs font-semibold text-rose-700 mb-2">Selected ({form.amenities.length}):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.amenities.map((a) => (
                        <span key={a} className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded-full font-medium">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 — Details */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Tell hosts about your trip</h2>
                    <p className="text-sm text-gray-500">The more detail, the better offers you&apos;ll get</p>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Describe your trip <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="e.g. Family ski trip for 6 adults. We love après-ski evenings and need a place with ski-in/ski-out access. Hot tub is a must! Flexible on exact location near Heavenly or Northstar."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 transition-all ${
                      errors.description ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-amber-200 focus:border-amber-400"
                    }`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.description ? (
                      <p className="text-red-500 text-xs">{errors.description}</p>
                    ) : <span />}
                    <p className="text-xs text-gray-400">{form.description.length} chars</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="First name or alias"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.name ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-amber-200 focus:border-amber-400"
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.email ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-amber-200 focus:border-amber-400"
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    <p className="text-xs text-gray-400 mt-1">We&apos;ll notify you when offers arrive</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Trip Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Destination:</span> <span className="font-medium text-gray-900">{form.destination}</span></div>
                    <div><span className="text-gray-500">Guests:</span> <span className="font-medium text-gray-900">{form.numGuests}</span></div>
                    <div><span className="text-gray-500">Dates:</span> <span className="font-medium text-gray-900">{form.startDate} – {form.endDate}</span></div>
                    <div><span className="text-gray-500">Budget:</span> <span className="font-medium text-gray-900">${form.budget.toLocaleString()}</span></div>
                  </div>
                  {form.amenities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {form.amenities.slice(0, 5).map((a) => (
                        <span key={a} className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-600">{a}</span>
                      ))}
                      {form.amenities.length > 5 && <span className="text-xs text-gray-500">+{form.amenities.length - 5} more</span>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md"
              style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
            >
              {step === STEPS.length - 2 ? (
                <>Post My Trip <CheckCircle className="w-4 h-4" /></>
              ) : (
                <>Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Free to post · No payment required · Hosts reach out to you
        </p>
      </div>
    </div>
  );
}

export default function PostTripPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" /></div>}>
      <PostTripForm />
    </Suspense>
  );
}
