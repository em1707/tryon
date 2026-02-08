
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import { geminiService } from './services/geminiService';
import { GenerationResult } from './types';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GenerationResult[]>([]);

  const handleGenerate = async () => {
    if (!personImage || !clothingImage) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const generatedUrl = await geminiService.performTryOn(personImage, clothingImage);
      const newResult = {
        imageUrl: generatedUrl,
        timestamp: Date.now()
      };
      setResult(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 5));
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `tryon-result-${result.timestamp}.png`;
    link.click();
  };

  const resetAll = () => {
    setPersonImage(null);
    setClothingImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-tshirt"></i>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TryOn AI
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm font-medium text-slate-500">Virtual Fitting Room</span>
            <button 
              onClick={resetAll}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Areas */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-magic text-indigo-500"></i>
                Fit Session
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px]">
                <ImageUploader 
                  label="1. The Person" 
                  icon="fa-user" 
                  image={personImage} 
                  onImageUpload={(url) => setPersonImage(url)} 
                  onRemove={() => setPersonImage(null)}
                  description="Upload a photo of a real person standing straight."
                />
                <ImageUploader 
                  label="2. The Clothes" 
                  icon="fa-shirt" 
                  image={clothingImage} 
                  onImageUpload={(url) => setClothingImage(url)} 
                  onRemove={() => setClothingImage(null)}
                  description="Upload an image of the garment on a flat surface."
                />
              </div>

              <div className="mt-8">
                <button
                  disabled={!personImage || !clothingImage || isGenerating}
                  onClick={handleGenerate}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                    !personImage || !clothingImage || isGenerating
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-200'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      Tailoring Your Fit...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sparkles"></i>
                      Generate Try-On
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600">
                  <i className="fas fa-exclamation-circle mt-1"></i>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>

            {/* Tip Card */}
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                <i className="fas fa-lightbulb"></i>
                Pro Tip
              </h3>
              <p className="text-sm text-indigo-700 leading-relaxed">
                For the best results, use a clear, full-body photo of the person with minimal overlapping arms. The clothing item should be well-lit and clearly visible.
              </p>
            </div>
          </div>

          {/* Right Column: Result Area */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[500px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Preview Result</h2>
                {result && (
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors"
                  >
                    <i className="fas fa-download"></i>
                    Download
                  </button>
                )}
              </div>

              <div className="flex-1 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center relative min-h-[400px]">
                {result ? (
                  <img 
                    src={result.imageUrl} 
                    alt="AI Try-On Result" 
                    className="max-w-full max-h-[700px] object-contain animate-in fade-in duration-500"
                  />
                ) : isGenerating ? (
                  <div className="flex flex-col items-center gap-6 px-8 text-center">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <i className="fas fa-scissors text-indigo-600"></i>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-xl mb-2">Analyzing Garment Physics</p>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        Our AI is mapping the fabric to the person's pose and lighting for a perfect fit.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-12">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <i className="fas fa-image text-3xl"></i>
                    </div>
                    <p className="text-slate-400 font-medium">Your generated result will appear here</p>
                  </div>
                )}
              </div>

              {/* History Bar */}
              {history.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Sessions</p>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {history.map((h) => (
                      <button 
                        key={h.timestamp}
                        onClick={() => setResult(h)}
                        className={`flex-shrink-0 w-20 h-24 rounded-xl border-2 overflow-hidden transition-all ${
                          result?.timestamp === h.timestamp ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={h.imageUrl} className="w-full h-full object-cover" alt="History item" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer info */}
      <footer className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} TryOn AI • Powered by Gemini 2.5 Flash Image</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="hover:text-indigo-600">Terms</a>
          <a href="#" className="hover:text-indigo-600">Privacy</a>
          <a href="#" className="hover:text-indigo-600">Fashion Ethics</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
