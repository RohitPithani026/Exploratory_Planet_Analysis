"use client"

import Link from "next/link"
import { ArrowRight, Database, Globe, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RotatingPlanet } from "@/components/rotating-planet"
import { ImageCarousel } from "@/components/image-carousel"
import { MobileMenu } from "@/components/mobile-menu"
import { SpaceBackground } from "@/components/space-background"
import { ParticleBackground } from "@/components/particle-background"

export default function Home() {
  // Navigation links
  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
    { href: "#methodology", label: "Methodology" },
  ]

  // Sample images for the carousel
  const exoplanetImages = [
    {
      src: "/assets/images/earth.jpg",
      alt: "Galaxy and stars",
      caption: "A beautiful view of the galaxy",
    },
    {
      src: "/assets/images/galaxy.jpg",
      alt: "Earth from space",
      caption: "Earth as seen from outer space",
    },
    {
      src: "/assets/images/mars.jpg",
      alt: "Mars landscape",
      caption: "A stunning view of the Mars-like landscape",
    },
    {
      src: "/assets/images/night-sky.jpg",
      alt: "Night sky with stars",
      caption: "The vast and endless night sky filled with stars",
    },
  ]  

  return (
    <div className="flex min-h-screen flex-col bg-[#030014]">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Space Background */}
      <SpaceBackground />

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
        <div className="container flex h-16 items-center justify-between p-8">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur"></div>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black">
                <Globe className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-xl font-bold text-transparent">
              ExoHabit
            </span>
          </div>

          {/* Mobile menu */}
          <MobileMenu links={navLinks} />

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white transition-colors hover:text-indigo-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25"
              >
                <span className="relative z-10">Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center bg-no-repeat opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/80 to-[#030014]"></div>
          <div className="absolute inset-0">
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
          </div>

          {/* Add rotating planet */}
          <RotatingPlanet position="right" />

          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="animate-fade-up bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-4xl font-bold tracking-tighter text-transparent sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Discover Habitable Exoplanets
                </h1>
                <p className="mx-auto max-w-[700px] text-white/70 md:text-xl">
                  Using AI and Machine Learning to analyze NASA&apos;s Exoplanet Archive data and predict habitability and
                  terraformability scores.
                </p>

              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25"
                  >
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="relative z-10 ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg transition-all duration-300 hover:shadow-gray-500/25"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030014] to-transparent"></div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-[#030014]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-indigo-300 backdrop-blur">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-400"></span>
                Cutting-edge Technology
              </div>
              <div className="space-y-2">
                <h2 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl">
                  Key Features
                </h2>
                <p className="mx-auto max-w-[700px] text-white/60 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers advanced tools for exoplanet analysis
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-12">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">NASA Data Integration</h3>
                  <p className="text-white/60">
                    Real-time access to NASA&apos;s Exoplanet Archive with comprehensive data visualization
                  </p>

                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">Habitability Scoring</h3>
                  <p className="text-white/60">
                    AI-powered analysis of exoplanet conditions to determine potential for supporting life
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <Rocket className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">Terraformability Assessment</h3>
                  <p className="text-white/60">
                    Advanced algorithms to evaluate if non-habitable planets can be engineered to support life
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32 bg-[#030014]">
          <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-900/20 blur-[100px]"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-indigo-300 backdrop-blur">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-400"></span>
                  Our Mission
                </div>
                <div className="space-y-2">
                  <h2 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl">
                    About Our Project
                  </h2>
                  <p className="max-w-[600px] text-white/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our project combines cutting-edge AI and Machine Learning techniques to analyze exoplanetary data
                    and predict the habitability of exoplanets.
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="max-w-[600px] text-white/60 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                    We take real data from NASA&apos;s Exoplanet Archive, apply both rule-based and ML-based methods, and
                    provide an AI-generated habitability score for each exoplanet.
                  </p>

                  <p className="max-w-[600px] text-white/60 md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                    Our new Terraformability Score assesses whether a planet can be engineered to support life even if
                    it&apos;s not naturally habitable, providing valuable insights for ISRO and NASA.
                  </p>

                </div>
              </div>
              <div className="relative flex items-center justify-center">
                {/* Replace static image with carousel */}
                <ImageCarousel images={exoplanetImages} interval={3000} className="w-full max-w-[600px] mx-auto" />
              </div>
            </div>
          </div>
        </section>

        <section
          id="methodology"
          className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#030014] to-[#070024]"
        >
          <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[100px]"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-full bg-white/5 px-3 py-1 text-sm text-indigo-300 backdrop-blur">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-400"></span>
                Scientific Approach
              </div>
              <div className="space-y-2">
                <h2 className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl">
                  Our Methodology
                </h2>
                <p className="mx-auto max-w-[700px] text-white/60 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  How we analyze and score exoplanets for habitability and terraformability
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 mt-12">
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-8 shadow-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-white">Habitability Score</h3>
                    <ul className="space-y-3 text-left">
                      {[
                        "Analysis of atmospheric composition",
                        "Surface temperature evaluation",
                        "Presence of liquid water",
                        "Planetary mass and gravity assessment",
                        "Distance from host star",
                        "Radiation levels",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                          <span className="text-white/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-8 shadow-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                      <Rocket className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-white">Terraformability Score</h3>
                    <ul className="space-y-3 text-left">
                      {[
                        "Resource availability assessment",
                        "Geological stability",
                        "Potential for atmospheric modification",
                        "Energy requirements calculation",
                        "Time estimation for terraforming processes",
                        "Cost-benefit analysis",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400"></div>
                          <span className="text-white/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-white/10 bg-[#030014] py-4">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row px-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-75 blur"></div>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black">
                <Globe className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-xl font-bold text-transparent">
              ExoHabit
            </span>
          </div>
          <p className="text-center text-sm leading-loose text-white/40 md:text-left">
            © 2025 ExoHabit. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm font-medium text-white/40 hover:text-white/70">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium text-white/40 hover:text-white/70">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium text-white/40 hover:text-white/70">
              Contact
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

