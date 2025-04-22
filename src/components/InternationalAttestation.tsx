import React, { useState, useCallback, useMemo } from 'react';
import { Upload, File, XCircle, Globe } from 'lucide-react';
import { registerAttestationRequest } from '../services/api';
import PhoneNumberField from './common/PhoneNumberField';

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
  
  // International Attestation Specific Information
  targetCountry: string;
  documentLanguage: string;
  translationRequired: boolean;
  apostilleRequired: boolean;
  destinationAuthority: string;
  urgentProcessing: boolean;
  
  // Applicant Contact Information
  addressInLibya: string;
  addressAbroad: string;
  phoneLibya: string;
  phoneAbroad: string;
  email: string;
  
  // Representative Information (if applicable)
  useRepresentative: boolean;
  representativeName: string;
  representativeRelationship: string;
  representativePhone: string;
  representativeEmail: string;
  
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

interface CheckboxFieldProps {
  label: string;
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface AttachmentData {
  file: File;
  type: string;
  id: string; // Add a unique ID field
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
        <option key={`${id}-${option.value}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  name,
  checked,
  onChange,
}) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <label htmlFor={id} className="mr-2 block text-gray-700 dark:text-gray-300">
      {label}
    </label>
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
  onAttachmentTypeChange: (id: string, newType: string) => void;
  onRemoveAttachment: (id: string) => void;
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
    { value: "translatedDocument", label: "المستند المترجم" },
    { value: "delegationLetter", label: "خطاب تفويض" },
    { value: "representativeID", label: "بطاقة هوية الوكيل" },
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
              {uploadedAttachments.map((attachment) => (
                <tr key={attachment.id}>
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
                        onAttachmentTypeChange(attachment.id, e.target.value)
                      }
                      className="border p-1 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {attachmentTypeOptions.map((option) => (
                        <option key={`attachment-type-${attachment.id}-${option.value}`} value={option.value}>
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
                      onClick={() => onRemoveAttachment(attachment.id)}
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
const useInternationalAttestationFormState = () => {
  const initialFormData = useMemo<FormData>(() => ({
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
    targetCountry: "",
    documentLanguage: "",
    translationRequired: false,
    apostilleRequired: false,
    destinationAuthority: "",
    urgentProcessing: false,
    addressInLibya: "",
    addressAbroad: "",
    phoneLibya: "",
    phoneAbroad: "",
    email: "",
    useRepresentative: false,
    representativeName: "",
    representativeRelationship: "",
    representativePhone: "",
    representativeEmail: "",
    notes: "",
  }), []);

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [uploadedAttachments, setUploadedAttachments] = useState<
    AttachmentData[]
  >([]);

  const handleChange = useCallback((name: string, value: string | boolean) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleAttachmentUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files?.length) return;

      const file = event.target.files[0];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      // Check file size
      if (file.size > maxSizeInBytes) {
        alert(`الملف ${file.name} يتجاوز الحد المسموح به (5 ميجا بايت). يرجى اختيار ملف أصغر.`);
        // Clear input value
        event.target.value = "";
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert(`نوع الملف ${file.name} غير مدعوم. الأنواع المدعومة هي: PDF, JPG, PNG.`);
        // Clear input value
        event.target.value = "";
        return;
      }

      const newAttachment = {
        file,
        type: "originalDocument",
        id: `${file.name}-${Date.now()}`, // Create a unique ID using filename and timestamp
      };
      
      setUploadedAttachments((prev) => [...prev, newAttachment]);

      // Clear input value to allow uploading the same file again if needed
      event.target.value = "";
    },
    []
  );

  const handleAttachmentTypeChange = useCallback(
    (id: string, newType: string) => {
      setUploadedAttachments((prev) => {
        return prev.map(attachment => 
          attachment.id === id 
            ? { ...attachment, type: newType }
            : attachment
        );
      });
    },
    []
  );

  const removeAttachment = useCallback((id: string) => {
    setUploadedAttachments((prev) => prev.filter(attachment => attachment.id !== id));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setUploadedAttachments([]);
  }, [initialFormData]); // setFormData/setUploadedAttachments are stable

  return {
    formData,
    uploadedAttachments,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
    resetForm, // Return resetForm
  };
};

// --- Main Component ---
const InternationalAttestation: React.FC = () => {
  const {
    formData,
    uploadedAttachments,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
    resetForm, // Destructure resetForm
  } = useInternationalAttestationFormState();

  // Add state for submission status
  const [submitStatus, setSubmitStatus] = useState<{
    isSubmitting: boolean;
    success?: boolean;
    message?: string;
  }>({
    isSubmitting: false,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Set submitting state
      setSubmitStatus({
        isSubmitting: true,
        message: undefined,
        success: undefined
      });
      
      // Comprehensive validation
      const requiredFields: {field: keyof FormData, label: string}[] = [
        {field: 'fullName', label: 'الاسم الكامل'},
        {field: 'passportNumber', label: 'رقم جواز السفر'},
        {field: 'nationality', label: 'الجنسية'},
        {field: 'documentType', label: 'نوع المستند'},
        {field: 'documentNumber', label: 'رقم المستند'},
        {field: 'documentIssueDate', label: 'تاريخ إصدار المستند'},
        {field: 'documentIssueAuthority', label: 'جهة إصدار المستند'},
        {field: 'documentLanguage', label: 'لغة المستند'},
        {field: 'documentPurpose', label: 'الغرض من التصديق'},
        {field: 'targetCountry', label: 'الدولة المستهدفة'},
        {field: 'destinationAuthority', label: 'الجهة المستلمة'},
        {field: 'addressAbroad', label: 'العنوان في الخارج'},
        {field: 'phoneAbroad', label: 'رقم الهاتف في الخارج'},
        {field: 'email', label: 'البريد الإلكتروني'}
      ];
      
      // Add representative fields if representative is used
      if (formData.useRepresentative) {
        requiredFields.push(
          {field: 'representativeName', label: 'اسم الوكيل'},
          {field: 'representativeRelationship', label: 'صلة القرابة'},
          {field: 'representativePhone', label: 'رقم هاتف الوكيل'}
        );
      }
      
      // Check all required fields
      const missingFields = requiredFields.filter(({field}) => !formData[field]);
      
      if (missingFields.length > 0) {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: `يرجى ملء الحقول الإلزامية التالية: ${missingFields.map(f => f.label).join('، ')}`
        });
        return;
      }
      
      // Validate email format if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: "يرجى إدخال بريد إلكتروني صحيح"
        });
        return;
      }
      
      // Validate representative email if provided
      if (formData.useRepresentative && formData.representativeEmail && 
          !emailRegex.test(formData.representativeEmail)) {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: "يرجى إدخال بريد إلكتروني صحيح للوكيل"
        });
        return;
      }
      
      // Validate at least one document is attached
      if (uploadedAttachments.length === 0) {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: "يرجى إرفاق المستند المطلوب تصديقه على الأقل"
        });
        return;
      }
      
      // Check if an original document is included
      const hasOriginalDoc = uploadedAttachments?.some(
        attachment => attachment.type === "originalDocument"
      );
      
      if (!hasOriginalDoc) {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: "يجب إرفاق المستند الأصلي المراد تصديقه"
        });
        return;
      }

      try {
        // Format data for the API
        const attestationData = {
          type: "international",
          citizenId: formData.nationalId, // Add required citizenId property
          attestationType: "international", // Add required attestationType property
          
          // Applicant information
          applicant: {
            fullName: formData.fullName,
            nationalId: formData.nationalId,
            passportNumber: formData.passportNumber,
            nationality: formData.nationality,
            birthDate: formData.birthDate,
            birthPlace: formData.birthPlace
          },
          
          // Document information
          document: {
            type: formData.documentType,
            number: formData.documentNumber,
            issueDate: formData.documentIssueDate,
            issueAuthority: formData.documentIssueAuthority,
            purpose: formData.documentPurpose,
            language: formData.documentLanguage
          },
          
          // International attestation details
          internationalDetails: {
            targetCountry: formData.targetCountry,
            translationRequired: formData.translationRequired,
            apostilleRequired: formData.apostilleRequired,
            destinationAuthority: formData.destinationAuthority,
            urgentProcessing: formData.urgentProcessing
          },
          
          // Contact information
          contactInfo: {
            addressInLibya: formData.addressInLibya,
            addressAbroad: formData.addressAbroad,
            phoneLibya: formData.phoneLibya,
            phoneAbroad: formData.phoneAbroad,
            email: formData.email
          },
          
          // Representative information (if applicable)
          representative: formData.useRepresentative ? {
            name: formData.representativeName,
            relationship: formData.representativeRelationship,
            phone: formData.representativePhone,
            email: formData.representativeEmail
          } : null,
          
          // Additional information
          notes: formData.notes,
          
          // Attachments metadata
          attachments: uploadedAttachments.map(attachment => ({
            type: attachment.type,
            filename: attachment.file.name,
            fileSize: attachment.file.size,
            fileType: attachment.file.type
          }))
        };

        // Call the API to register the attestation request
        const response = await registerAttestationRequest(attestationData);
        
        // Set success status
        setSubmitStatus({
          isSubmitting: false,
          success: true,
          message: `تم إرسال طلب التصديق بنجاح. رقم الطلب: ${response.applicationId}`
        });
        
        // Reset form after successful submission
        resetForm();
        
      } catch (error: unknown) {
        console.error("Error submitting attestation request:", error);
        const errorMessage = "حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.";
        // Set error status
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: errorMessage
        });
      }
    },
    [formData, uploadedAttachments, resetForm] // Add resetForm to dependency array
  );

  const DOCUMENT_TYPES = useMemo(
    () => [
      { value: "academic", label: "شهادة علمية" },
      { value: "birth", label: "شهادة ميلاد" },
      { value: "marriage", label: "عقد زواج" },
      { value: "commercial", label: "وثيقة تجارية" },
      { value: "legal", label: "مستند قانوني" },
      { value: "medical", label: "تقرير طبي" },
      { value: "powerOfAttorney", label: "وكالة قانونية" },
      { value: "commercialRegistration", label: "سجل تجاري" },
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

  // Target countries for international attestation
  const TARGET_COUNTRIES = useMemo(
    () => [
      { value: "usa", label: "الولايات المتحدة الأمريكية" },
      { value: "uk", label: "المملكة المتحدة" },
      { value: "germany", label: "ألمانيا" },
      { value: "france", label: "فرنسا" },
      { value: "canada", label: "كندا" },
      { value: "australia", label: "أستراليا" },
      { value: "uae", label: "الإمارات العربية المتحدة" },
      { value: "saudi", label: "المملكة العربية السعودية" },
      { value: "qatar", label: "قطر" },
      { value: "egypt", label: "مصر" },
      { value: "other", label: "أخرى" },
    ],
    []
  );

  // Document languages
  const DOCUMENT_LANGUAGES = useMemo(
    () => [
      { value: "arabic", label: "العربية" },
      { value: "english", label: "الإنجليزية" },
      { value: "french", label: "الفرنسية" },
      { value: "german", label: "الألمانية" },
      { value: "spanish", label: "الإسبانية" },
      { value: "italian", label: "الإيطالية" },
      { value: "other", label: "أخرى" },
    ],
    []
  );

  // Relationship types for representative
  const RELATIONSHIP_TYPES = useMemo(
    () => [
      { value: "family", label: "قريب" },
      { value: "lawyer", label: "محامي" },
      { value: "employee", label: "موظف" },
      { value: "friend", label: "صديق" },
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
          <SelectField
            label="لغة المستند"
            id="documentLanguage"
            name="documentLanguage"
            value={formData.documentLanguage}
            onChange={(value) => handleChange("documentLanguage", value)}
            options={DOCUMENT_LANGUAGES}
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
      formData.documentLanguage,
      formData.documentPurpose,
      handleChange,
      DOCUMENT_TYPES,
      DOCUMENT_LANGUAGES,
    ]
  );

  const internationalInfoSection = useMemo(
    () => (
      <Section title="معلومات التصديق الدولي">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="الدولة المستهدفة"
            id="targetCountry"
            name="targetCountry"
            value={formData.targetCountry}
            onChange={(value) => handleChange("targetCountry", value)}
            options={TARGET_COUNTRIES}
            required
          />
          <InputField
            label="الجهة المستلمة في البلد المستهدف"
            id="destinationAuthority"
            name="destinationAuthority"
            value={formData.destinationAuthority}
            onChange={(value) => handleChange("destinationAuthority", value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <CheckboxField
              label="مطلوب ترجمة المستند"
              id="translationRequired"
              name="translationRequired"
              checked={formData.translationRequired}
              onChange={(checked) => handleChange("translationRequired", checked)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 pr-6 mt-1">
              اختر هذا الخيار إذا كنت بحاجة لترجمة المستند إلى لغة البلد المستهدف
            </p>
          </div>
          
          <div>
            <CheckboxField
              label="مطلوب إضافة شهادة أبوستيل (Apostille)"
              id="apostilleRequired"
              name="apostilleRequired"
              checked={formData.apostilleRequired}
              onChange={(checked) => handleChange("apostilleRequired", checked)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 pr-6 mt-1">
              مطلوب للدول المنضمة لاتفاقية لاهاي لعام 1961
            </p>
          </div>
          
          <div className="col-span-full mt-2">
            <CheckboxField
              label="معاملة مستعجلة (رسوم إضافية)"
              id="urgentProcessing"
              name="urgentProcessing"
              checked={formData.urgentProcessing}
              onChange={(checked) => handleChange("urgentProcessing", checked)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 pr-6 mt-1">
              اختر هذا الخيار لإنجاز التصديق بصفة عاجلة (خلال 2-3 أيام عمل) مقابل رسوم إضافية
            </p>
          </div>
        </div>
      </Section>
    ),
    [
      formData.targetCountry,
      formData.destinationAuthority,
      formData.translationRequired,
      formData.apostilleRequired,
      formData.urgentProcessing,
      handleChange,
      TARGET_COUNTRIES,
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
          <PhoneNumberField
            label="رقم الهاتف في ليبيا"
            id="phoneLibya"
            name="phoneLibya"
            value={formData.phoneLibya}
            onChange={(value) => handleChange("phoneLibya", value)}
          />
          <PhoneNumberField
            label="رقم الهاتف في الخارج"
            id="phoneAbroad"
            name="phoneAbroad"
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

  const representativeInfoSection = useMemo(
    () => (
      <Section title="معلومات الوكيل (اختياري)">
        <div className="mb-4">
          <CheckboxField
            label="تقديم الطلب عن طريق وكيل"
            id="useRepresentative"
            name="useRepresentative"
            checked={formData.useRepresentative}
            onChange={(checked) => handleChange("useRepresentative", checked)}
          />
        </div>

        {formData.useRepresentative && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <InputField
              label="اسم الوكيل"
              id="representativeName"
              name="representativeName"
              value={formData.representativeName}
              onChange={(value) => handleChange("representativeName", value)}
              required={formData.useRepresentative}
            />
            <SelectField
              label="صلة القرابة / العلاقة"
              id="representativeRelationship"
              name="representativeRelationship"
              value={formData.representativeRelationship}
              onChange={(value) => handleChange("representativeRelationship", value)}
              options={RELATIONSHIP_TYPES}
              required={formData.useRepresentative}
            />
            <PhoneNumberField
              label="رقم هاتف الوكيل"
              id="representativePhone"
              name="representativePhone"
              value={formData.representativePhone}
              onChange={(value) => handleChange("representativePhone", value)}
              required={formData.useRepresentative}
            />
            <InputField
              label="البريد الإلكتروني للوكيل"
              id="representativeEmail"
              name="representativeEmail"
              type="email"
              value={formData.representativeEmail}
              onChange={(value) => handleChange("representativeEmail", value)}
            />
          </div>
        )}
      </Section>
    ),
    [
      formData.useRepresentative,
      formData.representativeName,
      formData.representativeRelationship,
      formData.representativePhone,
      formData.representativeEmail,
      handleChange,
      RELATIONSHIP_TYPES,
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
          placeholder="أي معلومات إضافية تود إضافتها لطلب التصديق الدولي"
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
        نموذج طلب التصديق الدولي
      </h1>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md mb-6 flex items-start">
        <Globe className="h-5 w-5 mt-0.5 ml-2 text-blue-500 dark:text-blue-300 flex-shrink-0" />
        <div>
          <p className="text-blue-700 dark:text-blue-300">
            يتيح التصديق الدولي إمكانية استخدام المستندات الليبية في الخارج بشكل رسمي.
            يرجى ملاحظة أن عملية التصديق قد تستغرق من 7 إلى 14 يوم عمل.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {personalInfoSection}
        {documentInfoSection}
        {internationalInfoSection}
        {contactInfoSection}
        {representativeInfoSection}

        <AttachmentsForm
          uploadedAttachments={uploadedAttachments}
          onAttachmentUpload={handleAttachmentUpload}
          onAttachmentTypeChange={handleAttachmentTypeChange}
          onRemoveAttachment={removeAttachment}
        />

        {additionalInfoSection}

        {/* Submission Status */}
        {submitStatus.message && (
          <div className={`p-4 rounded-md mb-4 ${
            submitStatus.success 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            <p className="text-center font-semibold">{submitStatus.message}</p>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={submitStatus.isSubmitting}
            className={`px-6 py-2 ${
              submitStatus.isSubmitting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700"
            } text-white rounded-md transition-colors duration-200`}
          >
            {submitStatus.isSubmitting
              ? "جاري تقديم الطلب..."
              : "إرسال الطلب"
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternationalAttestation;
