
import React, { useState, useRef } from 'react';
import { Upload, ShieldCheck, AlertCircle, Loader2, Play, Info, Eye, Layers, Activity, FileText, Cpu, UserCheck, Search, Database, Fingerprint, Link2Off, Sparkles, Scale, CheckCircle2 } from 'lucide-react';
import { MediaType, DetectionIncident, Severity, MediaPart, ClassificationType, SystemSettings } from '../types';
import { geminiService } from '../services/geminiService';
import { MAX_FILE_SIZE_MB, VIDEO_FRAME_COUNT } from '../constants';

interface DetectionConsoleProps {
  onIncidentDetected: (incident: DetectionIncident) => void;
  settings: SystemSettings;
}

const DetectionConsole: React.FC<DetectionConsoleProps> = ({ onIncidentDetected, settings }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionIncident | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 200 * 1024 * 1024) {
        setError("File exceeds 200MB system limit.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const extractFrames = async (videoFile: File): Promise<MediaPart[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = async () => {
        const duration = video.duration;
        const frames: MediaPart[] = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        for (let i = 0; i < VIDEO_FRAME_COUNT; i++) {
          const time = (duration / VIDEO_FRAME_COUNT) * i;
          video.currentTime = time;
          await new Promise(r => video.onseeked = r);
          
          canvas.width = video.videoWidth > 768 ? 768 : video.videoWidth;
          canvas.height = (canvas.width / video.videoWidth) * video.videoHeight;
          
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
            frames.push({ data: base64, mimeType: 'image/jpeg' });
          }
        }
        URL.revokeObjectURL(video.src);
        resolve(frames);
      };
      video.onerror = () => reject("Failed to process media frames.");
    });
  };

  const runAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const isVideo = file.type.startsWith('video/');
      const mediaType = isVideo ? MediaType.VIDEO : file.type.startsWith('audio/') ? MediaType.AUDIO : MediaType.IMAGE;
      
      let parts: MediaPart[] = [];

      if (isVideo) {
        parts = await extractFrames(file);
      } else {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        }

        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = () => reject("Failed to read file.");
          reader.readAsDataURL(file);
        });
        const base64 = await base64Promise;
        parts = [{ data: base64, mimeType: file.type }];
      }

      // Map UI engine names to actual model names
      const modelMap: Record<string, string> = {
        'GEMINI_3_FLASH_PROD': 'gemini-3-flash-preview',
        'GEMINI_2.5_FLASH_LITE': 'gemini-3.1-flash-lite-preview'
      };

      const model = modelMap[settings.inferenceEngine] || 'gemini-3-flash-preview';
      const detection = await geminiService.analyzeMedia(file.name, mediaType, parts, model);
      
      setResult(detection);
      onIncidentDetected(detection);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'The verification could not be completed at this time.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (classification: ClassificationType) => {
    if (classification === ClassificationType.GENUINE) return 'emerald';
    if (classification === ClassificationType.DEEPFAKE) return 'orange';
    if (classification === ClassificationType.AI_GENERATED) return 'red';
    if (classification === ClassificationType.HYBRID) return 'purple';
    return 'blue'; 
  };

  const color = result ? getStatusColor(result.classification) : 'slate';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div 
          onClick={() => !isAnalyzing && fileInputRef.current?.click()}
          className={`group relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer overflow-hidden ${
            isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            file ? 'border-blue-500 bg-blue-500/5' : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,video/*,audio/*" disabled={isAnalyzing} />
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${file ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
              <Upload className="w-8 h-8" />
            </div>
            {file ? (
              <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-white text-lg">{file.name}</p>
                <p className="text-[10px] text-blue-600 dark:text-blue-500 font-black uppercase tracking-widest">Media Loaded</p>
              </div>
            ) : (
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg uppercase tracking-tight italic">Select Media for Analysis</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-black uppercase tracking-widest">Upload a file to check for manipulation</p>
              </div>
            )}
          </div>
        </div>

        {file && !isAnalyzing && !result && (
          <button 
            onClick={runAnalysis}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic"
          >
            <ShieldCheck className="w-6 h-6" />
            Analyze Authenticity
          </button>
        )}

        {isAnalyzing && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl text-center space-y-6 shadow-2xl transition-colors duration-300">
            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Scanning Media Channels</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono animate-pulse uppercase tracking-widest font-bold">DETECTING_DIGITAL_SIGNS</p>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite] w-1/3"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex gap-3 text-red-400 animate-in fade-in zoom-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {result && (
           <div className="space-y-4 animate-in slide-in-from-left-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center transition-colors duration-300">
                    <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Physical Signal Match</p>
                    <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{Math.round(result.provenance.physical_capture_likelihood * 100)}%</p>
                 </div>
                 <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center transition-colors duration-300">
                    <p className="text-[8px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Authenticity Score</p>
                    <p className={`text-sm font-mono font-bold ${result.provenance.semantic_authenticity > 0.8 ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-600 dark:text-purple-400'}`}>
                      {result.provenance.semantic_authenticity > 0.8 ? 'Natural' : 'Patterned'}
                    </p>
                 </div>
              </div>
              <div className={`p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-center transition-colors duration-300 ${result.classification === ClassificationType.GENUINE ? 'border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : result.classification === ClassificationType.HYBRID ? 'border-purple-500/30 bg-purple-500/5' : ''}`}>
                 <div>
                   <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Final Classification</p>
                   <p className={`text-sm font-black uppercase italic ${result.classification === ClassificationType.GENUINE ? 'text-emerald-600 dark:text-emerald-400 underline decoration-2 underline-offset-4' : result.classification === ClassificationType.HYBRID ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
                      {result.classification === ClassificationType.HYBRID ? 'AI-ASSISTED CONTENT' : result.classification.replace('_', ' ')}
                   </p>
                 </div>
                 <div className={`p-3 rounded-xl ${result.classification === ClassificationType.GENUINE ? 'bg-emerald-500 text-white shadow-lg' : result.classification === ClassificationType.HYBRID ? 'bg-purple-500/10 text-purple-600 dark:text-purple-500' : 'bg-red-500/10 text-red-600 dark:text-red-500'}`}>
                    {result.classification === ClassificationType.GENUINE ? <CheckCircle2 className="w-6 h-6" /> : result.classification === ClassificationType.HYBRID ? <Sparkles className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                 </div>
              </div>
           </div>
        )}
      </div>

      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col min-h-[600px] shadow-2xl relative transition-colors duration-300`}>
        {result ? (
          <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-500">
            <div className={`p-8 border-b border-slate-200 dark:border-slate-800 ${color === 'emerald' ? 'bg-emerald-500/5' : color === 'purple' ? 'bg-purple-500/5' : color === 'orange' ? 'bg-orange-500/5' : 'bg-red-500/5'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl shadow-xl ${color === 'emerald' ? 'bg-emerald-500' : color === 'purple' ? 'bg-purple-500' : color === 'orange' ? 'bg-orange-500' : 'bg-red-500'}`}>
                    {result.classification === 'hybrid' ? <Sparkles className="w-7 h-7 text-white" /> : 
                     result.classification === 'ai_generated' ? <Cpu className="w-7 h-7 text-white" /> : 
                     <UserCheck className="w-7 h-7 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-black text-2xl uppercase tracking-tighter italic text-slate-900 dark:text-white">
                      {result.classification === ClassificationType.GENUINE ? 'Authentic Media' : 
                       result.classification === ClassificationType.HYBRID ? 'AI-Modified Media' : 
                       result.classification === ClassificationType.AI_GENERATED ? 'AI-Generated Content' :
                       result.classification === ClassificationType.DEEPFAKE ? 'Deepfake Detected' :
                       'Synthetic Content'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">ANALYSIS_CONFIDENCE: {result.confidenceScore}%</p>
                      {result.classification === ClassificationType.AI_GENERATED && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded animate-pulse">
                          Synthetic Alert
                        </span>
                      )}
                      {result.classification === ClassificationType.DEEPFAKE && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest rounded animate-pulse">
                          Identity Alert
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-10 flex-1 overflow-y-auto custom-scrollbar">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-200 dark:border-slate-800 shadow-inner group">
                {result.filePreview && <img src={result.filePreview} className="w-full h-full object-contain" alt="Preview" />}
                <div className="absolute inset-0 bg-blue-500/10 pointer-events-none animate-scan-line"></div>
                <div className="absolute bottom-4 left-4 p-2 bg-slate-950/80 backdrop-blur rounded border border-slate-800 text-[10px] font-mono text-blue-400 font-bold tracking-widest uppercase">
                  NODE_LOG: {result.id}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">Verification Findings</h4>
                  <p className={`text-base leading-relaxed font-medium ${result.classification === 'hybrid' ? 'text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-300'}`}>
                    {result.forensics.explanation}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.forensics.signals.map((sig, idx) => (
                    <div key={idx} className={`p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors ${sig.engine === 'semantic' ? 'ring-1 ring-purple-500/40 bg-purple-500/5' : ''}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 truncate uppercase tracking-widest">{sig.name}</span>
                          <span className={`text-[8px] font-mono uppercase font-bold ${sig.engine === 'semantic' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`}>{sig.engine} Check</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${sig.detected ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-200">{Math.round(sig.score * 100)}%</span>
                        <div className="w-2/3 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${sig.detected ? 'bg-purple-500' : 'bg-emerald-500'}`} style={{ width: `${sig.score * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="bg-blue-600/5 border border-blue-600/20 p-6 rounded-3xl space-y-3">
                    <h5 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <Info className="w-3 h-3" /> Authenticity Guidance
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      "Project Aegis evaluates content based on known digital generation patterns. A high authenticity score indicates the presence of natural, non-algorithmic textures and biological responses."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-60">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-8 border border-slate-200 dark:border-slate-700/50">
              <Activity className="w-10 h-10 text-slate-400 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter italic">Analysis Terminal</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs font-bold uppercase tracking-widest leading-loose">Awaiting media input. Start the process by uploading a file to check for manipulation signs.</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes scan-line {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          position: absolute;
          width: 100%;
          height: 3px;
          background: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          animation: scan-line 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DetectionConsole;
