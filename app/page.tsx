"use client";

import { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // SDK Initialize
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

  const handleOpen = useCallback(() => {
    if (!url) return;

    let target = url.trim();
    // Agar user ne https nahi lagaya to laga do
    if (!target.startsWith("http")) {
      target = `https://${target}`;
    }

    try {
      // CHANGE: SDK ke bajaye seedha window location change kar rahe hain.
      // Ye current page ko replace karke target URL load karega (In-App).
      window.location.href = target;
      
    } catch (e) {
      console.error("Navigation failed", e);
      // Fallback: Agar direct navigation fail ho jaye
      sdk.actions.openUrl(target);
    }
  }, [url]);

  if (!isLoaded) return <div className="flex h-screen items-center justify-center text-white">Loading Frame...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-6 border border-gray-800 p-6 rounded-2xl bg-gray-900 shadow-xl">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-purple-400 mb-1">
            Crypto Browser
          </h1>
          <p className="text-xs text-gray-500">Connect Wallet & Trade inside Farcaster</p>
        </div>
        
        {/* Input Box */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Website URL</label>
          <div className="relative flex items-center">
             <span className="absolute left-3 text-gray-500 text-sm">🌐</span>
             <input
                type="text"
                placeholder="e.g. app.uniswap.org"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-10 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-purple-500 outline-none"
              />
          </div>
        </div>

        {/* Popular Dapps Quick Links */}
        <div className="grid grid-cols-3 gap-2">
           <button onClick={() => setUrl("app.uniswap.org")} className="text-xs bg-gray-800 border border-gray-700 p-2 rounded hover:bg-gray-700 transition">🦄 Uniswap</button>
           <button onClick={() => setUrl("jumper.exchange")} className="text-xs bg-gray-800 border border-gray-700 p-2 rounded hover:bg-gray-700 transition">🌉 Jumper</button>
           <button onClick={() => setUrl("opensea.io")} className="text-xs bg-gray-800 border border-gray-700 p-2 rounded hover:bg-gray-700 transition">🌊 OpenSea</button>
        </div>

        {/* Main Action Button */}
        <button
          onClick={handleOpen}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-900/20"
        >
          Launch Inside App 🚀
        </button>

        <div className="text-[10px] text-gray-600 text-center mt-4">
          Note: Press the 'Back' button in Farcaster header to return to this browser.
        </div>
      </div>
    </div>
  );
}
