import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectWizard from './pages/ProjectWizard';
import ProjectDetail from './pages/ProjectDetail';
import Settings from './pages/Settings';
import { Menu, X, Hammer, User, LogOut } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state on location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('customProject');
    setIsLoggedIn(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-indigo-600 font-bold' : 'text-slate-650 hover:text-slate-900 font-medium';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-10">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-2.5 text-indigo-600 font-black text-xl tracking-tight">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Hammer size={18} className="transform -rotate-12" />
              </div>
              <span>PermitPilot</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 text-sm">
              <Link to="/" className={isActive('/')}>Landing</Link>
              {isLoggedIn && (
                <>
                  <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                  <Link to="/project-wizard" className={isActive('/project-wizard')}>Intake Wizard</Link>
                </>
              )}
              <Link to="/settings" className={isActive('/settings')}>Settings &amp; Plans</Link>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/settings" className="flex items-center text-sm font-semibold text-slate-700 hover:text-indigo-600">
                  <User size={16} className="mr-1.5" />
                  <span>My Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-750 font-semibold text-sm hover:border-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <LogOut size={14} className="mr-1.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/10 transition-colors"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-50 border-t border-slate-200 px-6 py-4 space-y-3 shadow-inner">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-slate-700 font-semibold hover:text-indigo-600">Landing</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block text-slate-700 font-semibold hover:text-indigo-600">Dashboard</Link>
              <Link to="/project-wizard" onClick={() => setIsOpen(false)} className="block text-slate-700 font-semibold hover:text-indigo-600">Intake Wizard</Link>
              <Link to="/settings" onClick={() => setIsOpen(false)} className="block text-slate-700 font-semibold hover:text-indigo-600">Settings &amp; Plans</Link>
              <div className="border-t border-slate-200 pt-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center py-2 border border-slate-300 rounded-lg text-slate-700 font-bold bg-white"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold bg-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
              >
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white font-black text-lg">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Hammer size={16} className="transform -rotate-12" />
            </div>
            <span>PermitPilot</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminating the complexity, timelines, and overhead of building and renovating compliance across North America.
          </p>
        </div>
        <div>
          <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Features</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/project-wizard" className="hover:text-white transition-colors">Intake Assessment Wizard</Link></li>
            <li><span className="text-slate-600">AI Code Scanner (Soon)</span></li>
            <li><span className="text-slate-600">CAD Blueprint Audit (Soon)</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Revenue Model</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/settings" className="hover:text-white transition-colors">Monthly Subscription Plan</Link></li>
            <li><Link to="/settings" className="hover:text-white transition-colors">Pay-Per-Project Tier</Link></li>
            <li><Link to="/settings" className="hover:text-white transition-colors">Contractor Accounts</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Target Customers</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="text-slate-350">Residential Homeowners</span></li>
            <li><span className="text-slate-350">General Builders &amp; Contractors</span></li>
            <li><span className="text-slate-350">Property Managers</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} PermitPilot Technologies Inc. All rights reserved.
      </div>
    </footer>
  );
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project-wizard" element={<ProjectWizard />} />
          <Route path="/project-detail/:id" element={<ProjectDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
