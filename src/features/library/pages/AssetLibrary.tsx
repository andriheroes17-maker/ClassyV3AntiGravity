import React, { useState } from 'react';
import { Search, Folder, FileImage, FileText, FileBadge, Download, Filter, Home, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const DB_ASSETS = [
  { id: 1, name: 'Q3_Pitch_Deck_Final.pdf', type: 'doc', size: '4.2 MB', updated: '2 hrs ago', icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 2, name: 'Brand_Guidelines_2026.pdf', type: 'doc', size: '12 MB', updated: '1 day ago', icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 3, name: 'Hero_Image_Revision_V2.png', type: 'img', size: '8.4 MB', updated: '3 days ago', icon: FileImage, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 4, name: 'Social_Media_Assets.zip', type: 'archive', size: '45 MB', updated: '1 week ago', icon: FileBadge, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 5, name: 'SOP_Client_Onboarding.pdf', type: 'sop', size: '1.1 MB', updated: '2 weeks ago', icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

const FOLDERS = [
  { id: 'f1', name: 'Design Assets', count: 24, color: 'text-brand-400' },
  { id: 'f2', name: 'Legal & SOP', count: 12, color: 'text-emerald-400' },
  { id: 'f3', name: 'Client Deliverables', count: 89, color: 'text-blue-400' },
];

export const AssetLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = DB_ASSETS.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Asset Library</h1>
          <p className="text-zinc-400 mt-1">Digital Asset Management & Company SOPs.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button className="flex items-center gap-2">
            Upload File
          </Button>
        </div>
      </div>

      {/* Breadcrumb pseudo */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 py-2">
         <Home className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
         <ChevronRight className="w-4 h-4" />
         <span className="text-brand-400 font-medium cursor-pointer">Main Drive</span>
         <ChevronRight className="w-4 h-4" />
      </div>

      <div className="relative w-full sm:w-96 mb-8 mt-2">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
         <Input 
           placeholder="Search files, folders..." 
           className="pl-10 mb-0 bg-surface-hover/50"
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {searchTerm === '' && (
        <section className="mb-10">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest mb-4">Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {FOLDERS.map(f => (
               <div key={f.id} className="glass-panel p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:border-brand-500/30 transition-colors group">
                  <div className={`w-12 h-12 rounded-lg bg-surface flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-surface-hover transition-colors`}>
                     <Folder className={`w-6 h-6 ${f.color} fill-current/20`} />
                  </div>
                  <div className="min-w-0">
                     <h4 className="text-zinc-100 font-semibold text-sm truncate group-hover:text-brand-400 transition-colors">{f.name}</h4>
                     <p className="text-zinc-500 text-xs mt-0.5">{f.count} items</p>
                  </div>
               </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest mb-4">Recent Files</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
           {filtered.map(file => (
               <div key={file.id} className="glass-panel p-4 rounded-xl flex flex-col gap-4 cursor-pointer hover:border-brand-500/30 transition-colors group">
                  <div className={`w-full h-32 rounded-lg ${file.bg} flex items-center justify-center shrink-0 border border-white/5`}>
                     <file.icon className={`w-12 h-12 ${file.color} opacity-80 group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-zinc-100 font-semibold text-sm truncate group-hover:text-brand-400 transition-colors" title={file.name}>{file.name}</h4>
                     <div className="flex items-center justify-between mt-2">
                        <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">{file.updated}</span>
                        <span className="text-zinc-400 text-xs">{file.size}</span>
                     </div>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex gap-2">
                     <Button variant="ghost" className="w-full text-xs h-8">View</Button>
                     <Button variant="ghost" className="w-full text-xs h-8 text-brand-400 hover:text-brand-300">
                        <Download className="w-4 h-4" />
                     </Button>
                  </div>
               </div>
           ))}
           {filtered.length === 0 && (
             <div className="col-span-full py-8 text-center text-zinc-500">
               No files matched your search.
             </div>
           )}
        </div>
      </section>

    </div>
  );
};
