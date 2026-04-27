
import React from 'react';
import { DetectionIncident, Severity, MediaType, ClassificationType } from '../types';
import { ExternalLink, Filter, Search, Download } from 'lucide-react';

interface IncidentTableProps {
  incidents: DetectionIncident[];
}

const IncidentTable: React.FC<IncidentTableProps> = ({ incidents }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by ID or file name..." 
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-200 outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"><Filter className="w-4 h-4" /></button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-200 transition-colors uppercase tracking-widest text-[10px]">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-wider">
            <tr>
              <th className="px-6 py-4">Incident ID</th>
              <th className="px-6 py-4">Media Source</th>
              <th className="px-6 py-4">Integrity Status</th>
              <th className="px-6 py-4">Confidence</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {incidents.length > 0 ? (
              incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-blue-600 dark:text-blue-400 font-bold">{incident.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-200">{incident.fileName}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black">{incident.mediaType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        incident.classification === ClassificationType.GENUINE ? 'bg-emerald-500' : 
                        incident.classification === ClassificationType.HYBRID ? 'bg-purple-500' : 
                        incident.classification === ClassificationType.DEEPFAKE ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-xs font-black uppercase tracking-tighter italic ${
                        incident.classification === ClassificationType.GENUINE ? 'text-emerald-600 dark:text-emerald-400' : 
                        incident.classification === ClassificationType.HYBRID ? 'text-purple-600 dark:text-purple-400' : 
                        incident.classification === ClassificationType.DEEPFAKE ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {incident.classification === ClassificationType.GENUINE ? 'SECURE' : 
                         incident.classification === ClassificationType.HYBRID ? 'AI-ASSISTED' : 
                         incident.classification === ClassificationType.AI_GENERATED ? 'SYNTHETIC' : 
                         incident.classification === ClassificationType.DEEPFAKE ? 'DEEPFAKE' : 'COMPROMISED'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${incident.confidenceScore > 75 ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} 
                          style={{ width: `${incident.confidenceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500 font-bold">{incident.confidenceScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      incident.severity === Severity.CRITICAL || incident.severity === Severity.HIGH 
                      ? 'bg-red-500/10 text-red-600 dark:text-red-500' 
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono font-bold">
                      {new Date(incident.timestamp).toLocaleDateString()}
                      <br />
                      {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 dark:text-slate-500 transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">
                  No incidents logged. Perform a detection to generate data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentTable;
