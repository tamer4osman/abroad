tsx
import React, { memo } from "react";

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const InputField = memo(({
  label,
  id,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
  }: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300"
>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
      placeholder={placeholder}
      required={required}
    />
  </div>
));

export default InputField;