
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Shield, AlertTriangle, FileText, CheckCircle2, TrendingUp, Clock, Cpu, Sparkles } from 'lucide-react';
import { DetectionIncident, Severity, ClassificationType } from '../types';

interface DashboardProps {
  incidents: DetectionIncident[];
}

const Dashboard: React.FC<DashboardProps> = ({ incidents }) => {
  const stats = {
    total: incidents.length,
    threats: incidents.filter(i => i.classification !== 'genuine').length,
    hybrid: incidents.filter(i => i.classification === 'hybrid').length,
    avgConfidence: incidents.length > 0 
      ? Math.round(incidents.reduce((acc, curr) => acc + curr.confidenceScore, 0) / incidents.length) 
      : 0,
    avgProcessingTime: incidents.length > 0
      ? Math.round(incidents.reduce((acc, curr) => acc + curr.processingTimeMs, 0) / incidents.length)
      : 0
  };

  const activityData = incidents.slice(-10).reverse().map((i, idx) => ({
    name: idx + 1,
    latency: i.processingTimeMs,
    confidence: i.confidenceScore
  }));

  const pieData = [
    { name: 'Genuine', value: incidents.filter(i => i.classification === ClassificationType.GENUINE).length, color: '#10b981' },
    { name: 'Deepfake', value: incidents.filter(i => i.classification === ClassificationType.DEEPFAKE).length, color: '#ef4444' },
    { name: 'AI-Generated', value: incidents.filter(i => i.classification === ClassificationType.AI_GENERATED).length, color: '#3b82f6' },
    { name: 'Hybrid', value: incidents.filter(i => i.classification === ClassificationType.HYBRID).length, color: '#a855f7' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Audits" value={stats.total} icon={<FileText className="text-slate-400" />} />
        <StatCard title="Active Threats" value={stats.threats} icon={<AlertTriangle className="text-red-500" />} />
        <StatCard title="Hybrid Media" value={stats.hybrid} icon={<Sparkles className="text-purple-500" />} />
        <StatCard title="Avg Latency" value={`${stats.avgProcessingTime}ms`} icon={<Clock className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-2xl transition-colors duration-300">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Detection Performance
          </h3>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--chart-text)" fontSize={10} hide />
                <YAxis stroke="var(--chart-text)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--tooltip-text)' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#10b981" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-2xl transition-colors duration-300">
          <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Integrity Distribution</h3>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--tooltip-text)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xl group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">{icon}</div>
    </div>
    <h4 className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">{title}</h4>
    <p className="text-3xl font-black mt-1 text-slate-900 dark:text-white tracking-tighter">{value}</p>
  </div>
);

export default Dashboard;
