import React, { useState } from 'react';
import initialSellers from './data/sellers.json';
import initialBuyers from './data/buyers.json';
import initialGoods from './data/goods.json';

import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import CatalogManagerModal from './components/CatalogManagerModal';
import { exportInvoiceToPdf } from './utils/exportPdf';
import { 
  FileText, 
  Printer, 
  Download, 
  Database, 
  Eye, 
  Edit3, 
  Layers
} from 'lucide-react';

export default function App() {
  // Load sellers from localStorage or default JSON
  const [sellers, setSellers] = useState(() => {
    try {
      const saved = localStorage.getItem('gst_sellers');
      return saved ? JSON.parse(saved) : initialSellers;
    } catch (e) {
      return initialSellers;
    }
  });

  // Load buyers from localStorage or default JSON
  const [buyers, setBuyers] = useState(() => {
    try {
      const saved = localStorage.getItem('gst_buyers');
      return saved ? JSON.parse(saved) : initialBuyers;
    } catch (e) {
      return initialBuyers;
    }
  });

  // Load goods from localStorage or default JSON
  const [goods, setGoods] = useState(() => {
    try {
      const saved = localStorage.getItem('gst_goods');
      return saved ? JSON.parse(saved) : initialGoods;
    } catch (e) {
      return initialGoods;
    }
  });

  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogInitialTab, setCatalogInitialTab] = useState('sellers');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'form', 'preview'

  // Persistent state updates
  const handleUpdateSellers = (newSellers) => {
    setSellers(newSellers);
    localStorage.setItem('gst_sellers', JSON.stringify(newSellers));
  };

  const handleUpdateBuyers = (newBuyers) => {
    setBuyers(newBuyers);
    localStorage.setItem('gst_buyers', JSON.stringify(newBuyers));
  };

  const handleUpdateGoods = (newGoods) => {
    setGoods(newGoods);
    localStorage.setItem('gst_goods', JSON.stringify(newGoods));
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset sellers, buyers, and goods catalog to default initial JSON?')) {
      localStorage.removeItem('gst_sellers');
      localStorage.removeItem('gst_buyers');
      localStorage.removeItem('gst_goods');
      setSellers(initialSellers);
      setBuyers(initialBuyers);
      setGoods(initialGoods);
    }
  };

  const handleOpenCatalogModal = (tab = 'sellers') => {
    setCatalogInitialTab(tab);
    setIsCatalogModalOpen(true);
  };

  // Default sample invoice state matching user's PDF exact values
  const defaultInvoiceState = {
    seller: sellers[0] || initialSellers[0],
    buyer: buyers[0] || initialBuyers[0],
    invoiceNo: '813',
    invoiceDate: '22-Sep-26',
    deliveryNote: '',
    modeTermsPayment: '',
    refNoDate: '',
    otherReferences: '',
    buyersOrderNo: '',
    buyersOrderDate: '',
    dispatchDocNo: '',
    deliveryNoteDate: '',
    dispatchedThrough: '',
    destination: '',
    termsOfDelivery: '',
    items: [
      {
        name: 'Tools As Per Sample',
        hsn: '8463',
        quantity: '',
        rate: '',
        per: '',
        amount: 6200.00
      }
    ],
    taxType: 'IGST',
    invoiceTaxRate: 18, // Single GST rate applicable on entire bill total
    bankDetails: (sellers[0] || initialSellers[0]).bankDetails || {
      acHolderName: 'PARDEEP ENGG WORKS',
      bankName: 'ICICI Bank',
      accountNo: '083005000548',
      branchIfsc: 'LAWRENCE ROAD, DELHI & ICIC0000830'
    },
    declaration: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.'
  };

  const [invoiceData, setInvoiceData] = useState(defaultInvoiceState);

  const handleResetSample = () => {
    setInvoiceData({
      ...defaultInvoiceState,
      seller: sellers[0] || initialSellers[0],
      buyer: buyers[0] || initialBuyers[0],
      bankDetails: (sellers[0] || initialSellers[0]).bankDetails
    });
  };

  const handleDownloadPdf = () => {
    const filename = `Invoice_${invoiceData.invoiceNo || '813'}_${invoiceData.buyer?.name?.replace(/\s+/g, '_') || 'Buyer'}.pdf`;
    exportInvoiceToPdf('invoice-paper', filename);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectSeller = (selectedSeller) => {
    setInvoiceData({
      ...invoiceData,
      seller: selectedSeller,
      bankDetails: selectedSeller.bankDetails || invoiceData.bankDetails
    });
  };

  const handleSelectBuyer = (selectedBuyer) => {
    const isInterState = invoiceData.seller?.stateCode !== selectedBuyer.stateCode;
    setInvoiceData({
      ...invoiceData,
      buyer: selectedBuyer,
      taxType: isInterState ? 'IGST' : 'CGST_SGST'
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                GST Invoice Generator
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  React FE
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Pardeep Engg Works &amp; Multi-Seller GST Tax Invoice Studio
              </p>
            </div>
          </div>

          {/* View Toggles & Actions */}
          <div className="flex items-center gap-2">
            {/* View Mode Selectors (Desktop) */}
            <div className="hidden md:flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  viewMode === 'split'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Split View
              </button>
              <button
                onClick={() => setViewMode('form')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  viewMode === 'form'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Form Only
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  viewMode === 'preview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                PDF Preview
              </button>
            </div>

            {/* Manage Master Catalog Manager Button */}
            <button
              onClick={() => handleOpenCatalogModal('sellers')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Add, Edit & Export JSON Data for Sellers, Buyers, Goods"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Manage Catalogs &amp; JSON</span>
            </button>

            {/* Native Print */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Print directly or save as PDF via browser"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Primary Download PDF */}
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 gap-6">
        {/* Responsive Mobile View Selector */}
        <div className="md:hidden flex bg-slate-800 p-1 rounded-xl border border-slate-700 no-print">
          <button
            onClick={() => setViewMode('form')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              viewMode === 'form' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Edit Form
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Live PDF Preview
          </button>
        </div>

        {/* Content Layout based on viewMode */}
        <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'lg:grid-cols-12' : ''} gap-6 items-start`}>
          {/* Form Column */}
          <div className={`${viewMode === 'form' || viewMode === 'split' ? 'block' : 'hidden'} ${viewMode === 'split' ? 'lg:col-span-6 xl:col-span-5' : 'max-w-3xl mx-auto w-full'} no-print`}>
            <InvoiceForm
              sellers={sellers}
              buyers={buyers}
              goods={goods}
              invoiceData={invoiceData}
              onChange={setInvoiceData}
              onResetSample={handleResetSample}
              onDownloadPdf={handleDownloadPdf}
              onPrint={handlePrint}
              onOpenCatalogManager={handleOpenCatalogModal}
            />
          </div>

          {/* Preview Column */}
          <div className={`${viewMode === 'preview' || viewMode === 'split' ? 'flex' : 'hidden'} ${viewMode === 'split' ? 'lg:col-span-6 xl:col-span-7' : 'w-full'} flex-col items-center overflow-x-auto py-2`}>
            <div className="w-full flex items-center justify-between mb-3 px-2 no-print">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-300">Live Tax Invoice Preview</span>
              </div>
              <span className="text-[11px] text-slate-400">A4 Printable Format (210mm x 297mm)</span>
            </div>

            {/* Invoice Paper Component */}
            <div className="bg-slate-950 p-2 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl max-w-full overflow-x-auto">
              <InvoicePreview invoiceData={invoiceData} />
            </div>
          </div>
        </div>
      </main>

      {/* Catalog & Party Master Manager Modal */}
      <CatalogManagerModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        sellers={sellers}
        buyers={buyers}
        goods={goods}
        onUpdateSellers={handleUpdateSellers}
        onUpdateBuyers={handleUpdateBuyers}
        onUpdateGoods={handleUpdateGoods}
        onResetDefaults={handleResetDefaults}
        onSelectSeller={handleSelectSeller}
        onSelectBuyer={handleSelectBuyer}
        initialTab={catalogInitialTab}
      />
    </div>
  );
}
