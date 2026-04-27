
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DetectionConsole from './components/DetectionConsole';
import IncidentTable from './components/IncidentTable';
import AnalyticsView from './components/AnalyticsView';
import LandingPage from './components/LandingPage';
import { DetectionIncident, Severity, MediaType, SystemSettings, ClassificationType } from './types';
import { AlertCircle, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'project_aegis_incidents_v2';
const SETTINGS_KEY = 'project_aegis_settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [incidents, setIncidents] = useState<DetectionIncident[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    escalationThreshold: 85,
    inferenceEngine: 'GEMINI_3_FLASH_PROD'
  });
  const [isConfirmingFlush, setIsConfirmingFlush] = useState(false);
  const [showFlushSuccess, setShowFlushSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('project_aegis_theme');
    return saved ? saved === 'dark' : true; // Default to dark
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('project_aegis_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('project_aegis_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const savedIncidents = localStorage.getItem(STORAGE_KEY);
    if (savedIncidents) {
      try {
        setIncidents(JSON.parse(savedIncidents));
      } catch (e) {
        console.error("Failed to parse saved incidents");
      }
    }

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse saved settings");
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  };

  const handleNewIncident = (incident: DetectionIncident) => {
    // Apply escalation threshold logic
    if (incident.confidenceScore >= settings.escalationThreshold && incident.classification !== ClassificationType.GENUINE) {
      incident.severity = Severity.CRITICAL;
    }

    setIncidents(prev => {
      const updated = [incident, ...prev];
      
      // Pruning mechanism: Limit to 50 incidents for history
      const pruned = updated.slice(0, 50);
      
      // Strip large filePreview data before saving to localStorage to prevent quota issues
      const storageData = pruned.map(({ filePreview, ...rest }) => rest);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
      } catch (e) {
        console.warn("LocalStorage quota exceeded, attempting to prune further...");
        try {
          // If it still fails, store only the most recent 10 without previews
          const minimal = storageData.slice(0, 10);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal));
        } catch (innerE) {
          console.error("Failed to save to localStorage even after pruning", innerE);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      
      return pruned;
    });
  };

  const handleFlushCache = () => {
    setIncidents([]);
    localStorage.removeItem(STORAGE_KEY);
    setIsConfirmingFlush(false);
    setShowFlushSuccess(true);
    setTimeout(() => setShowFlushSuccess(false), 3000);
  };

  if (view === 'landing') {
    return <LandingPage onEnterApp={() => setView('app')} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard incidents={incidents} />;
      case 'detect':
        return <DetectionConsole onIncidentDetected={handleNewIncident} settings={settings} />;
      case 'incidents':
        return <IncidentTable incidents={incidents} />;
      case 'analytics':
        return <AnalyticsView incidents={incidents} />;
      case 'settings':
        return (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-2xl transition-colors duration-300">
              <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight">System Node Configuration</h3>
              <div className="space-y-8">
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                  <div className="max-w-md">
                    <h4 className="font-bold text-slate-700 dark:text-slate-100 uppercase tracking-widest text-[10px] mb-2">Escalation Threshold</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">Incidents exceeding this probability will trigger high-priority alerts.</p>
                  </div>
                  <div className="flex items-center gap-6">
                     <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{settings.escalationThreshold}%</span>
                     <input 
                        type="range" 
                        className="accent-blue-500 w-32" 
                        min="50" 
                        max="100" 
                        value={settings.escalationThreshold} 
                        onChange={(e) => updateSettings({ escalationThreshold: parseInt(e.target.value) })}
                      />
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                  <div className="max-w-md">
                    <h4 className="font-bold text-slate-700 dark:text-slate-100 uppercase tracking-widest text-[10px] mb-2">Inference Engine</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">Selecting the Gemini core for optimal latency vs accuracy.</p>
                  </div>
                  <select 
                    value={settings.inferenceEngine}
                    onChange={(e) => updateSettings({ inferenceEngine: e.target.value })}
                    className="bg-white dark:bg-slate-900 border-none rounded-xl text-xs font-bold px-4 py-2 text-slate-700 dark:text-slate-200 outline-none ring-1 ring-slate-200 dark:ring-slate-700 transition-colors duration-300"
                  >
                    <option value="GEMINI_3_FLASH_PROD">GEMINI_3_FLASH_PROD</option>
                    <option value="GEMINI_2.5_FLASH_LITE">GEMINI_2.5_FLASH_LITE</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-10 flex flex-col items-start shadow-inner relative overflow-hidden transition-colors duration-300">
              <div className="flex items-center gap-4 text-red-500 mb-6 relative z-10">
                <AlertCircle className="w-6 h-6" />
                <h4 className="font-bold uppercase tracking-widest text-sm">Destructive Actions</h4>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 max-w-lg leading-relaxed relative z-10 font-bold">
                Purging the forensic audit trail is irreversible. All incident metadata and historical telemetry will be erased from local storage.
              </p>
              
              <div className="flex items-center gap-4 relative z-10">
                {!isConfirmingFlush ? (
                  <button 
                    onClick={() => setIsConfirmingFlush(true)}
                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 px-10 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest shadow-xl shadow-red-900/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Flush System Cache
                  </button>
                ) : (
                  <div className="flex items-center gap-3 animate-in zoom-in duration-300">
                    <button 
                      onClick={handleFlushCache}
                      className="bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest shadow-xl shadow-red-900/40 hover:bg-red-500"
                    >
                      Confirm Permanent Wipe
                    </button>
                    <button 
                      onClick={() => setIsConfirmingFlush(false)}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {showFlushSuccess && (
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300 z-20 transition-colors duration-300">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-black uppercase tracking-tighter italic text-lg">Cache Purged</p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest">All forensic data has been erased.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
    >
      <button 
        onClick={() => setView('landing')} 
        className="fixed bottom-8 right-8 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all z-50 shadow-2xl flex items-center gap-2"
      >
        <RotateCcw className="w-3 h-3" />
        Return to Portal
      </button>
      {renderContent()}
    </Layout>
  );
};

export default App;
