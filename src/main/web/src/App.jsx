import { useState } from 'react';
import axios from 'axios';
import ConflictVisualizer from './ConflictVisualizer';

function App() {
  const [baseCode, setBaseCode] = useState(
`function calculateTotal(price, tax) {
  let total = price;
  total += tax;
  return total;
}`
  );
  
  const [mainCode, setMainCode] = useState(
`function calculateTotal(price, tax) {
  let total = price;
  total += tax + 1; // added service fee
  return total;
}`
  );
  
  const [featureCode, setFeatureCode] = useState(
`function calculateTotal(price, tax) {
  let total = price;
  total += tax * 1.05; // adjusted tax rate
  return total;
}`
  );

  const [isLoading, setIsLoading] = useState(false);
  const [mergeResult, setMergeResult] = useState(null);

  const simulateMerge = async () => {
    setIsLoading(true);
    setMergeResult(null);
    try {
      const response = await axios.post('http://localhost:3001/api/merge', {
        baseCode,
        mainCode,
        featureCode
      });
      setMergeResult(response.data);
    } catch (error) {
      console.error("Merge error:", error);
      alert("Failed to simulate merge. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6 md:p-8 font-sans selection:bg-blue-500/30">
      <header className="max-w-[1400px] mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-400 tracking-tight">
            MergeMate
          </h1>
          <p className="text-gray-400 mt-2 font-medium">DevOps Git Conflict Resolution Sandbox</p>
        </div>
        <button
          onClick={simulateMerge}
          disabled={isLoading}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-md shadow-lg shadow-emerald-900/20 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="4" strokeOpacity="0.3"></circle>
                <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
              </svg>
              Merging...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Simulate Merge
            </>
          )}
        </button>
      </header>

      <main className="max-w-[1400px] mx-auto space-y-10">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-gray-300 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              Base Code
            </label>
            <textarea
              className="flex-1 min-h-[320px] p-5 bg-[#0d1117] border border-gray-800 rounded-lg outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 font-mono text-[13px] leading-relaxed resize-y shadow-inner transition-colors"
              value={baseCode}
              onChange={(e) => setBaseCode(e.target.value)}
              spellCheck={false}
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-gray-300 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              Main (HEAD)
            </label>
            <textarea
              className="flex-1 min-h-[320px] p-5 bg-[#0d1117] border border-gray-800 rounded-lg outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 font-mono text-[13px] leading-relaxed resize-y shadow-inner transition-colors"
              value={mainCode}
              onChange={(e) => setMainCode(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-gray-300 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
              Feature Branch
            </label>
            <textarea
              className="flex-1 min-h-[320px] p-5 bg-[#0d1117] border border-gray-800 rounded-lg outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 font-mono text-[13px] leading-relaxed resize-y shadow-inner transition-colors"
              value={featureCode}
              onChange={(e) => setFeatureCode(e.target.value)}
              spellCheck={false}
            />
          </div>
        </section>

        {mergeResult && (
          <section className="animate-fade-in-up mt-8 border-t border-gray-800 pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Merge Result Output
            </h2>
            {mergeResult.hasConflict === false ? (
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-lg overflow-hidden shadow-lg shadow-emerald-900/10">
                <div className="bg-emerald-900/40 px-5 py-3 border-b border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Clean Merge Successful
                </div>
                <div className="p-5 bg-gray-950">
                  <pre className="font-mono text-sm overflow-x-auto text-emerald-100/90 leading-relaxed">
                    {mergeResult.mergedCode}
                  </pre>
                </div>
              </div>
            ) : (
              <ConflictVisualizer rawText={mergeResult.mergedCode} />
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
