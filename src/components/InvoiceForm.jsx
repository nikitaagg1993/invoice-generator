import React, { useState } from 'react';
import GstDatePicker from './GstDatePicker';
import { 
  Building2, 
  User, 
  Package, 
  FileText, 
  Landmark, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Download, 
  Printer, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function InvoiceForm({
  sellers,
  buyers,
  goods,
  invoiceData,
  onChange,
  onResetSample,
  onDownloadPdf,
  onPrint,
  onOpenCatalogManager
}) {
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'parties', 'items', 'bank'

  // Handle Seller selection dropdown change
  const handleSellerSelect = (e) => {
    const selectedId = e.target.value;
    const found = sellers.find(s => s.id === selectedId);
    if (found) {
      onChange({
        ...invoiceData,
        seller: { ...found },
        bankDetails: { ...(found.bankDetails || {}) }
      });
    }
  };

  // Handle Buyer selection dropdown change
  const handleBuyerSelect = (e) => {
    const selectedId = e.target.value;
    const found = buyers.find(b => b.id === selectedId);
    if (found) {
      // Check if interstate to auto select IGST vs CGST_SGST
      const isInterState = invoiceData.seller?.stateCode !== found.stateCode;
      onChange({
        ...invoiceData,
        buyer: { ...found },
        taxType: isInterState ? 'IGST' : 'CGST_SGST'
      });
    }
  };

  // Add Item from Goods JSON dropdown catalog
  const handleAddGoodFromCatalog = (e) => {
    const goodId = e.target.value;
    if (!goodId) return;
    const item = goods.find(g => g.id === goodId);
    if (item) {
      const newItem = {
        name: item.name,
        hsn: item.hsn,
        quantity: item.quantity || 1,
        rate: item.rate,
        per: item.per || 'Pcs',
        amount: item.rate * (item.quantity || 1)
      };
      onChange({
        ...invoiceData,
        items: [...invoiceData.items, newItem]
      });
    }
    e.target.value = ''; // Reset select
  };

  // Add custom blank item
  const handleAddBlankItem = () => {
    const newItem = {
      name: 'New Custom Item',
      hsn: '8463',
      quantity: 1,
      rate: 1000,
      per: 'Pcs',
      amount: 1000
    };
    onChange({
      ...invoiceData,
      items: [...invoiceData.items, newItem]
    });
  };

  // Update item field
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    const item = { ...updatedItems[index], [field]: value };
    
    // Auto re-calculate amount if quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      const qty = Number(field === 'quantity' ? value : item.quantity) || 0;
      const rate = Number(field === 'rate' ? value : item.rate) || 0;
      item.amount = qty > 0 ? qty * rate : rate;
    }

    updatedItems[index] = item;
    onChange({
      ...invoiceData,
      items: updatedItems
    });
  };

  // Remove item
  const handleRemoveItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    onChange({
      ...invoiceData,
      items: updatedItems
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            GST Invoice Builder
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Fill in fields to generate & preview tax invoice in real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetSample}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
            title="Reset form to match sample PDF"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Sample PDF Data
          </button>
          <button
            onClick={onDownloadPdf}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'general'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          Invoice & Ref Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('parties')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'parties'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Seller & Buyer Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'items'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Package className="w-4 h-4" />
          Goods & Items ({invoiceData.items?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'bank'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Bank & Declaration
        </button>
      </div>

      {/* Tab 1: Invoice & Reference Details */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Invoice No. *
              </label>
              <input
                type="text"
                value={invoiceData.invoiceNo || ''}
                onChange={(e) => onChange({ ...invoiceData, invoiceNo: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="e.g. 813"
              />
            </div>

            <GstDatePicker
              label="Dated"
              value={invoiceData.invoiceDate || ''}
              onChange={(val) => onChange({ ...invoiceData, invoiceDate: val })}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Delivery Note
              </label>
              <input
                type="text"
                value={invoiceData.deliveryNote || ''}
                onChange={(e) => onChange({ ...invoiceData, deliveryNote: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Mode / Terms of Payment
              </label>
              <input
                type="text"
                value={invoiceData.modeTermsPayment || ''}
                onChange={(e) => onChange({ ...invoiceData, modeTermsPayment: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Reference No. & Date.
              </label>
              <input
                type="text"
                value={invoiceData.refNoDate || ''}
                onChange={(e) => onChange({ ...invoiceData, refNoDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Other References
              </label>
              <input
                type="text"
                value={invoiceData.otherReferences || ''}
                onChange={(e) => onChange({ ...invoiceData, otherReferences: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Buyer's Order No.
              </label>
              <input
                type="text"
                value={invoiceData.buyersOrderNo || ''}
                onChange={(e) => onChange({ ...invoiceData, buyersOrderNo: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <GstDatePicker
              label="Buyer's Order Date"
              value={invoiceData.buyersOrderDate || ''}
              onChange={(val) => onChange({ ...invoiceData, buyersOrderDate: val })}
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Dispatch Doc No.
              </label>
              <input
                type="text"
                value={invoiceData.dispatchDocNo || ''}
                onChange={(e) => onChange({ ...invoiceData, dispatchDocNo: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <GstDatePicker
              label="Delivery Note Date"
              value={invoiceData.deliveryNoteDate || ''}
              onChange={(val) => onChange({ ...invoiceData, deliveryNoteDate: val })}
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Dispatched through
              </label>
              <input
                type="text"
                value={invoiceData.dispatchedThrough || ''}
                onChange={(e) => onChange({ ...invoiceData, dispatchedThrough: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Destination
              </label>
              <input
                type="text"
                value={invoiceData.destination || ''}
                onChange={(e) => onChange({ ...invoiceData, destination: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Terms of Delivery
            </label>
            <textarea
              rows={2}
              value={invoiceData.termsOfDelivery || ''}
              onChange={(e) => onChange({ ...invoiceData, termsOfDelivery: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Parties (Seller & Buyer selection + custom edits) */}
      {activeTab === 'parties' && (
        <div className="space-y-6">
          {/* Seller Section */}
          <div className="p-4 bg-indigo-50/50 dark:bg-gray-800/50 rounded-xl border border-indigo-100 dark:border-gray-700 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Seller (Current User / Static JSON List)
              </h3>
              <div className="flex items-center gap-2">
                <select
                  onChange={handleSellerSelect}
                  value={sellers.find(s => s.name === invoiceData.seller?.name)?.id || ''}
                  className="text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  <option value="" disabled>Select Preset Seller...</option>
                  {sellers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.stateName})</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onOpenCatalogManager && onOpenCatalogManager('sellers')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  title="Add or Manage Sellers"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Seller
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">Seller Company Name</label>
                <input
                  type="text"
                  value={invoiceData.seller?.name || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    seller: { ...invoiceData.seller, name: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">GSTIN / UIN</label>
                <input
                  type="text"
                  value={invoiceData.seller?.gstin || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    seller: { ...invoiceData.seller, gstin: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">State Name</label>
                <input
                  type="text"
                  value={invoiceData.seller?.stateName || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    seller: { ...invoiceData.seller, stateName: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">State Code</label>
                <input
                  type="text"
                  value={invoiceData.seller?.stateCode || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    seller: { ...invoiceData.seller, stateCode: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">Address</label>
                <textarea
                  rows={2}
                  value={invoiceData.seller?.address || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    seller: { ...invoiceData.seller, address: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Buyer Section */}
          <div className="p-4 bg-purple-50/50 dark:bg-gray-800/50 rounded-xl border border-purple-100 dark:border-gray-700 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Buyer (Bill to / Static JSON List)
              </h3>
              <div className="flex items-center gap-2">
                <select
                  onChange={handleBuyerSelect}
                  value={buyers.find(b => b.name === invoiceData.buyer?.name)?.id || ''}
                  className="text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 py-1.5 font-medium"
                >
                  <option value="" disabled>Select Preset Buyer...</option>
                  {buyers.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.stateName})</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => onOpenCatalogManager && onOpenCatalogManager('buyers')}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                  title="Add or Manage Buyers"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buyer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">Buyer Company Name</label>
                <input
                  type="text"
                  value={invoiceData.buyer?.name || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    buyer: { ...invoiceData.buyer, name: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">GSTIN / UIN</label>
                <input
                  type="text"
                  value={invoiceData.buyer?.gstin || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    buyer: { ...invoiceData.buyer, gstin: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">State Name</label>
                <input
                  type="text"
                  value={invoiceData.buyer?.stateName || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    buyer: { ...invoiceData.buyer, stateName: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">Place of Supply</label>
                <input
                  type="text"
                  value={invoiceData.buyer?.placeOfSupply || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    buyer: { ...invoiceData.buyer, placeOfSupply: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">Address</label>
                <textarea
                  rows={2}
                  value={invoiceData.buyer?.address || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    buyer: { ...invoiceData.buyer, address: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Goods & Line Items */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Quick Add from Goods JSON Catalog:
              </label>
              <select
                onChange={handleAddGoodFromCatalog}
                defaultValue=""
                className="text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 py-1.5 font-medium"
              >
                <option value="" disabled>Select item to add...</option>
                {goods.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name} (HSN: {g.hsn} - ₹{g.rate})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Bill GST Rate:</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={invoiceData.invoiceTaxRate ?? 18}
                    onChange={(e) => onChange({ ...invoiceData, invoiceTaxRate: Number(e.target.value) })}
                    className="w-14 px-2 py-1 text-xs font-bold text-center border border-gray-300 dark:border-gray-700 rounded-l-lg dark:bg-gray-900 dark:text-white"
                  />
                  <span className="bg-gray-200 dark:bg-gray-700 px-1.5 py-1 text-xs font-bold border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-lg">
                    %
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Tax Type:</span>
                <select
                  value={invoiceData.taxType || 'IGST'}
                  onChange={(e) => onChange({ ...invoiceData, taxType: e.target.value })}
                  className="text-xs font-bold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-indigo-600 dark:text-indigo-400"
                >
                  <option value="IGST">IGST (Inter-State)</option>
                  <option value="CGST_SGST">CGST + SGST (Intra-State)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddBlankItem}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {invoiceData.items?.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                    Item #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Description of Goods</label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-0.5">HSN / SAC</label>
                    <input
                      type="text"
                      value={item.hsn || ''}
                      onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                      className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Rate (₹)</label>
                    <input
                      type="number"
                      value={item.rate || ''}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Per (Unit)</label>
                    <input
                      type="text"
                      value={item.per || ''}
                      onChange={(e) => handleItemChange(index, 'per', e.target.value)}
                      className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white text-center"
                      placeholder="e.g. Set, Pcs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Taxable Amount (₹)</label>
                    <input
                      type="number"
                      value={item.amount || 0}
                      onChange={(e) => handleItemChange(index, 'amount', Number(e.target.value))}
                      className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white font-semibold text-right"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Bank Details & Declaration */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/50 dark:bg-gray-800/50 rounded-xl border border-emerald-100 dark:border-gray-700 space-y-3">
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              Company's Bank Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">A/c Holder's Name</label>
                <input
                  type="text"
                  value={invoiceData.bankDetails?.acHolderName || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    bankDetails: { ...invoiceData.bankDetails, acHolderName: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">Bank Name</label>
                <input
                  type="text"
                  value={invoiceData.bankDetails?.bankName || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    bankDetails: { ...invoiceData.bankDetails, bankName: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">A/c No.</label>
                <input
                  type="text"
                  value={invoiceData.bankDetails?.accountNo || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    bankDetails: { ...invoiceData.bankDetails, accountNo: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-400 mb-1 font-medium">Branch & IFS Code</label>
                <input
                  type="text"
                  value={invoiceData.bankDetails?.branchIfsc || ''}
                  onChange={(e) => onChange({
                    ...invoiceData,
                    bankDetails: { ...invoiceData.bankDetails, branchIfsc: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Declaration Text
            </label>
            <textarea
              rows={3}
              value={invoiceData.declaration || ''}
              onChange={(e) => onChange({ ...invoiceData, declaration: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
