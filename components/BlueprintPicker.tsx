import React from 'react';
import { Loader2, Zap, LayoutGrid } from 'lucide-react';

interface BlueprintPickerProps {
  onUrlSelected: (url: string) => void;
  isLoading: boolean;
}

const PRESET_BLUEPRINTS = [
  {
    id: 'b1',
    url: 'https://i.imgur.com/g8ed1lm.jpeg',
    label: 'Vision Pro',
    desc: 'Next-gen spatial computing architecture'
  },
  {
    id: 'b2',
    url: 'https://i.imgur.com/f3JIygm.jpeg',
    label: 'iPhone 17 Pro Max',
    desc: 'Cutting-edge mobile hardware integration'
  },
  {
    id: 'b3',
    url: 'https://i.imgur.com/uBKJ9VB.jpeg',
    label: 'NINTENDO SWITCH 2',
    desc: 'Hybrid gaming console component layout'
  },
  {
    id: 'b4',
    url: 'https://i.imgur.com/BLqN68F.jpeg',
    label: 'PlayStation 5',
    desc: 'Advanced console cooling and processing unit'
  }
];

const BlueprintPicker: React.FC<BlueprintPickerProps> = ({ onUrlSelected, isLoading }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-[#fdfbf7]">
      <div className="max-w-5xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-500">
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blueprint-100 text-blueprint-900 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            <LayoutGrid size={14} /> Interactive Gallery
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-blueprint-900 tracking-tight leading-tight">
            Pick a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 font-mono">Blueprint</span> to Analyze
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select one of the specialized exploded diagrams below. Gemini will break it down to reveal the synergy between <span className="text-blue-600 font-semibold">Smart Design</span> and <span className="text-pink-600 font-semibold">User Experience</span>.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <p className="font-mono text-xl font-bold text-blueprint-900 animate-pulse">Running AI Synthesis...</p>
              <p className="text-sm text-slate-500">Extracting components and identifying design patterns</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRESET_BLUEPRINTS.map((bp) => (
              <button
                key={bp.id}
                onClick={() => onUrlSelected(bp.url)}
                className="group relative flex flex-col text-left bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={bp.url} 
                    alt={bp.label} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white text-sm font-medium flex items-center gap-2">
                      <Zap size={16} className="text-yellow-400" /> Start Deep Analysis
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blueprint-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {bp.label}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {bp.desc}
                  </p>
                </div>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap size={18} className="text-blue-600" />
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest pt-8">
          Powered by Gemini 3 Flash • Context-Aware Image Perception
        </p>
      </div>
    </div>
  );
};

export default BlueprintPicker;