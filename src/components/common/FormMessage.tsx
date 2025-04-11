tsx
import React from "react";

interface FormMessageProps {
  message: { type: string; text: string };
}

const FormMessage: React.FC<FormMessageProps> = ({ message }) => {
  if (!message.text)
    return null;
  

    const messageTypeClass =
        message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';

    return (
        <div className={`p-4 mb-4 ${messageTypeClass}`}>
            {message.text}
        </div>
    );
};

export default FormMessage;