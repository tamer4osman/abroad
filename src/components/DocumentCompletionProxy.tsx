// src/components/DocumentCompletionProxy.tsx
import React, { useState, useCallback, useMemo, ChangeEvent } from "react";
import {
  FileText,
  User,
  Hash,
  MapPin,
  Calendar,
  Save,
  FileInput,
} from "lucide-react";
import AttachmentDocuments from "./common/AttachmentDocuments"; // Assuming this component exists and works as in DivorceProxy

// --- Interfaces ---
interface FormData {
  grantorName: string; // Name of the person granting the power
  grantorIdType: "id" | "license" | "passport";
  grantorIdNumber: string;
  grantorResident: string;
  agentName: string; // Name of the person receiving the power (the agent)
  agentIdType: "passport" | "id";
  agentIdNumber: string;
  agentIssueDate: string;
  agentResident: string;
  documentDescription: string; // Specific field for this proxy type
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
  rows?: number; // For textarea inputs
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
  rows = 3, // For textarea inputs
}) => {
  // Extract field rendering logic into separate functions
  const renderField = () => {
    if (type === "select" && options) {
      return (
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    
    if (type === "textarea") {
      return (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
          placeholder={placeholder}
          required={required}
          rows={rows}
        />
      );
    }
    
    // Default is input field
    return (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
        placeholder={placeholder}
        required={required}
      />
    );
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="flex justify-start items-center text-gray-700 dark:text-gray-300 text-right mb-1"
      >
        {label}
        {icon && <span className="mr-2 text-gray-500">{icon}</span>}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {renderField()}
    </div>
  );
};

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

// --- Form State Hook ---
const useDocumentCompletionProxyFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    grantorName: "",
    grantorIdType: "id",
    grantorIdNumber: "",
    grantorResident: "",
    agentName: "",
    agentIdType: "passport",
    agentIdNumber: "",
    agentIssueDate: "",
    agentResident: "",
    documentDescription: "", // Initialize new field
  });

  const [uploadedAttachments, setUploadedAttachments] = useState<
    { id: string; type: string; file: File }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = useCallback((name: keyof FormData, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleAttachmentUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

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
const DocumentCompletionProxy: React.FC = () => {
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
  } = useDocumentCompletionProxyFormState();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus("idle");
      console.log("Document Completion Proxy Data:", formData);
      console.log("Attachments:", uploadedAttachments);

      // Basic validation example (expand as needed)
      if (
        !formData.grantorName ||
        !formData.agentName ||
        !formData.documentDescription
      ) {
        alert("يرجى ملء جميع الحقول المطلوبة.");
        setIsSubmitting(false);
        setSubmitStatus("error");
        return;
      }

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // In a real app, you'd send data to a backend here
        // const response = await api.submitDocCompletionProxy(formData, uploadedAttachments);
        console.log("Form submitted successfully (simulated)");
        setSubmitStatus("success");
      } catch (error) {
        console.error("Submission Error:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, uploadedAttachments, setIsSubmitting, setSubmitStatus]
  );

  // --- Section Memos ---
  const grantorInfoSection = useMemo(
    () => (
      <Section title="بيانات الموكل">
        <InputField
          label="أقر أنا السيد / السيدة (الموكل)"
          id="grantorName"
          name="grantorName" // Corrected: Use grantorName
          value={formData.grantorName}
          onChange={(value) => handleChange("grantorName", value)} // Corrected: Use grantorName
          icon={<User size={18} />}
          placeholder="الاسم الكامل للموكل"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-end">
          <InputField
            label="نوع الإثبات"
            id="agentIdType"
            name="agentIdType"
            type="select"
            value={formData.agentIdType}
            onChange={(value) =>
              handleChange("agentIdType", value as FormData["agentIdType"])
            }
            options={[
              { value: "passport", label: "جواز سفر" },
              { value: "id", label: "بطاقة شخصية" },
            ]}
            placeholder="اختر نوع الإثبات"
            required
          />
          <InputField
            label="رقم جواز السفر / البطاقة"
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
            required
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
      </Section>
    ),
    [
      formData.grantorName,
      formData.grantorResident,
      formData.agentIdType,
      formData.agentIdNumber,
      formData.agentIssueDate,
      handleChange,
    ]
  );

  const agentInfoSection = useMemo(
    () => (
      <Section title="بيانات الوكيل">
        <InputField
          label="وكلت السيد / السيدة (الوكيل)"
          id="agentName"
          name="agentName"
          value={formData.agentName}
          onChange={(value) => handleChange("agentName", value)}
          icon={<User size={18} />}
          placeholder="الاسم الكامل للوكيل"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 items-end">
          <InputField
            label="نوع الإثبات"
            id="agentIdType"
            name="agentIdType"
            type="select"
            value={formData.agentIdType}
            onChange={(value) =>
              handleChange("agentIdType", value as FormData["agentIdType"])
            }
            options={[
              { value: "passport", label: "جواز سفر" },
              { value: "id", label: "بطاقة شخصية" },
            ]}
            placeholder="اختر نوع الإثبات"
            required
          />
          <InputField
            label="رقم جواز السفر / البطاقة"
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
            required
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
          ليقوم مقامي ونيابة عني في إتمام ومتابعة الإجراءات المتعلقة بالمستندات
          التالية والتوقيع نيابة عني حيثما لزم الأمر:
        </p>
        <InputField
          label="وصف المستندات والإجراءات المطلوبة"
          id="documentDescription"
          name="documentDescription"
          type="textarea" // Use textarea for longer descriptions
          value={formData.documentDescription}
          onChange={(value) => handleChange("documentDescription", value)}
          icon={<FileInput size={18} />} // Changed icon
          placeholder="اذكر تفاصيل المستندات أو المعاملات المطلوب إتمامها (مثل: استلام شهادة ميلاد، متابعة معاملة في السجل المدني، إلخ)"
          required
          rows={4} // Adjust rows as needed
        />
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
          وذلك بتمثيلي أمام كافة الجهات الحكومية وغير الحكومية ذات العلاقة،
          وتقديم واستلام الأوراق والمستندات والتوقيع عليها، ودفع الرسوم إن وجدت.
          وللوكيل الحق في توكيل الغير في كل أو بعض ما ذكر أعلاه.
        </p>
      </Section>
    ),
    [formData.documentDescription, handleChange]
  );

  const attachmentsSection = useMemo(
    () => (
      <Section title="المرفقات">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          يرجى إرفاق صور واضحة من المستندات المطلوبة لإصدار التوكيل.
        </p>
        <AttachmentDocuments
          uploadedAttachments={uploadedAttachments}
          onAttachmentTypeChange={handleAttachmentTypeChange}
          onRemoveAttachment={onRemoveAttachment}
          onAttachmentUpload={handleAttachmentUpload}
          attachmentTypeOptions={[
            { value: "grantor_id", label: "صورة إثبات الموكل (وجهين)" },
            { value: "agent_id", label: "صورة إثبات الوكيل" },
            {
              value: "relevant_docs",
              label: "نسخة من المستندات المعنية (إن وجدت)",
            },
            { value: "other", label: "أخرى (يرجى التوضيح في اسم الملف)" },
          ]}
        />
      </Section>
    ),
    [
      uploadedAttachments,
      handleAttachmentTypeChange,
      onRemoveAttachment,
      handleAttachmentUpload,
    ]
  );

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl" // Set direction to Right-to-Left
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          توكيل (خاص) - إتمام مستندات
        </h1>
        <FileText className="text-red-600 dark:text-red-400" size={32} />
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-4 text-center">
        <h1 className="text-xl font-bold">توكيل إتمام مستندات</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {grantorInfoSection}
        {agentInfoSection}
        {purposeSection}
        {attachmentsSection}

        <div className="flex justify-center space-x-4 space-x-reverse mt-6 print:hidden">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center px-6 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
            } focus:outline-none`}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <Save className="ml-2 h-5 w-5" />
            )}
            {isSubmitting ? "جاري الحفظ..." : "إصدار التوكيل"}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <p className="text-center text-green-600 dark:text-green-400 mt-4 print:hidden">
            تم حفظ بيانات التوكيل بنجاح!
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-center text-red-600 dark:text-red-400 mt-4 print:hidden">
            حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.
          </p>
        )}
      </form>
    </div>
  );
};

export default DocumentCompletionProxy;
