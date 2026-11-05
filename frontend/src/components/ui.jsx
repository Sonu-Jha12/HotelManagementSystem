import { useState } from 'react';

const colors = { available: 'bg-emerald-100 text-emerald-800', maintenance: 'bg-orange-100 text-orange-800', reserved: 'bg-sky-100 text-sky-800',
  'checked-in': 'bg-emerald-100 text-emerald-800', 'checked-out': 'bg-slate-200 text-slate-700', cancelled: 'bg-red-100 text-red-700',
  admin: 'bg-violet-100 text-violet-800', staff: 'bg-slate-200 text-slate-700' };
export const Badge = ({ value }) => <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[value]}`}>{value}</span>;

export const PageHeader = ({ title, children }) => (
  <div className="flex items-center justify-between mb-6"><h2 className="font-head text-3xl text-ink">{title}</h2><div>{children}</div></div>
);

export function Table({ heads, rows, empty = 'Nothing here yet. Use the button above to add the first one.' }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-slate-500 border-b"><tr>{heads.map(h => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows : <tr><td colSpan={heads.length} className="p-6 text-center text-slate-500">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
export const Row = ({ cells }) => <tr className="border-b last:border-0">{cells.map((c, i) => <td key={i} className="p-3">{c}</td>)}</tr>;

// Generic modal form. fields: [{name,label,type,options:[[value,text]],required}]
export function FormModal({ title, fields, values = {}, onSave, onClose, onChange }) {
  const [data, setData] = useState(() => Object.fromEntries(fields.map(f => [f.name, values[f.name] ?? f.value ?? (f.options ? f.options[0]?.[0] : '')])));
  const [err, setErr] = useState('');
  const set = (k, v) => { const next = { ...data, [k]: v }; setData(next); onChange?.(next); };
  // A select whose options changed (e.g. rooms for new dates) falls back to its first option.
  const val = f => f.options ? (f.options.some(o => o[0] === data[f.name]) ? data[f.name] : f.options[0]?.[0] ?? '') : data[f.name];
  const submit = async e => {
    e.preventDefault();
    try { await onSave(Object.fromEntries(fields.map(f => [f.name, val(f)]))); onClose(true); } catch (x) { setErr(x.message); }
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-10">
      <form onSubmit={submit} className="bg-white rounded-xl p-6 w-full max-w-md space-y-3 max-h-[90vh] overflow-y-auto">
        <h3 className="font-head text-xl text-ink">{title}</h3>
        {fields.map(f => (
          <label key={f.name} className="block">
            <span className="text-sm text-slate-600">{f.label}</span>
            {f.options ? (
              <select className="inp" value={val(f)} onChange={e => set(f.name, e.target.value)} required={f.required !== false}>
                {f.options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
              </select>
            ) : (
              <input className="inp" type={f.type || 'text'} value={data[f.name]} required={f.required} min={f.min}
                onChange={e => set(f.name, e.target.value)} />
            )}
          </label>
        ))}
        <p className="text-red-600 text-sm">{err}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-o" onClick={() => onClose(false)}>Cancel</button>
          <button className="btn">Save</button>
        </div>
      </form>
    </div>
  );
}
