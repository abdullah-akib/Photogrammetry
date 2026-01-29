
import React from 'react';

interface InputGroupProps {
  label: string;
  id: string;
  value: string;
  unit: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, id, value, unit, onChange, icon }) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 ml-0.5">
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
      </label>
      <div className="relative group">
        <input
          id={id}
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className="w-full h-11 bg-slate-800/40 border border-slate-700/50 rounded-lg pl-3 pr-12 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all hover:bg-slate-800/60"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/30 uppercase tracking-tighter">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputGroup;
