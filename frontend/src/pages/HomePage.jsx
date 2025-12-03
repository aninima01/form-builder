import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen  bg-black text-white flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black"></div>

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(71 85 105 / 0.4) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="absolute top-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <nav className="relative z-10 flex items-center justify-between max-w-7xl  w-full mx-auto py-6 px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center ">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-semibold  font-mono tracking-tight">
            FormCraft
          </h1>
        </div>
        <Link
          to="/login"
          className="group relative px-6 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full font-medium hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-white/5"
        >
          <span className="relative z-10">Sign In</span>
        </Link>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center text-center flex-grow px-6 py-20">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm">
          <Zap className="w-4 h-4 text-white" />
          <span className="text-white/80">Dynamic Form Builder</span>
        </div>

        <h2 className="text-6xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl">
          <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
            Build Forms That
          </span>
          <br />
          <span className="bg-gradient-to-r from-white/90 to-white/40 bg-clip-text text-transparent">
            Convert Better
          </span>
        </h2>

        <p className="text-lg text-white/60 mb-12 max-w-2xl leading-relaxed">
          Create beautiful, responsive forms in minutes. No coding required.
          Advanced validation, conditional logic, and seamless integrations.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/signup"
            className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-2xl shadow-white/10 hover:shadow-white/20 flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/dashboard"
            className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 shadow-lg"
          >
            Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">
          {[
            {
              icon: Sparkles,
              title: "Smart Fields",
              desc: "Auto-generated field types",
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Build forms in seconds",
            },
            {
              icon: Shield,
              title: "Secure by Default",
              desc: "Enterprise-grade security",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group relative p-8 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-gradient-to-br hover:from-white/[0.12] hover:to-white/[0.06] transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/0 to-white/0 opacity-0 group-hover:opacity-100 group-hover:from-white/5 group-hover:via-transparent group-hover:to-transparent transition-opacity duration-500 pointer-events-none" />

              <div className="relative w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-white/10">
                <feature.icon
                  className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-500"
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-base text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center text-sm py-6 text-white/40 border-t border-white/5">
        © {new Date().getFullYear()} FormCraft. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
