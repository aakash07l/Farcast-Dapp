"use client";

import { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { Loader2, Wallet, Plus, Sparkles, Zap, X, Share } from "lucide-react"; 

export default function Home() {
  // --- EXISTING STATES (Browser Logic) ---
  const [url, setUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [added, setAdded] = useState(false);

  // --- NEW STATES (Vibe Check Logic) ---
  const [showVibe, setShowVibe] = useState(false);
  const [identity, setIdentity] = useState<string | null>(null);
  const [luck, setLuck] = useState<number | null>(null);
  const [loadingVibe, setLoadingVibe] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
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

  // --- FUNCTION 1: Add to Farcaster ---
  const handleAddToFarcaster = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
      setAdded(true);
    } catch (error) {
      console.error("Failed to add frame:", error);
    }
  }, []);

  // --- FUNCTION 2: Browser Logic ---
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
      window.open(target, "_blank");
    } catch (e) {
      sdk.actions.openUrl(target);
    }
  }, [url]);

  // --- FUNCTION 3: Vibe Check Logic ---
  const generateIdentity = () => {
    setLoadingVibe(true);
    setIdentity(null); // Clear old result
    
    setTimeout(() => {
      const roles = [
        "Based Builder 🛠️", 
        "Memecoin Millionaire 💰", 
        "Rug Pull Survivor 🥲", 
        "Degen King 👑", 
        "Gas Fee Donor ⛽",
        "Normie 😐",
        "Reply Guy 💬",
        "Frame Wizard 🧙‍♂️"
      ];
      setIdentity(roles[Math.floor(Math.random() * roles.length)]);
      setLuck(Math.floor(Math.random() * 100) + 1);
      setLoadingVibe(false);
    }, 1000);
  };

  // --- FUNCTION 4: Share to Warpcast ---
  const handleShare = () => {
    if (!identity) return;
    
    // Message jo post hoga
    const text = `🔮 My Farcaster Vibe Check:\n\n✨ Role: ${identity}\n🍀 Luck: ${luck}%\n\nCheck yours on the Web3 Browser Frame! 👇`;
    
    // URL Encode karke link banana
    const encodedText = encodeURIComponent(text);
    const shareUrl = `https://warpcast.com/~/compose?text=${encodedText}`;
    
    // Open Warpcast
    sdk.actions.openUrl(shareUrl);
  };

  if (!isLoaded) return (
    <div className="flex h-screen items-center justify-center text-white bg-black">
      <Loader2 className="animate-spin w-10 h-10 text-purple-500" />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans relative">
      
      {/* HEADER BAR */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        
        {/* Left Side */}
        <div className="flex items-center gap-2">
           <span className="text-xl">🌐</span>
           <span className="font-bold text-sm text-gray-200 hidden sm:block">Web3 Browser</span>
        </div>

        {/* Right Side Buttons */}
        <div className="flex gap-3">
          
          {/* Vibe Check Button */}
          <button 
            onClick={() => setShowVibe(true)}
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-purple-900/20"
          >
            <Sparkles className="w-3 h-3" />
            Vibe Check
          </button>

          {/* Add App Button */}
          {!added && (
            <button 
              onClick={handleAddToFarcaster}
              className="flex items-center gap-1 bg-gray-800 text-gray-300 border border-gray-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-700 hover:text-white transition-all"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          )}
        </div>
      </div>

      {/* --- MAIN BROWSER CONTENT --- */}
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
                 <input
                    type="text"
                    placeholder="Paste URL (e.g. zora.co)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="relative w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-purple-500 outline-none transition-all placeholder-gray-600"
                  />
              </div>
            </div>

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
                  <span className="text-green-500">✅</span><span className="font-bold text-white">Select "Coinbase Wallet"</span>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex items-center gap-3">
                  <span className="text-yellow-500">✅</span><span className="font-bold text-white">Select "Browser Wallet"</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowGuide(false)} className="flex-1 text-gray-400 text-sm py-3 hover:text-white transition">Cancel</button>
              <button onClick={handleProceed} className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors">Go to Site</button>
            </div>
          </div>
        </div>
      )}

      {/* --- VIBE CHECK POPUP (MODAL) --- */}
      {showVibe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowVibe(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1 rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Vibe Check
            </h2>

            <div className="min-h-[140px] flex flex-col items-center justify-center text-center mb-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
               {loadingVibe ? (
                 <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
               ) : identity ? (
                 <div className="animate-in zoom-in duration-300">
                   <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">You are a</p>
                   <h3 className="text-2xl font-black text-white mb-2">{identity}</h3>
                   <div className="inline-flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 mt-2">
                      <Zap className={`w-3 h-3 ${luck && luck > 50 ? 'text-yellow-400' : 'text-gray-400'}`} />
                      <span className="text-xs text-slate-300">Luck: <span className={luck && luck > 80 ? "text-green-400 font-bold" : "text-white"}>{luck}%</span></span>
                   </div>
                 </div>
               ) : (
                 <div className="text-slate-500 flex flex-col items-center gap-2">
                   <Sparkles className="w-6 h-6 opacity-50" />
                   <p className="text-sm">Click below to reveal your fate</p>
                 </div>
               )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3">
              
              {!identity ? (
                // State 1: Jab result na ho -> Sirf Reveal Button
                <button
                  onClick={generateIdentity}
                  disabled={loadingVibe}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-bold text-white hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-purple-900/30"
                >
                  {loadingVibe ? "Scanning Blockchain..." : "Reveal Identity 🎲"}
                </button>
              ) : (
                // State 2: Jab result aa jaye -> Share aur Try Again button
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleShare}
                    className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Share className="w-4 h-4" />
                    Share on Warpcast
                  </button>
                  
                  <button
                    onClick={generateIdentity}
                    className="w-full bg-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all"
                  >
                    Spin Again 🔄
                  </button>
                </div>
              )}
            
            </div>

          </div>
        </div>
      )}

    </div>
  );
               }
