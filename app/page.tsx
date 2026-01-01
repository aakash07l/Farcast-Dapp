"use client";

import { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { Loader2, Wallet, Plus } from "lucide-react"; 

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [added, setAdded] = useState(false); // Track krenge ki add hua ya nhi

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        // Check karein agar pehle se added hai
        if (context?.client?.added) {
          setAdded(true);
        }
        sdk.actions.ready();
      } catch (err) {
        console.log("SDK Error:", err);
      }
      setIsLoaded(true);
    };
    load();
  }, []);

  // --- FEATURE: ADD MINI APP TO FARCASTER ---
  const handleAddToFarcaster = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
      setAdded(true);
    } catch (error) {
      console.error("Failed to add frame:", error);
    }
  }, []);

  const handleInitialClick = () => {
    if (!url) return;
    setShowGuide(true);
  };

  const handleProceed = useCallback(() => {
    let target = url.trim();
    if (!target.startsWith("http")) {
      target = `https://${target}`;
    }
    try {
      // Pehle normal window open try karein
      window.open(target, "_blank");
    } catch (e) {
      // Fallback Farcaster SDK ke liye
      sdk.actions.openUrl(target);
    }
  }, [url]);

  if (!isLoaded) return (
    <div className="flex h-screen items-center justify-center text-white bg-black">
      <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans relative">
      
      {/* HEADER BAR */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
           <span className="text-xl">🌐</span>
           <span className="font-bold text-sm text-gray-200">Web3 Browser</span>
        </div>

        {/* --- ADD BUTTON (Sirf tab dikhega jab added na ho) --- */}
        {!added && (
          <button 
            onClick={handleAddToFarcaster}
            className="flex items-center gap-1 bg-purple-600/20 text-purple-400 border border-purple-500/50 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-purple-600 hover:text-white transition-all"
          >
            <Plus className="w-3 h-3" />
            Add App
          </button>
        )}
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        
        {!showGuide && (
          <div className="w-full max-w-md space-y-6">
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-gray-500 text-transparent bg-clip-text">
                Browse & Connect
              </h1>
              <p className="text-xs text-gray-500">Access any dApp inside Farcaster</p>
            </div>
            
            <div className="space-y-2">
              <div className="relative group">
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
                 <div className="relative">
                   <input
                      type="text"
                      placeholder="Paste URL (e.g. zora.co)"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-purple-500 outline-none transition-all placeholder-gray-600"
                    />
                 </div>
              </div>
            </div>

            {/* Quick Shortcuts */}
            <div className="grid grid-cols-3 gap-3">
               <button onClick={() => setUrl("app.uniswap.org")} className="text-xs bg-gray-800 border border-gray-700 p-3 rounded-lg hover:bg-gray-700 hover:border-purple-500 transition">🦄 Uniswap</button>
               <button onClick={() => setUrl("opensea.io")} className="text-xs bg-gray-800 border border-gray-700 p-3 rounded-lg hover:bg-gray-700 hover:border-blue-500 transition">🌊 OpenSea</button>
               <button onClick={() => setUrl("pump.fun")} className="text-xs bg-gray-800 border border-gray-700 p-3 rounded-lg hover:bg-gray-700 hover:border-green-500 transition">💊 Pump.fun</button>
            </div>

            <button
              onClick={handleInitialClick}
              disabled={!url}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                url ? "bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10" : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              Launch dApp 🚀
            </button>
          </div>
        )}
      </div>

      {/* --- GUIDE POPUP --- */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl max-w-sm w-full space-y-5 shadow-2xl">
            
            <div className="flex items-center gap-3 text-purple-400 border-b border-gray-800 pb-4">
              <Wallet className="w-6 h-6" />
              <h2 className="text-lg font-bold text-white">Opening dApp...</h2>
            </div>

            <div className="space-y-4 text-sm text-gray-300">
              <p>For the best experience connecting your wallet:</p>
              
              <div className="space-y-2">
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-3">
                  <span className="text-green-500">✅</span>
                  <span className="font-bold text-white">Select "Coinbase Wallet"</span>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-3">
                  <span className="text-yellow-500">✅</span>
                  <span className="font-bold text-white">Select "Browser Wallet"</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">Do not select WalletConnect inside the internal browser.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowGuide(false)}
                className="flex-1 text-gray-400 text-sm py-3 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Go to Site
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
