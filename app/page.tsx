"use client";

import React, { useState, useEffect } from 'react';


export default function Home() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [blockId, setBlockId] = useState<string | null>(null);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleGenerate = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error('Failed to save block');

      const data = await response.json();
      setBlockId(data.id);
    } catch (error) {
      console.error(error);
      alert('Failed to generate iframe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!blockId) return;
    const iframeCode = `<iframe src="${origin}/embed/${blockId}" width="100%" height="600" style="border:none; border-radius: 8px; overflow: hidden;"></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    alert('Snippet copied to clipboard!');
  };

  const handleReset = () => {
    setBlockId(null);
    setCode('');
  };

  return (
    <div className="min-h-screen bg-white text-[#0f0801] font-sans selection:bg-[#f4b840]/40">
      {/* Dynamic Background */}
      {/* Remove background gradients for a clean white look */}

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 lg:px-8">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#0f0801]">
            <span style={{ color: '#f4b840' }}>Vibe</span> Code to IFrame
          </h1>
          <p className="text-lg md:text-xl text-[#0f0801] max-w-2xl">
            Seamlessly convert your AI-generated data visualizations into isolated, embeddable <span style={{ color: '#f4b840' }}>&lt;iframe&gt;</span> snippets for your WordPress site.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="flex flex-col h-full bg-[#fff7e6] border border-[#f4b840] rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:border-[#f4b840]/80">
            <div className="flex items-center mb-3 gap-2">
              <label htmlFor="code-input" className="text-sm font-semibold text-[#0f0801] block">
                Paste your raw HTML/React Code
              </label>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setCode(text);
                  } catch (err) {
                    alert('Failed to read clipboard.');
                  }
                }}
                className="ml-4 flex items-center gap-2 px-5 py-2 text-base font-bold bg-[#f4b840] hover:bg-[#ffd77a] text-[#0f0801] rounded-xl shadow-lg border border-[#f4b840] focus:outline-none focus:ring-2 focus:ring-[#f4b840]/50 transition-all active:scale-[0.98]"
                title="Paste from clipboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Paste
              </button>
            </div>

            <div className="mb-3 w-full">
              <input
                type="file"
                accept=".html,text/html"
                className="block w-full text-sm text-[#0f0801] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#f4b840] file:text-[#0f0801] hover:file:bg-[#ffd77a] file:transition-all"
                title="Upload HTML file"
                onChange={async (e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    const text = await file.text();
                    setCode(text);
                  }
                }}
              />
            </div>
            <div className="relative flex-grow">
              <textarea
                id="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="<html>...</html>"
                className="w-full h-[400px] lg:h-[500px] p-4 bg-white text-[#0f0801] font-mono text-sm leading-relaxed rounded-xl border border-[#f4b840] focus:outline-none focus:ring-2 focus:ring-[#f4b840]/50 focus:border-[#f4b840]/50 resize-none transition-all placeholder:text-[#f4b840]"
                spellCheck="false"
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading || !code.trim()}
              className="mt-6 w-full py-3 px-4 bg-[#f4b840] hover:bg-[#ffd77a] disabled:bg-[#f4b840]/40 disabled:text-[#0f0801]/40 disabled:cursor-not-allowed text-[#0f0801] font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                'Generate Iframe Snippet'
              )}
            </button>
          </div>

          {/* Output / Preview Section */}
          <div className="flex flex-col h-full space-y-6">
            
            {/* Snippet Card */}
            <div className={`bg-[#fff7e6] border border-[#f4b840] rounded-2xl p-6 shadow-2xl transition-all duration-500 ${blockId ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2 pointer-events-none'}`}>
              <h2 className="text-lg font-bold text-[#0f0801] mb-2 flex items-center justify-between">
                Your Embed Snippet
                {blockId && (
                  <span className="text-xs font-mono bg-[#f4b840]/20 text-[#0f0801] px-2 py-1 rounded-md border border-[#f4b840]/20">
                    ID: {blockId}
                  </span>
                )}
              </h2>
              <p className="text-sm text-[#0f0801] mb-4">
                Copy this code and paste it into WordPress (or any CMS) as Custom HTML.
              </p>
              
              <div className="relative group">
                <code className="block w-full bg-white p-4 rounded-xl text-[#0f0801] font-mono text-sm border border-[#f4b840] overflow-x-auto whitespace-nowrap">
                  {blockId && origin
                    ? `<iframe src="${origin}/embed/${blockId}" width="100%" height="600" style="border:none; border-radius: 8px; overflow: hidden;"></iframe>`
                    : '<iframe src="..." width="100%" height="600" style="border:none;"></iframe>'}
                </code>
                
                {blockId && (
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-1/2 -translate-y-1/2 right-3 opacity-0 group-hover:opacity-100 bg-[#f4b840] hover:bg-[#ffd77a] text-[#0f0801] p-2 rounded-lg transition-all"
                    title="Copy to clipboard"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Live Preview Card */}
            <div className={`flex-grow flex flex-col bg-[#fff7e6] border border-[#f4b840] rounded-2xl p-6 shadow-2xl transition-all duration-500 ${blockId ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2 pointer-events-none'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#0f0801]">Live Preview</h2>
                {blockId && (
                  <button onClick={handleReset} className="text-sm text-[#f4b840] hover:text-[#0f0801] transition-colors">
                    Start Over
                  </button>
                )}
              </div>
              <div className="w-full flex-grow bg-white rounded-xl overflow-hidden border border-[#f4b840] shadow-inner min-h-[300px] relative">
                {blockId ? (
                  <iframe 
                    src={`/embed/${blockId}`}
                    className="w-full h-full absolute inset-0" 
                    style={{ border: 'none' }} 
                    title="Live Preview"
                  />
                ) : (
                  <div className="w-full h-full absolute inset-0 flex items-center justify-center bg-[#fff7e6]">
                    <p className="text-[#f4b840] font-medium">Waiting for code to generate preview...</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
