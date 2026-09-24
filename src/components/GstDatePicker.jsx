import React from 'react';
import { Calendar } from 'lucide-react';
import { formatGstDate, convertToInputDateValue } from '../utils/dateUtils';

export default function GstDatePicker({ 
  label, 
  value, 
  onChange, 
  placeholder = 'e.g. 22-Sep-26', 
  required = false 
}) {
  const handleNativeDateChange = (e) => {
    const rawVal = e.target.value; // YYYY-MM-DD
    if (rawVal) {
      const formatted = formatGstDate(rawVal);
      onChange(formatted);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && '*'}
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white pr-9 font-medium"
        />
        <div className="absolute right-1.5 flex items-center">
          <label className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" title="Open Calendar Date Picker">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <input
              type="date"
              value={convertToInputDateValue(value)}
              onChange={handleNativeDateChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
