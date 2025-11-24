"use client";

import { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { Loader2, Wallet, Info } from "lucide-react"; // Icons add kiye

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false); // Guide popup ke liye state

  useEffect(() => {
    const load = async () => {
      try {
        await sdk.actions.ready();
      } catch (err) {
        console.log("SDK Error:", err);
      }
      setIsLoaded(true);
    };
    load();
  }, []);

  // Step 1: User ne button dabaya -> Guide dikhao
  const handleInitialClick = () => {
    if (!url) return;
    setShowGuide(true);
  };

  // Step 2: User ne Guide padh liya -> Ab Redirect karo
  const handleProceed = useCallback(() => {
    let target = url.trim();
    if (!target.startsWith("http")) {
      target = `https://${target}`;
    }

    try {
      window.location.href = target;
    } catch (e) {
      console.error("Navigation failed", e);
      sdk.actions.openUrl(target);
    }
  }, [url]);

  if (!isLoaded) return <div className="flex h-screen items-center justify-center text-white bg-black"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 font-sans">
      
      {/* --- MAIN INTERFACE --- */}
      {!showGuide && (
        <div className="w-full max-w-md space-y-6 border border-gray-800 p-6 rounded-2xl bg-gray-900 shadow-2xl">
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Mini Browser
            </h1>
            <p className="text-xs text-gray-500 mt-1">Explore Web3 inside Farcaster</p>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
               <input
                  type="text"
                  placeholder="Enter URL (e.g. zora.co)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 outline-none transition-all placeholder-gray-600"
                />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <button onClick={() => setUrl("app.uniswap.org")} className="text-xs bg-gray-800 border border-gray-700 p-3 rounded-lg hover:bg-gray-700 transition">🦄 Uniswap</button>
             <button onClick={() => setUrl("opensea.io")} className="text-xs bg-gray-800 border border-gray-700 p-3 rounded-lg hover:bg-gray-700 transition">🌊 OpenSea</button>
             <button onClick={() => setUrl("pump.fun")} className="text-xs bg-gray-800 border border-gray-700 p-3 rounded-lg hover:bg-gray-700 transition">💊 Pump.fun</button>
          </div>

          <button
            onClick={handleInitialClick}
            disabled={!url}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              url ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/40" : "bg-gray-800 text-gray-600"
            }`}
          >
            Launch dApp 🚀
          </button>
        </div>
      )}

      {/* --- GUIDE POPUP (Jugad Logic) --- */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border border-purple-500/30 p-6 rounded-2xl max-w-sm w-full space-y-5 shadow-2xl">
            
            <div className="flex items-center gap-3 text-purple-400">
              <Wallet className="w-8 h-8" />
              <h2 className="text-xl font-bold">Connect Kaise Karein?</h2>
            </div>

            <div className="space-y-4 text-sm text-gray-300">
              <p>Website khulne ke baad wallet connect karte samay ye option chunein:</p>
              
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="font-bold text-white">Rainbow Wallet</span>
                <span className="text-xs text-gray-500 ml-auto">(Recommended)</span>
              </div>
              
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="font-bold text-white">Injected / Browser</span>
              </div>

              <div className="bg-red-900/20 p-3 rounded-lg border border-red-900/50 flex items-start gap-2">
                <Info className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-300">
                  "WalletConnect" select na karein, wo external app khol dega.
                </p>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Samajh Gaya, Open Karo ✅
            </button>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full text-gray-500 text-xs py-2 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
