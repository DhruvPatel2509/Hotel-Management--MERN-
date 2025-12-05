// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
              About <span className="text-blue-600">QuickStay</span>
            </h1>
            <p className="mt-4 text-slate-600 leading-relaxed">
              QuickStay helps travelers discover the right stay and helps hotel
              owners manage rooms with ease. Search fast, book confidently, and
              manage everything from one simple dashboard.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/rooms"
                className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700"
              >
                Explore Rooms
              </Link>
              <Link
                to="/hotel-reg"
                className="rounded-xl bg-white px-5 py-3 text-slate-700 border border-slate-200 hover:bg-slate-100"
              >
                Register Your Hotel
              </Link>
            </div>
          </div>

          <div className="relative">
            <img src={assets.websiteHome} alt="" />

            <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-2xl bg-white/80 backdrop-blur p-4 shadow-lg">
              <p className="text-sm text-slate-700">
                “Book in minutes. Manage in seconds.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="rounded-2xl bg-white p-6 sm:p-10 shadow">
          <h2 className="text-2xl font-semibold text-slate-900">Our Mission</h2>
          <p className="mt-3 text-slate-600">
            We make hotel discovery and management simple, transparent, and
            reliable. Clean UI, honest pricing, and tools that save time for
            guests and owners alike.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h3 className="text-xl font-semibold text-slate-900">What you get</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="Quick Search"
            desc="Filter by city, price, and amenities. Find rooms fast."
          />
          <Feature
            title="Easy Booking"
            desc="Smooth date selection and instant confirmation."
          />
          <Feature
            title="Owner Dashboard"
            desc="Add rooms, upload photos, edit pricing—no hassle."
          />
          <Feature
            title="Verified Listings"
            desc="Reviewed properties with real photos."
          />
          <Feature
            title="Secure Payments"
            desc="Card, UPI, and Pay at Hotel options."
          />
          <Feature title="Support" desc="Friendly help, 7 days a week." />
        </div>
      </section>

      {/* Stats — realistic fake numbers */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          <Stat k="2,400+" v="Hotels Listed" />
          <Stat k="18,000+" v="Rooms Available" />
          <Stat k="120+" v="Cities Covered" />
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <Stat k="4.6/5" v="Average Rating" />
          <Stat k="1.2M+" v="Searches Completed" />
          <Stat k="2019" v="Founded" />
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
};

const Feature = ({ title, desc }) => (
  <div className="rounded-2xl bg-white p-6 shadow border border-slate-100">
    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
      <span className="text-blue-600 font-bold">★</span>
    </div>
    <p className="font-semibold text-slate-900">{title}</p>
    <p className="mt-1 text-sm text-slate-600">{desc}</p>
  </div>
);

const Stat = ({ k, v }) => (
  <div className="rounded-2xl bg-white p-6 shadow text-center">
    <p className="text-3xl font-semibold text-slate-900">{k}</p>
    <p className="mt-1 text-slate-500">{v}</p>
  </div>
);

export default About;
