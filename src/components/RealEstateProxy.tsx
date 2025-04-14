// src/components/RealEstateProxy.tsx
import React, { useState, useCallback, useMemo, ChangeEvent } from "react";
import {
  FileText,
  User,
  Hash,
  MapPin,
  Calendar,
  Save,
  Home,
  Map,
} from "lucide-react";
import AttachmentDocuments from "./common/AttachmentDocuments"; // Assuming this path is correct

// --- Interfaces ---
interface FormData {
  grantorName: string; // Added Grantor Name explicitly
  grantorIdType: "id" | "license" | "passport";
  grantorIdNumber: string;
  // grantorIssueDate: string; // Consider adding if needed based on specific requirements
  grantorResident: string;
  agentName: string;
  agentIdType: "passport" | "id";
  agentIdNumber: string;
  agentIssueDate: string;
  agentResident: string;
  propertyDescription: string; // Specific to Real Estate Proxy
  propertyLocation: string; // Specific to Real Estate Proxy
  // propertyNumber: string; // Optional: Add if needed
  // specificPowers: string[]; // Optional: For checkboxes like sell, buy, rent, manage
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
  rows?: number; // Adding rows property for textarea
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
  rows = 4, // Default value for rows
}) => (
  <div>
    <label
      htmlFor={id}
      className="flex justify-start items-center text-gray-700 dark:text-gray-300 text-right mb-1"
    >
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
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
        placeholder={placeholder}
        required={required}
      />
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
    <div className="space-y-4">{children}</div>
  </div>
);

// --- Form State Hook ---
const useRealEstateProxyFormState = () => {
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
    propertyDescription: "",
    propertyLocation: "",
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
        const newFiles = Array.from(event.target.files);
        // Basic validation (example: check for duplicates by name and size)
        const uniqueNewFiles = newFiles.filter(
          (newFile) =>
            !uploadedAttachments.some(
              (existing) =>
                existing.file.name === newFile.name &&
                existing.file.size === newFile.size
            )
        );

        if (uniqueNewFiles.length !== newFiles.length) {
          // Optionally notify user about duplicates skipped
          console.warn("Skipped duplicate files.");
        }

        const newAttachments = uniqueNewFiles.map((file) => ({
          id: Math.random().toString(36).substring(2, 11), // longer random id
          type: "", // Default type, user needs to select
          file,
        }));

        setUploadedAttachments((prev) => [...prev, ...newAttachments]);
      }
      // Reset file input visually to allow uploading the same file again if removed
      if (event.target) {
        event.target.value = "";
      }
    },
    [uploadedAttachments]
  ); // Depend on uploadedAttachments to check duplicates

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
const RealEstateProxy: React.FC = () => {
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
  } = useRealEstateProxyFormState();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus("idle");
      console.log("Real Estate Proxy Data:", formData);
      console.log("Attachments:", uploadedAttachments);

      // Basic validation example: Check if required attachments are selected
      const requiredAttachmentTypes = [
        "grantor_id",
        "agent_id",
        "property_deed",
      ];
      const providedTypes = new Set(uploadedAttachments.map((a) => a.type));
      const missingRequired = requiredAttachmentTypes.filter(
        (type) => !providedTypes.has(type)
      );

      if (missingRequired.length > 0) {
        console.error("Missing required attachment types:", missingRequired);
        alert(
          `يرجى تحديد نوع المرفقات الإلزامية: ${missingRequired.join(", ")}`
        );
        setSubmitStatus("error");
        setIsSubmitting(false);
        return; // Stop submission
      }
      // Validate if any attachment still has the default empty type ""
      if (uploadedAttachments.some((a) => a.type === "")) {
        alert("يرجى تحديد نوع لجميع المرفقات.");
        setSubmitStatus("error");
        setIsSubmitting(false);
        return; // Stop submission
      }

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // In a real app, you'd send data to a backend here
        // const apiFormData = new FormData();
        // apiFormData.append('jsonData', JSON.stringify(formData));
        // uploadedAttachments.forEach(att => {
        //    apiFormData.append(att.type || 'other_attachment', att.file, att.file.name);
        // });
        // const response = await api.submitRealEstateProxy(apiFormData);

        console.log("Form submitted successfully (simulated)");
        setSubmitStatus("success");
        // Optionally reset form or redirect
      } catch (error) {
        console.error("Submission Error:", error);
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, uploadedAttachments, setIsSubmitting, setSubmitStatus] // Add uploadedAttachments dependency
  );

  // --- Section Memos ---
  const grantorInfoSection = useMemo(
    () => (
      <Section title="بيانات الموكل">
        <InputField
          label="السيد / السيدة (الموكل)"
          id="grantorName"
          name="grantorName" // Ensure name matches state key
          value={formData.grantorName}
          onChange={(value) => handleChange("grantorName", value)}
          icon={<User size={18} />}
          placeholder="اسم الموكل كاملاً كما في إثبات الهوية"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <InputField
            label="نوع إثبات الهوية"
            id="grantorIdType"
            name="grantorIdType"
            type="select"
            value={formData.grantorIdType}
            onChange={(value) =>
              handleChange("grantorIdType", value as FormData["grantorIdType"])
            }
            options={[
              { value: "passport", label: "جواز سفر" }, // Assuming agent might be non-resident
              { value: "id", label: "بطاقة شخصية ليبية" },
              { value: "license", label: "رخصة قيادة ليبية" },
            ]}
            placeholder="اختر نوع الإثبات"
            required
          />
          <InputField
            label="رقم إثبات الهوية"
            id="grantorIdNumber"
            name="grantorIdNumber"
            value={formData.grantorIdNumber}
            onChange={(value) => handleChange("grantorIdNumber", value)}
            icon={<Hash size={18} />}
            placeholder="أدخل الرقم"
            required
          />
          <InputField
            label="تاريخ صدور إثبات الهوية"
            id="grantorIssueDate"
            name="grantorIssueDate"
            type="date"
            value={formData.agentIssueDate}
            onChange={(value) => handleChange("agentIssueDate", value)}
            icon={<Calendar size={18} />}
            required
          />
        </div>
        <InputField
          label="العنوان الحالي للموكل"
          id="grantorResident"
          name="grantorResident"
          value={formData.grantorResident}
          onChange={(value) => handleChange("grantorResident", value)}
          icon={<MapPin size={18} />}
          placeholder="مثال: 123 الشارع الرئيسي، المدينة، الدولة"
          required
        />
      </Section>
    ),
    [
      formData.grantorName,
      formData.grantorIdType,
      formData.grantorIdNumber,
      formData.grantorResident,
      formData.agentIssueDate,
      handleChange,
    ]
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
          placeholder="اسم الوكيل كاملاً كما في إثبات الهوية"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <InputField
            label="نوع إثبات الهوية"
            id="agentIdType"
            name="agentIdType"
            type="select"
            value={formData.agentIdType}
            onChange={(value) =>
              handleChange("agentIdType", value as FormData["agentIdType"])
            }
            options={[
              { value: "passport", label: "جواز سفر" }, // Assuming agent might be non-resident
              { value: "id", label: "بطاقة شخصية ليبية" },
            ]}
            placeholder="اختر نوع الإثبات"
            required
          />
          <InputField
            label="رقم إثبات الهوية"
            id="agentIdNumber"
            name="agentIdNumber"
            value={formData.agentIdNumber}
            onChange={(value) => handleChange("agentIdNumber", value)}
            icon={<Hash size={18} />}
            placeholder="أدخل الرقم"
            required
          />
          <InputField
            label="تاريخ صدور إثبات الهوية"
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
          label="العنوان الحالي للوكيل"
          id="agentResident"
          name="agentResident"
          value={formData.agentResident}
          onChange={(value) => handleChange("agentResident", value)}
          icon={<MapPin size={18} />}
          placeholder="مثال: 456 شارع فرعي، المدينة، الدولة"
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
      <Section title="موضوع التوكيل والغرض منه (عقاري)">
        <p className="text-md text-gray-700 dark:text-gray-300 mb-3">
          أقر أنا الموكل المذكور أعلاه، وبكامل إرادتي وأهليتي المعتبرة شرعاً
          وقانوناً، بأنني وكلت السيد/السيدة الوكيل المذكور أعلاه لينوب عني
          ويمثلني ويقوم مقامي في كافة التصرفات والإجراءات المتعلقة بالعقار
          المملوك لي / المراد شراؤه / المراد التعامل بشأنه، والموضح أدناه:
        </p>
        <InputField
          label="وصف العقار"
          id="propertyDescription"
          name="propertyDescription"
          type="textarea" // Use textarea for potentially longer descriptions
          rows={4}
          value={formData.propertyDescription}
          onChange={(value) => handleChange("propertyDescription", value)}
          icon={<Home size={18} />}
          placeholder="مثال: شقة سكنية بالطابق الثاني، أو قطعة أرض فضاء، أو محل تجاري..."
          required
        />
        <InputField
          label="موقع العقار"
          id="propertyLocation"
          name="propertyLocation"
          type="textarea"
          rows={3}
          value={formData.propertyLocation}
          onChange={(value) => handleChange("propertyLocation", value)}
          icon={<Map size={18} />}
          placeholder="العنوان التفصيلي للعقار شاملاً المدينة والمنطقة والشارع ورقم العقار إن وجد"
          required
        />
        {/* Optional: Property Number/Registry Info
         <InputField
            label="رقم العقار / السجل العقاري"
            id="propertyNumber"
            name="propertyNumber"
            value={formData.propertyNumber}
            onChange={(value) => handleChange("propertyNumber", value)}
            icon={<Hash size={18} />}
            placeholder="رقم العقار أو السجل إن كان متوفراً"
         /> */}
        <p className="text-md text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
          ويشمل هذا التوكيل، على سبيل المثال لا الحصر، حق الوكيل في البيع
          والشراء والإيجار والرهن وإدارة العقار، والتوقيع على كافة العقود
          والاتفاقيات والمستندات اللازمة لذلك، والمثول أمام مكاتب السجل العقاري
          والبلديات والمحاكم والجهات الحكومية وغير الحكومية ذات العلاقة، ودفع
          واستلام الرسوم والمبالغ والأوراق والمستندات، وتوكيل المحامين والخبراء
          والغير في كل أو بعض ما ذكر. وهذا توكيل خاص قاصر على ما ذكر فيه فقط.
        </p>
        {/* Optional: Add checkboxes here for specific powers if needed */}
      </Section>
    ),
    [
      formData.propertyDescription,
      formData.propertyLocation,
      /* formData.propertyNumber, */ handleChange,
    ]
  );

  const attachmentsSection = useMemo(
    () => (
      <Section title="المرفقات المطلوبة">
        <div className="mb-4">
          <AttachmentDocuments
            uploadedAttachments={uploadedAttachments}
            onAttachmentTypeChange={handleAttachmentTypeChange}
            onRemoveAttachment={onRemoveAttachment}
            onAttachmentUpload={handleAttachmentUpload}
            attachmentTypeOptions={[
              { value: "grantor_id", label: "صورة إثبات هوية الموكل" },
              { value: "agent_id", label: "صورة إثبات هوية الوكيل" },
              { value: "property_deed", label: "صورة سند ملكية العقار" },
              { value: "other", label: "مستند آخر" },
            ]}
          />
        </div>
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
          توكيل (خاص) - عقاري
        </h1>
        <FileText className="text-red-600 dark:text-red-400" size={32} />
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-4 text-center">
        <h1 className="text-xl font-bold">توكيل عقاري</h1>
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

export default RealEstateProxy;
