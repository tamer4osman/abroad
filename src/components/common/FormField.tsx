// FormField.tsx
// This component is a wrapper for different types of form fields.
// It can render either an input field or a select field based on the type prop.
// It also handles the common props like label, id, name, value, onChange, and required.
// It is a reusable component that can be used in various forms throughout the application.
// It is a generic component that can be extended to support more field types in the future.
// This component is a wrapper for different types of form fields.

import React from 'react';
import InputField from './InputField';

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, id, name, value, onChange, options, required }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: 'text' | 'select' ;
  options?: { value: string; label: string }[];
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  type = 'text',
  options,
}) => {
  if (type === 'select') {
    return (
      <SelectField
        label={label}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        options={options || []}
        required={required}
      />
    );
  } else {
    return (
      <InputField
        label={label}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    );
  }
};

export default FormField;