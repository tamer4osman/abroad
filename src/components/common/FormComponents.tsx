import React from 'react';

export const FormMessage: React.FC<{
  message: { type: string; text: string };
}> = ({ message }) => {
  if (!message.text) return null;
  
  const bgColor = message.type === 'success' 
    ? 'bg-green-100 border-green-500 text-green-700' 
    : 'bg-red-100 border-red-500 text-red-700';
    
  return (
    <div className={`p-4 mb-4 border-l-4 rounded ${bgColor}`}>
      {message.text}
    </div>
  );
};

export const FormErrors: React.FC<{
  errors: string[];
}> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
      <ul className="list-disc pl-5">
        {errors.map((error, index) => (
          <li key={`error-${index}-${error.substring(0, 10)}`}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
