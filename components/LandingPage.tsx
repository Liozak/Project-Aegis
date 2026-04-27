
import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Zap, Cpu, Search, Activity, ChevronRight, 
  Globe, Database, FileCheck, Layers, Eye, Mic, Video, 
  Server, HardDrive, BarChart3, Binary, ArrowLeft, Info, CheckCircle, Sparkles
} from 'lucide-react';
import { APP_NAME, APP_VERSION } from '../constants';

type LandingSubView = 'home' | 'features' | 'tech';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [currentView, setCurrentView] = useState<LandingSubView>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-blue-600/5 blur-[160px] rounded-full -z-10"></div>
        <div className="max-w-6xl mx-auto text-center space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" />
            Next-Gen Media Forensics
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] uppercase">
            SECURE THE TRUTH IN A <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 italic">SYNTHETIC WORLD</span>.
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            As AI manipulation becomes more sophisticated, professional tools are required to identify synthetic content. Project Aegis provides frame-by-frame analysis to detect deepfakes and generative artifacts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <button 
              onClick={onEnterApp}
              className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-12 py-6 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 group uppercase tracking-tighter"
            >
              Launch Terminal
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setCurrentView('features')}
              className="w-full sm:w-auto px-12 py-6 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase text-xs tracking-[0.2em] shadow-sm"
            >
              View Methodology
            </button>
          </div>
        </div>
      </section>

      {/* Trusted By / Social Proof */}
      <section className="py-20 border-y border-slate-100 dark:border-slate-900/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600 mb-12">Trusted by Global Security Teams</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter italic"><Globe className="w-6 h-6" /> GLOBAL_SEC</div>
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter italic"><Database className="w-6 h-6" /> DATA_CORE</div>
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter italic"><Shield className="w-6 h-6" /> AEGIS_NET</div>
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter italic"><Lock className="w-6 h-6" /> CRYPTO_LOG</div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <FeatureCard 
                icon={<Shield className="w-10 h-10 text-blue-600" />}
                title="Identity Verification"
                desc="Detecting digital substitutions and face-swapping in video content using advanced biometric consistency checks."
                onClick={() => setCurrentView('features')}
                className="h-full"
              />
            </div>
            <div className="md:col-span-4">
              <div className="bg-blue-600 rounded-3xl p-10 text-white h-full flex flex-col justify-between shadow-2xl shadow-blue-600/20">
                <Zap className="w-10 h-10 mb-6" />
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Real-time Inference</h3>
                  <p className="text-blue-100 text-sm leading-relaxed font-medium">Powered by Gemini's multimodal engine for sub-second analysis across all media types.</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-4">
              <FeatureCard 
                icon={<Mic className="w-8 h-8 text-purple-500" />}
                title="Audio Forensics"
                desc="Identifying neural voice clones and synthetic speech patterns."
                onClick={() => setCurrentView('features')}
              />
            </div>
            <div className="md:col-span-8">
              <FeatureCard 
                icon={<Cpu className="w-10 h-10 text-emerald-500" />}
                title="Generative Artifact Detection"
                desc="Pinpointing the digital fingerprints left behind by generative AI models like Sora, Runway, and Midjourney."
                onClick={() => setCurrentView('features')}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderFeatures = () => (
    <section className="pt-40 pb-32 px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-right-10 duration-700">
      <div className="mb-20 space-y-4 text-center">
        <button onClick={() => setCurrentView('home')} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-500 font-bold text-xs uppercase tracking-widest mb-4 hover:gap-3 transition-all">
          <ArrowLeft className="w-3 h-3" /> Back Home
        </button>
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Detection Methodology</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">We use a multi-layered approach to evaluate the authenticity of digital media.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl space-y-6 shadow-xl transition-colors duration-300">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg"><Shield className="w-6 h-6" /></div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">Biological Analysis</h3>
            <p className="text-slate-500 dark:text-slate-400">Our models are trained to recognize the natural variability of human anatomy and physics.</p>
            <div className="space-y-3">
               <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-mono"><CheckCircle className="w-3 h-3" /> Eye movement and blink cadence</div>
               <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-mono"><CheckCircle className="w-3 h-3" /> Lip-to-speech synchronization accuracy</div>
               <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-mono"><CheckCircle className="w-3 h-3" /> Skin texture and lighting interaction</div>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl space-y-6 shadow-xl transition-colors duration-300">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Cpu className="w-6 h-6" /></div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">Signal Processing</h3>
            <p className="text-slate-500 dark:text-slate-400">Searching for the digital remnants of algorithmic processing and pixel synthesis.</p>
            <div className="space-y-3">
               <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-mono"><CheckCircle className="w-3 h-3" /> GAN-specific noise patterns</div>
               <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-mono"><CheckCircle className="w-3 h-3" /> Spatial and temporal consistency checks</div>
               <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-mono"><CheckCircle className="w-3 h-3" /> Frequency domain artifact detection</div>
            </div>
         </div>
      </div>
    </section>
  );

  const renderTech = () => (
    <section className="pt-40 pb-32 px-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-left-10 duration-700">
      <div className="mb-20 space-y-4 text-center">
        <button onClick={() => setCurrentView('home')} className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-500 font-bold text-xs uppercase tracking-widest mb-4 hover:gap-3 transition-all">
          <ArrowLeft className="w-3 h-3" /> Back Home
        </button>
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">The Technology Stack</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Aegis is built on established forensic principles and high-speed analysis engines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 text-center">
        <TechCard title="Analysis Core" value="Gemini Multimodal" icon={<Binary className="w-6 h-6" />} color="text-blue-500" />
        <TechCard title="Data" title2="Back-end" value="Secure Infrastructure" icon={<Database className="w-6 h-6" />} color="text-emerald-500" />
        <TechCard title="Inference" value="Real-time Engine" icon={<Zap className="w-6 h-6" />} color="text-yellow-500" />
        <TechCard title="Type" value="Forensic Media Audit" icon={<Server className="w-6 h-6" />} color="text-purple-500" />
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 shadow-xl transition-colors duration-300">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Supported Modalities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 transition-colors duration-300">
             <Video className="w-6 h-6 text-blue-500" />
             <h4 className="font-bold text-slate-900 dark:text-white">Video Analysis</h4>
             <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">Checking for identity substitution and face-swapping in video content.</p>
          </div>
          <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 transition-colors duration-300">
             <Eye className="w-6 h-6 text-emerald-500" />
             <h4 className="font-bold text-slate-900 dark:text-white">Image Analysis</h4>
             <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">Identifying pixel irregularities and structural anomalies in static photos.</p>
          </div>
          <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 transition-colors duration-300">
             <Mic className="w-6 h-6 text-purple-500" />
             <h4 className="font-bold text-slate-900 dark:text-white">Audio Analysis</h4>
             <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">Identifying synthetic or cloned speech patterns through frequency checks.</p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-blue-500/30 transition-colors duration-300">
      <nav className="fixed w-full z-50 px-8 py-6 flex items-center justify-between backdrop-blur-md bg-white/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-900 transition-colors duration-300">
        <div onClick={() => setCurrentView('home')} className="flex items-center gap-3 cursor-pointer group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight uppercase italic text-slate-900 dark:text-white">{APP_NAME}</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          <button onClick={() => setCurrentView('features')} className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${currentView === 'features' ? 'text-blue-600 dark:text-blue-500' : ''}`}>Methodology</button>
          <button onClick={() => setCurrentView('tech')} className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${currentView === 'tech' ? 'text-blue-600 dark:text-blue-500' : ''}`}>Tech Stack</button>
        </div>
        <button onClick={onEnterApp} className="bg-blue-600 dark:bg-white text-white dark:text-slate-950 px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Enter Platform</button>
      </nav>

      <main>
        {currentView === 'home' && renderHome()}
        {currentView === 'features' && renderFeatures()}
        {currentView === 'tech' && renderTech()}
      </main>

      <footer className="py-20 border-t border-slate-100 dark:border-slate-900 px-8 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              <span className="font-black text-xl uppercase italic text-slate-900 dark:text-white">{APP_NAME}</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs leading-relaxed">A specialized verification tool designed to help identify potential AI-generated media content.</p>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
            <div className="flex flex-col gap-4">
              <button onClick={() => setCurrentView('features')} className="hover:text-blue-600 dark:hover:text-blue-400 text-left">Methodology</button>
              <button onClick={() => setCurrentView('tech')} className="hover:text-blue-600 dark:hover:text-blue-400 text-left">Technology</button>
            </div>
            <div className="flex flex-col gap-4">
              <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">Powered by Gemini</a>
              <span className="opacity-40">Privacy Protected</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <p className="text-slate-300 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">STABLE_RELEASE: {APP_VERSION}</p>
            <p className="text-slate-400 dark:text-slate-700 text-[9px] font-mono">© 2024 PROJECT AEGIS // MEDIA AUTHENTICITY TOOLS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ProcessBlock = ({ label, title, desc }: { label: string, title: string, desc: string }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.2em] mb-2">{label}</p>
    <p className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">{title}</p>
    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold max-w-[200px] mx-auto leading-relaxed">{desc}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc, onClick, className = "" }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, className?: string }) => (
  <div onClick={onClick} className={`p-10 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-blue-500/30 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60 group cursor-pointer shadow-xl ${className}`}>
    <div className="mb-6 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase italic">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">{desc}</p>
    <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
      Methodology <ChevronRight className="w-3 h-3" />
    </span>
  </div>
);

const TechCard = ({ title, title2, value, icon, color }: { title: string, title2?: string, value: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl space-y-4 shadow-xl transition-colors duration-300">
    <div className={`flex justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest mb-1">{title} {title2}</p>
      <p className="text-lg font-black text-slate-900 dark:text-white italic tracking-tight">{value}</p>
    </div>
  </div>
);

export default LandingPage;
