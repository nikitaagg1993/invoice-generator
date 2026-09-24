import html2pdf from 'html2pdf.js';

export async function exportInvoiceToPdf(elementId, filename = 'Tax_Invoice.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Invoice element not found:', elementId);
    window.print();
    return;
  }

  // Clone element to isolate from parent styling
  const clone = element.cloneNode(true);
  
  // Remove decorative container borders/shadows from clone so only the invoice grid box is rendered
  clone.style.border = 'none';
  clone.style.boxShadow = 'none';
  clone.style.outline = 'none';
  clone.style.minHeight = 'auto';
  clone.style.height = 'auto';

  // Create an isolated container with standard white background & black text
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = 'Calibri, Arial, sans-serif';

  // Replace any oklch color references in computed styles
  const allNodes = clone.querySelectorAll('*');
  allNodes.forEach(node => {
    node.style.color = node.style.color || '';
  });

  container.appendChild(clone);
  document.body.appendChild(container);

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
      scrollX: 0,
      windowWidth: 794
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'avoid-all' }
  };

  try {
    await html2pdf().set(opt).from(clone).save();
  } catch (error) {
    console.error('html2pdf export error:', error);
    alert('Browser canvas rendering fell back to print. Opening print dialog to save as PDF...');
    window.print();
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
