tsx
import React, { memo } from 'react';

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

const SelectField = memo(({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
      required={required}
    >
      <option value="" disabled>
        -- اختر --
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

export default SelectField;