import React, { useState, useEffect } from 'react';

const ConflictVisualizer = ({ rawText }) => {
  const [parsed, setParsed] = useState({
    contextBefore: '', currentChange: '', incomingChange: '', contextAfter: ''
  });
  const [resolutionText, setResolutionText] = useState('');

  const parseConflict = (text) => {
    const lines = text.split('\n');
    let state = 'BEFORE'; 
    let before = [], current = [], incoming = [], after = [];

    for (let line of lines) {
      if (line.startsWith('<<<<<<<')) {
        state = 'CURRENT';
        continue;
      }
      if (line.startsWith('=======')) {
        state = 'INCOMING';
        continue;
      }
      if (line.startsWith('>>>>>>>')) {
        state = 'AFTER';
        continue;
      }

      if (state === 'BEFORE') before.push(line);
      else if (state === 'CURRENT') current.push(line);
      else if (state === 'INCOMING') incoming.push(line);
      else if (state === 'AFTER') after.push(line);
    }

    return {
      contextBefore: before.join('\n'),
      currentChange: current.join('\n'),
      incomingChange: incoming.join('\n'),
      contextAfter: after.join('\n')
    };
  };

  useEffect(() => {
    if (!rawText) return;
    const extract = parseConflict(rawText);
    setParsed(extract);
    setResolutionText(rawText);
  }, [rawText]);

  const handleAccept = (type) => {
    let res = '';
    if (type === 'current') res = parsed.currentChange;
    if (type === 'incoming') res = parsed.incomingChange;
    if (type === 'both') res = [parsed.currentChange, parsed.incomingChange].filter(Boolean).join('\n');
    
    // Stitch it all together perfectly
    const fullText = [parsed.contextBefore, res, parsed.contextAfter].filter(Boolean).join('\n');
    setResolutionText(fullText);
  };

  const handleSave = () => {
    console.log("Final Resolution:\n", resolutionText);
    alert("Conflict Resolved!");
  };

  return (
    <div className="flex flex-col gap-6 bg-[#030712] text-gray-200 border border-gray-800 rounded-lg p-6 shadow-xl w-full">
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-100">Interactive Conflict Resolution</h2>
        <span className="text-xs bg-red-900/40 text-red-400 px-2 py-1 rounded font-bold ml-auto border border-red-500/20">Action Needed</span>
      </div>

      {parsed.contextBefore && (
         <div className="bg-[#0d1117] border border-gray-800 rounded p-4 shadow-inner">
           <div className="text-xs text-gray-500 font-bold uppercase mb-2 tracking-wider">Context (Before)</div>
           <pre className="font-mono text-[13px] text-gray-400 overflow-x-auto leading-relaxed">{parsed.contextBefore}</pre>
         </div>
      )}

      {/* Split Panes */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Left Pane: Current */}
        <div className="flex-1 border border-emerald-500/30 rounded overflow-hidden bg-emerald-950/20 flex flex-col shadow-lg shadow-emerald-900/10">
          <div className="bg-emerald-900/30 px-4 py-2 border-b border-emerald-500/20">
             <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Current (HEAD)
             </span>
          </div>
          <pre className="flex-1 p-5 font-mono text-[13px] text-emerald-100/90 overflow-x-auto leading-relaxed">
            {parsed.currentChange || <span className="text-gray-500 italic">No content</span>}
          </pre>
        </div>

        {/* Right Pane: Incoming */}
        <div className="flex-1 border border-blue-500/30 rounded overflow-hidden bg-blue-950/20 flex flex-col shadow-lg shadow-blue-900/10">
          <div className="bg-blue-900/30 px-4 py-2 border-b border-blue-500/20">
             <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Incoming (Feature)
             </span>
          </div>
          <pre className="flex-1 p-5 font-mono text-[13px] text-blue-100/90 overflow-x-auto leading-relaxed">
            {parsed.incomingChange || <span className="text-gray-500 italic">No content</span>}
          </pre>
        </div>
      </div>

      {/* Resolution Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-center p-5 bg-[#0d1117] rounded-lg border border-gray-800 shadow-inner">
        <button 
          onClick={() => handleAccept('current')}
          className="px-6 py-2.5 bg-emerald-600/10 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded shadow-sm font-semibold transition-all transform hover:-translate-y-0.5"
        >
          Accept Current
        </button>
        <button 
          onClick={() => handleAccept('incoming')}
          className="px-6 py-2.5 bg-blue-600/10 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 rounded shadow-sm font-semibold transition-all transform hover:-translate-y-0.5"
        >
          Accept Incoming
        </button>
        <button 
           onClick={() => handleAccept('both')}
          className="px-6 py-2.5 bg-purple-600/10 hover:bg-purple-600/30 text-purple-400 border border-purple-500/40 rounded shadow-sm font-semibold transition-all transform hover:-translate-y-0.5"
        >
          Accept Both
        </button>
      </div>

      {parsed.contextAfter && (
         <div className="bg-[#0d1117] border border-gray-800 rounded p-4 shadow-inner">
           <div className="text-xs text-gray-500 font-bold uppercase mb-2 tracking-wider">Context (After)</div>
           <pre className="font-mono text-[13px] text-gray-400 overflow-x-auto leading-relaxed">{parsed.contextAfter}</pre>
         </div>
      )}

      {/* Final Editing block */}
      <div className="flex flex-col gap-3 mt-4">
         <label className="text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Final Resolution Editor
         </label>
         <textarea 
           className="w-full min-h-[300px] bg-[#0d1117] border border-gray-700 rounded-lg p-5 font-mono text-[13px] text-gray-200 outline-none focus:border-blue-500 border-l-4 focus:ring-opacity-50"
           value={resolutionText}
           onChange={(e) => setResolutionText(e.target.value)}
           spellCheck={false}
         />
      </div>

      <div className="flex justify-end pt-5 border-t border-gray-800 mt-2">
         <button 
           onClick={handleSave}
           className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-8 rounded shadow-lg shadow-blue-900/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
         >
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
           </svg>
           Save Resolution
         </button>
      </div>

    </div>
  );
};

export default ConflictVisualizer;
