import React, { useState, useCallback, useMemo } from 'react';
import { FileText, User, Send, Hash, MapPin, Calendar } from 'lucide-react';

// --- Interfaces ---
interface FormData {
  // Principal (الموكل)
  principalName: string;
  principalPassportNumber: string;
  principalPassportIssueDate: string;
  principalIdNumber: string;
  principalResidency: string;

  // Agent (الوكيل)
  agentName: string;
  agentPassportIdNumber: string;
  agentIssueDate: string;
  agentResidency: string;

  // Proxy Details
  proxySubject: string;

  // Signatures/Dates
  principalSignedName: string;
  proxyDate: string;

  // Notary/Consular Info
  grantorFullNameEnglish: string;
  grantorIdNumber: string;
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
    <label htmlFor={id} className="flex justify-end items-center text-gray-700 dark:text-gray-300 text-right">
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
      dir={label.match(/English|US ID/) ? "ltr" : "rtl"}
    />
  </div>
);

const TextAreaField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300 text-right">
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder={placeholder}
      required={required}
      rows={3}
      dir="rtl"
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
const useCourtProxyFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    principalName: "",
    principalPassportNumber: "",
    principalPassportIssueDate: "",
    principalIdNumber: "",
    principalResidency: "",
    agentName: "",
    agentPassportIdNumber: "",
    agentIssueDate: "",
    agentResidency: "",
    proxySubject: "",
    principalSignedName: "",
    proxyDate: "",
    grantorFullNameEnglish: "",
    grantorIdNumber: "",
  });

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  return {
    formData,
    handleChange,
  };
};

// --- Main Component ---
const CourtProxy: React.FC = () => {
  const { formData, handleChange } = useCourtProxyFormState();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("بيانات طلب التوكيل القضائي:", formData);
      // Here you would typically send the data to a server
      alert("تم إرسال الطلب بنجاح");
    },
    [formData]
  );

  const principalInfoSection = useMemo(
    () => (
      <Section title="بيانات الموكل">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="الاسم الكامل"
            id="principalName"
            name="principalName"
            value={formData.principalName}
            onChange={(value) => handleChange("principalName", value)}
            icon={<User size={18} />}
            required
          />
          <InputField
            label="رقم جواز السفر"
            id="principalPassportNumber"
            name="principalPassportNumber"
            value={formData.principalPassportNumber}
            onChange={(value) => handleChange("principalPassportNumber", value)}
            icon={<Hash size={18} />}
            required
          />
          <InputField
            label="تاريخ صدور الجواز"
            id="principalPassportIssueDate"
            name="principalPassportIssueDate"
            type="date"
            value={formData.principalPassportIssueDate}
            onChange={(value) => handleChange("principalPassportIssueDate", value)}
            icon={<Calendar size={18} />}
            required
          />
          <InputField
            label="رقم البطاقة / الرخصة"
            id="principalIdNumber"
            name="principalIdNumber"
            value={formData.principalIdNumber}
            onChange={(value) => handleChange("principalIdNumber", value)}
            icon={<Hash size={18} />}
          />
          <InputField
            label="العنوان / مكان الإقامة"
            id="principalResidency"
            name="principalResidency"
            value={formData.principalResidency}
            onChange={(value) => handleChange("principalResidency", value)}
            icon={<MapPin size={18} />}
            required
          />
        </div>
      </Section>
    ),
    [
      formData.principalName,
      formData.principalPassportNumber,
      formData.principalPassportIssueDate,
      formData.principalIdNumber,
      formData.principalResidency,
      handleChange,
    ]
  );

  const agentInfoSection = useMemo(
    () => (
      <Section title="بيانات الوكيل">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="الاسم الكامل"
            id="agentName"
            name="agentName"
            value={formData.agentName}
            onChange={(value) => handleChange("agentName", value)}
            icon={<User size={18} />}
            required
          />
          <InputField
            label="رقم جواز السفر / البطاقة"
            id="agentPassportIdNumber"
            name="agentPassportIdNumber"
            value={formData.agentPassportIdNumber}
            onChange={(value) => handleChange("agentPassportIdNumber", value)}
            icon={<Hash size={18} />}
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
          <InputField
            label="العنوان / مكان الإقامة"
            id="agentResidency"
            name="agentResidency"
            value={formData.agentResidency}
            onChange={(value) => handleChange("agentResidency", value)}
            icon={<MapPin size={18} />}
            required
          />
                    <InputField
            label="تاريخ التوكيل"
            id="proxyDate"
            name="proxyDate"
            type="date"
            value={formData.proxyDate}
            onChange={(value) => handleChange("proxyDate", value)}
            icon={<Calendar size={18} />}
            required
          />
        </div>
      </Section>
    ),
    [
      formData.agentName,
      formData.agentPassportIdNumber,
      formData.agentIssueDate,
      formData.agentResidency,
      handleChange,
    ]
  );

  const proxyScopeSection = useMemo(
    () => (
      <Section title="نطاق التوكيل">
        <div className="text-right text-gray-600 dark:text-gray-300 space-y-2 mb-4">
          <p>
            ليقوم مقامي ونيابة عني في المثول أمام جميع المحاكم بإختلاف أنواعها
            ودرجاتها بخصوص:
          </p>
        </div>

        <div className="mb-4">
          <TextAreaField
            label="الموضوع المحدد"
            id="proxySubject"
            name="proxySubject"
            value={formData.proxySubject}
            onChange={(value) => handleChange("proxySubject", value)}
            placeholder="اذكر القضية أو الموضوع المحدد للتوكيل هنا..."
            required
          />
        </div>

      </Section>
    ),
    [formData.proxySubject, handleChange]
  );



  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          نموذج توكيل للمحاكم (خاص)
        </h1>
        <FileText className="text-red-600 dark:text-red-400" size={32} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {principalInfoSection}
        {agentInfoSection}
        {proxyScopeSection}


        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
          >
            <Send size={18} className="ml-2" />
            إصدار التوكيل
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourtProxy;