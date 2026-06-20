import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles, Hammer, Clipboard } from 'lucide-react';
import apiClient from '../api/client';

export default function ProjectWizard() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('Deck');
  const [name, setName] = useState('');
  const [state, setState] = useState('TX');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [size, setSize] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 1. Create project
      const createResponse = await apiClient.post('/projects', {
        title: name || `My Custom ${type} Project`,
        description,
        location_city: city,
        location_state: state,
        project_type: type,
        project_scope: description,
        size: size || '0',
        estimated_cost: Number(cost) || 0,
        property_details: JSON.stringify({ zip })
      });

      const { id } = createResponse.data;

      // 2. Determine permits
      await apiClient.post(`/projects/${id}/determine-permits`);

      setIsLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error in project wizard submit:', err);
      setIsLoading(false);
      setError(err.response?.data?.error || 'Failed to create project and determine permit requirements. Please try again.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10 text-left">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Step {step} of 3</span>
            <span>
              {step === 1 && 'Project Type & Location'}
              {step === 2 && 'Dimensions & Valuation'}
              {step === 3 && 'Details & AI Checklist'}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-2 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-left">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 border-l-4 border-red-500 rounded text-sm">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">What are you building?</h2>
                <p className="text-slate-600 mt-1">Tell us the type and general location of your build.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Project Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['Deck', 'Garage', 'Pool', 'Renovation', 'Workshop', 'Other'].map((pType) => (
                    <button
                      key={pType}
                      type="button"
                      onClick={() => setType(pType)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        type === pType
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <Hammer size={18} className="mb-2 text-indigo-500" />
                      <div>{pType}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="block text-sm font-bold text-slate-700">Project Identifier Name</label>
                <input
                  type="text"
                  placeholder="e.g. Backyard Pool, Detached Garage Workshop"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full py-2.5 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full py-2.5 px-3 border border-slate-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="TX">Texas (TX)</option>
                    <option value="WA">Washington (WA)</option>
                    <option value="FL">Florida (FL)</option>
                    <option value="CA">California (CA)</option>
                    <option value="NY">New York (NY)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Austin"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full py-2.5 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    placeholder="78701"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="block w-full py-2.5 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dimensions &amp; Valuation</h2>
                <p className="text-slate-600 mt-1">Provide sizing and estimated costs. These trigger zoning rules.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Size / Footprint (Sq Ft)</label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      placeholder="e.g. 400"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="block w-full pr-12 py-2.5 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-sm">
                      sq. ft.
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Estimated Project Valuation ($)</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-sm">
                      $
                    </div>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="block w-full pl-8 py-2.5 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 text-sm">
                      USD
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-blue-800 space-y-2">
                <div className="font-bold flex items-center">
                  <Sparkles size={16} className="mr-2 text-blue-600" />
                  Did You Know?
                </div>
                <p>
                  Most cities waive complex permit requirements if a deck is under 200 sq ft and detached accessory buildings are under 120 sq ft. Size matters significantly!
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Project Narrative Details</h2>
                <p className="text-slate-600 mt-1">Describe any details. We will scan this to determine permit pathways.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Project Description</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project: where will it be on the lot, will there be electricity or plumbing, any structural modifications, height changes..."
                  className="block w-full py-2.5 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-slate-400"
                ></textarea>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded text-sm text-indigo-900">
                <h4 className="font-bold mb-1 flex items-center">
                  <Clipboard size={16} className="mr-1.5" />
                  Ready to compile AI Checklist
                </h4>
                <p className="text-indigo-800">
                  By clicking "Assemble Checklist", our AI rules engine matches your inputs with municipal, state, electrical, and structural codes.
                </p>
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              className={`inline-flex items-center justify-center px-5 py-2.5 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 text-slate-750 font-semibold text-sm transition-all ${
                step === 1 ? 'opacity-0 pointer-events-none' : ''
              }`}
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-semibold rounded-lg shadow-md shadow-indigo-600/20 transition-all text-sm"
            >
              {isLoading ? (
                <span>Assembling Guide...</span>
              ) : (
                <>
                  <span>{step === 3 ? 'Assemble Checklist' : 'Next Step'}</span>
                  {step < 3 && <ArrowRight size={16} className="ml-2" />}
                  {step === 3 && <Check size={16} className="ml-2" />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
