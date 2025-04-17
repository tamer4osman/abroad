// src/components/BankProxy.tsx
import React, { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { FileText, User, Send, Hash, MapPin, Calendar, CreditCard, Building } from 'lucide-react';
import AttachmentDocuments from './common/AttachmentDocuments';
import { registerProxy } from '../services/api';

// --- Interfaces ---
interface FormData {
  // Principal (الموكل)
  grantorTitle: string;
  grantorName: string;
  grantorPassportNumber: string;
  grantorPassportIssueDate: string;
  grantorIdOrLicense: string;
  grantorResidency: string;

  // Agent (الوكيل)
  granteeTitle: string;
  granteeName: string;
  granteePassportOrId: string;
  granteePassportIssueDate: string;
  granteeResidency: string;

  // Bank Details
  bankName: string;
  accountNumber: string;

  // Notary/Consular Info
  grantorFullNameNotary: string;
  grantorUsId: string;
}

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}



interface SectionProps {
  title: string;
  children: React.ReactNode;
}

// --- Helper Components ---
const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  icon,
}) => (
  <div>
    <label htmlFor={id} className="flex justify-start items-center text-gray-700 dark:text-gray-300 text-right mb-1">
      {label}
      {icon && <span className="mr-2 text-gray-500">{icon}</span>}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder={placeholder}
      required={required}
      dir={label.match(/English|Full Name|US ID/) ? "ltr" : "rtl"}
    />
  </div>
);





const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

// --- Form State Hook ---
const useBankProxyFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    grantorTitle: 'السيد',
    grantorName: '',
    grantorPassportNumber: '',
    grantorPassportIssueDate: '',
    grantorIdOrLicense: '',
    grantorResidency: '',
    granteeTitle: 'السيد',
    granteeName: '',
    granteePassportOrId: '',
    granteePassportIssueDate: '',
    granteeResidency: '',
    bankName: '',
    accountNumber: '',
    grantorFullNameNotary: '',
    grantorUsId: ''
  });

  const [uploadedAttachments, setUploadedAttachments] = useState<
    { id: string; type: string; file: File }[]
  >([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleAttachmentUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newAttachments = Array.from(event.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: "",
        file,
      }));

      setUploadedAttachments((prev) => [...prev, ...newAttachments]);
    }
  }, []);

  const handleAttachmentTypeChange = useCallback((id: string, type: string) => {
    setUploadedAttachments((prev) =>
      prev.map((attachment) =>
        attachment.id === id ? { ...attachment, type } : attachment
      )
    );
  }, []);

  const onRemoveAttachment = useCallback((id: string) => {
    setUploadedAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== id)
    );
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    formData,
    uploadedAttachments,
    isSubmitting,
    submitStatus,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    onRemoveAttachment,
    setIsSubmitting,
    setSubmitStatus,
    handlePrint
  };
};

// --- Main Component ---
const BankProxy: React.FC = () => {
  const {
    formData,
    uploadedAttachments,
    isSubmitting,
    submitStatus,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    onRemoveAttachment,
    setIsSubmitting,
    setSubmitStatus
  } = useBankProxyFormState();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus('idle');
      
      try {
        // Format data for the API according to backend expectations
        const proxyData = {
          type: "bank",
          purpose: "banking",
          expiryDate: null, // Most bank proxies don't have expiry dates
          
          // Add required properties for ProxyRegistrationData
          citizenId: formData.grantorIdOrLicense,
          proxyHolderId: formData.granteePassportOrId, 
          proxyType: "bank",
          startDate: new Date().toISOString(),
          
          grantor: {
            title: formData.grantorTitle,
            name: formData.grantorName,
            passportNumber: formData.grantorPassportNumber,
            passportIssueDate: formData.grantorPassportIssueDate,
            idNumber: formData.grantorIdOrLicense,
            residency: formData.grantorResidency
          },
          
          grantee: {
            title: formData.granteeTitle,
            name: formData.granteeName,
            idOrPassportNumber: formData.granteePassportOrId,
            idOrPassportIssueDate: formData.granteePassportIssueDate,
            residency: formData.granteeResidency
          },
          
          bankDetails: {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            actions: [
              "withdraw",
              "deposit",
              "checkbooks",
              "cards",
              "maintenance"
            ]
          },
          
          // Convert attachments to format expected by backend
          attachments: uploadedAttachments.map(attachment => ({
            type: attachment.type,
            filename: attachment.file.name,
            fileType: attachment.file.type,
            fileSize: attachment.file.size
          }))
        };

        // Call the API to register the proxy
        const response = await registerProxy(proxyData);
        
        console.log("API Response:", response);
        setSubmitStatus('success');
        
        // Optional: Reset form or redirect user
        // resetForm();
      } catch (error) {
        console.error('Submission Error:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, uploadedAttachments, setIsSubmitting, setSubmitStatus]
  );



  const grantorInfoSection = useMemo(
    () => (
      <Section title="بيانات الموكل">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">
            
            <div className="w-2/2">
              <InputField
                label="الاسم الكامل"
                id="grantorName"
                name="grantorName"
                value={formData.grantorName}
                onChange={(value) => handleChange("grantorName", value)}
                icon={<User size={18} />}
                placeholder="اسم الموكل كاملاً"
                required
              />
            </div>
          </div>
          <InputField
            label="جواز سفر رقم"
            id="grantorPassportNumber"
            name="grantorPassportNumber"
            value={formData.grantorPassportNumber}
            onChange={(value) => handleChange("grantorPassportNumber", value)}
            icon={<Hash size={18} />}
            required
          />
          <InputField
            label="تاريخ صدور الجواز"
            id="grantorPassportIssueDate"
            name="grantorPassportIssueDate"
            type="date"
            value={formData.grantorPassportIssueDate}
            onChange={(value) => handleChange("grantorPassportIssueDate", value)}
            icon={<Calendar size={18} />}
            required
          />
          <InputField
            label="بطاقة / رخصة رقم"
            id="grantorIdOrLicense"
            name="grantorIdOrLicense"
            value={formData.grantorIdOrLicense}
            onChange={(value) => handleChange("grantorIdOrLicense", value)}
            icon={<Hash size={18} />}
          />
          <InputField
            label="المقيم في"
            id="grantorResidency"
            name="grantorResidency"
            value={formData.grantorResidency}
            onChange={(value) => handleChange("grantorResidency", value)}
            icon={<MapPin size={18} />}
            placeholder="عنوان الإقامة"
            required
          />
        </div>
      </Section>
    ),
    [
      formData.grantorName,
      formData.grantorPassportNumber,
      formData.grantorPassportIssueDate,
      formData.grantorIdOrLicense,
      formData.grantorResidency,
      handleChange,
    ]
  );

  const granteeInfoSection = useMemo(
    () => (
      <Section title="بيانات الوكيل">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">

            <div className="w-2/2">
              <InputField
                label="الاسم الكامل"
                id="granteeName"
                name="granteeName"
                value={formData.granteeName}
                onChange={(value) => handleChange("granteeName", value)}
                icon={<User size={18} />}
                placeholder="اسم الوكيل كاملاً"
                required
              />
            </div>
          </div>
          <InputField
            label="جواز سفر / بطاقة رقم"
            id="granteePassportOrId"
            name="granteePassportOrId"
            value={formData.granteePassportOrId}
            onChange={(value) => handleChange("granteePassportOrId", value)}
            icon={<Hash size={18} />}
            required
          />
          <InputField
            label="تاريخ الصدور"
            id="granteePassportIssueDate"
            name="granteePassportIssueDate"
            type="date"
            value={formData.granteePassportIssueDate}
            onChange={(value) => handleChange("granteePassportIssueDate", value)}
            icon={<Calendar size={18} />}
            required
          />
          <InputField
            label="المقيم في"
            id="granteeResidency"
            name="granteeResidency"
            value={formData.granteeResidency}
            onChange={(value) => handleChange("granteeResidency", value)}
            icon={<MapPin size={18} />}
            placeholder="عنوان إقامة الوكيل"
            required
          />
        </div>
      </Section>
    ),
    [
      formData.granteeName,
      formData.granteePassportOrId,
      formData.granteePassportIssueDate,
      formData.granteeResidency,
      handleChange,
    ]
  );

  const purposeSection = useMemo(
    () => (
      <Section title="الغرض من التوكيل">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="اسم المصرف"
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={(value) => handleChange("bankName", value)}
            icon={<Building size={18} />}
            required
          />
          <InputField
            label="رقم الحساب"
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={(value) => handleChange("accountNumber", value)}
            icon={<CreditCard size={18} />}
            required
          />
        </div>
        <div className="text-right text-gray-600 dark:text-gray-300 space-y-2 mt-4">
          <p>
            في إتمام كافة الإجراءات والمعاملات المالية بما فيها السحب النقدي وتصديق الصكوك والإيداع وإستلام الدفاتر والبطاقات المحلية (بطاقة السحب الذاتي) وبهذا التوكيل يعتبر توكيلاً على حسابي في المصرف المذكور، كما له حق التوقيع على أي إجراء إداري يخص هذا الحساب فقط.
          </p>
        </div>
      </Section>
    ),
    [formData.bankName, formData.accountNumber, handleChange]
  );



  const attachmentsSection = useMemo(
    () => (
      <Section title="المرفقات">
        <div className="mb-4">
          <AttachmentDocuments
            uploadedAttachments={uploadedAttachments}
            onAttachmentTypeChange={handleAttachmentTypeChange}
            onRemoveAttachment={onRemoveAttachment}
            onAttachmentUpload={handleAttachmentUpload}
            attachmentTypeOptions={[
              { value: "صورة جواز سفر الموكل", label: "صورة جواز سفر الموكل" },
              { value: "صورة هوية الموكل", label: "صورة هوية الموكل" },
              { value: "صورة جواز سفر / هوية الوكيل", label: "صورة جواز سفر / هوية الوكيل" },
              { value: "كشف حساب مصرفي", label: "كشف حساب مصرفي" },
              { value: "أخرى", label: "أخرى" },
            ]}
          />
        </div>
      </Section>
    ),
    [uploadedAttachments, handleAttachmentTypeChange, onRemoveAttachment, handleAttachmentUpload]
  );

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          نموذج توكيل مصرفي (خاص)
        </h1>
        <FileText className="text-red-600 dark:text-red-400" size={32} />
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-4 text-center">
        <h1 className="text-xl font-bold">توكيل مصرفي</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {grantorInfoSection}
        {granteeInfoSection}
        {purposeSection}
        {attachmentsSection}

        <div className="flex justify-center space-x-4 space-x-reverse mt-6 print:hidden">

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center px-6 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'
            } focus:outline-none`}
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="ml-2 h-5 w-5" />
            )}
            {isSubmitting ? 'جاري الحفظ...' : 'إصدار التوكيل'}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <p className="text-center text-green-600 dark:text-green-400 mt-4 print:hidden">
            تم حفظ بيانات التوكيل بنجاح!
          </p>
        )}
        {submitStatus === 'error' && (
          <p className="text-center text-red-600 dark:text-red-400 mt-4 print:hidden">
            حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.
          </p>
        )}
      </form>
    </div>
  );
};

export default BankProxy;