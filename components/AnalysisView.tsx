import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AnalysisResult, AnalyzedPart, DesignCategory } from '../types';
import { Brain, Cpu, Armchair, Zap, ChevronRight, X, Scan, Info } from 'lucide-react';

interface AnalysisViewProps {
  imageSrc: string;
  data: AnalysisResult;
  onReset: () => void;
}

const CategoryBadge: React.FC<{ category: DesignCategory }> = ({ category }) => {
  let colorClass = "";
  let icon = null;

  switch (category) {
    case DesignCategory.SMART:
      colorClass = "bg-blue-100 text-blue-700 border-blue-200";
      icon = <Cpu size={14} />;
      break;
    case DesignCategory.ENTERTAINMENT:
      colorClass = "bg-pink-100 text-pink-700 border-pink-200";
      icon = <Armchair size={14} />;
      break;
    case DesignCategory.HYBRID:
      colorClass = "bg-purple-100 text-purple-700 border-purple-200";
      icon = <Zap size={14} />;
      break;
  }

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
      {icon}
      {category}
    </span>
  );
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ imageSrc, data, onReset }) => {
  const [selectedPart, setSelectedPart] = useState<AnalyzedPart | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group parts for the list view
  const smartParts = data.parts.filter(p => p.category === DesignCategory.SMART);
  const entertainmentParts = data.parts.filter(p => p.category === DesignCategory.ENTERTAINMENT);
  const hybridParts = data.parts.filter(p => p.category === DesignCategory.HYBRID);

  // Sort parts by area size for the overlay: Largest first, Smallest last.
  const sortedPartsForOverlay = useMemo(() => {
    return [...data.parts].sort((a, b) => {
      const getArea = (p: AnalyzedPart) => {
        if (!p.boundingBox || p.boundingBox.length !== 4) return 0;
        const [ymin, xmin, ymax, xmax] = p.boundingBox;
        return (ymax - ymin) * (xmax - xmin);
      };
      // Descending order (Big -> Small)
      return getArea(b) - getArea(a);
    });
  }, [data.parts]);

  // Scroll to detail view when a part is selected
  useEffect(() => {
    if (selectedPart && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [selectedPart]);

  const getBoxStyle = (part: AnalyzedPart) => {
    if (!part.boundingBox || part.boundingBox.length !== 4) return {};
    const [ymin, xmin, ymax, xmax] = part.boundingBox;
    
    return {
      top: `${ymin / 10}%`,
      left: `${xmin / 10}%`,
      height: `${(ymax - ymin) / 10}%`,
      width: `${(xmax - xmin) / 10}%`,
    };
  };

  const getBoxClasses = (part: AnalyzedPart, isSelected: boolean) => {
    const base = "absolute transition-all duration-300 cursor-pointer rounded-sm mix-blend-multiply";
    
    if (isSelected) {
      return `${base} border-4 border-yellow-400 bg-yellow-400/20 shadow-[0_0_20px_rgba(250,204,21,0.6)] z-[100] scale-105`;
    }

    let colorBorder = "";
    switch(part.category) {
      case DesignCategory.SMART: colorBorder = "border-blue-500/40 hover:border-blue-500 hover:bg-blue-500/10"; break;
      case DesignCategory.ENTERTAINMENT: colorBorder = "border-pink-500/40 hover:border-pink-500 hover:bg-pink-500/10"; break;
      case DesignCategory.HYBRID: colorBorder = "border-purple-500/40 hover:border-purple-500 hover:bg-purple-500/10"; break;
    }

    return `${base} border-2 ${colorBorder} hover:shadow-lg`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
      {/* Left: Image Viewer */}
      <div className="lg:w-1/2 h-1/2 lg:h-full bg-blueprint-50 p-6 flex flex-col relative overflow-hidden select-none">
        
        <div className="absolute top-4 left-4 right-4 z-[200] flex justify-between items-start pointer-events-none">
           <div className="group bg-white/90 backdrop-blur border border-blueprint-line/20 px-4 py-3 rounded-lg shadow-sm max-w-md pointer-events-auto transition-all duration-500 ease-in-out max-h-[50px] hover:max-h-96 overflow-hidden hover:shadow-md hover:bg-white cursor-help">
             <div className="flex items-center justify-between mb-2 h-6">
                <h3 className="font-bold text-blueprint-900 flex items-center gap-2">
                  <Brain size={18} className="text-blueprint-500"/> 
                  System Overview
                </h3>
                <span className="text-xs text-blueprint-500 font-medium opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex items-center gap-1">
                  <Info size={12} />
                  Hover to read
                </span>
             </div>
             <p className="text-sm text-slate-600 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
               {data.overview}
             </p>
           </div>

           <button 
            onClick={onReset}
            className="pointer-events-auto bg-white hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm border border-slate-200 transition-colors"
           >
             Analyze New Image
           </button>
        </div>

        <div className="flex-1 flex items-center justify-center relative min-h-0">
          <div className="relative shadow-2xl rounded-lg border-4 border-white bg-white max-h-full max-w-full overflow-hidden">
            <img 
              src={imageSrc} 
              alt="Analyzed Diagram" 
              className="max-h-[60vh] lg:max-h-[80vh] object-contain block"
              draggable={false}
            />
            
            <div className="absolute inset-0 w-full h-full">
              {sortedPartsForOverlay.map((part, index) => (
                part.boundingBox && (
                  <div
                    key={part.id}
                    style={{ ...getBoxStyle(part), zIndex: index + 10 }}
                    className={getBoxClasses(part, selectedPart?.id === part.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPart(part);
                    }}
                    title={`${part.name} - ${part.category}`}
                  >
                    {(selectedPart?.id === part.id) && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-md pointer-events-none z-[150]">
                        {part.name}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-blueprint-line/60 text-xs mt-4 font-mono z-10 flex items-center justify-center gap-2">
          <Scan size={14} />
          Click highlighted areas on the diagram or items in the list to explore.
        </p>
      </div>

      {/* Right: Analysis Details */}
      <div className="lg:w-1/2 h-1/2 lg:h-full bg-white border-l border-slate-200 flex flex-col overflow-hidden relative">
        
        {selectedPart ? (
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 bg-white animate-in slide-in-from-right-10 duration-300">
            <button 
              onClick={() => setSelectedPart(null)}
              className="mb-6 flex items-center text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ChevronRight className="rotate-180 mr-1" size={20} />
              Back to List
            </button>

            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                 <CategoryBadge category={selectedPart.category} />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-4 font-mono">{selectedPart.name}</h2>
              
              <div className="prose prose-slate mb-8">
                <p className="text-lg text-slate-600 leading-relaxed">
                  {selectedPart.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blueprint-50 rounded-xl p-6 border border-blueprint-100">
                  <h4 className="text-sm font-bold text-blueprint-900 uppercase tracking-wider mb-3">Why fits this category?</h4>
                  <p className="text-sm text-slate-700">
                    {selectedPart.reasoning}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPart.skills.map((skill, idx) => (
                      <span key={idx} className="bg-white px-3 py-1 rounded-md text-sm font-medium text-slate-600 border border-slate-200 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="max-w-3xl mx-auto space-y-8">
              
              {smartParts.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2 border-b border-blue-100 pb-2">
                    <Cpu size={20} />
                    Smart Design
                    <span className="text-xs font-normal text-slate-400 ml-auto">Logic • Efficiency • Structure</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {smartParts.map(part => (
                      <PartCard key={part.id} part={part} onClick={() => setSelectedPart(part)} />
                    ))}
                  </div>
                </section>
              )}

              {hybridParts.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2 border-b border-purple-100 pb-2">
                    <Zap size={20} />
                    Hybrid Design
                    <span className="text-xs font-normal text-slate-400 ml-auto">Integration • Synergy</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hybridParts.map(part => (
                      <PartCard key={part.id} part={part} onClick={() => setSelectedPart(part)} />
                    ))}
                  </div>
                </section>
              )}

              {entertainmentParts.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-pink-700 mb-4 flex items-center gap-2 border-b border-pink-100 pb-2">
                    <Armchair size={20} />
                    Entertainment Design
                    <span className="text-xs font-normal text-slate-400 ml-auto">Experience • Comfort • Style</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {entertainmentParts.map(part => (
                      <PartCard key={part.id} part={part} onClick={() => setSelectedPart(part)} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PartCard: React.FC<{ part: AnalyzedPart; onClick: () => void }> = ({ part, onClick }) => (
  <button 
    onClick={onClick}
    className="text-left group bg-white hover:bg-slate-50 border border-slate-200 hover:border-blueprint-500 rounded-lg p-4 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
  >
    <div className="flex justify-between items-start mb-2">
      <span className="font-mono font-bold text-slate-800 group-hover:text-blueprint-600 transition-colors">
        {part.name}
      </span>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-blueprint-500" />
    </div>
    <p className="text-xs text-slate-500 line-clamp-2">
      {part.description}
    </p>
    <div className="mt-3 flex flex-wrap gap-1">
       {part.skills.slice(0, 2).map((s, i) => (
         <span key={i} className="text-[10px] uppercase tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
           {s}
         </span>
       ))}
    </div>
  </button>
);

export default AnalysisView;