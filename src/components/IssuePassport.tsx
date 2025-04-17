import React, { useState, useCallback, useMemo } from "react";
import { Upload } from "lucide-react";
import AttachmentDocuments from "./common/AttachmentDocuments";
import { registerPassport } from "../services/api";

// --- Interfaces ---
interface FormData {
  // Applicant Personal Information
  firstName: string;
  fatherName: string;
  grandfatherName: string;
  familyName: string;
  nationalNumber: string;
  birthPlace: string;
  birthDate: string;
  gender: "male" | "female";
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  occupation: string;
  educationLevel: string;
  
  // Current Passport Information (if any)
  hasCurrentPassport: boolean;
  currentPassportNumber: string;
  currentPassportIssueDate: string;
  currentPassportExpiryDate: string;
  currentPassportIssuePlace: string;
  
  // Parent Information
  fatherFullName: string;
  fatherNationality: string;
  motherFullName: string;
  motherNationality: string;
  
  // Contact Information
  addressLibya: string;
  phoneLibya: string;
  addressAbroad: string;
  phoneAbroad: string;
  email: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  
  // Passport Type and Options
  passportType: "regular" | "diplomatic" | "service" | "special";
  numberOfPages: "48" | "64";
  processingType: "normal" | "expedited";
  
  // Additional Information
  travelReason: string;
  travelDestination: string;
  previousPassportLost: boolean;
  previousPassportLostDetails?: string;
  
  // Applicant Declaration
  agreesToTerms: boolean;
  
  // Photo will be managed separately
  photo?: File;
}

// Interface for the attachment data
interface AttachmentData {
  id: string;
  file: File;
  type: string;
}

// --- Constants ---
const GENDER_TYPES = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
] as const;

const MARITAL_STATUS_TYPES = [
  { value: "single", label: "أعزب/عزباء" },
  { value: "married", label: "متزوج/ة" },
  { value: "divorced", label: "مطلق/ة" },
  { value: "widowed", label: "أرمل/ة" },
] as const;

const PASSPORT_TYPES = [
  { value: "regular", label: "عادي" },
  { value: "diplomatic", label: "دبلوماسي" },
  { value: "service", label: "خدمة" },
  { value: "special", label: "خاص" },
] as const;

const PAGE_OPTIONS = [
  { value: "48", label: "48 صفحة" },
  { value: "64", label: "64 صفحة" },
] as const;

const PROCESSING_TYPES = [
  { value: "normal", label: "عادي" },
  { value: "expedited", label: "مستعجل" },
] as const;

// Transform into the format expected by AttachmentDocuments
const ATTACHMENT_TYPE_OPTIONS = [
  { value: "identity", label: "إثبات الهوية" },
  { value: "photo", label: "الصورة الشخصية" },
  { value: "birthCertificate", label: "شهادة الميلاد" },
  { value: "currentPassport", label: "جواز السفر الحالي" },
  { value: "residenceProof", label: "إثبات الإقامة" },
  { value: "lostPassportReport", label: "بلاغ فقدان جواز السفر" },
  { value: "other", label: "أخرى" },
] as const;

// --- Helper Components ---
interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  disabled,
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
      disabled={disabled}
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required,
  disabled,
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
      disabled={disabled}
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

interface CheckboxFieldProps {
  label: string;
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  name,
  checked,
  onChange,
  required,
}) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      required={required}
    />
    <label
      htmlFor={id}
      className="text-gray-700 dark:text-gray-300 cursor-pointer"
    >
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

// --- Custom Hooks ---
const usePassportFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    // Initialize with default values
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    familyName: "",
    nationalNumber: "",
    birthPlace: "",
    birthDate: "",
    gender: "male",
    maritalStatus: "single",
    occupation: "",
    educationLevel: "",
    
    hasCurrentPassport: false,
    currentPassportNumber: "",
    currentPassportIssueDate: "",
    currentPassportExpiryDate: "",
    currentPassportIssuePlace: "",
    
    fatherFullName: "",
    fatherNationality: "",
    motherFullName: "",
    motherNationality: "",
    
    addressLibya: "",
    phoneLibya: "",
    addressAbroad: "",
    phoneAbroad: "",
    email: "",
    
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    
    passportType: "regular",
    numberOfPages: "48",
    processingType: "normal",
    
    travelReason: "",
    travelDestination: "",
    previousPassportLost: false,
    previousPassportLostDetails: "",
    
    agreesToTerms: false,
  });

  const [uploadedAttachments, setUploadedAttachments] = useState<AttachmentData[]>([]);

  const handleChange = useCallback((name: keyof FormData, value: string | boolean) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          photo: e.target.files![0],
        }));
      }
    },
    []
  );

  // Handle attachment upload
  const handleAttachmentUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newAttachments = Array.from(files).map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          type: "",
        }));
        setUploadedAttachments((prev) => [...prev, ...newAttachments]);
      }
      if (event.target) {
        event.target.value = '';
      }
    },
    []
  );

  // Handle attachment type change
  const handleAttachmentTypeChange = useCallback((id: string, newType: string) => {
    setUploadedAttachments((prev) =>
      prev.map((attachment) =>
        attachment.id === id ? { ...attachment, type: newType } : attachment
      )
    );
  }, []);

  // Handle attachment removal
  const removeAttachment = useCallback((id: string) => {
    setUploadedAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== id)
    );
  }, []);

  return {
    formData,
    uploadedAttachments,
    handleChange,
    handlePhotoChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
  };
};

// --- Main Component ---
const IssuePassport: React.FC = () => {
  const {
    formData,
    uploadedAttachments,
    handleChange,
    handlePhotoChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
  } = usePassportFormState();

  // Add status state for API feedback
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
      
      // Reset submission status
      setSubmitStatus({
        isSubmitting: true,
        message: undefined,
        success: undefined
      });

      // Validation
      if (!formData.firstName || !formData.nationalNumber) {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: "يرجى ملء جميع الحقول الإلزامية",
        });
        return;
      }

      if (!formData.agreesToTerms) {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: "يرجى الموافقة على الشروط والأحكام",
        });
        return;
      }

      try {
        // Prepare the data for backend
        const passportData = {
          // Add placeholder required fields to satisfy PassportRegistrationData type
          // These might be ignored or handled by the backend for a new passport request.
          passportNumber: "", // Placeholder for new passport
          issueDate: "",      // Placeholder for new passport
          expiryDate: "",     // Placeholder for new passport

          citizenId: formData.nationalNumber, // Using national number as citizen ID
          holderName: `${formData.firstName} ${formData.fatherName} ${formData.grandfatherName} ${formData.familyName}`,
          passportType: formData.passportType,
          pages: formData.numberOfPages,
          processingType: formData.processingType,
          birthPlace: formData.birthPlace,
          birthDate: formData.birthDate,
          gender: formData.gender,
          contactInfo: {
            addressLibya: formData.addressLibya,
            phoneLibya: formData.phoneLibya,
            addressAbroad: formData.addressAbroad || undefined,
            phoneAbroad: formData.phoneAbroad || undefined,
            email: formData.email || undefined,
          },
          emergencyContact: {
            name: formData.emergencyContactName,
            relationship: formData.emergencyContactRelation,
            phone: formData.emergencyContactPhone,
          },
          parentInfo: {
            fatherName: formData.fatherFullName || undefined,
            fatherNationality: formData.fatherNationality || undefined,
            motherName: formData.motherFullName || undefined,
            motherNationality: formData.motherNationality || undefined,
          },
          previousPassport: formData.hasCurrentPassport ? {
            number: formData.currentPassportNumber,
            issueDate: formData.currentPassportIssueDate,
            expiryDate: formData.currentPassportExpiryDate,
            issuePlace: formData.currentPassportIssuePlace,
          } : undefined,
          additionalInfo: {
            travelReason: formData.travelReason || undefined,
            travelDestination: formData.travelDestination || undefined,
            previousLost: formData.previousPassportLost,
            previousLostDetails: formData.previousPassportLostDetails || undefined,
          }
        };

        // Call the API to register the passport
        const result = await registerPassport(passportData);
        
        // Set success status
        setSubmitStatus({
          isSubmitting: false,
          success: true,
          message: "تم تقديم طلب إصدار جواز السفر بنجاح. رقم الطلب: " + result.applicationId,
        });

        // Reset form if needed
        // resetForm();
        
      } catch (error: unknown) {
        // Handle errors from the API
        console.error("Error submitting passport application:", error);
        let errorMessage = "حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: errorMessage,
        });
      }
    },
    [formData] // Removed uploadedAttachments as it's not used directly in the callback
  );

  // Memoize form sections to prevent unnecessary re-renders
  const personalInfoSection = useMemo(
    () => (
      <Section title="المعلومات الشخصية">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            label="الاسم الأول"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(value) => handleChange("firstName", value)}
            required
          />
          <InputField
            label="اسم الأب"
            id="fatherName"
            name="fatherName"
            value={formData.fatherName}
            onChange={(value) => handleChange("fatherName", value)}
            required
          />
          <InputField
            label="اسم الجد"
            id="grandfatherName"
            name="grandfatherName"
            value={formData.grandfatherName}
            onChange={(value) => handleChange("grandfatherName", value)}
            required
          />
          <InputField
            label="اسم العائلة"
            id="familyName"
            name="familyName"
            value={formData.familyName}
            onChange={(value) => handleChange("familyName", value)}
            required
          />
          <InputField
            label="الرقم الوطني"
            id="nationalNumber"
            name="nationalNumber"
            value={formData.nationalNumber}
            onChange={(value) => handleChange("nationalNumber", value)}
            required
          />
          <InputField
            label="مكان الميلاد"
            id="birthPlace"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={(value) => handleChange("birthPlace", value)}
            required
          />
          <InputField
            label="تاريخ الميلاد"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={(value) => handleChange("birthDate", value)}
            type="date"
            required
          />
          <SelectField
            label="الجنس"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={(value) => handleChange("gender", value)}
            options={GENDER_TYPES}
            required
          />
          <SelectField
            label="الحالة الاجتماعية"
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={(value) => handleChange("maritalStatus", value)}
            options={MARITAL_STATUS_TYPES}
            required
          />
          <InputField
            label="المهنة"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={(value) => handleChange("occupation", value)}
          />
          <InputField
            label="المستوى التعليمي"
            id="educationLevel"
            name="educationLevel"
            value={formData.educationLevel}
            onChange={(value) => handleChange("educationLevel", value)}
          />
        </div>
      </Section>
    ),
    [
      formData.firstName,
      formData.fatherName,
      formData.grandfatherName,
      formData.familyName,
      formData.nationalNumber,
      formData.birthPlace,
      formData.birthDate,
      formData.gender,
      formData.maritalStatus,
      formData.occupation,
      formData.educationLevel,
      handleChange,
    ]
  );

  const currentPassportSection = useMemo(
    () => (
      <Section title="معلومات جواز السفر الحالي">
        <div className="mb-4">
          <CheckboxField
            label="أملك جواز سفر حالي"
            id="hasCurrentPassport"
            name="hasCurrentPassport"
            checked={formData.hasCurrentPassport}
            onChange={(checked) => handleChange("hasCurrentPassport", checked)}
          />
        </div>

        {formData.hasCurrentPassport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="رقم جواز السفر الحالي"
              id="currentPassportNumber"
              name="currentPassportNumber"
              value={formData.currentPassportNumber}
              onChange={(value) => handleChange("currentPassportNumber", value)}
              required
            />
            <InputField
              label="مكان الإصدار"
              id="currentPassportIssuePlace"
              name="currentPassportIssuePlace"
              value={formData.currentPassportIssuePlace}
              onChange={(value) => handleChange("currentPassportIssuePlace", value)}
              required
            />
            <InputField
              label="تاريخ الإصدار"
              id="currentPassportIssueDate"
              name="currentPassportIssueDate"
              value={formData.currentPassportIssueDate}
              onChange={(value) => handleChange("currentPassportIssueDate", value)}
              type="date"
              required
            />
            <InputField
              label="تاريخ انتهاء الصلاحية"
              id="currentPassportExpiryDate"
              name="currentPassportExpiryDate"
              value={formData.currentPassportExpiryDate}
              onChange={(value) => handleChange("currentPassportExpiryDate", value)}
              type="date"
              required
            />
          </div>
        )}
      </Section>
    ),
    [
      formData.hasCurrentPassport,
      formData.currentPassportNumber,
      formData.currentPassportIssuePlace,
      formData.currentPassportIssueDate,
      formData.currentPassportExpiryDate,
      handleChange,
    ]
  );

  const parentInfoSection = useMemo(
    () => (
      <Section title="معلومات الوالدين">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="اسم الأب الكامل"
            id="fatherFullName"
            name="fatherFullName"
            value={formData.fatherFullName}
            onChange={(value) => handleChange("fatherFullName", value)}
          />
          <InputField
            label="جنسية الأب"
            id="fatherNationality"
            name="fatherNationality"
            value={formData.fatherNationality}
            onChange={(value) => handleChange("fatherNationality", value)}
          />
          <InputField
            label="اسم الأم الكامل"
            id="motherFullName"
            name="motherFullName"
            value={formData.motherFullName}
            onChange={(value) => handleChange("motherFullName", value)}
          />
          <InputField
            label="جنسية الأم"
            id="motherNationality"
            name="motherNationality"
            value={formData.motherNationality}
            onChange={(value) => handleChange("motherNationality", value)}
          />
        </div>
      </Section>
    ),
    [
      formData.fatherFullName,
      formData.fatherNationality,
      formData.motherFullName,
      formData.motherNationality,
      handleChange,
    ]
  );

  const contactInfoSection = useMemo(
    () => (
      <Section title="معلومات الاتصال">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="العنوان في ليبيا"
            id="addressLibya"
            name="addressLibya"
            value={formData.addressLibya}
            onChange={(value) => handleChange("addressLibya", value)}
            required
          />
          <InputField
            label="رقم الهاتف في ليبيا"
            id="phoneLibya"
            name="phoneLibya"
            value={formData.phoneLibya}
            onChange={(value) => handleChange("phoneLibya", value)}
            type="tel"
            required
          />
          <InputField
            label="العنوان في الخارج"
            id="addressAbroad"
            name="addressAbroad"
            value={formData.addressAbroad}
            onChange={(value) => handleChange("addressAbroad", value)}
          />
          <InputField
            label="رقم الهاتف في الخارج"
            id="phoneAbroad"
            name="phoneAbroad"
            value={formData.phoneAbroad}
            onChange={(value) => handleChange("phoneAbroad", value)}
            type="tel"
          />
          <InputField
            label="البريد الإلكتروني"
            id="email"
            name="email"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            type="email"
          />
        </div>

        <div className="mt-4">
          <h3 className="font-medium mb-2">جهة اتصال للطوارئ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="الاسم"
              id="emergencyContactName"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(value) => handleChange("emergencyContactName", value)}
              required
            />
            <InputField
              label="صلة القرابة"
              id="emergencyContactRelation"
              name="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={(value) => handleChange("emergencyContactRelation", value)}
              required
            />
            <InputField
              label="رقم الهاتف"
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={(value) => handleChange("emergencyContactPhone", value)}
              type="tel"
              required
            />
          </div>
        </div>
      </Section>
    ),
    [
      formData.addressLibya,
      formData.phoneLibya,
      formData.addressAbroad,
      formData.phoneAbroad,
      formData.email,
      formData.emergencyContactName,
      formData.emergencyContactRelation,
      formData.emergencyContactPhone,
      handleChange,
    ]
  );

  const passportOptionsSection = useMemo(
    () => (
      <Section title="خيارات جواز السفر">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="نوع جواز السفر"
            id="passportType"
            name="passportType"
            value={formData.passportType}
            onChange={(value) => handleChange("passportType", value)}
            options={PASSPORT_TYPES}
            required
          />
          <SelectField
            label="عدد الصفحات"
            id="numberOfPages"
            name="numberOfPages"
            value={formData.numberOfPages}
            onChange={(value) => handleChange("numberOfPages", value)}
            options={PAGE_OPTIONS}
            required
          />
          <SelectField
            label="نوع المعالجة"
            id="processingType"
            name="processingType"
            value={formData.processingType}
            onChange={(value) => handleChange("processingType", value)}
            options={PROCESSING_TYPES}
            required
          />
        </div>
      </Section>
    ),
    [
      formData.passportType,
      formData.numberOfPages,
      formData.processingType,
      handleChange,
    ]
  );

  const additionalInfoSection = useMemo(
    () => (
      <Section title="معلومات إضافية">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="سبب السفر"
            id="travelReason"
            name="travelReason"
            value={formData.travelReason}
            onChange={(value) => handleChange("travelReason", value)}
          />
          <InputField
            label="وجهة السفر"
            id="travelDestination"
            name="travelDestination"
            value={formData.travelDestination}
            onChange={(value) => handleChange("travelDestination", value)}
          />
        </div>

        <div className="mt-4">
          <CheckboxField
            label="هل سبق وأن فقدت جواز سفر؟"
            id="previousPassportLost"
            name="previousPassportLost"
            checked={formData.previousPassportLost}
            onChange={(checked) => handleChange("previousPassportLost", checked)}
          />

          {formData.previousPassportLost && (
            <div className="mt-2">
              <InputField
                label="تفاصيل فقدان الجواز السابق"
                id="previousPassportLostDetails"
                name="previousPassportLostDetails"
                value={formData.previousPassportLostDetails || ""}
                onChange={(value) => handleChange("previousPassportLostDetails", value)}
                required
              />
            </div>
          )}
        </div>
      </Section>
    ),
    [
      formData.travelReason,
      formData.travelDestination,
      formData.previousPassportLost,
      formData.previousPassportLostDetails,
      handleChange,
    ]
  );

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        نموذج إصدار جواز سفر
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Photo Upload Section */}
        <Section title="الصورة الشخصية">
          <div className="flex flex-col items-center">
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              يرجى تحميل صورة شخصية حديثة بخلفية بيضاء (حجم 4×6 سم).
            </p>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 rounded-md w-full max-w-md">
              <div className="flex flex-col items-center">
                {formData.photo ? (
                  <div className="mb-3">
                    <img
                      src={URL.createObjectURL(formData.photo)}
                      alt="صورة شخصية"
                      className="h-40 w-32 object-cover border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange("photo", undefined as unknown as string)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm dark:text-red-400 dark:hover:text-red-300"
                    >
                      إزالة الصورة
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 text-gray-400 dark:text-gray-600">
                    <div className="h-40 w-32 border-2 border-dashed rounded-md flex items-center justify-center">
                      <span>معاينة الصورة</span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <Upload className="ml-2" size={16} />
                  <span>تحميل صورة</span>
                </label>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  PNG، JPG، أو JPEG (الحد الأقصى: 2MB)
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Form Sections */}
        {personalInfoSection}
        {currentPassportSection}
        {parentInfoSection}
        {contactInfoSection}
        {passportOptionsSection}
        {additionalInfoSection}

        {/* Attachments Section */}
        <Section title="المرفقات">
          <AttachmentDocuments
            uploadedAttachments={uploadedAttachments}
            onAttachmentUpload={handleAttachmentUpload}
            onAttachmentTypeChange={handleAttachmentTypeChange}
            onRemoveAttachment={removeAttachment}
            attachmentTypeOptions={ATTACHMENT_TYPE_OPTIONS}
          />
        </Section>
        
        {/* Submission Status */}
        {submitStatus.message && (
          <div className={`p-4 rounded-md ${
            submitStatus.success 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            <p className="text-center font-semibold">{submitStatus.message}</p>
          </div>
        )}
        
        {/* Terms and Conditions */}
        <div className="mb-4">
          <CheckboxField
            label="أوافق على الشروط والأحكام المتعلقة بإصدار جواز السفر"
            id="agreesToTerms"
            name="agreesToTerms"
            checked={formData.agreesToTerms}
            onChange={(checked) => handleChange("agreesToTerms", checked)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitStatus.isSubmitting}
          className={`py-2 ${
            submitStatus.isSubmitting 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-600 hover:bg-green-700"
          } text-white border-none rounded-md font-semibold transition-colors duration-200`}
        >
          {submitStatus.isSubmitting ? "جاري الإرسال..." : "تقديم الطلب"}
        </button>
      </form>
    </div>
  );
};

export default IssuePassport;