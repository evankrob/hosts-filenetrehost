"use client";

import { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, MapPin, X, TrendingUp } from "lucide-react";
import { MOCK_TRIP_REQUESTS, ALL_AMENITIES, type Amenity } from "@/app/lib/data";
import TripCard from "@/app/components/TripCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "budget_high", label: "Budget: High to Low" },
  { value: "budget_low", label: "Budget: Low to High" },
  { value: "guests_high", label: "Most guests" },
  { value: "offers_high", label: "Most offers" },
];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("open");
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [minBudget, setMinBudget] = useState(0);
  const [maxGuests, setMaxGuests] = useState(0);

  const toggleAmenity = (amenity: Amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("open");
    setSelectedAmenities([]);
    setSortBy("newest");
    setMinBudget(0);
    setMaxGuests(0);
  };

  const filteredAndSorted = useMemo(() => {
    let results = [...MOCK_TRIP_REQUESTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.destination.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.region.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      results = results.filter((t) => t.status === statusFilter);
    }

    if (selectedAmenities.length > 0) {
      results = results.filter((t) =>
        selectedAmenities.some((a) => t.amenities.includes(a))
      );
    }

    if (minBudget > 0) {
      results = results.filter((t) => t.budget >= minBudget);
    }

    if (maxGuests > 0) {
      results = results.filter((t) => t.numGuests <= maxGuests);
    }

    switch (sortBy) {
      case "newest":
        results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "budget_high":
        results.sort((a, b) => b.budget - a.budget);
        break;
      case "budget_low":
        results.sort((a, b) => a.budget - b.budget);
        break;
      case "guests_high":
        results.sort((a, b) => b.numGuests - a.numGuests);
        break;
      case "offers_high":
        results.sort((a, b) => b.offerCount - a.offerCount);
        break;
    }

    return results;
  }, [searchQuery, statusFilter, selectedAmenities, sortBy, minBudget, maxGuests]);

  const openCount = MOCK_TRIP_REQUESTS.filter((t) => t.status === "open").length;
  const activeFilters = selectedAmenities.length + (minBudget > 0 ? 1 : 0) + (maxGuests > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                </div>
                <span className="text-sm font-semibold text-rose-600">For Hosts</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Browse Trip Requests</h1>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{openCount} open requests</span> from travelers looking for their perfect rental
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
              <span>💡</span>
              <span>Click any trip to make an offer</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by destination, region, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex rounded-xl border border-gray-300 overflow-hidden bg-white">
            {(["all", "open", "closed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-all ${
                  statusFilter === s
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                style={statusFilter === s ? { background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" } : {}}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
              showFilters || activeFilters > 0
                ? "border-rose-400 bg-rose-50 text-rose-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilters > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#FF385C" }}>
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Advanced Filters
              </h3>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="text-sm text-rose-600 font-semibold hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Required amenities (match any)</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        selectedAmenities.includes(amenity)
                          ? "border-rose-400 bg-rose-50 text-rose-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min. budget</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      placeholder="No minimum"
                      value={minBudget || ""}
                      onChange={(e) => setMinBudget(Number(e.target.value))}
                      className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max. guests</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    placeholder="No maximum"
                    value={maxGuests || ""}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredAndSorted.length}</span> trip{filteredAndSorted.length !== 1 ? "s" : ""}
              {searchQuery && <span> matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>}
            </p>
          </div>
          {(searchQuery || activeFilters > 0) && (
            <button onClick={clearFilters} className="text-sm text-rose-600 font-semibold hover:underline">
              Reset filters
            </button>
          )}
        </div>

        {/* Trip grid */}
        {filteredAndSorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
