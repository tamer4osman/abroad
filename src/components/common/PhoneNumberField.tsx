import React, { useState, useEffect } from 'react';
import { isValidPhone } from '../../constants/VisaForm.constants';

interface PhoneNumberFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  required = false,
  placeholder = "Example: +218-91-1234567",
  disabled = false,
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Validate phone number when value changes
  useEffect(() => {
    if (isTouched) {
      if (!value && required) {
        setIsValid(false);
        setErrorMessage('هذا الحقل مطلوب / This field is required');
      } else if (value && !isValidPhone(value)) {
        setIsValid(false);
        setErrorMessage('صيغة رقم الهاتف غير صحيحة / Invalid phone number format');
      } else {
        setIsValid(true);
        setErrorMessage(null);
      }
    }
  }, [value, isTouched, required]);
  
  return (
    <div> 
      <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <div className="relative">
        <input
          type="tel"
          id={id}
          name={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={() => setIsTouched(true)}
          className={`border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm ${
            !isValid && isTouched 
              ? "border-red-500 ring-1 ring-red-500" 
              : "focus:border-blue-500 focus:ring-blue-500"
          }`}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
        {isTouched && !isValid && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      {isTouched && !isValid && errorMessage && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">{errorMessage}</p>
      )}
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        أدخل رمز الدولة متبوعًا برقم الهاتف (مثال: ‎+218-91-1234567)
      </p>
    </div>
  );
};

export default PhoneNumberField;