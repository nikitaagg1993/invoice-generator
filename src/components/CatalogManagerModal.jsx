import React, { useState } from 'react';
import { 
  Database, 
  X, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Download, 
  FileJson, 
  Building2, 
  User, 
  Package, 
  Check,
  RotateCcw
} from 'lucide-react';

export default function CatalogManagerModal({
  isOpen,
  onClose,
  sellers,
  buyers,
  goods,
  onUpdateSellers,
  onUpdateBuyers,
  onUpdateGoods,
  onResetDefaults,
  onSelectSeller,
  onSelectBuyer,
  initialTab = 'sellers'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'sellers', 'buyers', 'goods', 'json'
  const [editItem, setEditItem] = useState(null); // null or item object being edited
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Seller Form State
  const [sellerForm, setSellerForm] = useState({
    name: '',
    address: '',
    gstin: '',
    stateName: '',
    stateCode: '',
    email: '',
    bankDetails: {
      acHolderName: '',
      bankName: '',
      accountNo: '',
      branchIfsc: ''
    }
  });

  // New Buyer Form State
  const [buyerForm, setBuyerForm] = useState({
    name: '',
    address: '',
    gstin: '',
    stateName: '',
    stateCode: '',
    placeOfSupply: ''
  });

  // New Goods Form State
  const [goodsForm, setGoodsForm] = useState({
    name: '',
    hsn: '',
    rate: 1000,
    per: 'Pcs',
    quantity: 1
  });

  if (!isOpen) return null;

  // Save New Seller
  const handleSaveSeller = (e) => {
    e.preventDefault();
    if (!sellerForm.name.trim()) return alert('Please enter Seller Name');

    const newSeller = {
      id: editItem ? editItem.id : `seller-${Date.now()}`,
      name: sellerForm.name.trim(),
      address: sellerForm.address.trim(),
      gstin: sellerForm.gstin.trim(),
      stateName: sellerForm.stateName.trim() || 'Delhi',
      stateCode: sellerForm.stateCode.trim() || '07',
      email: sellerForm.email.trim(),
      bankDetails: {
        acHolderName: sellerForm.bankDetails.acHolderName.trim() || sellerForm.name.trim(),
        bankName: sellerForm.bankDetails.bankName.trim(),
        accountNo: sellerForm.bankDetails.accountNo.trim(),
        branchIfsc: sellerForm.bankDetails.branchIfsc.trim()
      }
    };

    let updatedSellers;
    if (editItem) {
      updatedSellers = sellers.map(s => s.id === editItem.id ? newSeller : s);
    } else {
      updatedSellers = [...sellers, newSeller];
    }

    onUpdateSellers(updatedSellers);
    setIsAddingNew(false);
    setEditItem(null);
    resetSellerForm();
  };

  // Save New Buyer
  const handleSaveBuyer = (e) => {
    e.preventDefault();
    if (!buyerForm.name.trim()) return alert('Please enter Buyer Name');

    const newBuyer = {
      id: editItem ? editItem.id : `buyer-${Date.now()}`,
      name: buyerForm.name.trim(),
      address: buyerForm.address.trim(),
      gstin: buyerForm.gstin.trim(),
      stateName: buyerForm.stateName.trim() || 'West Bengal',
      stateCode: buyerForm.stateCode.trim() || '19',
      placeOfSupply: buyerForm.placeOfSupply.trim() || buyerForm.stateName.trim() || 'West Bengal'
    };

    let updatedBuyers;
    if (editItem) {
      updatedBuyers = buyers.map(b => b.id === editItem.id ? newBuyer : b);
    } else {
      updatedBuyers = [...buyers, newBuyer];
    }

    onUpdateBuyers(updatedBuyers);
    setIsAddingNew(false);
    setEditItem(null);
    resetBuyerForm();
  };

  // Save New Goods Item
  const handleSaveGoods = (e) => {
    e.preventDefault();
    if (!goodsForm.name.trim()) return alert('Please enter Goods Description');

    const newGood = {
      id: editItem ? editItem.id : `good-${Date.now()}`,
      name: goodsForm.name.trim(),
      hsn: goodsForm.hsn.trim() || '8463',
      rate: Number(goodsForm.rate) || 0,
      per: goodsForm.per.trim() || 'Pcs',
      quantity: Number(goodsForm.quantity) || 1
    };

    let updatedGoods;
    if (editItem) {
      updatedGoods = goods.map(g => g.id === editItem.id ? newGood : g);
    } else {
      updatedGoods = [...goods, newGood];
    }

    onUpdateGoods(updatedGoods);
    setIsAddingNew(false);
    setEditItem(null);
    resetGoodsForm();
  };

  // Reset forms
  const resetSellerForm = () => {
    setSellerForm({
      name: '',
      address: '',
      gstin: '',
      stateName: '',
      stateCode: '',
      email: '',
      bankDetails: { acHolderName: '', bankName: '', accountNo: '', branchIfsc: '' }
    });
  };

  const resetBuyerForm = () => {
    setBuyerForm({ name: '', address: '', gstin: '', stateName: '', stateCode: '', placeOfSupply: '' });
  };

  const resetGoodsForm = () => {
    setGoodsForm({ name: '', hsn: '', rate: 1000, per: 'Pcs', quantity: 1 });
  };

  // Delete Seller
  const handleDeleteSeller = (id) => {
    if (sellers.length <= 1) return alert('At least one seller must remain in catalog.');
    if (confirm('Are you sure you want to delete this seller?')) {
      onUpdateSellers(sellers.filter(s => s.id !== id));
    }
  };

  // Delete Buyer
  const handleDeleteBuyer = (id) => {
    if (buyers.length <= 1) return alert('At least one buyer must remain in catalog.');
    if (confirm('Are you sure you want to delete this buyer?')) {
      onUpdateBuyers(buyers.filter(b => b.id !== id));
    }
  };

  // Delete Goods
  const handleDeleteGoods = (id) => {
    if (confirm('Are you sure you want to delete this goods item?')) {
      onUpdateGoods(goods.filter(g => g.id !== id));
    }
  };

  // Edit triggers
  const startEditSeller = (seller) => {
    setEditItem(seller);
    setSellerForm({
      name: seller.name || '',
      address: seller.address || '',
      gstin: seller.gstin || '',
      stateName: seller.stateName || '',
      stateCode: seller.stateCode || '',
      email: seller.email || '',
      bankDetails: {
        acHolderName: seller.bankDetails?.acHolderName || '',
        bankName: seller.bankDetails?.bankName || '',
        accountNo: seller.bankDetails?.accountNo || '',
        branchIfsc: seller.bankDetails?.branchIfsc || ''
      }
    });
    setIsAddingNew(true);
  };

  const startEditBuyer = (buyer) => {
    setEditItem(buyer);
    setBuyerForm({
      name: buyer.name || '',
      address: buyer.address || '',
      gstin: buyer.gstin || '',
      stateName: buyer.stateName || '',
      stateCode: buyer.stateCode || '',
      placeOfSupply: buyer.placeOfSupply || ''
    });
    setIsAddingNew(true);
  };

  const startEditGoods = (good) => {
    setEditItem(good);
    setGoodsForm({
      name: good.name || '',
      hsn: good.hsn || '',
      rate: good.rate || 0,
      per: good.per || 'Pcs',
      quantity: good.quantity || 1
    });
    setIsAddingNew(true);
  };

  // Download JSON helper
  const downloadJsonFile = (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Master Data Catalog & Party Manager
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Add, edit & export Sellers, Buyers, and Goods catalog JSON files
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-900">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('sellers'); setIsAddingNew(false); setEditItem(null); }}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'sellers'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Sellers List ({sellers.length})
            </button>

            <button
              onClick={() => { setActiveTab('buyers'); setIsAddingNew(false); setEditItem(null); }}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'buyers'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Buyers List ({buyers.length})
            </button>

            <button
              onClick={() => { setActiveTab('goods'); setIsAddingNew(false); setEditItem(null); }}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'goods'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Goods Catalog ({goods.length})
            </button>

            <button
              onClick={() => { setActiveTab('json'); setIsAddingNew(false); setEditItem(null); }}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'json'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              Export &amp; Raw JSON
            </button>
          </div>

          <button
            onClick={onResetDefaults}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
            title="Reset to default sellers.json, buyers.json & goods.json"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>
        </div>

        {/* Modal Main Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: SELLERS MANAGER */}
          {activeTab === 'sellers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Manage Seller Profiles (Current User / Suppliers)
                </h4>
                {!isAddingNew && (
                  <button
                    onClick={() => { resetSellerForm(); setEditItem(null); setIsAddingNew(true); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Seller
                  </button>
                )}
              </div>

              {/* Add / Edit Seller Form */}
              {isAddingNew ? (
                <form onSubmit={handleSaveSeller} className="p-4 bg-indigo-50/50 dark:bg-gray-800 rounded-xl border border-indigo-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-100 dark:border-gray-700 pb-2">
                    <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                      {editItem ? 'Edit Seller Details' : 'Create New Seller Profile'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Company / Seller Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PARDEEP ENGG WORKS"
                        value={sellerForm.name}
                        onChange={(e) => setSellerForm({ ...sellerForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">GSTIN / UIN *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 07AAKPK2658Q1Z0"
                        value={sellerForm.gstin}
                        onChange={(e) => setSellerForm({ ...sellerForm, gstin: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">State Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Delhi"
                        value={sellerForm.stateName}
                        onChange={(e) => setSellerForm({ ...sellerForm, stateName: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">State Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 07"
                        value={sellerForm.stateCode}
                        onChange={(e) => setSellerForm({ ...sellerForm, stateCode: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. pardeepenggworks@gmail.com"
                        value={sellerForm.email}
                        onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Registered Address</label>
                      <textarea
                        rows={2}
                        placeholder="B-38, LAWRENCE ROAD INDUSTRIAL AREA, DELHI - 110035"
                        value={sellerForm.address}
                        onChange={(e) => setSellerForm({ ...sellerForm, address: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Bank Details Sub-Form */}
                  <div className="pt-2 border-t border-indigo-100 dark:border-gray-700 space-y-2">
                    <h6 className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 uppercase">Bank Details</h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 mb-0.5">A/c Holder Name</label>
                        <input
                          type="text"
                          value={sellerForm.bankDetails.acHolderName}
                          onChange={(e) => setSellerForm({
                            ...sellerForm,
                            bankDetails: { ...sellerForm.bankDetails, acHolderName: e.target.value }
                          })}
                          className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 mb-0.5">Bank Name</label>
                        <input
                          type="text"
                          placeholder="ICICI Bank"
                          value={sellerForm.bankDetails.bankName}
                          onChange={(e) => setSellerForm({
                            ...sellerForm,
                            bankDetails: { ...sellerForm.bankDetails, bankName: e.target.value }
                          })}
                          className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 mb-0.5">A/c No.</label>
                        <input
                          type="text"
                          placeholder="083005000548"
                          value={sellerForm.bankDetails.accountNo}
                          onChange={(e) => setSellerForm({
                            ...sellerForm,
                            bankDetails: { ...sellerForm.bankDetails, accountNo: e.target.value }
                          })}
                          className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 mb-0.5">Branch & IFS Code</label>
                        <input
                          type="text"
                          placeholder="LAWRENCE ROAD, DELHI & ICIC0000830"
                          value={sellerForm.bankDetails.branchIfsc}
                          onChange={(e) => setSellerForm({
                            ...sellerForm,
                            bankDetails: { ...sellerForm.bankDetails, branchIfsc: e.target.value }
                          })}
                          className="w-full px-2.5 py-1 border border-gray-300 rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Save Seller Profile
                    </button>
                  </div>
                </form>
              ) : null}

              {/* Sellers Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sellers.map((s) => (
                  <div key={s.id} className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-bold text-xs text-gray-900 dark:text-white uppercase">{s.name}</h5>
                        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-semibold whitespace-nowrap">
                          Code: {s.stateCode || '07'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 whitespace-pre-line leading-tight">
                        {s.address}
                      </p>
                      <div className="mt-2 text-[11px] text-gray-700 dark:text-gray-300 space-y-0.5">
                        <div>GSTIN: <span className="font-mono font-semibold">{s.gstin}</span></div>
                        <div>State: <span>{s.stateName}</span></div>
                        {s.bankDetails?.accountNo && (
                          <div className="text-[10px] text-gray-500">Bank: {s.bankDetails.bankName} ({s.bankDetails.accountNo})</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => {
                          onSelectSeller(s);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                      >
                        <Check className="w-3 h-3" /> Select for Bill
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditSeller(s)}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition"
                          title="Edit seller"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSeller(s.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition"
                          title="Delete seller"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BUYERS MANAGER */}
          {activeTab === 'buyers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Manage Buyer Profiles (Bill To Customers)
                </h4>
                {!isAddingNew && (
                  <button
                    onClick={() => { resetBuyerForm(); setEditItem(null); setIsAddingNew(true); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Buyer
                  </button>
                )}
              </div>

              {/* Add / Edit Buyer Form */}
              {isAddingNew ? (
                <form onSubmit={handleSaveBuyer} className="p-4 bg-purple-50/50 dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-100 dark:border-gray-700 pb-2">
                    <h5 className="text-xs font-bold text-purple-900 dark:text-purple-300">
                      {editItem ? 'Edit Buyer Details' : 'Create New Buyer Profile'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Buyer Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SAVITRI CHAINS"
                        value={buyerForm.name}
                        onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">GSTIN / UIN *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 19ACUFS8067M1ZV"
                        value={buyerForm.gstin}
                        onChange={(e) => setBuyerForm({ ...buyerForm, gstin: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">State Name</label>
                      <input
                        type="text"
                        placeholder="e.g. West Bengal"
                        value={buyerForm.stateName}
                        onChange={(e) => setBuyerForm({ ...buyerForm, stateName: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">State Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 19"
                        value={buyerForm.stateCode}
                        onChange={(e) => setBuyerForm({ ...buyerForm, stateCode: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Place of Supply</label>
                      <input
                        type="text"
                        placeholder="e.g. West Bengal"
                        value={buyerForm.placeOfSupply}
                        onChange={(e) => setBuyerForm({ ...buyerForm, placeOfSupply: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
                      <textarea
                        rows={2}
                        placeholder="7A, SHIB KRISHNA DAW LANE, KOLKATA, West Bengal - 700007"
                        value={buyerForm.address}
                        onChange={(e) => setBuyerForm({ ...buyerForm, address: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Save Buyer Profile
                    </button>
                  </div>
                </form>
              ) : null}

              {/* Buyers Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {buyers.map((b) => (
                  <div key={b.id} className="p-3.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-bold text-xs text-gray-900 dark:text-white uppercase">{b.name}</h5>
                        <span className="text-[10px] bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded font-semibold whitespace-nowrap">
                          Code: {b.stateCode || '19'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 whitespace-pre-line leading-tight">
                        {b.address}
                      </p>
                      <div className="mt-2 text-[11px] text-gray-700 dark:text-gray-300 space-y-0.5">
                        <div>GSTIN: <span className="font-mono font-semibold">{b.gstin}</span></div>
                        <div>State: <span>{b.stateName}</span></div>
                        <div>Place of Supply: <span className="italic">{b.placeOfSupply || b.stateName}</span></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => {
                          onSelectBuyer(b);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-800 dark:text-purple-400"
                      >
                        <Check className="w-3 h-3" /> Select for Bill
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditBuyer(b)}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition"
                          title="Edit buyer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBuyer(b.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition"
                          title="Delete buyer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GOODS CATALOG MANAGER */}
          {activeTab === 'goods' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Manage Master Goods &amp; Items Catalog
                </h4>
                {!isAddingNew && (
                  <button
                    onClick={() => { resetGoodsForm(); setEditItem(null); setIsAddingNew(true); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Goods Item
                  </button>
                )}
              </div>

              {/* Add / Edit Goods Form */}
              {isAddingNew ? (
                <form onSubmit={handleSaveGoods} className="p-4 bg-emerald-50/50 dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-100 dark:border-gray-700 pb-2">
                    <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      {editItem ? 'Edit Goods Item' : 'Add New Goods Item to Catalog'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Description of Goods *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tools As Per Sample"
                        value={goodsForm.name}
                        onChange={(e) => setGoodsForm({ ...goodsForm, name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">HSN / SAC Code</label>
                      <input
                        type="text"
                        placeholder="8463"
                        value={goodsForm.hsn}
                        onChange={(e) => setGoodsForm({ ...goodsForm, hsn: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Default Rate (₹)</label>
                      <input
                        type="number"
                        placeholder="6200"
                        value={goodsForm.rate}
                        onChange={(e) => setGoodsForm({ ...goodsForm, rate: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Per / Unit</label>
                      <input
                        type="text"
                        placeholder="Set, Pcs, Mtr"
                        value={goodsForm.per}
                        onChange={(e) => setGoodsForm({ ...goodsForm, per: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Save Goods Item
                    </button>
                  </div>
                </form>
              ) : null}

              {/* Goods Table */}
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Description of Goods</th>
                      <th className="p-3 text-center">HSN/SAC</th>
                      <th className="p-3 text-right">Default Rate (₹)</th>
                      <th className="p-3 text-center">Per (Unit)</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {goods.map((g, idx) => (
                      <tr key={g.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-3 font-semibold text-gray-500">{idx + 1}</td>
                        <td className="p-3 font-bold text-gray-900 dark:text-white">{g.name}</td>
                        <td className="p-3 text-center font-mono">{g.hsn}</td>
                        <td className="p-3 text-right font-semibold">₹{g.rate?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-center">{g.per || 'Pcs'}</td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => startEditGoods(g)}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition"
                            title="Edit item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoods(g.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: EXPORT & RAW JSON FILES */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-600" />
                  Download Updated Master JSON Files
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Save your updated sellers, buyers, and goods master lists back to standard JSON format.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => downloadJsonFile(sellers, 'sellers.json')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download sellers.json
                  </button>

                  <button
                    onClick={() => downloadJsonFile(buyers, 'buyers.json')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download buyers.json
                  </button>

                  <button
                    onClick={() => downloadJsonFile(goods, 'goods.json')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download goods.json
                  </button>
                </div>
              </div>

              {/* Raw JSON Viewers */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-gray-600 dark:text-gray-400">Current Sellers JSON Data</h5>
                <pre className="p-3 bg-gray-950 text-emerald-400 text-xs font-mono rounded-xl max-h-40 overflow-y-auto border border-gray-800">
                  {JSON.stringify(sellers, null, 2)}
                </pre>

                <h5 className="text-xs font-bold text-gray-600 dark:text-gray-400">Current Buyers JSON Data</h5>
                <pre className="p-3 bg-gray-950 text-indigo-300 text-xs font-mono rounded-xl max-h-40 overflow-y-auto border border-gray-800">
                  {JSON.stringify(buyers, null, 2)}
                </pre>

                <h5 className="text-xs font-bold text-gray-600 dark:text-gray-400">Current Goods Catalog JSON Data</h5>
                <pre className="p-3 bg-gray-950 text-cyan-300 text-xs font-mono rounded-xl max-h-40 overflow-y-auto border border-gray-800">
                  {JSON.stringify(goods, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            Changes automatically saved in local memory &amp; browser storage
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
          >
            Close Manager
          </button>
        </div>
      </div>
    </div>
  );
}
