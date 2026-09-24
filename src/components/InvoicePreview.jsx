import React from 'react';
import { numberToWordsINR } from '../utils/numberToWords';

export default function InvoicePreview({ invoiceData }) {
  const {
    seller = {},
    buyer = {},
    invoiceNo = '813',
    invoiceDate = '22-Sep-26',
    deliveryNote = '',
    modeTermsPayment = '',
    refNoDate = '',
    otherReferences = '',
    buyersOrderNo = '',
    buyersOrderDate = '',
    dispatchDocNo = '',
    deliveryNoteDate = '',
    dispatchedThrough = '',
    destination = '',
    termsOfDelivery = '',
    items = [],
    taxType = 'IGST', // 'IGST' or 'CGST_SGST'
    invoiceTaxRate = 18, // Single GST rate applicable on entire bill
    bankDetails = {},
    declaration = 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.'
  } = invoiceData;

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const totalTaxAmount = (subtotal * (Number(invoiceTaxRate) || 0)) / 100;
  const grandTotal = subtotal + totalTaxAmount;

  // Group items by HSN/SAC for breakdown table
  const hsnSummary = items.reduce((acc, item) => {
    const hsn = item.hsn || 'N/A';
    const taxableVal = Number(item.amount) || 0;
    const taxAmt = (taxableVal * (Number(invoiceTaxRate) || 0)) / 100;

    if (!acc[hsn]) {
      acc[hsn] = {
        hsn,
        taxableValue: 0,
        taxRate: invoiceTaxRate,
        taxAmount: 0
      };
    }
    acc[hsn].taxableValue += taxableVal;
    acc[hsn].taxAmount += taxAmt;
    return acc;
  }, {});

  const hsnList = Object.values(hsnSummary);

  const grandTotalWords = numberToWordsINR(grandTotal);
  const taxAmountWords = numberToWordsINR(totalTaxAmount);

  // Format currency helper
  const formatNum = (val) => {
    if (val === undefined || val === null || isNaN(val) || val === '') return '';
    return Number(val).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Printable Paper Canvas */}
      <div
        id="invoice-paper"
        className="w-[210mm] bg-white text-black p-[6mm] sm:p-[8mm] shadow-xl border border-gray-200 print:shadow-none print:border-none print:p-0 box-border font-sans text-[11px] leading-[1.35] relative"
        style={{ fontFamily: 'Calibri, Arial, sans-serif' }}
      >
        {/* Title Header */}
        <div className="text-center font-bold text-[15px] mb-1">
          Tax Invoice
        </div>

        {/* Outer Main Border Box */}
        <div className="border border-black border-collapse text-[11px]">
          {/* Top Section: 2 Columns (Left: Seller/Buyer, Right: Ref/Invoice Meta) */}
          <div className="grid grid-cols-12 border-b border-black">
            {/* Left Box (Seller & Buyer) - 6 cols */}
            <div className="col-span-6 border-r border-black flex flex-col justify-between">
              {/* Seller details */}
              <div className="p-2 border-b border-black min-h-[110px]">
                <div className="font-bold text-[12px] uppercase">{seller.name || 'PARDEEP ENGG WORKS'}</div>
                <div className="whitespace-pre-line text-[11px]">
                  {seller.address || 'B-38, LAWRENCE ROAD INDUSTRIAL AREA\nDELHI - 110035'}
                </div>
                <div>GSTIN/UIN: <span className="font-semibold">{seller.gstin || '07AAKPK2658Q1Z0'}</span></div>
                <div>State Name : {seller.stateName || 'Delhi'}, Code : {seller.stateCode || '07'}</div>
                {seller.email && <div>E-Mail : {seller.email}</div>}
              </div>

              {/* Buyer details */}
              <div className="p-2 min-h-[120px]">
                <div className="text-[10px] text-gray-700 italic mb-0.5">Buyer (Bill to)</div>
                <div className="font-bold text-[12px] uppercase">{buyer.name || 'SAVITRI CHAINS'}</div>
                <div className="whitespace-pre-line text-[11px]">
                  {buyer.address || '7A, SHIB KRISHNA DAW LANE, KOLKATA,\nWest Bengal - 700007'}
                </div>
                <div className="flex">
                  <span className="w-24">GSTIN/UIN</span>
                  <span>: <strong className="font-semibold">{buyer.gstin || '19ACUFS8067M1ZV'}</strong></span>
                </div>
                <div className="flex">
                  <span className="w-24">State Name</span>
                  <span>: {buyer.stateName || 'West Bengal'}, Code : {buyer.stateCode || '19'}</span>
                </div>
                <div className="flex">
                  <span className="w-24">Place of Supply</span>
                  <span>: {buyer.placeOfSupply || 'West Bengal'}</span>
                </div>
              </div>
            </div>

            {/* Right Box (Grid of 2 sub-columns for metadata) - 6 cols */}
            <div className="col-span-6 text-[10.5px]">
              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-1 border-r border-black min-h-[38px]">
                  <div className="text-[9.5px] text-gray-600">Invoice No.</div>
                  <div className="font-bold text-[11.5px]">{invoiceNo}</div>
                </div>
                <div className="p-1 min-h-[38px]">
                  <div className="text-[9.5px] text-gray-600">Dated</div>
                  <div className="font-bold text-[11.5px]">{invoiceDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-1 border-r border-black min-h-[34px]">
                  <div className="text-[9.5px] text-gray-600">Delivery Note</div>
                  <div>{deliveryNote || ' '}</div>
                </div>
                <div className="p-1 min-h-[34px]">
                  <div className="text-[9.5px] text-gray-600">Mode/Terms of Payment</div>
                  <div>{modeTermsPayment || ' '}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-1 border-r border-black min-h-[34px]">
                  <div className="text-[9.5px] text-gray-600">Reference No. & Date.</div>
                  <div>{refNoDate || ' '}</div>
                </div>
                <div className="p-1 min-h-[34px]">
                  <div className="text-[9.5px] text-gray-600">Other References</div>
                  <div>{otherReferences || ' '}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-1 border-r border-black min-h-[34px]">
                  <div className="text-[9.5px] text-gray-600">Buyer's Order No.</div>
                  <div>{buyersOrderNo || ' '}</div>
                </div>
                <div className="p-1 min-h-[34px]">
                  <div className="text-[9.5px] text-gray-600">Dated</div>
                  <div>{buyersOrderDate || ' '}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-1 border-r border-black min-h-[34px]">
                  <div className="text-[9.5px] text-gray-600">Dispatch Doc No.</div>
                  <div>{dispatchDocNo || ' '}</div>
                </div>
                <div className="p-1 min-h-[34px]">
                  <div className="text-[9.5px]" style={{ color: '#4b5563' }}>Delivery Note Date</div>
                  <div>{deliveryNoteDate || ' '}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-black">
                <div className="p-1 border-r border-black min-h-[34px]">
                  <div className="text-[9.5px] text-gray-600">Dispatched through</div>
                  <div>{dispatchedThrough || ' '}</div>
                </div>
                <div className="p-1 min-h-[34px]">
                  <div className="text-[9.5px] text-gray-600">Destination</div>
                  <div>{destination || ' '}</div>
                </div>
              </div>

              <div className="p-1 min-h-[40px]">
                <div className="text-[9.5px] text-gray-600">Terms of Delivery</div>
                <div>{termsOfDelivery || ' '}</div>
              </div>
            </div>
          </div>

          {/* Table of Goods Header */}
          <div className="grid grid-cols-12 border-b border-black font-semibold text-[10px] text-center bg-gray-50/50">
            <div className="col-span-1 border-r border-black p-1">Sl<br />No.</div>
            <div className="col-span-4 border-r border-black p-1 text-left">Description of Goods</div>
            <div className="col-span-2 border-r border-black p-1">HSN/SAC</div>
            <div className="col-span-1 border-r border-black p-1">Quantity</div>
            <div className="col-span-1 border-r border-black p-1">Rate</div>
            <div className="col-span-1 border-r border-black p-1">per</div>
            <div className="col-span-2 p-1 text-right">Amount</div>
          </div>

          {/* Table Body with Min Height to Match Traditional Tally Layout */}
          <div className="grid grid-cols-12 min-h-[200px] text-[11px] relative">
            {/* Columns Vertical Grid Borders Background */}
            <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
              <div className="col-span-1 border-r border-black"></div>
              <div className="col-span-4 border-r border-black"></div>
              <div className="col-span-2 border-r border-black"></div>
              <div className="col-span-1 border-r border-black"></div>
              <div className="col-span-1 border-r border-black"></div>
              <div className="col-span-1 border-r border-black"></div>
              <div className="col-span-2"></div>
            </div>

            {/* Items Rows */}
            <div className="col-span-12 z-10 flex flex-col justify-between h-full">
              <div>
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 pt-1 pb-1">
                    <div className="col-span-1 text-center">{idx + 1}</div>
                    <div className="col-span-4 font-bold px-1.5">{item.name}</div>
                    <div className="col-span-2 text-center">{item.hsn}</div>
                    <div className="col-span-1 text-center">{item.quantity ? `${item.quantity}` : ''}</div>
                    <div className="col-span-1 text-right pr-1">{item.rate ? formatNum(item.rate) : ''}</div>
                    <div className="col-span-1 text-center">{item.per || ''}</div>
                    <div className="col-span-2 text-right font-bold pr-1.5">{formatNum(item.amount)}</div>
                  </div>
                ))}
              </div>

              {/* Single GST Row added on entire bill total */}
              <div className="pt-2 pb-2">
                {taxType === 'IGST' ? (
                  <div className="grid grid-cols-12 pb-1 text-[10.5px]">
                    <div className="col-span-1"></div>
                    <div className="col-span-4 px-1.5 italic font-bold text-right pr-6">
                      IGST {invoiceTaxRate}%
                    </div>
                    <div className="col-span-2"></div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1"></div>
                    <div className="col-span-2 text-right font-bold pr-1.5">
                      {formatNum(totalTaxAmount)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-12 pb-0.5 text-[10.5px]">
                      <div className="col-span-1"></div>
                      <div className="col-span-4 px-1.5 italic font-bold text-right pr-6">
                        CGST {(Number(invoiceTaxRate) / 2).toFixed(1)}%
                      </div>
                      <div className="col-span-2"></div>
                      <div className="col-span-1"></div>
                      <div className="col-span-1"></div>
                      <div className="col-span-1"></div>
                      <div className="col-span-2 text-right font-bold pr-1.5">
                        {formatNum(totalTaxAmount / 2)}
                      </div>
                    </div>
                    <div className="grid grid-cols-12 pb-1 text-[10.5px]">
                      <div className="col-span-1"></div>
                      <div className="col-span-4 px-1.5 italic font-bold text-right pr-6">
                        SGST {(Number(invoiceTaxRate) / 2).toFixed(1)}%
                      </div>
                      <div className="col-span-2"></div>
                      <div className="col-span-1"></div>
                      <div className="col-span-1"></div>
                      <div className="col-span-1"></div>
                      <div className="col-span-2 text-right font-bold pr-1.5">
                        {formatNum(totalTaxAmount / 2)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Items Total Row */}
          <div className="grid grid-cols-12 border-t border-b border-black font-bold py-1">
            <div className="col-span-10 text-right pr-4">Total</div>
            <div className="col-span-2 text-right pr-1.5 text-[12px]">
              ₹ {formatNum(grandTotal)}
            </div>
          </div>

          {/* Amount Chargeable (in words) Box */}
          <div className="flex justify-between border-b border-black p-1.5 text-[11px]">
            <div>
              <div className="text-[10px] text-gray-700">Amount Chargeable (in words)</div>
              <div className="font-bold">{grandTotalWords}</div>
            </div>
            <div className="italic font-serif text-[11px] self-start">E. & O.E</div>
          </div>

          {/* HSN / SAC Tax Breakdown Table */}
          <div className="border-b border-black">
            {taxType === 'IGST' ? (
              <table className="w-full text-[10px] border-collapse text-center">
                <thead>
                  <tr className="border-b border-black font-semibold" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="border-r border-black px-1.5 py-1 text-left align-middle w-[22%]">HSN/SAC</th>
                    <th className="border-r border-black px-1.5 py-1 text-right align-middle w-[25%]">Taxable Value</th>
                    <th className="border-r border-black p-0 w-[30%] align-top">
                      <div className="border-b border-black py-1 text-center font-bold">IGST</div>
                      <div className="flex w-full text-[9.5px]">
                        <div className="w-1/2 border-r border-black py-1 text-center font-semibold">Rate</div>
                        <div className="w-1/2 py-1 text-right pr-1.5 font-semibold">Amount</div>
                      </div>
                    </th>
                    <th className="px-1.5 py-1 text-right align-middle w-[23%]">Total Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {hsnList.map((hsnItem, i) => (
                    <tr key={i} className="border-b border-gray-400">
                      <td className="border-r border-black p-1 text-left">{hsnItem.hsn}</td>
                      <td className="border-r border-black p-1 text-right">{formatNum(hsnItem.taxableValue)}</td>
                      <td className="border-r border-black p-0">
                        <div className="flex w-full">
                          <div className="w-1/2 border-r border-black p-1 text-center">{hsnItem.taxRate}%</div>
                          <div className="w-1/2 p-1 text-right pr-1.5">{formatNum(hsnItem.taxAmount)}</div>
                        </div>
                      </td>
                      <td className="p-1 text-right pr-1.5 font-semibold">{formatNum(hsnItem.taxAmount)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold" style={{ backgroundColor: '#f9fafb' }}>
                    <td className="border-r border-black p-1 text-right">Total</td>
                    <td className="border-r border-black p-1 text-right">{formatNum(subtotal)}</td>
                    <td className="border-r border-black p-0">
                      <div className="flex w-full">
                        <div className="w-1/2 border-r border-black p-1"></div>
                        <div className="w-1/2 p-1 text-right pr-1.5">{formatNum(totalTaxAmount)}</div>
                      </div>
                    </td>
                    <td className="p-1 text-right pr-1.5">{formatNum(totalTaxAmount)}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              /* CGST + SGST Breakdown Table */
              <table className="w-full text-[10px] border-collapse text-center">
                <thead>
                  <tr className="border-b border-black font-semibold" style={{ backgroundColor: '#f9fafb' }}>
                    <th className="border-r border-black px-1.5 py-1 text-left align-middle w-[18%]">HSN/SAC</th>
                    <th className="border-r border-black px-1.5 py-1 text-right align-middle w-[22%]">Taxable Value</th>
                    <th className="border-r border-black p-0 w-[20%] align-top">
                      <div className="border-b border-black py-1 text-center font-bold">Central Tax (CGST)</div>
                      <div className="flex w-full text-[9.5px]">
                        <div className="w-1/2 border-r border-black py-1 text-center font-semibold">Rate</div>
                        <div className="w-1/2 py-1 text-right pr-1 font-semibold">Amount</div>
                      </div>
                    </th>
                    <th className="border-r border-black p-0 w-[20%] align-top">
                      <div className="border-b border-black py-1 text-center font-bold">State Tax (SGST)</div>
                      <div className="flex w-full text-[9.5px]">
                        <div className="w-1/2 border-r border-black py-1 text-center font-semibold">Rate</div>
                        <div className="w-1/2 py-1 text-right pr-1 font-semibold">Amount</div>
                      </div>
                    </th>
                    <th className="px-1.5 py-1 text-right align-middle w-[20%]">Total Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {hsnList.map((hsnItem, i) => {
                    const halfRate = (invoiceTaxRate / 2).toFixed(1) + '%';
                    const halfAmt = hsnItem.taxAmount / 2;
                    return (
                      <tr key={i} className="border-b border-gray-400">
                        <td className="border-r border-black p-1 text-left">{hsnItem.hsn}</td>
                        <td className="border-r border-black p-1 text-right">{formatNum(hsnItem.taxableValue)}</td>
                        <td className="border-r border-black p-0">
                          <div className="flex w-full">
                            <div className="w-1/2 border-r border-black p-1 text-center">{halfRate}</div>
                            <div className="w-1/2 p-1 text-right pr-1">{formatNum(halfAmt)}</div>
                          </div>
                        </td>
                        <td className="border-r border-black p-0">
                          <div className="flex w-full">
                            <div className="w-1/2 border-r border-black p-1 text-center">{halfRate}</div>
                            <div className="w-1/2 p-1 text-right pr-1">{formatNum(halfAmt)}</div>
                          </div>
                        </td>
                        <td className="p-1 text-right pr-1.5 font-semibold">{formatNum(hsnItem.taxAmount)}</td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold" style={{ backgroundColor: '#f9fafb' }}>
                    <td className="border-r border-black p-1 text-right">Total</td>
                    <td className="border-r border-black p-1 text-right">{formatNum(subtotal)}</td>
                    <td className="border-r border-black p-0">
                      <div className="flex w-full">
                        <div className="w-1/2 border-r border-black p-1"></div>
                        <div className="w-1/2 p-1 text-right pr-1">{formatNum(totalTaxAmount / 2)}</div>
                      </div>
                    </td>
                    <td className="border-r border-black p-0">
                      <div className="flex w-full">
                        <div className="w-1/2 border-r border-black p-1"></div>
                        <div className="w-1/2 p-1 text-right pr-1">{formatNum(totalTaxAmount / 2)}</div>
                      </div>
                    </td>
                    <td className="p-1 text-right pr-1.5">{formatNum(totalTaxAmount)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Tax Amount (in words) Row */}
          <div className="border-b border-black p-1.5 text-[11px]">
            <span>Tax Amount (in words) : </span>
            <strong className="font-bold">{taxAmountWords}</strong>
          </div>

          {/* Bottom Section (Declaration & Bank Details) */}
          <div className="grid grid-cols-12 min-h-[120px]">
            {/* Left Declaration */}
            <div className="col-span-6 border-r border-black p-2 flex flex-col justify-between">
              <div>
                <div className="underline font-semibold mb-1 text-[10.5px]">Declaration</div>
                <div className="text-[10px] text-gray-700 leading-tight">
                  {declaration}
                </div>
              </div>
            </div>

            {/* Right Bank Details & Signatory */}
            <div className="col-span-6 p-2 flex flex-col justify-between">
              <div>
                <div className="font-bold text-[10.5px] mb-1">Company's Bank Details</div>
                <div className="grid grid-cols-12 text-[10.5px] leading-tight">
                  <div className="col-span-5 text-gray-600">A/c Holder's Name</div>
                  <div className="col-span-7 font-bold">: {bankDetails.acHolderName || seller.name || 'PARDEEP ENGG WORKS'}</div>
                  <div className="col-span-5 text-gray-600">Bank Name</div>
                  <div className="col-span-7 font-bold">: {bankDetails.bankName || 'ICICI Bank'}</div>
                  <div className="col-span-5 text-gray-600">A/c No.</div>
                  <div className="col-span-7 font-bold">: {bankDetails.accountNo || '083005000548'}</div>
                  <div className="col-span-5 text-gray-600">Branch & IFS Code</div>
                  <div className="col-span-7 font-bold">: {bankDetails.branchIfsc || 'LAWRENCE ROAD, DELHI & ICIC0000830'}</div>
                </div>
              </div>

              {/* Signatory Box */}
              <div className="text-right pt-4">
                <div className="font-bold text-[11px]">for {seller.name || 'PARDEEP ENGG WORKS'}</div>
                <div className="h-8"></div>
                <div className="text-[10px] font-semibold text-gray-800">Authorised Signatory</div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="text-center text-[10px] mt-1 text-gray-700">
          This is a Computer Generated Invoice
        </div>
      </div>
    </div>
  );
}
