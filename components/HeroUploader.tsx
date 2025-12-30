import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface HeroUploaderProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

const HeroUploader: React.FC<HeroUploaderProps> = ({ onImageSelected, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-[#fdfbf7]">
      <div className="max-w-3xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-extrabold text-blueprint-900 tracking-tight">
            Decode the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">Blueprint</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload an exploded view diagram. We use AI to break it down into 
            <span className="font-semibold text-blue-600 mx-1">Intelligent Design</span> 
            (Engineering) and 
            <span className="font-semibold text-pink-600 mx-1">Entertainment Design</span> 
            (User Experience) components.
          </p>
        </div>

        <div 
          className={`
            relative group cursor-pointer
            border-2 border-dashed rounded-3xl p-10 md:p-16 transition-all duration-300
            flex flex-col items-center justify-center gap-4
            ${dragActive ? 'border-blue-500 bg-blue-50/50 scale-102' : 'border-slate-300 hover:border-blueprint-500 hover:bg-white'}
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleChange}
          />
          
          <div className="bg-white p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-blueprint-500" />
            )}
          </div>
          
          <div className="space-y-2">
            <p className="font-semibold text-slate-700 text-lg">
              {isLoading ? 'Analyzing Blueprint...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-slate-500">Supported formats: PNG, JPG, WEBP</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-4">
           <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Powered by Gemini 2.5</p>
        </div>

      </div>
    </div>
  );
};

export default HeroUploader;
