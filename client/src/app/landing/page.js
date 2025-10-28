import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <NavBar />

      {/* Hero Section with Background Image + Overlay */}
      <section className="relative text-white py-28 px-6 overflow-hidden">
  {/* Background image as <img> */}
  <img
    src="/climabg.jpg"
    alt="Climate background"
    className="absolute inset-0 w-full h-full object-cover brightness-75 z-0"
  />


  {/* Content */}
  <div className="relative z-10 text-center max-w-3xl mx-auto">
    <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
      Buy the home, not the hazard.
    </h1>
    <p className="text-lg mb-8 drop-shadow-md">
      Assess climate hazards before investing — AI-powered climate risk reports.
    </p>
    <a
  href="#report"
  className="bg-white text-black px-6 py-3 rounded-md hover:bg-green-600 transition-colors no-underline"
>
  Get Risk Report
</a>

  </div>
</section>




      {/* Hazard Highlights */}
      <section className="bg-gray-50 py-16 px-6">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      { title: "Flood Risk", image: "/flood image.svg" },
      { title: "Drought", image: "/drought image.svg" },
      { title: "Drainage", image: "/drainage image.svg" },
    ].map(({ title, image }) => (
      <div key={title} className="bg-white shadow-md rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-contain bg-white p-4" //  increased from h-48 to h-56
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-green-700 text-center"> {/*  changed to green */}
            {title}
          </h3>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Map + Report Summary */}
      <section id="report" className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-bold text-green-900 mb-4">Interactive Maps</h2>
            <img
              src="/map.jpg"
              alt="Kenya Hazard Map"
              className="w-full rounded-md shadow object-contain bg-white p-4"
            />
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
  {/* AI Icon + Title */}
  <div className="flex items-center gap-3 mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1m4 0h-1v4h-1" />
    </svg>
    <h3 className="text-xl font-semibold text-green-700">
      AI Report — Drought Risk (Nairobi, Kenya)
    </h3>
  </div>

  {/* Report Details */}
  <ul className="text-green-700 space-y-2 text-sm leading-relaxed">
    <li><strong>Overall Drought Risk:</strong> 68/100 — High</li>
    <li><strong>Risk to Property:</strong> Medium</li>
    <li><strong>Time to Recover:</strong> Nine hours (10–20 years)</li>
    <li>
      <strong>Outlook:</strong> This region has been experiencing high levels of drought over the past decade.
      Rainfall patterns may continue to change, increasing the need for property upkeep and scaling.
    </li>
  </ul>
</div>

        </div>
      </section>

      <Footer />
    </>
  );
}
