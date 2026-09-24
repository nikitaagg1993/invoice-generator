// Utility to convert numbers to Indian Rupee Words format
// Example: 7316.00 -> "INR Seven Thousand Three Hundred Sixteen Only"

const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const teenDigits = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tensDigits = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertTwoDigits(num) {
  if (num === 0) return "";
  if (num < 10) return singleDigits[num];
  if (num < 20) return teenDigits[num - 10];
  const ten = Math.floor(num / 10);
  const rem = num % 10;
  return tensDigits[ten] + (rem > 0 ? " " + singleDigits[rem] : "");
}

function convertThreeDigits(num) {
  if (num === 0) return "";
  const hundred = Math.floor(num / 100);
  const rem = num % 100;
  let str = "";
  if (hundred > 0) {
    str += singleDigits[hundred] + " Hundred";
  }
  if (rem > 0) {
    if (str !== "") str += " ";
    str += convertTwoDigits(rem);
  }
  return str;
}

export function numberToWordsINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "INR Zero Only";
  const num = Math.abs(Number(amount));
  if (num === 0) return "INR Zero Only";

  const parts = num.toFixed(2).split(".");
  const rupees = parseInt(parts[0], 10);
  const paise = parseInt(parts[1], 10);

  if (rupees === 0 && paise === 0) return "INR Zero Only";

  let rupeeStr = "";
  let tempRupees = rupees;

  // Crore (10,00,00,00)
  const crore = Math.floor(tempRupees / 10000000);
  tempRupees %= 10000000;

  // Lakh (10,00,00)
  const lakh = Math.floor(tempRupees / 100000);
  tempRupees %= 100000;

  // Thousand (1,000)
  const thousand = Math.floor(tempRupees / 1000);
  tempRupees %= 1000;

  // Hundreds & Below
  const hundredAndBelow = tempRupees;

  if (crore > 0) {
    rupeeStr += convertTwoDigits(crore) + " Crore ";
  }
  if (lakh > 0) {
    rupeeStr += convertTwoDigits(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    rupeeStr += convertTwoDigits(thousand) + " Thousand ";
  }
  if (hundredAndBelow > 0) {
    rupeeStr += convertThreeDigits(hundredAndBelow);
  }

  rupeeStr = rupeeStr.trim();
  if (!rupeeStr) rupeeStr = "Zero";

  let paiseStr = "";
  if (paise > 0) {
    paiseStr = " and " + convertTwoDigits(paise) + " Paise";
  }

  return `INR ${rupeeStr}${paiseStr} Only`;
}
