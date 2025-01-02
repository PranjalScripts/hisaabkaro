import React from "react";
import  RetroTV  from "./RetroTV/RetroTv";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Background404 } from "./RetroTV/Background";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <Background404 />
      <div className="relative z-10 ">
        <RetroTV  />

        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/dashboard"
            className="group flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium transition-all hover:bg-gray-200"
          >
            <Home className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
            Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 border border-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
