import React, { ChangeEvent, useState, useEffect } from 'react';
import { Upload, File, XCircle } from 'lucide-react';

interface AttachmentData {
    id: string;
    type: string;
    file: File;
}

interface AttachmentDocumentsProps {
    uploadedAttachments: AttachmentData[];
    onAttachmentTypeChange: (id: string, type: string) => void;
    onRemoveAttachment: (id: string) => void;
    onAttachmentUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    attachmentTypeOptions?: readonly { value: string; label: string }[];
};

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required,
}) => (
  <div>
    {label && (
      <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      required={required}
    >
      <option value="">-- اختر نوع المستند --</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const AttachmentDocuments: React.FC<AttachmentDocumentsProps> = ({
  uploadedAttachments,
  onAttachmentTypeChange,
  onRemoveAttachment,
  onAttachmentUpload,
  attachmentTypeOptions = [
    { value: "صورة عن الهوية", label: "صورة عن الهوية" },
    { value: "صورة عن جواز السفر", label: "صورة عن جواز السفر" },
    { value: "عقد الزواج", label: "عقد الزواج" },
    { value: "شهادة ميلاد", label: "شهادة ميلاد" },
    { value: "إخراج قيد", label: "إخراج قيد" },
    { value: "أخرى", label: "أخرى" },
  ],
}) => {
  // State for tracking file preview URLs
  const [fileURLs, setFileURLs] = useState<Record<string, string>>({});
  
  // Function to cleanup unused URL objects
  const cleanupUnusedURLs = React.useCallback((currentURLs: Record<string, string>, currentAttachments: AttachmentData[]) => {
    Object.entries(currentURLs).forEach(([id, url]) => {
      if (!currentAttachments.find(att => att.id === id)) {
        URL.revokeObjectURL(url);
      }
    });
  }, []);
  
  // Update URLs when attachments change
  useEffect(() => {
    // Create object URLs for new attachments
    const newURLs: Record<string, string> = {};
    uploadedAttachments.forEach(attachment => {
      if (!fileURLs[attachment.id]) {
        // Only create new URLs for attachments that don't have one yet
        newURLs[attachment.id] = URL.createObjectURL(attachment.file);
      }
    });
    
    if (Object.keys(newURLs).length > 0) {
      // Update state with new URLs
      setFileURLs(prev => ({...prev, ...newURLs}));
    }
    
    // Cleanup function to revoke URLs when component unmounts or attachments change
    return () => {
      cleanupUnusedURLs(fileURLs, uploadedAttachments);
    };
  }, [uploadedAttachments, fileURLs, cleanupUnusedURLs]);
  
  // Function to revoke all URL objects
  const revokeAllURLs = React.useCallback((urls: Record<string, string>) => {
    Object.values(urls).forEach(url => URL.revokeObjectURL(url));
  }, []);
  
  // Cleanup all URLs when component unmounts
  useEffect(() => {
    return () => {
      revokeAllURLs(fileURLs);
    };
  }, [fileURLs, revokeAllURLs]);
  
  // Safely remove an attachment with proper URL cleanup
  const handleRemoveAttachment = (id: string) => {
    if (fileURLs[id]) {
      URL.revokeObjectURL(fileURLs[id]);
      setFileURLs(prev => {
        const newURLs = {...prev};
        delete newURLs[id];
        return newURLs;
      });
    }
    onRemoveAttachment(id);
  };
  
  return (
    <div>
      <div>
        <label
          htmlFor="attachmentUpload"
          className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <Upload className="mr-2" size={16} />
          <span>تحميل المرفقات</span>
        </label>
        <input
          type="file"
          id="attachmentUpload"
          multiple
          className="hidden"
          onChange={onAttachmentUpload}
        />

        {/* Display uploaded attachments in a table */}
        <div className="mt-4 overflow-x-auto">
          {uploadedAttachments.length > 0 ? (
            <table className="min-w-full table-auto bg-white dark:bg-gray-800 rounded-md shadow-md">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    اسم الملف
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    نوع المرفق
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    إجراء
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {uploadedAttachments.map((attachment) => (
                  <tr key={attachment.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-right dark:text-white">
                      <div className="flex items-center">
                        <File className="mr-2" size={16} />
                        {attachment.file.name}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right dark:text-white">
                      <SelectField
                        label=""
                        id={`attachmentType-${attachment.id}`}
                        name={`attachmentType-${attachment.id}`}
                        value={attachment.type}
                        onChange={(value) => onAttachmentTypeChange(attachment.id, value)}
                        options={attachmentTypeOptions}
                        required
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right dark:text-white">
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="px-2 py-1 text-white rounded-md"
                      >
                        <XCircle
                          className="text-red-500 hover:text-red-700"
                          size={16}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
              لا توجد مرفقات مضافة
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentDocuments;
