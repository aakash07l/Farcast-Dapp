"use client";

import { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { 
  Loader2, 
  Globe, 
  Plus, 
  Check, 
  Search, 
  AlertTriangle, 
  Wallet, 
  ArrowRight, 
  Gift 
} from "lucide-react"; 
import { encodeFunctionData, parseEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        // Check karein agar user ne app pehle se add ki hui hai
        if (context?.client?.added) {
          setAdded(true);
        }
        await sdk.actions.ready();
      } catch (err) {
        console.error("SDK Error:", err);
      }
      setIsLoaded(true);
    };
    load();
  }, []);

  // --- REWARD CLAIM FUNCTION (Uses Warplet / Native Wallet) ---
  const handleClaimReward = async () => {
    setClaiming(true);
    try {
      // 1. Transaction Data Encode karna (Viem use karke)
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: "mint", // Make sure ye tumhare contract function name se match kare
        args: [
           "0x0000000000000000000000000000000000000000", // Placeholder (Contract should use msg.sender)
           parseEther("100") // Amount to claim (e.g. 100 tokens)
        ], 
      });

      // 2. Trigger Transaction via Farcaster Native Wallet
      const result = await sdk.actions.ethSendTransaction({
        chainId: "eip155:8453", // Base Chain ID (Change if needed)
        data: data,
        to: CONTRACT_ADDRESS,
        value: "0", 
      });

      alert(`Claim Transaction Sent!`);

    } catch (error) {
      console.error("Claim Failed:", error);
      // alert("Claim Cancelled"); // Optional: Error dikhana ho to uncomment karein
    } finally {
      setClaiming(false);
    }
  };

  // --- ADD TO SHORTCUTS ---
  const handleAddToFarcaster = useCallback(async () => {
    try {
      const result = await sdk.actions.addFrame();
      if (result) setAdded(true);
    } catch (error) {
      console.log("Add frame not supported in this env");
    }
  }, []);

  // --- BROWSER NAVIGATION ---
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
      // Force navigation inside the webview
      window.location.href = target;
    } catch (e) {
      sdk.actions.openUrl(target);
    }
  }, [url]);

  if (!isLoaded) return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a] text-white">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#0f172a] text-white font-sans selection:bg-purple-500/30">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
             <Globe className="w-4 h-4 text-white" />
           </div>
           <span className="font-bold text-sm tracking-wide hidden sm:block">dApp Browser</span>
        </div>

        {!added ? (
          <button 
            onClick={handleAddToFarcaster}
            className="flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/20 transition-all active:scale-95"
          >
            <Plus className="w-3 h-3" />
            Add App
          </button>
        ) : (
          <span className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            <Check className="w-3 h-3" /> Added
          </span>
        )}
      </div>

      {/* --- CONTENT --- */}
      <div className="flex-1 flex flex-col items-center p-6 animate-fade-in max-w-lg mx-auto w-full space-y-6">
        
        {/* --- REWARD CARD (TOP SECTION) --- */}
        <div className="w-full relative overflow-hidden rounded-2xl p-0.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 shadow-xl shadow-orange-500/20">
           <div className="bg-[#1e293b] rounded-[14px] p-4 relative">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Gift className="w-5 h-5 text-yellow-400" /> Daily Reward
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Claim 100 Tokens on Base</p>
                 </div>
                 <button 
                    onClick={handleClaimReward}
                    disabled={claiming}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                    {claiming ? <Loader2 className="w-3 h-3 animate-spin" /> : "Claim Now"}
                 </button>
              </div>
           </div>
        </div>

        {!showGuide && (
          <div className="w-full space-y-6">
            
            {/* Hero Section */}
            <div className="text-center space-y-2 pt-2">
              <h1 className="text-3xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                  Web3 Browser
                </span>
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed">
                Enter URL & connect external wallet
              </p>
            </div>
            
            {/* Input Section */}
            <div className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-30 group-hover:opacity-60 transition duration-500 blur-sm"></div>
               <div className="relative flex items-center bg-[#1e293b] rounded-2xl border border-white/10 p-1">
                 <div className="pl-4 text-gray-500">
                   <Search className="w-5 h-5" />
                 </div>
                 <input
                    type="text"
                    placeholder="Search or enter URL (e.g. zora.co)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-3 bg-transparent text-white outline-none placeholder-gray-500 text-sm"
                  />
               </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="grid grid-cols-3 gap-3">
                 {[
                   { name: "Uniswap", url: "app.uniswap.org", icon: "🦄" },
                   { name: "OpenSea", url: "opensea.io", icon: "🌊" },
                   { name: "Pump.fun", url: "pump.fun", icon: "💊" }
                 ].map((dapp) => (
                   <button 
                     key={dapp.name}
                     onClick={() => setUrl(dapp.url)} 
                     className="glass flex flex-col items-center justify-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-all hover:border-purple-500/50 group"
                   >
                     <span className="text-xl group-hover:scale-110 transition-transform">{dapp.icon}</span>
                     <span className="text-[10px] font-medium text-gray-300">{dapp.name}</span>
                   </button>
                 ))}
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleInitialClick}
              disabled={!url}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-xl ${
                url 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] text-white shadow-purple-900/20" 
                : "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
              }`}
            >
              Go to Website <ArrowRight className="w-4 h-4" />
            </button>
            
          </div>
        )}
      </div>

      {/* --- GUIDE MODAL (IMPORTANT WARNING) --- */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e293b] border border-white/10 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 text-purple-400 mb-5">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Wallet className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-white">Wallet Connection</h2>
              </div>

              <div className="space-y-4 text-sm">
                <p className="text-gray-300 leading-relaxed">
                  Please select <span className="text-white font-bold">Rainbow</span> or <span className="text-white font-bold">Injected Wallet</span> inside the website.
                </p>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                  <p className="text-xs text-yellow-200">
                    <span className="font-bold">Note:</span> Native Wallet (Warplet) is used for <b>Rewards only</b>. Use external wallet for dApps.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowGuide(false)}
                  className="flex-1 text-gray-400 text-sm font-medium py-3 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceed}
                  className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
            }
