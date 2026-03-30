import React from 'react';
import { Mail, Calendar, Youtube, ExternalLink } from 'lucide-react';

interface QuickLinkProps {
  icon: React.ReactNode;
  label: string;
  url: string;
  color: string;
}

const QuickLink: React.FC<QuickLinkProps> = ({ icon, label, url, color }) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-2 group transition-all"
  >
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-black/5 group-hover:scale-110 group-active:scale-95 transition-all duration-200`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
      {label}
    </span>
  </a>
);

export const QuickAccess: React.FC = () => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">
          Quick Access / 0-Click
        </h3>
        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-900 ml-4"></div>
      </div>
      
      <div className="flex justify-between px-2">
        <QuickLink 
          icon={<Mail size={20} />} 
          label="Gmail" 
          url="https://mail.google.com" 
          color="bg-gradient-to-br from-red-500 to-rose-600"
        />
        <QuickLink 
          icon={<Calendar size={20} />} 
          label="Calendar" 
          url="https://calendar.google.com" 
          color="bg-gradient-to-br from-blue-500 to-indigo-600"
        />
        <QuickLink 
          icon={<Youtube size={20} />} 
          label="YouTube" 
          url="https://youtube.com" 
          color="bg-gradient-to-br from-red-600 to-red-800"
        />
        <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 hover:border-slate-400 transition-colors cursor-pointer">
          <ExternalLink size={18} />
        </div>
      </div>
    </section>
  );
};
