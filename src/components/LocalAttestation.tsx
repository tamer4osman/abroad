import React, { useState, useCallback, useMemo } from 'react';
import { Upload, File, XCircle } from 'lucide-react';

// --- Interfaces ---
interface FormData {
  // Personal Information
  fullName: string;
  nationalId: string;
  passportNumber: string;
  nationality: string;
  birthDate: string;
  birthPlace: string;
  
  // Document Information
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentIssueAuthority: string;
  documentPurpose: string;
  
  // Applicant Contact Information
  addressInLibya: string;
  addressAbroad: string;
  phoneLibya: string;
  phoneAbroad: string;
  email: string;
  
  // Additional Information
  notes: string;
  
  // Attachment information tracked separately
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
}

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  required?: boolean;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface AttachmentData {
  file: File;
  type: string;
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
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label}
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
    />
  </div>
);

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      required={required}
    >
      <option value="">-- اختر --</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
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
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
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
      rows={4}
    />
  </div>
);

const AttachmentsForm: React.FC<{
  uploadedAttachments: AttachmentData[];
  onAttachmentUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAttachmentTypeChange: (index: number, newType: string) => void;
  onRemoveAttachment: (index: number) => void;
}> = ({
  uploadedAttachments,
  onAttachmentUpload,
  onAttachmentTypeChange,
  onRemoveAttachment,
}) => {
  const attachmentTypeOptions = [
    { value: "identityDocument", label: "وثيقة الهوية" },
    { value: "passport", label: "جواز السفر" },
    { value: "originalDocument", label: "المستند الأصلي المراد تصديقه" },
    { value: "delegationLetter", label: "خطاب تفويض" },
    { value: "other", label: "أخرى" },
  ];

  return (
    <Section title="المرفقات والمستندات">
      <div className="mb-4">
        <div className="relative border-2 border-dashed border-gray-400 dark:border-gray-600 p-4 rounded-md text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex flex-col items-center justify-center py-2">
            <Upload className="h-8 w-8 mb-2 text-gray-500 dark:text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              اضغط أو اسحب الملفات هنا لإرفاقها
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              صيغ الملفات المدعومة: PDF, JPG, PNG (الحد الأقصى: 5 ميجا بايت)
            </p>
          </div>
          <input
            type="file"
            onChange={onAttachmentUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {uploadedAttachments.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  اسم الملف
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  نوع المستند
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  حجم الملف
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {uploadedAttachments.map((attachment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      {attachment.file.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <select
                      value={attachment.type}
                      onChange={(e) =>
                        onAttachmentTypeChange(index, e.target.value)
                      }
                      className="border p-1 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {attachmentTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {(attachment.file.size / 1024).toFixed(0)} كيلوبايت
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onRemoveAttachment(index)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
};

// --- Form State Hook ---
const useLocalAttestationFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    nationalId: "",
    passportNumber: "",
    nationality: "",
    birthDate: "",
    birthPlace: "",
    documentType: "",
    documentNumber: "",
    documentIssueDate: "",
    documentIssueAuthority: "",
    documentPurpose: "",
    addressInLibya: "",
    addressAbroad: "",
    phoneLibya: "",
    phoneAbroad: "",
    email: "",
    notes: "",
  });

  const [uploadedAttachments, setUploadedAttachments] = useState<
    AttachmentData[]
  >([]);

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleAttachmentUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files?.length) return;

      const file = event.target.files[0];

      setUploadedAttachments((prev) => [
        ...prev,
        { file, type: "originalDocument" },
      ]);

      // Clear input value to allow uploading the same file again if needed
      event.target.value = "";
    },
    []
  );

  const handleAttachmentTypeChange = useCallback(
    (index: number, newType: string) => {
      setUploadedAttachments((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], type: newType };
        return updated;
      });
    },
    []
  );

  const removeAttachment = useCallback((index: number) => {
    setUploadedAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    formData,
    uploadedAttachments,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
  };
};

// --- Main Component ---
const LocalAttestation: React.FC = () => {
  const {
    formData,
    uploadedAttachments,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
  } = useLocalAttestationFormState();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("بيانات طلب التصديق المحلي:", formData);
      console.log("المرفقات:", uploadedAttachments);
      // Here you would typically send the data to a server
      alert("تم إرسال الطلب بنجاح");
    },
    [formData, uploadedAttachments]
  );

  const DOCUMENT_TYPES = useMemo(
    () => [
      { value: "academic", label: "شهادة علمية" },
      { value: "birth", label: "شهادة ميلاد" },
      { value: "marriage", label: "عقد زواج" },
      { value: "commercial", label: "وثيقة تجارية" },
      { value: "legal", label: "مستند قانوني" },
      { value: "medical", label: "تقرير طبي" },
      { value: "other", label: "أخرى" },
    ],
    []
  );

  // Common nationalities in the region
  const NATIONALITIES = useMemo(
    () => [
      { value: "libyan", label: "ليبي" },
      { value: "egyptian", label: "مصري" },
      { value: "tunisian", label: "تونسي" },
      { value: "algerian", label: "جزائري" },
      { value: "moroccan", label: "مغربي" },
      { value: "sudanese", label: "سوداني" },
      { value: "jordanian", label: "أردني" },
      { value: "syrian", label: "سوري" },
      { value: "lebanese", label: "لبناني" },
      { value: "other", label: "أخرى" },
    ],
    []
  );

  // Memoized form sections
  const personalInfoSection = useMemo(
    () => (
      <Section title="البيانات الشخصية">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="الاسم الكامل"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={(value) => handleChange("fullName", value)}
            required
          />
          <SelectField
            label="الجنسية"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={(value) => handleChange("nationality", value)}
            options={NATIONALITIES}
            required
          />
          <InputField
            label="الرقم الوطني"
            id="nationalId"
            name="nationalId"
            value={formData.nationalId}
            onChange={(value) => handleChange("nationalId", value)}
          />
          <InputField
            label="رقم جواز السفر"
            id="passportNumber"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={(value) => handleChange("passportNumber", value)}
            required
          />
          <InputField
            label="تاريخ الميلاد"
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(value) => handleChange("birthDate", value)}
          />
          <InputField
            label="مكان الميلاد"
            id="birthPlace"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={(value) => handleChange("birthPlace", value)}
          />
        </div>
      </Section>
    ),
    [
      formData.fullName,
      formData.nationality,
      formData.nationalId,
      formData.passportNumber,
      formData.birthDate,
      formData.birthPlace,
      handleChange,
      NATIONALITIES,
    ]
  );

  const documentInfoSection = useMemo(
    () => (
      <Section title="معلومات المستند المراد تصديقه">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="نوع المستند"
            id="documentType"
            name="documentType"
            value={formData.documentType}
            onChange={(value) => handleChange("documentType", value)}
            options={DOCUMENT_TYPES}
            required
          />
          <InputField
            label="رقم المستند"
            id="documentNumber"
            name="documentNumber"
            value={formData.documentNumber}
            onChange={(value) => handleChange("documentNumber", value)}
            required
          />
          <InputField
            label="تاريخ إصدار المستند"
            id="documentIssueDate"
            name="documentIssueDate"
            type="date"
            value={formData.documentIssueDate}
            onChange={(value) => handleChange("documentIssueDate", value)}
            required
          />
          <InputField
            label="جهة إصدار المستند"
            id="documentIssueAuthority"
            name="documentIssueAuthority"
            value={formData.documentIssueAuthority}
            onChange={(value) => handleChange("documentIssueAuthority", value)}
            required
          />
          <InputField
            label="الغرض من التصديق"
            id="documentPurpose"
            name="documentPurpose"
            value={formData.documentPurpose}
            onChange={(value) => handleChange("documentPurpose", value)}
            required
          />
        </div>
      </Section>
    ),
    [
      formData.documentType,
      formData.documentNumber,
      formData.documentIssueDate,
      formData.documentIssueAuthority,
      formData.documentPurpose,
      handleChange,
      DOCUMENT_TYPES,
    ]
  );

  const contactInfoSection = useMemo(
    () => (
      <Section title="معلومات الاتصال">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="العنوان في ليبيا"
            id="addressInLibya"
            name="addressInLibya"
            value={formData.addressInLibya}
            onChange={(value) => handleChange("addressInLibya", value)}
          />
          <InputField
            label="العنوان في الخارج"
            id="addressAbroad"
            name="addressAbroad"
            value={formData.addressAbroad}
            onChange={(value) => handleChange("addressAbroad", value)}
            required
          />
          <InputField
            label="رقم الهاتف في ليبيا"
            id="phoneLibya"
            name="phoneLibya"
            type="tel"
            value={formData.phoneLibya}
            onChange={(value) => handleChange("phoneLibya", value)}
          />
          <InputField
            label="رقم الهاتف في الخارج"
            id="phoneAbroad"
            name="phoneAbroad"
            type="tel"
            value={formData.phoneAbroad}
            onChange={(value) => handleChange("phoneAbroad", value)}
            required
          />
          <InputField
            label="البريد الإلكتروني"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            required
          />
        </div>
      </Section>
    ),
    [
      formData.addressInLibya,
      formData.addressAbroad,
      formData.phoneLibya,
      formData.phoneAbroad,
      formData.email,
      handleChange,
    ]
  );

  const additionalInfoSection = useMemo(
    () => (
      <Section title="معلومات إضافية">
        <TextAreaField
          label="ملاحظات"
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={(value) => handleChange("notes", value)}
          placeholder="أي معلومات إضافية تود إضافتها لطلب التصديق"
        />
      </Section>
    ),
    [formData.notes, handleChange]
  );

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        نموذج طلب التصديق المحلي
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {personalInfoSection}
        {documentInfoSection}
        {contactInfoSection}

        <AttachmentsForm
          uploadedAttachments={uploadedAttachments}
          onAttachmentUpload={handleAttachmentUpload}
          onAttachmentTypeChange={handleAttachmentTypeChange}
          onRemoveAttachment={removeAttachment}
        />

        {additionalInfoSection}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
          >
            تقديم طلب التصديق
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocalAttestation;