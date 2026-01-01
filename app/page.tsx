"use client";

import { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { 
  Loader2, 
  Globe, 
  Plus, 
  Check, 
  Search, 
  Wallet, 
  Gift 
} from "lucide-react"; 
import { encodeFunctionData } from "viem";

// 1. FILES IMPORT (Ensure ye dono files app folder me ho)
import { CONTRACT_ADDRESS } from "./contract"; // Address wali file
import contractABI from "./contract.json";     // ABI wali file (Jo tumne paste kiya)

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        if (context?.client?.added) setAdded(true);
        await sdk.actions.ready();
      } catch (err) {
        console.error("SDK Error:", err);
      }
      setIsLoaded(true);
    };
    load();
  }, []);

  // --- MAIN CLAIM LOGIC ---
  const handleClaimReward = async () => {
    setClaiming(true);
    try {
      // 1. Check if Wallet Action is supported
      if (!(sdk.actions as any).ethSendTransaction) {
        alert("Error: Feature requires Warpcast Mobile App.");
        setClaiming(false);
        return;
      }

      // 2. Prepare Data (Using your ABI)
      // claim() function has no arguments in your ABI
      const data = encodeFunctionData({
        abi: contractABI,
        functionName: "claim",
        args: [], 
      });

      // 3. Send Transaction
      const result = await (sdk.actions as any).ethSendTransaction({
        chainId: "eip155:8453", // Base Chain ID
        data: data,
        to: CONTRACT_ADDRESS,
        value: "0", 
      });

      alert(`Success! Tokens Claimed.`);
      console.log("Tx Hash:", result);

    } catch (error: any) {
      console.error("Claim Failed:", error);
      
      // Error handling for cooldown
      if (error.message?.includes("Wait 24h")) {
        alert("Failed: You can only claim once every 24 hours.");
      } else if (error.message?.includes("User rejected")) {
        alert("Transaction Cancelled.");
      } else {
        alert("Claim Failed. Make sure contract has funds.");
      }
    } finally {
      setClaiming(false);
    }
  };

  // --- ADD APP SHORTCUT ---
  const handleAddToFarcaster = useCallback(async () => {
    try {
      const result = await sdk.actions.addFrame();
      if (result) setAdded(true);
    } catch (error) { }
  }, []);

  // --- BROWSER LOGIC ---
  const handleInitialClick = () => {
    if (!url) return;
    // Direct open logic
    let target = url.trim();
    if (!target.startsWith("http")) target = `https://${target}`;
    try {
      window.location.href = target;
    } catch (e) {
      sdk.actions.openUrl(target);
    }
  };

  if (!isLoaded) return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a] text-white">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#0f172a] text-white font-sans selection:bg-purple-500/30">
      
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
             <Globe className="w-4 h-4 text-white" />
           </div>
           <span className="font-bold text-sm tracking-wide">dApp Browser</span>
        </div>
        {!added && (
          <button onClick={handleAddToFarcaster} className="flex items-center gap-1.5 bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/20 transition-all">
            <Plus className="w-3 h-3" /> Add App
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col items-center p-6 animate-fade-in max-w-lg mx-auto w-full space-y-6">
        
        {/* REWARD CARD */}
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

        {/* BROWSER INPUT */}
        <div className="w-full space-y-6">
            <div className="text-center space-y-2 pt-2">
              <h1 className="text-3xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                  Web3 Browser
                </span>
              </h1>
              <p className="text-xs text-gray-400">Enter URL & connect external wallet</p>
            </div>
            
            <div className="relative flex items-center bg-[#1e293b] rounded-2xl border border-white/10 p-1">
                 <div className="pl-4 text-gray-500"><Search className="w-5 h-5" /></div>
                 <input
                    type="text"
                    placeholder="Search or enter URL (e.g. zora.co)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-3 bg-transparent text-white outline-none placeholder-gray-500 text-sm"
                  />
            </div>

            <div className="grid grid-cols-3 gap-3">
                 {[
                   { name: "Uniswap", url: "app.uniswap.org", icon: "🦄" },
                   { name: "OpenSea", url: "opensea.io", icon: "🌊" },
                   { name: "Pump.fun", url: "pump.fun", icon: "💊" }
                 ].map((dapp) => (
                   <button key={dapp.name} onClick={() => setUrl(dapp.url)} className="glass flex flex-col items-center justify-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-all hover:border-purple-500/50 group">
                     <span className="text-xl group-hover:scale-110 transition-transform">{dapp.icon}</span>
                     <span className="text-[10px] font-medium text-gray-300">{dapp.name}</span>
                   </button>
                 ))}
            </div>

            <button
              onClick={handleInitialClick}
              disabled={!url}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-xl ${
                url ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              Go to Website
            </button>
        </div>
      </div>
    </div>
  );
}
