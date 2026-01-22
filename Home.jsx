import { useNavigate } from "react-router-dom";

const Home = () => {
  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#081a33] to-[#0e2a52] text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Welcome to <br />
            <span className="text-blue-400">
              Site Survey Intelligence Platform
            </span>
          </h1>

          <p className="mt-6 text-gray-300 text-lg">
            This platform helps Internet Service Providers plan, analyze,
            and document network deployments across apartments, campuses,
            offices, and large-scale environments.
          </p>

          <p className="mt-4 text-gray-400">
            Use the navigation above to manage properties, buildings,
            floors, spaces, and perform detailed survey checklists.
          </p>

          <div className="mt-6 text-sm text-blue-300">
            📌 Tip: Start with <b>Properties</b> to define your site hierarchy.
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>

          <div className="relative bg-[#0b1f3a] border border-blue-900 rounded-xl p-6 shadow-xl">
            <p className="text-sm text-gray-300 mb-2">
              📡 Network Coverage Snapshot
            </p>

            <div className="h-48 rounded bg-gradient-to-r from-blue-500/40 to-indigo-500/40 flex items-center justify-center">
              <span className="text-blue-200 text-sm">
                Heatmap & Survey Visualization Area
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-gray-300">
              <div className="bg-blue-900/40 rounded p-2 text-center">
                Floors
              </div>
              <div className="bg-blue-900/40 rounded p-2 text-center">
                Spaces
              </div>
              <div className="bg-blue-900/40 rounded p-2 text-center">
                Coverage
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Home;
