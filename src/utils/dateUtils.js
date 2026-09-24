// Utility for formatting GST Invoice Dates

export function formatGstDate(dateStr) {
  if (!dateStr) return '';

  // If already in DD-MMM-YY format like "22-Sep-26" or "22-Sep-2026", keep it as is
  if (/^\d{1,2}-[A-Za-z]{3}-\d{2,4}$/.test(dateStr.trim())) {
    return dateStr.trim();
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const day = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2); // "26"

  return `${day}-${month}-${year}`;
}

// Convert DD-MMM-YY ("22-Sep-26") or ISO to YYYY-MM-DD for native HTML <input type="date">
export function convertToInputDateValue(dateStr) {
  if (!dateStr) return '';
  
  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    return dateStr.trim();
  }

  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  return '';
}
