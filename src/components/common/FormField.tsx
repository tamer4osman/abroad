tsx
import React from 'react';
import InputField from './InputField';
import SelectField from './SelectField';

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