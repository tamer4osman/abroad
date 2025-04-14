// src/components/InheritanceProxy.tsx
import React, { useState, useCallback, useMemo, ChangeEvent } from "react";
import { FileText, User, Hash, MapPin, Calendar, Save } from "lucide-react";
import AttachmentDocuments from "./common/AttachmentDocuments"; // Assuming this path is correct

// --- Interfaces ---
interface FormData {
  grantorName: string; // Added Grantor Name
  grantorIdType: "id" | "license" | "passport";
  grantorIdNumber: string;
  grantorIssueDate: string; // Added Grantor ID Issue Date
  grantorResident: string;
  agentName: string;
  agentIdType: "passport" | "id";
  agentIdNumber: string;
  agentIssueDate: string;
  agentResident: string;
  deceasedName: string; // Specific to Inheritance Proxy
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
  options?: { value: string; label: string }[]; // For select inputs
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
}) => (
  <div>
    <label htmlFor={id} className="flex justify-start items-center text-gray-700 dark:text-gray-300 text-right mb-1">
      {label}
      {icon && <span className="mr-2 text-gray-500">{icon}</span>}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    {type === "select" && options ? (
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ) : (
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
    )}
  </div>
);

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

// --- Form State Hook ---
const useInheritanceProxyFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    grantorName: "", // Initialized
    grantorIdType: "id",
    grantorIdNumber: "",
    grantorIssueDate: "", // Initialized
    grantorResident: "",
    agentName: "",
    agentIdType: "passport",
    agentIdNumber: "",
    agentIssueDate: "",
    agentResident: "",
    deceasedName: "", // Initialized
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
        type: "", // Default type, user selects later
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
const InheritanceProxy: React.FC = () => {
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
  } = useInheritanceProxyFormState();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus("idle");
      console.log("Inheritance Proxy Data:", formData);
      console.log("Attachments:", uploadedAttachments);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // In a real app, you'd send data to a backend here
        // const response = await api.submitInheritanceProxy(formData, uploadedAttachments);
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
          name="grantorName" // Corrected name mapping
          value={formData.grantorName}
          onChange={(value) => handleChange("grantorName", value)}
          icon={<User size={18} />}
          placeholder="اسم الموكل ثلاثي"
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
            label="رقم البطاقة / الرخصة / الجواز"
            id="grantorIdNumber"
            name="grantorIdNumber"
            value={formData.grantorIdNumber}
            onChange={(value) => handleChange("grantorIdNumber", value)}
            icon={<Hash size={18} />}
            placeholder="أدخل الرقم"
            required
          />
           <InputField
            label="تاريخ الصدور"
            id="grantorIssueDate"
            name="grantorIssueDate" // Corrected name mapping
            type="date"
            value={formData.grantorIssueDate}
            onChange={(value) => handleChange("grantorIssueDate", value)}
            icon={<Calendar size={18} />}
            required
          />
        </div>
        <InputField
          label="المقيم"
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
    [formData.grantorName, formData.grantorIdType, formData.grantorIdNumber, formData.grantorIssueDate, formData.grantorResident, handleChange]
  );

  const agentInfoSection = useMemo(
    () => (
      <Section title="بيانات الوكيل">
        <InputField
          label="وكلتُ السيد / السيدة (الوكيل)"
          id="agentName"
          name="agentName"
          value={formData.agentName}
          onChange={(value) => handleChange("agentName", value)}
          icon={<User size={18} />}
          placeholder="اسم الوكيل ثلاثي"
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
              { value: "passport", label: "جواز سفر" },
              { value: "id", label: "بطاقة شخصية" },
            ]}
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
          label="المقيم"
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
        <p className="text-md text-gray-700 dark:text-gray-300">
          ليقوم مقامي ونيابة عني في:
        </p>
        <p className="text-md text-gray-700 dark:text-gray-300 leading-relaxed">
          المثول أمام المحكمة المختصة لاستخراج الفريضة الشرعية للمرحوم:
        </p>
        <InputField
          label="اسم المرحوم / المتوفى"
          id="deceasedName"
          name="deceasedName"
          value={formData.deceasedName}
          onChange={(value) => handleChange("deceasedName", value)}
          icon={<User size={18} />}
          placeholder="الاسم الكامل للمتوفى"
          required
        />
        <p className="text-md text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
           وبهذا التوكيل يستطيع الحضور أمام جميع المحاكم على اختلاف أنواعها ودرجاتها، وتوكيل المحامين في جميع الأمور والقضايا التي لها علاقة بهذا التوكيل والتوقيع نيابة عني على كافة الأوراق والمستندات المتعلقة بهذا التوكيل فقط.
        </p>
      </Section>
    ),
    [formData.deceasedName, handleChange]
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
              { value: "grantor_id", label: "صورة إثبات الموكل" },
              { value: "agent_id", label: "صورة إثبات الوكيل" },
              { value: "death_certificate", label: "صورة شهادة الوفاة للمرحوم" },
              { value: "family_book", label: "صورة الكتَيِّب العائلي (إن وجد)" },
              { value: "other", label: "أخرى" },
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
      dir="rtl" // Set direction to Right-to-Left
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          توكيل (خاص) - الفريضة الشرعية
        </h1>
        <FileText className="text-red-600 dark:text-red-400" size={32} />
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-4 text-center">
        <h1 className="text-xl font-bold">توكيل الفريضة الشرعية</h1>
        {/* Add other necessary print header elements here if needed */}
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
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

export default InheritanceProxy;