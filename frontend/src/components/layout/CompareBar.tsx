import { useNavigate } from 'react-router-dom';
import { GitCompare, X } from 'lucide-react';
import { useCompareStore } from '../../stores';

export function CompareBar() {
  const { ids, names, remove, clear } = useCompareStore();
  const navigate = useNavigate();

  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div className="bg-primary-900 text-white rounded-2xl shadow-2xl shadow-primary-900/40 px-5 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <GitCompare size={16} className="text-primary-300" />
          <span className="text-sm font-medium text-primary-200">Comparing</span>
        </div>

        <div className="flex items-center gap-2">
          {ids.map((id) => (
            <div key={id} className="flex items-center gap-1.5 bg-primary-800 rounded-lg px-2.5 py-1">
              <span className="text-xs font-medium max-w-[120px] truncate">{names[id]}</span>
              <button onClick={() => remove(id)} className="text-primary-400 hover:text-white transition-colors">
                <X size={12} />
              </button>
            </div>
          ))}

          {ids.length < 3 && (
            <div className="flex items-center gap-1.5 border border-dashed border-primary-600 rounded-lg px-2.5 py-1">
              <span className="text-xs text-primary-400">+Add more</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => navigate('/compare')}
            disabled={ids.length < 2}
            className="bg-white text-primary-900 text-sm font-semibold px-4 py-1.5 rounded-xl hover:bg-primary-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Compare Now
          </button>
          <button onClick={clear} className="p-1.5 rounded-lg text-primary-400 hover:text-white hover:bg-primary-800 transition-colors">
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
