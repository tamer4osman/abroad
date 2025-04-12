import React from "react";

interface FormErrorsProps {
  errors: string[];
}

const FormErrors: React.FC<FormErrorsProps> = ({ errors }) =>
  errors.length === 0 ? null : (
    <div className="bg-red-100 text-red-800 p-4 mb-4 border border-red-300 rounded">
      <h3 className="font-bold mb-2">يرجى تصحيح الأخطاء التالية:</h3>
      <ul className="list-disc pr-5">{errors.map((error, index) => <li key={index}>{error}</li>)}</ul>
    </div>
  );

export default FormErrors;