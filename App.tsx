import React, { useState } from 'react';
import Header from './components/Header';
import BlueprintPicker from './components/BlueprintPicker';
import AnalysisView from './components/AnalysisView';
import { analyzeImage } from './services/geminiService';
import { AnalysisResult, ImageState } from './types';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    base64: null,
  });
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSelect = async (url: string) => {
    setError(null);
    setLoading(true);

    try {
      // 1. Fetch image from URL
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch image from external source.");
      const blob = await response.blob();
      
      // 2. Convert to Base64 for the API
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = async () => {
        const fullBase64String = reader.result as string;
        // Strip the data:image/xxx;base64, prefix
        const base64Data = fullBase64String.split(',')[1];

        setImageState({
          file: null, // No manual file uploaded
          previewUrl: url,
          base64: base64Data,
        });

        try {
          // 3. Call Gemini API
          const result = await analyzeImage(base64Data);
          setAnalysisData(result);
        } catch (err) {
          setError("AI Analysis failed. This usually happens if the API key is invalid or rate-limited.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
    } catch (err) {
      setError("Error processing selected blueprint. Make sure you have a stable internet connection.");
      console.error(err);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageState({ file: null, previewUrl: null, base64: null });
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-[#fdfbf7]">
      <Header />
      
      <main>
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-4 text-center animate-in slide-in-from-top duration-300">
             <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
               <p className="text-red-600 font-medium text-sm">{error}</p>
               <button onClick={() => setError(null)} className="text-red-400 text-xs font-bold uppercase hover:text-red-600 transition-colors">Dismiss</button>
             </div>
          </div>
        )}

        {!analysisData ? (
          <BlueprintPicker 
            onUrlSelected={handleUrlSelect} 
            isLoading={loading} 
          />
        ) : (
          <AnalysisView 
            imageSrc={imageState.previewUrl!} 
            data={analysisData}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default App;