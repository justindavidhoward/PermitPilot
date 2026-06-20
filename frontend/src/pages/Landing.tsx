import { Link } from 'react-router-dom';
import { CheckCircle, FileText, MapPin, ShieldCheck, DollarSign, Hammer, Clock, ArrowRight, Star } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 text-white overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-sm font-semibold border border-indigo-500/30">
              <Star size={16} className="fill-current" />
              <span>AI-Powered Permit Navigation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Permits Simplified.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Projects Approved.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
              Describe your building project once. PermitPilot instantly determines the exact permits, forms, fees, inspections, and timelines you need—tailored to your precise location.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                to="/project-wizard"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/30 transition-all duration-200"
              >
                <span>Start Intake Wizard</span>
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                to="/settings"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold rounded-lg hover:text-white transition-all duration-200"
              >
                View Pricing Plans
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl text-left text-slate-200">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <CheckCircle className="text-indigo-400 mr-2" size={22} />
              Why Choose PermitPilot?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-indigo-500/20 p-1.5 rounded-md mr-3 mt-0.5 text-indigo-300">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Location-Tailored Logic</h4>
                  <p className="text-sm text-slate-300">Intelligent rules adjusted to your specific municipality.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-500/20 p-1.5 rounded-md mr-3 mt-0.5 text-indigo-300">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Prepped Applications & Checklists</h4>
                  <p className="text-sm text-slate-300">Get pre-filled application packages and ready-to-use checklist paths.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-500/20 p-1.5 rounded-md mr-3 mt-0.5 text-indigo-300">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Inspection Tracking</h4>
                  <p className="text-sm text-slate-300">Automated scheduling hints, reminders, and checklist milestones.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Target Audiences */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Built for Creators &amp; Builders</h2>
          <p className="text-slate-600 text-lg">
            No matter the project scope, we guide you from initial drawing to signed occupancy certificates.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg inline-block mb-4">
              <Hammer size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Homeowners</h3>
            <p className="text-slate-600 text-sm">
              Tackle your deck, pool, garage build, workshop, or renovation with the confidence of an expert.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg inline-block mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Contractors</h3>
            <p className="text-slate-600 text-sm">
              Accelerate approvals across multiple municipal boundaries. Keep clients updated in real time.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg inline-block mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Property Managers</h3>
            <p className="text-slate-600 text-sm">
              Track maintenance permits, repairs, and code compliance across hundreds of single or multi-family assets.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg inline-block mb-4">
              <DollarSign size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Small Developers</h3>
            <p className="text-slate-600 text-sm">
              De-risk build-outs and commercial space renewals with systematic permit status tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Models Overview */}
      <section className="py-16 bg-slate-100 border-y border-slate-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Flexible Pricing Tailored To You</h2>
            <p className="text-slate-600 mt-2">Choose between subscription accounts or a single pay-per-project model.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pay Per Project */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">One-Off Builder</h4>
                <h3 className="text-2xl font-bold text-slate-950">Pay-Per-Project</h3>
                <div className="text-3xl font-extrabold text-indigo-600">
                  $49 – $149 <span className="text-sm font-normal text-slate-500">/ project</span>
                </div>
                <p className="text-sm text-slate-600">
                  Ideal for one-time home builders who just need a complete set of application materials and checklists.
                </p>
              </div>
              <Link to="/settings" className="mt-8 block w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-850 font-semibold rounded-lg text-sm transition-colors">
                View Pricing
              </Link>
            </div>

            {/* Individual Monthly */}
            <div className="bg-indigo-900 text-white rounded-xl p-8 border border-indigo-850 flex flex-col justify-between shadow-lg relative transform scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-yellow-300">
                Most Popular
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Homeowner / DIYer</h4>
                <h3 className="text-2xl font-bold text-white">Individual Pro</h3>
                <div className="text-3xl font-extrabold text-indigo-400">
                  $19 – $49 <span className="text-sm font-normal text-indigo-200">/ mo</span>
                </div>
                <p className="text-sm text-indigo-100">
                  Unlimited projects. Complete permit navigation guide, documents store, and automated inspection warnings.
                </p>
              </div>
              <Link to="/settings" className="mt-8 block w-full text-center py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg text-sm transition-colors">
                Subscribe Now
              </Link>
            </div>

            {/* Contractor Pro */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Builder Professional</h4>
                <h3 className="text-2xl font-bold text-slate-950">Contractor Accounts</h3>
                <div className="text-3xl font-extrabold text-indigo-600">
                  $79 – $199 <span className="text-sm font-normal text-slate-500">/ mo</span>
                </div>
                <p className="text-sm text-slate-600">
                  For builders and PMs running multiple concurrent active project filings with multi-user collaboration hooks.
                </p>
              </div>
              <Link to="/settings" className="mt-8 block w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-850 font-semibold rounded-lg text-sm transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-slate-950 mb-12">PermitPilot by the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="p-4 space-y-2">
            <div className="text-4xl md:text-5xl font-extrabold text-indigo-600">99.4%</div>
            <div className="text-slate-600 text-sm font-medium">Permit Checklist Accuracy</div>
          </div>
          <div className="p-4 space-y-2">
            <div className="text-4xl md:text-5xl font-extrabold text-indigo-600">3x</div>
            <div className="text-slate-600 text-sm font-medium">Faster Approval Speeds</div>
          </div>
          <div className="p-4 space-y-2">
            <div className="text-4xl md:text-5xl font-extrabold text-indigo-600">12k+</div>
            <div className="text-slate-600 text-sm font-medium">Projects Facilitated</div>
          </div>
          <div className="p-4 space-y-2">
            <div className="text-4xl md:text-5xl font-extrabold text-indigo-600">$2.4M</div>
            <div className="text-slate-600 text-sm font-medium">Saved in Municipal Fines</div>
          </div>
        </div>
      </section>
    </div>
  );
}
