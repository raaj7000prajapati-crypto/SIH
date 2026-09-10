import { Link } from 'react-router-dom';
import { FileText, ShieldAlert, CheckCircle, Clock, ArrowRight, Activity, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle: string;
  delay?: number;
}

const StatCard = ({ title, value, icon: Icon, subtitle, delay = 0 }: StatCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-[#0A0A0A] p-5 rounded-xl border border-neutral-900 flex flex-col"
  >
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-2xl font-semibold text-neutral-100 tracking-tight">{value}</h3>
      <div className="p-2 rounded-md bg-neutral-900 border border-neutral-800">
        <Icon className="w-4 h-4 text-neutral-400" />
      </div>
    </div>
    <div>
      <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">{title}</p>
      <div className="text-[10px] text-neutral-600 mt-1 uppercase tracking-widest">{subtitle}</div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mb-1">Command Center</h1>
          <p className="text-neutral-500 text-sm">System overview and recent activity</p>
        </div>
        <Link 
          to="/screening" 
          className="bg-white text-black hover:bg-neutral-200 px-5 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>New Screening</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Documents Screened" 
          value="1,284" 
          icon={FileText} 
          subtitle="Past 30 days"
          delay={0.1}
        />
        <StatCard 
          title="Low Risk" 
          value="1,102" 
          icon={CheckCircle} 
          subtitle="85.8% of total"
          delay={0.2}
        />
        <StatCard 
          title="Review Required" 
          value="124" 
          icon={Clock} 
          subtitle="9.6% of total"
          delay={0.3}
        />
        <StatCard 
          title="High Risk" 
          value="58" 
          icon={ShieldAlert} 
          subtitle="4.5% of total"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="lg:col-span-2 bg-[#0A0A0A] rounded-xl border border-neutral-900 overflow-hidden"
        >
          <div className="p-5 border-b border-neutral-900 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200">Recent Screenings</h2>
            <Link to="/history" className="text-neutral-500 text-xs font-medium hover:text-neutral-300 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-900 text-neutral-500 text-xs uppercase tracking-wider bg-neutral-900/20">
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Document</th>
                  <th className="px-5 py-3 font-medium">Date/Time</th>
                  <th className="px-5 py-3 font-medium">Risk Score</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-neutral-900/50 hover:bg-neutral-900/30 transition-colors">
                  <td className="px-5 py-4 font-medium text-neutral-200">#SCR-1025</td>
                  <td className="px-5 py-4 text-neutral-400">Passport</td>
                  <td className="px-5 py-4 text-neutral-500 text-xs">Just now</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-neutral-200">82</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded text-[10px] font-semibold bg-red-950 text-red-500 border border-red-900">HIGH RISK</span>
                  </td>
                </tr>
                <tr className="border-b border-neutral-900/50 hover:bg-neutral-900/30 transition-colors">
                  <td className="px-5 py-4 font-medium text-neutral-200">#SCR-1024</td>
                  <td className="px-5 py-4 text-neutral-400">Passport</td>
                  <td className="px-5 py-4 text-neutral-500 text-xs">12 mins ago</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-neutral-200">18</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded text-[10px] font-semibold bg-green-950 text-green-500 border border-green-900">LOW RISK</span>
                  </td>
                </tr>
                <tr className="hover:bg-neutral-900/30 transition-colors">
                  <td className="px-5 py-4 font-medium text-neutral-200">#SCR-1023</td>
                  <td className="px-5 py-4 text-neutral-400">National ID</td>
                  <td className="px-5 py-4 text-neutral-500 text-xs">45 mins ago</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-neutral-200">45</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded text-[10px] font-semibold bg-yellow-950 text-yellow-500 border border-yellow-900">REVIEW</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-[#0A0A0A] rounded-xl border border-neutral-900 overflow-hidden"
        >
          <div className="p-5 border-b border-neutral-900">
            <h2 className="text-sm font-semibold text-neutral-200">System Status</h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              { name: 'Core API', status: 'Online' },
              { name: 'AI Models', status: 'Online' },
              { name: 'Database', status: 'Online' },
            ].map((system) => (
              <div key={system.name} className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/20 border border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </div>
                  <span className="text-xs font-medium text-neutral-300">{system.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-green-500 uppercase tracking-wider">
                  {system.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
