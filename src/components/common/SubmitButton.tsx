import React from 'react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      className={`py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-green-500'} text-white border-none`}
      disabled={isSubmitting}
    >
      {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
    </button>
  );
};

export default SubmitButton;