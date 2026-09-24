import React, { useState } from 'react';
import { Database, X, Plus, Trash2, Edit2, Save, FileJson } from 'lucide-react';

export default function JsonDataModal({
  isOpen,
  onClose,
  sellers,
  buyers,
  goods,
  onUpdateSellers,
  onUpdateBuyers,
  onUpdateGoods
}) {
  const [activeCatalog, setActiveCatalog] = useState('sellers'); // 'sellers', 'buyers', 'goods'
  const [jsonText, setJsonText] = useState('');
  const [isEditingRawJson, setIsEditingRawJson] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const getActiveData = () => {
    if (activeCatalog === 'sellers') return sellers;
    if (activeCatalog === 'buyers') return buyers;
    return goods;
  };

  const handleOpenRawEdit = () => {
    setJsonText(JSON.stringify(getActiveData(), null, 2));
    setIsEditingRawJson(true);
    setErrorMsg('');
  };

  const handleSaveRawJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setErrorMsg('Data must be a JSON array of objects');
        return;
      }
      if (activeCatalog === 'sellers') onUpdateSellers(parsed);
      else if (activeCatalog === 'buyers') onUpdateBuyers(parsed);
      else onUpdateGoods(parsed);

      setIsEditingRawJson(false);
      setErrorMsg('');
    } catch (e) {
      setErrorMsg('Invalid JSON syntax: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Manage Master JSON Data Catalogs
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-900">
          <div className="flex space-x-1">
            <button
              onClick={() => { setActiveCatalog('sellers'); setIsEditingRawJson(false); }}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeCatalog === 'sellers'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sellers JSON ({sellers.length})
            </button>
            <button
              onClick={() => { setActiveCatalog('buyers'); setIsEditingRawJson(false); }}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeCatalog === 'buyers'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Buyers JSON ({buyers.length})
            </button>
            <button
              onClick={() => { setActiveCatalog('goods'); setIsEditingRawJson(false); }}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeCatalog === 'goods'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Goods Catalog JSON ({goods.length})
            </button>
          </div>

          <button
            onClick={isEditingRawJson ? handleSaveRawJson : handleOpenRawEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-100 transition"
          >
            {isEditingRawJson ? <Save className="w-3.5 h-3.5" /> : <FileJson className="w-3.5 h-3.5" />}
            {isEditingRawJson ? 'Save JSON Changes' : 'Edit Raw JSON'}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1 overflow-y-auto">
          {errorMsg && (
            <div className="mb-3 p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          {isEditingRawJson ? (
            <textarea
              rows={16}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full font-mono text-xs p-3 bg-gray-950 text-emerald-400 rounded-xl border border-gray-800 focus:outline-none"
            />
          ) : (
            <div className="space-y-3">
              <pre className="p-4 bg-gray-950 text-gray-200 text-xs font-mono rounded-xl overflow-x-auto border border-gray-800">
                {JSON.stringify(getActiveData(), null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
