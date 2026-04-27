
import React from 'react';
import { Terminal, Cpu, Activity, Zap, ShieldAlert, BarChart } from 'lucide-react';
import { DetectionIncident, ClassificationType } from '../types';

interface AnalyticsProps {
  incidents: DetectionIncident[];
}

const AnalyticsView: React.FC<AnalyticsProps> = ({ incidents }) => {
  const recentLogs = incidents.slice(0, 10).map(i => ({
    timestamp: new Date(i.timestamp).toLocaleTimeString(),
    message: `${i.classification.toUpperCase()} DETECTED :: ${i.fileName} :: ${i.processingTimeMs}ms`,
    type: (i.classification === ClassificationType.DEEPFAKE || i.classification === ClassificationType.AI_GENERATED) ? 'error' : 'success'
  }));

  const avgLatency = incidents.length > 0 
    ? Math.round(incidents.reduce((a, b) => a + b.processingTimeMs, 0) / incidents.length) 
    : 0;

  // Replaced fake reliability number with a dynamic operational status
  const systemStatus = incidents.length > 0 ? "Operational" : "Standby";

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl transition-colors duration-300">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Live Incident Stream</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-emerald-500 font-bold uppercase">Socket Active</span>
            </div>
          </div>
          <div className="flex-1 p-6 font-mono text-[11px] space-y-3 overflow-y-auto bg-slate-50/50 dark:bg-black/40">
            {recentLogs.length > 0 ? recentLogs.map((log, i) => (
              <div key={i} className="flex gap-4 border-b border-slate-200 dark:border-slate-800/50 pb-2">
                <span className="text-slate-400 dark:text-slate-600">[{log.timestamp}]</span>
                <span className={log.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}>
                  {log.message}
                </span>
              </div>
            )) : (
              <div className="text-slate-400 dark:text-slate-600 italic">Awaiting primary data ingestion...</div>
            )}
            <div className="flex gap-4 animate-pulse pt-2">
              <span className="text-slate-300 dark:text-slate-700">_</span>
              <span className="text-blue-600 dark:text-blue-500">LISTENING_FOR_MEDIA_NODE...</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl transition-colors duration-300">
            <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 mb-8 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-blue-500" />
              Real-Time Metrics
            </h3>
            <div className="space-y-8">
              <MetricRow label="Avg Inference Time" value={incidents.length > 0 ? `${avgLatency}ms` : '---'} color="bg-blue-500" />
              <MetricRow label="System Status" value={systemStatus} color="bg-emerald-500" />
              <MetricRow label="Active Sessions" value={incidents.length > 0 ? '1' : '0'} color="bg-purple-500" />
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/40">
            <div className="relative z-10">
              <ShieldAlert className="w-10 h-10 mb-6" />
              <h4 className="text-xl font-bold mb-2">Platform Integrity</h4>
              <p className="text-blue-100 text-xs leading-relaxed opacity-80">
                Project Aegis utilizes Google Gemini's vision-language models for analysis. Current state: <strong>READY</strong>.
              </p>
            </div>
            <Activity className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricRow = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-2">
    <div>
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{value}</p>
    </div>
    <div className={`w-8 h-1 rounded-full ${color}`}></div>
  </div>
);

export default AnalyticsView;
