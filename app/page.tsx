import Link from "next/link";
import { ArrowRight, CheckCircle, Search, Star, TrendingUp, Users, Zap } from "lucide-react";
import { MOCK_TRIP_REQUESTS, POPULAR_DESTINATIONS } from "./lib/data";
import TripCard from "./components/TripCard";

const STATS = [
  { value: "12,000+", label: "Trips posted" },
  { value: "8,400+", label: "Verified hosts" },
  { value: "$320", label: "Avg. savings/trip" },
  { value: "4.9★", label: "Avg. host rating" },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Post Your Trip",
    desc: "Tell us your destination, dates, group size, and the amenities you want. It takes 2 minutes.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "bg-rose-50 text-rose-500",
  },
  {
    step: "2",
    title: "Hosts Find You",
    desc: "Local vacation rental owners browse your request and reach out with custom offers tailored to your needs.",
    icon: <Search className="w-6 h-6" />,
    color: "bg-violet-50 text-violet-500",
  },
  {
    step: "3",
    title: "Compare & Book",
    desc: "Review all the offers, compare prices and amenities, message hosts, and choose the perfect deal.",
    icon: <CheckCircle className="w-6 h-6" />,
    color: "bg-emerald-50 text-emerald-500",
  },
];

const TESTIMONIALS = [
  {
    name: "Jessica M.",
    location: "Traveled to Lake Tahoe",
    avatar: "J",
    rating: 5,
    text: "We posted our ski trip and got 8 offers within 24 hours. Saved nearly $800 off what we would have paid booking normally. The host even added a welcome basket!",
    avatarBg: "from-pink-500 to-rose-500",
  },
  {
    name: "Derek & Tam",
    location: "Traveled to Outer Banks",
    avatar: "D",
    rating: 5,
    text: "Finally — a marketplace where hosts have to compete for us. We got a beachfront house with a private pool that was way outside our original budget because the host wanted to fill a last-minute gap.",
    avatarBg: "from-blue-500 to-indigo-500",
  },
  {
    name: "Aaliyah R.",
    location: "Traveled to Sedona",
    avatar: "A",
    rating: 5,
    text: "Honeymoon planning stress? Gone. We described our dream getaway and three gorgeous properties sent us offers. The one we chose was better than anything we'd found on our own.",
    avatarBg: "from-amber-500 to-orange-500",
  },
];

export default function HomePage() {
  const featuredTrips = MOCK_TRIP_REQUESTS.filter((t) => t.status === "open").slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #FF385C 0%, transparent 50%), radial-gradient(circle at 75% 75%, #FF7245 0%, transparent 50%)`
        }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>The reverse vacation rental marketplace</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Post your trip.
            <br />
            <span style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Hosts come to you.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Tell us where you want to go. Local vacation rental owners compete to win your booking — so you always get the best deal.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/post-trip"
              className="group flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105"
              style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
            >
              Post Your Trip — Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/browse"
              className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <Search className="w-4 h-4" />
              Hosts: Find Guests
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Popular destinations on StayBid</h2>
          <div className="flex flex-wrap gap-3">
            {POPULAR_DESTINATIONS.map((dest) => (
              <Link
                key={dest.name}
                href={`/post-trip?destination=${encodeURIComponent(dest.name)}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <span>{dest.emoji}</span>
                <span>{dest.name}</span>
              </Link>
            ))}
            <Link
              href="/post-trip"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)", color: "white" }}
            >
              + Add your destination
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How StayBid works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stop spending hours searching listings. Let the listings come to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative bg-white rounded-2xl p-8 border border-gray-200 text-center">
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-5`}>
                  {step.icon}
                </div>
                <div className="absolute top-6 right-6 text-5xl font-black text-gray-100">{step.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/post-trip"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-bold text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
            >
              Start your trip request <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Open trip requests */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Open trip requests</h2>
              <p className="text-gray-600">Hosts: make an offer on these active requests</p>
            </div>
            <Link
              href="/browse"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold hover:underline"
              style={{ color: "#FF385C" }}
            >
              View all requests <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/browse" className="text-sm font-semibold" style={{ color: "#FF385C" }}>
              View all open requests →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Travelers love StayBid</h2>
            <p className="text-gray-600">Real stories from real trips</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-5 text-sm">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 mx-4 sm:mx-8 lg:mx-16 mb-8 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Users className="w-6 h-6 text-white/60" />
            <span className="text-white/60 text-sm font-medium">Join 50,000+ smart travelers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get the best deal on your next trip?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            It&apos;s free to post your trip request. Hosts only reach out when they have something great to offer.
          </p>
          <Link
            href="/post-trip"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all hover:shadow-xl hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF7245 100%)" }}
          >
            Post Your Trip — It&apos;s Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
