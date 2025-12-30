import React from 'react';
import { BrainCircuit, Palette } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-blueprint-line/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="bg-blue-600 p-2 rounded-full text-white shadow-lg z-10">
              <BrainCircuit size={24} />
            </div>
            <div className="bg-pink-500 p-2 rounded-full text-white shadow-lg">
              <Palette size={24} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-blueprint-900 tracking-tight">Design Divergence</h1>
            <p className="text-xs text-blueprint-line font-mono uppercase tracking-widest">Smart vs. Entertainment</p>
          </div>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-blueprint-line">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            Smart Design
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            Entertainment Design
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;