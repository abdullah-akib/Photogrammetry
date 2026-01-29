
import React, { useState, useEffect } from 'react';
import { 
  Plane, Compass, Ruler, Camera, 
  Wind, Navigation, Maximize, RotateCcw,
  Github, Info, ChevronDown, ChevronRight, Map as MapIcon,
  Layers, Image as ImageIcon, CheckCircle2, Sliders, Box
} from 'lucide-react';
import { INITIAL_INPUTS } from './constants';
import { FlightInputs, FlightPlanResult } from './types';
import { calculateFlightPlan } from './engine';
import InputGroup from './components/InputGroup';
import StepCard from './components/StepCard';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<FlightInputs>(INITIAL_INPUTS);
  const [showSteps, setShowSteps] = useState(false);
  
  const [results, setResults] = useState<FlightPlanResult>(() => calculateFlightPlan(INITIAL_INPUTS));

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.className = "bg-slate-950 text-slate-200 selection:bg-blue-500/30 transition-colors duration-200";
  }, []);

  const handleRunSolver = () => {
    const newResults = calculateFlightPlan(inputs);
    setResults(newResults);
  };

  const handleReset = () => {
    setInputs(INITIAL_INPUTS);
    setResults(calculateFlightPlan(INITIAL_INPUTS));
    setShowSteps(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-100">AeroPlan</h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] -mt-1">Photogrammetry Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRunSolver}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-7 rounded-lg shadow-lg shadow-blue-600/10 transition-all flex items-center justify-center gap-2 border border-blue-400/20 active:scale-95"
            >
              Run Solver
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Inputs Section */}
          <section className="lg:col-span-4 space-y-8 no-print">
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-7 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8 border-b border-slate-800/60 pb-4">
                <h2 className="text-sm font-bold flex items-center gap-2 text-slate-300 uppercase tracking-widest">
                  <Sliders className="w-4 h-4 text-blue-500" />
                  Mission Config
                </h2>
                <button 
                  onClick={handleReset}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-slate-300"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-10">
                {/* Category: Spatial Parameters */}
                <div>
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Maximize className="w-3 h-3" />
                    Spatial Parameters
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup 
                      label="N-S Length" id="areaLength" value={inputs.areaLength} unit="mi" 
                      onChange={(v) => setInputs({...inputs, areaLength: v})}
                    />
                    <InputGroup 
                      label="E-W Length" id="areaWidth" value={inputs.areaWidth} unit="mi" 
                      onChange={(v) => setInputs({...inputs, areaWidth: v})}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <InputGroup 
                      label="Avg Elevation" id="terrainElevation" value={inputs.terrainElevation} unit="ft" 
                      onChange={(v) => setInputs({...inputs, terrainElevation: v})}
                    />
                    <InputGroup 
                      label="Map Scale" id="mapScale" value={inputs.mapScale} unit="ratio" 
                      onChange={(v) => setInputs({...inputs, mapScale: v})}
                    />
                  </div>
                </div>

                {/* Category: Camera Specs */}
                <div>
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Camera className="w-3 h-3" />
                    Image Info
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup 
                      label="Focal Length" id="focalLength" value={inputs.focalLength} unit="in" 
                      onChange={(v) => setInputs({...inputs, focalLength: v})}
                    />
                    <InputGroup 
                      label="Scale (1:S)" id="photoScale" value={inputs.photoScale} unit="ratio" 
                      onChange={(v) => setInputs({...inputs, photoScale: v})}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-slate-950/40 rounded-xl border border-slate-800/60">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-4">Photo Dimensions</p>
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup 
                        label="Width (Sw)" id="photoWidth" value={inputs.photoWidth} unit="in" 
                        onChange={(v) => setInputs({...inputs, photoWidth: v})}
                      />
                      <InputGroup 
                        label="Length (Sl)" id="photoLength" value={inputs.photoLength} unit="in" 
                        onChange={(v) => setInputs({...inputs, photoLength: v})}
                      />
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium mt-4 border-t border-slate-800/40 pt-2 whitespace-nowrap">
                      Width affects Sidelap and Length affects Overlap
                    </p>
                  </div>
                </div>

                {/* Category: Flight Settings */}
                <div>
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Wind className="w-3 h-3" />
                    Flight Dynamics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup 
                      label="Over Lap" id="forwardOverlap" value={inputs.forwardOverlap} unit="%" 
                      onChange={(v) => setInputs({...inputs, forwardOverlap: v})}
                    />
                    <InputGroup 
                      label="Side Lap" id="sideLap" value={inputs.sideLap} unit="%" 
                      onChange={(v) => setInputs({...inputs, sideLap: v})}
                    />
                  </div>
                  <div className="mt-4">
                    <InputGroup 
                      label="Ground Speed" id="groundSpeed" value={inputs.groundSpeed} unit="mph" 
                      onChange={(v) => setInputs({...inputs, groundSpeed: v})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Note Callout */}
            <div className="border-l-2 border-blue-500/50 bg-blue-500/5 p-5 rounded-r-2xl">
               <div className="flex items-center gap-2 mb-2">
                 <Info className="w-4 h-4 text-blue-500" />
                 <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                   Academic Note
                 </h3>
               </div>
               <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                 Calculations use standard photogrammetric formulas. Number of photos per line includes a +4 factor (2 extras on each side) to ensure stereoscopic coverage of boundaries.
               </p>
            </div>
          </section>

          {/* Results Section */}
          <section className="lg:col-span-8 space-y-8">
            
            <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-slate-800/60 pb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                Flight Plan Solution
                <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 uppercase no-print">
                  {results.steps.length} steps
                </span>
              </h2>
            </div>

            {/* Result Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
               {[
                 { label: 'Alt. (MSL)', value: results.summary.flyingHeightMSL, sub: 'Target Altitude', icon: <Navigation className="w-3.5 h-3.5" /> },
                 { label: 'Flight Lines', value: results.summary.numLines, sub: 'Course Strips', icon: <Layers className="w-3.5 h-3.5" /> },
                 { label: 'Exp. / Line', value: results.summary.photosPerLine, sub: 'Interval Clicks', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                 { label: 'Total Images', value: results.summary.totalPhotos, sub: 'Mission Total', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
               ].map((item, idx) => (
                 <div key={idx} className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-5 shadow-lg flex flex-col items-center text-center group hover:border-blue-500/30 transition-all">
                   <div className="bg-slate-950 p-2 rounded-lg mb-3 border border-slate-800 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-colors">
                     {React.cloneElement(item.icon, { className: 'w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors' })}
                   </div>
                   <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 mb-2">{item.label}</p>
                   <p className="text-2xl font-mono font-bold text-slate-100 tracking-tight">{item.value}</p>
                   <p className="text-[10px] text-slate-600 mt-1 font-semibold italic">{item.sub}</p>
                 </div>
               ))}
            </div>

            {/* Solution Toggle */}
            <div className="no-print">
              <button 
                onClick={() => setShowSteps(!showSteps)}
                className="w-full flex items-center justify-between p-5 bg-slate-900/40 border border-slate-800/50 rounded-2xl hover:bg-slate-800/60 transition-all group shadow-sm border-dashed"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-500 group-hover:border-blue-500/50 transition-all">
                    {showSteps ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-200 text-base">Step-by-Step Logic</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Procedural Formula Resolution</p>
                  </div>
                </div>
                {!showSteps && (
                  <span className="text-[10px] font-black text-slate-500 border border-slate-700 px-3 py-1.5 rounded-lg uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-all">
                    Inspect Calculations
                  </span>
                )}
              </button>
            </div>

            {/* Steps Container */}
            {(showSteps || window.matchMedia('print').matches) && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 pb-12">
                {results.steps.map((step) => (
                  <StepCard key={step.id} step={step} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950 text-white py-12 mt-12 no-print border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] sm:text-[12px] font-medium tracking-tight text-slate-500">
              {"Developed by "} 
              <span className="text-slate-300 font-bold">Abdullah Al Mamun Akib</span>
              <span className="mx-3 text-slate-800">|</span>
              <span className="text-blue-500/80 font-bold">CEE, SUST</span>
            </p>
          </div>
          <div className="flex items-center gap-6 text-[9px] text-slate-700 font-bold uppercase tracking-[0.25em]">
            <div className="flex items-center gap-2 cursor-default">
              <Github className="w-3 h-3 text-slate-700" />
              Photogrammetry
            </div>
            <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
            <span className="cursor-default">AeroPlan Geomatics © 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
