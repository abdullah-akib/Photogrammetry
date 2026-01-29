
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Code2, Calculator } from 'lucide-react';

interface StepCardProps {
  step: {
    id: string;
    title: string;
    formula: string;
    substitution: string;
    result: string;
  };
}

const StepCard: React.FC<StepCardProps> = ({ step }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl overflow-hidden transition-all duration-200 shadow-lg">
      <div 
        className="p-5 flex items-center justify-between cursor-pointer select-none bg-slate-900/60 hover:bg-slate-800/80 transition-colors border-b border-slate-800/40"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950 text-blue-500 font-mono font-bold text-xs border border-slate-800 shadow-inner uppercase">
            {step.id}
          </span>
          <h3 className="font-bold text-sm text-slate-200 tracking-tight">{step.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3 h-3" />
                  Formula Model
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                  <code className="text-xs md:text-sm text-blue-400 font-mono leading-relaxed">
                    {step.formula}
                  </code>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2 flex items-center gap-1.5">
                  <Calculator className="w-3 h-3" />
                  Substitution Logic
                </p>
                <p className="text-xs text-slate-400 italic bg-slate-900/30 p-3 rounded-lg border border-slate-800/40">
                  {step.substitution}
                </p>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col justify-center items-center md:items-end md:text-right border-t md:border-t-0 md:border-l border-slate-800/60 pt-6 md:pt-0 md:pl-8">
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2">Resolved Result</p>
              <p className="text-3xl font-mono font-black text-blue-500 tracking-tighter drop-shadow-sm">{step.result}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepCard;
