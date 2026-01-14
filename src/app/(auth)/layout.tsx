import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE: Form Container */}
      <main className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:w-[540px] xl:w-[600px]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <header className="mb-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">SkyBound</span>
            </Link>
          </header>
          
          {children}
          
          <footer className="mt-8 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} SkyBound Airlines. All rights reserved.
          </footer>
        </div>
      </main>

      {/* RIGHT SIDE: Visual/Branding (Hidden on Mobile) */}
      <div className="relative hidden w-0 flex-1 lg:block bg-slate-100">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2074"
          alt="Luxury flight view"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay with Glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20">
          <blockquote className="text-white">
            <p className="text-2xl font-medium mb-4">
              "The best booking experience I've had in years. Clean, fast, and remarkably intuitive."
            </p>
            </blockquote>
            <cite className="not-italic block border-l-2 border-blue-500 pl-4">
              <span className="font-semibold block text-lg text-white">Alexander Wright</span>
              <span className="text-white/70">Frequent Flyer & Architect</span>
            </cite>
          </div>
        </div>
      </div>
  );
}