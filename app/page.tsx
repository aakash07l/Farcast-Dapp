"use client";

import { useState, useEffect, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Frame SDK ready hone ka wait
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
      // Farcaster native method to open URL
      sdk.actions.openUrl(target);
    } catch (e) {
      // Fallback for testing in normal browser
      window.open(target, "_blank");
    }
  }, [url]);

  if (!isLoaded) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-6 border border-gray-800 p-6 rounded-2xl bg-gray-900">
        
        <h1 className="text-2xl font-bold text-center text-purple-400">
          Dapp Browser
        </h1>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Enter dApp URL</label>
          <input
            type="text"
            placeholder="uniswap.org"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-purple-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
           {/* Quick Links buttons for ease */}
           <button onClick={() => setUrl("app.uniswap.org")} className="text-xs bg-gray-800 p-2 rounded hover:bg-gray-700">Uniswap</button>
           <button onClick={() => setUrl("zora.co")} className="text-xs bg-gray-800 p-2 rounded hover:bg-gray-700">Zora</button>
           <button onClick={() => setUrl("opensea.io")} className="text-xs bg-gray-800 p-2 rounded hover:bg-gray-700">OpenSea</button>
        </div>

        <button
          onClick={handleOpen}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Go to App ↗
        </button>
      </div>
    </div>
  );
}
