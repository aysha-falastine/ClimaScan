"use client";

import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 py-12">
      <NavBar />

      <h1 className="text-3xl font-semibold text-gray-900 mb-10 text-center">
        ABOUT US!
      </h1>


      <section className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">


        <div
          className="border-2 rounded-lg p-6 shadow-sm hover:shadow-md transition text-center"
          style={{ borderColor: "#00FA9A", color: "forestgreen" }}
        >
          <h2 className="text-lg font-bold mb-3">OUR MISSION</h2>
          <p className="text-sm leading-relaxed">
            Empower every homeowner, expert, and builder to make climate-smart
            property decisions by translating complex hazard data into clear,
            actionable insights and practical adaptation steps.
          </p>
        </div>


        <div
          className="border-2 rounded-lg p-6 shadow-sm hover:shadow-md transition text-center"
          style={{ borderColor: "#00FA9A", color: "forestgreen" }}
        >
          <h2 className="text-lg font-bold mb-3">TECHNOLOGY</h2>
          <p className="text-sm leading-relaxed">
            ClimaScan blends space climate datasets with an AI-supported scoring
            engine and an accessible web interface, delivering fast
            geospatial-based insights.
          </p>
        </div>


        <div
          className="border-2 rounded-lg p-6 shadow-sm hover:shadow-md transition text-center"
          style={{ borderColor: "#00FA9A", color: "forestgreen" }}
        >
          <h2 className="text-lg font-bold mb-3">CORE VALUES</h2>
          <p className="text-sm leading-relaxed">
            We prioritize clarity, accountability, and transparency, offering
            climate and geospatial information in data-driven structures,
            allowing communities and individuals to act responsibly.
          </p>
        </div>
      </section>


      <section className="mt-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-8">DATASETS</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-48">
          <div className="flex flex-col items-center">
            <Image
              src="/nasa.svg"
              alt="NASA logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <Image
              src="/wbLogo.svg"
              alt="World Bank logo"
              width={140}
              height={120}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
