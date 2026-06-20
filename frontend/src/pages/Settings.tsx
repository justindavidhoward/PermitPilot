import { useState, useEffect } from 'react';
import { User, CreditCard, Check, Sparkles, Briefcase, Mail, Phone } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile');
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane.doe@example.com');
  const [phone, setPhone] = useState('(512) 555-0199');
  const [currentTier] = useState<string>('Individual Monthly ($29/mo)');
  const [isSaved, setIsSaved] = useState(false);
  const [isTierSaving] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto text-left space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-600 mt-1">Manage your profile, active billing subscription, and building tiers.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <User size={16} className="mr-2" />
            Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center ${
              activeTab === 'billing'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CreditCard size={16} className="mr-2" />
            Subscription &amp; Plans
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-950 mb-6 border-b border-slate-100 pb-3 flex items-center">
              <User className="text-indigo-500 mr-2" size={20} />
              Personal Information
            </h3>

            {isSaved && (
              <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 text-sm text-emerald-800 rounded flex items-center">
                <Check size={18} className="mr-2" />
                <span>Your profile has been saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone size={16} />
                    </div>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Account Role</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Briefcase size={16} />
                    </div>
                    <select className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                      <option>Homeowner / Owner-Builder</option>
                      <option>General Contractor</option>
                      <option>Specialty Subcontractor</option>
                      <option>Property Manager</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md shadow-indigo-600/20 text-sm transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8">
            {/* Current Tier Summary */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Active Membership</h3>
                <div className="text-2xl font-black text-slate-950 flex items-center">
                  {currentTier}
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-sm text-slate-500">Your membership automatically renews on July 17, 2026 via Stripe.</p>
              </div>
              <div>
                <button className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 text-slate-750 font-semibold text-sm transition-all shadow-sm bg-white">
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Change Subscription Tiers */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Upgrade or Switch Tiers</h3>
                <p className="text-slate-500 text-sm mt-1">Select the subscription model that aligns with your builder workload.</p>
              </div>

              {isTierSaving && (
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 text-sm text-indigo-900 rounded flex items-center">
                  <Sparkles size={18} className="mr-2 text-indigo-600 animate-pulse" />
                  <span>Configuring your Stripe webhook mapping tier...</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Individual Tier */}
                <div className={`bg-white rounded-xl p-6 border flex flex-col justify-between shadow-sm transition-all ${
                  currentTier.includes('Individual') ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-slate-200'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Individual</span>
                      {currentTier.includes('Individual') && <Check size={18} className="text-indigo-600" />}
                    </div>
                    <h4 className="text-xl font-bold text-slate-950">Individual Monthly</h4>
                    <div className="text-3xl font-black text-indigo-600">
                      $29 <span className="text-sm font-normal text-slate-500">/ mo</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      <li className="flex items-center"><Check size={14} className="text-emerald-500 mr-2" /> Unlimited Active Projects</li>
                      <li className="flex items-center"><Check size={14} className="text-emerald-500 mr-2" /> AI Checklist Building Engine</li>
                      <li className="flex items-center"><Check size={14} className="text-emerald-500 mr-2" /> Inspection Notification Trackers</li>
                    </ul>
                  </div>
                  <a
                    href="https://buy.stripe.com/bJe00lduC9u225v9RddAk00"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    Subscribe
                  </a>
                </div>

                {/* Contractor Tier */}
                <div className={`bg-white rounded-xl p-6 border flex flex-col justify-between shadow-sm transition-all relative ${
                  currentTier.includes('Contractor') ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-slate-200'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Pro Builder</span>
                      {currentTier.includes('Contractor') && <Check size={18} className="text-indigo-600" />}
                    </div>
                    <h4 className="text-xl font-bold text-slate-950">Contractor Monthly</h4>
                    <div className="text-3xl font-black text-indigo-600">
                      $99 <span className="text-sm font-normal text-slate-500">/ mo</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      <li className="flex items-center"><Check size={14} className="text-emerald-500 mr-2" /> Everything in Individual</li>
                      <li className="flex items-center"><Check size={14} className="text-emerald-500 mr-2" /> Contractor Collaboration Seats</li>
                      <li className="flex items-center"><Check size={14} className="text-emerald-500 mr-2" /> Custom CAD Upload Checks</li>
                    </ul>
                  </div>
                  <a
                    href="https://buy.stripe.com/cNi6oJfCKfSqcK96F1dAk01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    Subscribe
                  </a>
                </div>

                {/* Pay-Per-Project Tier */}
                <div className={`bg-white rounded-xl p-6 border flex flex-col justify-between shadow-sm transition-all ${
                  currentTier.includes('Pay-Per-Project') ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-slate-200'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Single Run</span>
                      {currentTier.includes('Pay-Per-Project') && <Check size={18} className="text-indigo-600" />}
                    </div>
                    <h4 className="text-xl font-bold text-slate-950">Pay-Per-Project</h4>
                    <div className="text-3xl font-black text-indigo-600">
                      $99 <span className="text-sm font-normal text-slate-500">/ single project</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      <li className="flex items-center"><Check size={14} className="text-emerald-500 mr-2" /> Full AI Checklist Setup</li>
                      <li className="flex items-center"><Check size={14} className="text-emerald-500 mr-2" /> Pre-filled Forms Package</li>
                      <li className="flex items-center"><Check size={14} className="text-emerald-500 mr-2" /> 90 Days Document Store</li>
                    </ul>
                  </div>
                  <a
                    href="https://buy.stripe.com/4gM7sN2PY35E11r5AXdAk02"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    Buy
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
