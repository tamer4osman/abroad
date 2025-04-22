// src/components/GeneralProxy.tsx
import React, { useState, useCallback, useMemo, ChangeEvent } from "react";
import { FileText, User, Hash, MapPin, Calendar, Save, Edit3 } from "lucide-react";
import AttachmentDocuments from "./common/AttachmentDocuments";

// --- Interfaces ---
interface FormData {
  grantorName: string; // Grantor's full name
  grantorIdType: "id" | "license" | "passport";
  grantorIdNumber: string;
  grantorIssueDate: string; // Added issue date for Grantor ID/Passport
  grantorResident: string;
  agentName: string; // Agent's full name
  agentIdType: "passport" | "id";
  agentIdNumber: string;
  agentIssueDate: string;
  agentResident: string;
  proxyPurposeNotes?: string; // Optional field for specific notes/additions
}

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "select" | "textarea"; // Added textarea type
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  options?: { value: string; label: string }[]; // For select inputs
  rows?: number; // For textarea
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
  options,
  rows = 3, // Default rows for textarea
}) => (
  <div className="mb-3">
    <label htmlFor={id} className="flex justify-start items-center text-gray-700 dark:text-gray-300 text-right mb-1 text-sm font-medium">
      {icon && <span className="mr-2 text-gray-500">{icon}</span>}
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    {type === "select" && options ? (
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ) : type === "textarea" ? (
       <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    ) : (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4">
    <h2 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-300 dark:border-gray-600">{title}</h2>
    {children}
  </div>
);

// --- Form State Hook ---
const useGeneralProxyFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    grantorName: "",
    grantorIdType: "id",
    grantorIdNumber: "",
    grantorIssueDate: "",
    grantorResident: "",
    agentName: "",
    agentIdType: "passport",
    agentIdNumber: "",
    agentIssueDate: "",
    agentResident: "",
    proxyPurposeNotes: "",
  });

  const [uploadedAttachments, setUploadedAttachments] = useState<
    { id: string; type: string; file: File }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = useCallback((name: keyof FormData, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleAttachmentUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newAttachments = Array.from(event.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: "", // Default type, user should select
        file,
      }));
      setUploadedAttachments((prev) => [...prev, ...newAttachments]);
    }
     // Reset file input visually
    if (event.target) {
      event.target.value = "";
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
  };
};

// --- Main Component ---
const GeneralProxy: React.FC = () => {
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
    setSubmitStatus,
  } = useGeneralProxyFormState();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus("idle");
      console.log("General Proxy Data:", formData);
      console.log("Attachments:", uploadedAttachments);

      // --- Validation Logic (Basic Example) ---
      const requiredFields: (keyof FormData)[] = [
          'grantorName', 'grantorIdType', 'grantorIdNumber', 'grantorResident',
          'agentName', 'agentIdType', 'agentIdNumber', 'agentIssueDate', 'agentResident'
      ];
      // Add date validation if needed
      if (formData.grantorIdType === 'passport' && !formData.grantorIssueDate) requiredFields.push('grantorIssueDate');

      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
          alert(`يرجى ملء الحقول المطلوبة: ${missingFields.join(', ')}`);
          setIsSubmitting(false);
          setSubmitStatus("error");
          return;
      }
      // --- End Validation ---

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // In a real app, you'd send data to a backend here
        // const response = await api.submitGeneralProxy(formData, uploadedAttachments);
        console.log("Simulated submission successful");
        setSubmitStatus("success");
        // Optionally reset form: Consider if needed based on UX
        // setFormData({ ...initialFormData });
        // setUploadedAttachments([]);
      } catch (error) {
        console.error("Submission Error:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, uploadedAttachments, setIsSubmitting, setSubmitStatus] // Added missing dependencies
  );

  // --- Section Memos ---
  const grantorInfoSection = useMemo(
    () => (
      <Section title="بيانات الموكل">
        <InputField
          label="أقر أنا السيد / السيدة (الموكل)"
          id="grantorName"
          name="grantorName"
          value={formData.grantorName}
          onChange={(value) => handleChange("grantorName", value)}
          icon={<User size={18} />}
          placeholder="الاسم الكامل للموكل"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <InputField
            label="نوع الإثبات"
            id="grantorIdType"
            name="grantorIdType"
            type="select"
            value={formData.grantorIdType}
            onChange={(value) => handleChange("grantorIdType", value as FormData["grantorIdType"])}
            options={[
              { value: "id", label: "بطاقة شخصية" },
              { value: "license", label: "رخصة قيادة" },
              { value: "passport", label: "جواز سفر" },
            ]}
            required
          />
          <InputField
            label="رقم الإثبات"
            id="grantorIdNumber"
            name="grantorIdNumber"
            value={formData.grantorIdNumber}
            onChange={(value) => handleChange("grantorIdNumber", value)}
            icon={<Hash size={18} />}
            placeholder="أدخل الرقم"
            required
          />
           <InputField
            label="تاريخ صدور الإثبات"
            id="grantorIssueDate"
            name="grantorIssueDate"
            type="date"
            value={formData.grantorIssueDate}
            onChange={(value) => handleChange("grantorIssueDate", value)}
            icon={<Calendar size={18} />}
             // Make required only if passport? Or always? Let's keep it optional for now unless passport
            required={formData.grantorIdType === 'passport'} // Example conditional requirement
          />
        </div>
        <InputField
          label="المقيم في"
          id="grantorResident"
          name="grantorResident"
          value={formData.grantorResident}
          onChange={(value) => handleChange("grantorResident", value)}
          icon={<MapPin size={18} />}
          placeholder="عنوان الإقامة الحالي للموكل"
          required
        />
         <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            بكامل إرادتي والأوصاف الجائزة شرعاً وقانوناً وبدون إكراه أني وكلت:
        </p>
      </Section>
    ),
    [formData.grantorName, formData.grantorIdType, formData.grantorIdNumber, formData.grantorIssueDate, formData.grantorResident, handleChange]
  );

  const agentInfoSection = useMemo(
    () => (
      <Section title="بيانات الوكيل">
        <InputField
          label="السيد / السيدة (الوكيل)"
          id="agentName"
          name="agentName"
          value={formData.agentName}
          onChange={(value) => handleChange("agentName", value)}
          icon={<User size={18} />}
          placeholder="الاسم الكامل للوكيل"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <InputField
            label="نوع الإثبات"
            id="agentIdType"
            name="agentIdType"
            type="select"
            value={formData.agentIdType}
            onChange={(value) => handleChange("agentIdType", value as FormData["agentIdType"])}
            options={[
              { value: "id", label: "بطاقة شخصية" },
              { value: "license", label: "رخصة قيادة" },
              { value: "passport", label: "جواز سفر" },
            ]}
            required
          />
          <InputField
            label="رقم الإثبات"
            id="agentIdNumber"
            name="agentIdNumber"
            value={formData.agentIdNumber}
            onChange={(value) => handleChange("agentIdNumber", value)}
            icon={<Hash size={18} />}
            placeholder="أدخل الرقم"
            required
          />
          <InputField
            label="تاريخ الصدور"
            id="agentIssueDate"
            name="agentIssueDate"
            type="date"
            value={formData.agentIssueDate}
            onChange={(value) => handleChange("agentIssueDate", value)}
            icon={<Calendar size={18} />}
            required // Issue date usually required for agent ID/Passport
          />
        </div>
        <InputField
          label="المقيم في"
          id="agentResident"
          name="agentResident"
          value={formData.agentResident}
          onChange={(value) => handleChange("agentResident", value)}
          icon={<MapPin size={18} />}
          placeholder="عنوان إقامة الوكيل"
          required
        />
      </Section>
    ),
    [
      formData.agentName,
      formData.agentIdType,
      formData.agentIdNumber,
      formData.agentIssueDate,
      formData.agentResident,
      handleChange,
    ]
  );

  const purposeSection = useMemo(
    () => (
      <Section title="موضوع التوكيل والغرض منه">
        <p className="text-md text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          ليقوم مقامي ونيابة عني في المثول أمام جميع المحاكم بإختلاف أنواعها ودرجاتها، وتمثيلي أمام جميع الجهات القضائية والجهات المختصة والجهات ذات العلاقة ومراكز الشرطة في رفع الدعاوى وتوكيل المحامين والتوقيع على كافة الأوراق والمستندات المتعلقة بهذا التوكيل فقط، وله حق القيام بجميع الأمور الإدارية والقانونية التي تخصني فيما يتعلق بهذا الغرض.
        </p>
        {/* Optional Notes Field */}
         <InputField
          label="ملاحظات إضافية (اختياري)"
          id="proxyPurposeNotes"
          name="proxyPurposeNotes"
          type="textarea"
          value={formData.proxyPurposeNotes || ''} // Ensure value is controlled
          onChange={(value) => handleChange("proxyPurposeNotes", value)}
          icon={<Edit3 size={18} />}
          placeholder="أضف أي تفاصيل أو قيود إضافية هنا..."
          rows={4}
        />
      </Section>
    ),
    [formData.proxyPurposeNotes, handleChange] // Dependency added
  );

  const attachmentsSection = useMemo(
    () => (
      <Section title="المرفقات">
        <AttachmentDocuments
          uploadedAttachments={uploadedAttachments}
          onAttachmentTypeChange={handleAttachmentTypeChange}
          onRemoveAttachment={onRemoveAttachment}
          onAttachmentUpload={handleAttachmentUpload}
          attachmentTypeOptions={[
            { value: "grantor_id", label: "صورة إثبات الموكل" },
            { value: "agent_id", label: "صورة إثبات الوكيل" },
            { value: "other", label: "أخرى" },
          ]}
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
             * يرجى إرفاق صور واضحة من مستندات إثبات الهوية للموكل والوكيل.
          </p>
      </Section>
    ),
    [uploadedAttachments, handleAttachmentTypeChange, onRemoveAttachment, handleAttachmentUpload]
  );

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl" // Set direction to Right-to-Left
    >
      <div className="flex justify-between items-center mb-6 border-b pb-3 border-gray-300 dark:border-gray-600">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          توكيل عام
        </h1>
        <FileText className="text-red-600 dark:text-red-400" size={32} />
      </div>

       {/* Print Header */}
       <div className="hidden print:block mb-4 text-center">
          {/* Basic Print Header - Can be enhanced */}
          <h1 className="text-xl font-bold">توكيل عام</h1>
          <p className="text-sm">وزارة الخارجية والتعاون الدولي - سفارة دولة ليبيا</p>
          <hr className="my-2"/>
       </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {grantorInfoSection}
        {agentInfoSection}
        {purposeSection}
        {attachmentsSection}

        {/* Disclaimer/Note */}
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 pt-4 print:hidden">
          * ملاحظة: لا يتم اعتماد التوكيل في حال الشطب أو الكشط. السفارة غير مسؤولة عن محتوى التوكيل.
        </div>


        <div className="flex justify-center space-x-4 space-x-reverse mt-6 print:hidden">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center px-6 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
          >
            {/* Extract nested ternary operations into independent statements */}
            {(() => {
              // Button icon based on submission state
              const buttonIcon = isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Save className="ml-2 h-5 w-5" /> // Swapped icon position for RTL
              );

              // Button text based on submission state
              const buttonText = isSubmitting ? "جاري الحفظ..." : "إصدار التوكيل العام";

              // Return both icon and text
              return (
                <>
                  {buttonIcon}
                  {buttonText}
                </>
              );
            })()}
          </button>
           {/* Add a Print Button maybe? */}
           {/* <button type="button" onClick={() => window.print()} className="...">طباعة</button> */}
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <p className="text-center text-green-600 dark:text-green-400 mt-4 print:hidden">
            تم حفظ بيانات التوكيل العام بنجاح!
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-center text-red-600 dark:text-red-400 mt-4 print:hidden">
            حدث خطأ أثناء الحفظ. يرجى التحقق من الحقول المطلوبة والمحاولة مرة أخرى.
          </p>
        )}
      </form>

       {/* Print Footer - Basic Example */}
        <div className="hidden print:block mt-10 text-xs text-center border-t pt-2">
            <p>اسم الموكل: {formData.grantorName || '..............................'} التوقيع: .............................. التاريخ: ..../..../........</p>
            <p className="mt-4 font-bold">للإستعمال القنصلي فقط:</p>
            {/* Add notary/consular section placeholders */}
        </div>
    </div>
  );
};

export default GeneralProxy;