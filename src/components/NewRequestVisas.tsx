// src/components/NewRequestVisas.tsx
import React, { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { FilePlus, Send} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  SEX_OPTIONS, 
  MARITAL_STATUSES, 
  DOCUMENT_TYPES, 
  VISA_PURPOSES, 
  SPONSOR_TYPES, 
  YES_NO_OPTIONS,
  COUNTRIES 
} from '../constants/VisaForm.constants';
import AttachmentDocuments from './common/AttachmentDocuments';
import PhoneNumberField from './common/PhoneNumberField';
// Update the import to match the actual exported function name from '../services/api'
import { registerVisa } from '../services/api';
// If registerVisa is a named export, use the above line.
// If it's a named export with a different name, use:
// import { correctExportName as registerVisa } from '../services/api';

// Define visa document types
const VISA_DOCUMENT_TYPES = [
  { value: "passport_copy", label: "صورة عن جواز السفر" },
  { value: "photo_id", label: "صورة شخصية" },
  { value: "invitation_letter", label: "خطاب دعوة" },
  { value: "hotel_reservation", label: "حجز فندق" },
  { value: "flight_itinerary", label: "جدول الرحلة" },
  { value: "bank_statement", label: "كشف حساب بنكي" },
  { value: "sponsorship_letter", label: "خطاب الكفالة" },
  { value: "employment_letter", label: "خطاب عمل" },
  { value: "other", label: "أخرى" },
];

// --- Interfaces ---
interface VisaFormData {
  // Personal Particulars
  picture?: File | null;
  firstName: string;
  surname: string;
  fatherName: string;
  nationality: string;
  formerNationality: string;
  motherName: string;
  dob: string;
  sex: 'male' | 'female' | '';
  placeOfBirth: string;
  occupation: string;
  qualifications: string;
  maritalStatus: 'single' | 'married' | 'divorced' | '';
  religion: string;

  // Contact Info
  address: string;
  unitOrApt: string;
  country: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;

  // Passport Info
  passportNumber: string;
  documentType: 'passport' | 'travel_document' | '';
  issuedOn: string;
  validTo: string;

  // General Information (Page 2)
  purposeOfVisit: 'transit' | 'work' | 'visit' | 'tourism' | 'family_visit' | '';
  requiredPeriod: string;
  transitDestination: string; // Shown if purpose is transit

  // Sponsor (Page 2)
  sponsorType: 'government' | 'company' | 'family' | 'other' | '';
  sponsorName: string;
  sponsorAddressInLibya: string;
  sponsorPhone: string;

  // Previous Entries (Page 2)
  everBeenToLibya: 'yes' | 'no' | '';
  lastDepartureDate: string; // Shown if everBeenToLibya is 'yes'
  lastEntryDate: string;     // Shown if everBeenToLibya is 'yes'
  previousVisitPurpose: string; // Shown if everBeenToLibya is 'yes'
  lastAddressInLibya: string; // Shown if everBeenToLibya is 'yes'
  previousEntryNature: string; // Shown if everBeenToLibya is 'yes' (work/mission details)
  previousMeansOfTravel: string; // Shown if everBeenToLibya is 'yes' and purpose was transit
  
  // References & Documents (Page 2)
  referencesInLibya: string;
  enclosedDocuments: string;
}

// Add interface for attachments
interface AttachmentData {
  id: string;
  type: string;
  file: File;
}

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

const InputField: React.FC<InputFieldProps> = React.memo(({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
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
));

interface TextAreaFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  disabled?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = React.memo(({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  disabled = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <textarea
      id={id}
      name={name}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
  </div>
));

interface SelectFieldProps {
  label: string;
  id: string;
  name: keyof VisaFormData;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (name: keyof VisaFormData, value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = React.memo(({
  label,
  id,
  name,
  options,
  value,
  onChange,
  required = false,
  disabled = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </label>
    <select
      id={id}
      name={name as string}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
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
));

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = React.memo(({ title, children }) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
));

// --- Custom hook for form state management ---
const useVisaFormState = () => {
  const initialFormData = useMemo<VisaFormData>(() => ({
    // Personal Particulars
    picture: null,
    firstName: '',
    surname: '',
    fatherName: '',
    nationality: '',
    formerNationality: '',
    motherName: '',
    dob: '',
    sex: '',
    placeOfBirth: '',
    occupation: '',
    qualifications: '',
    maritalStatus: '',
    religion: '',

    // Contact Info
    address: '',
    unitOrApt: '',
    country: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',

    // Passport Info
    passportNumber: '',
    documentType: '',
    issuedOn: '',
    validTo: '',

    // General Information
    purposeOfVisit: '',
    requiredPeriod: '',
    transitDestination: '',

    // Sponsor
    sponsorType: '',
    sponsorName: '',
    sponsorAddressInLibya: '',
    sponsorPhone: '',

    // Previous Entries
    everBeenToLibya: '',
    lastDepartureDate: '',
    lastEntryDate: '',
    previousVisitPurpose: '',
    lastAddressInLibya: '',
    previousEntryNature: '',
    previousMeansOfTravel: '',

    // References & Documents
    referencesInLibya: '',
    enclosedDocuments: '',
  }), []);

  const [formData, setFormData] = useState<VisaFormData>(initialFormData);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);

  const handleChange = useCallback((name: keyof VisaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, picture: file }));
      setPicturePreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, picture: null }));
      setPicturePreview(null);
    }
  }, []);

  // Handle attachment upload
  const handleAttachmentUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments = Array.from(e.target.files).map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: '',
        file
      }));
      
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  }, []);

  // Handle attachment type change
  const handleAttachmentTypeChange = useCallback((id: string, type: string) => {
    setAttachments(prev => 
      prev.map(attachment => 
        attachment.id === id ? { ...attachment, type } : attachment
      )
    );
  }, []);

  // Handle attachment removal
  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setPicturePreview(null);
    setAttachments([]);
  }, [initialFormData]);

  return {
    formData,
    picturePreview,
    attachments,
    handleChange,
    handleFileChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    handleRemoveAttachment,
    resetForm
  };
};

// --- Main Component ---
const NewRequestVisas: React.FC = () => {
  const {
    formData,
    picturePreview,
    attachments,
    handleChange,
    handleFileChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    handleRemoveAttachment,
    resetForm
  } = useVisaFormState();

  // Add state for submission status
  const [submitStatus, setSubmitStatus] = useState<{
    isSubmitting: boolean;
    success?: boolean;
    message?: string;
  }>({
    isSubmitting: false,
  });

  // Helper function to validate form data
  const validateForm = useCallback(() => {
    // Check for required fields
    if (
      !formData.firstName || 
      !formData.surname || 
      !formData.passportNumber || 
      !formData.purposeOfVisit
    ) {
      return {
        isValid: false,
        errorMessage: "يرجى ملء جميع الحقول الإلزامية"
      };
    }

    // Check for ID photo specifically
    if (!formData.picture) {
      return {
        isValid: false,
        errorMessage: "يرجى إرفاق صورة شخصية"
      };
    }

    return { isValid: true };
  }, [formData]);

  // Helper function to prepare attachment data
  const prepareAttachmentData = useCallback(() => {
    // Create base attachment with photo ID
    const photoAttachment = {
      type: "photo_id",
      filename: formData.picture?.name,
      fileType: formData.picture?.type,
      fileSize: formData.picture?.size
    };
    
    // Process other attachments
    const otherAttachments = attachments.map(attachment => ({
      type: attachment.type,
      filename: attachment.file.name,
      fileType: attachment.file.type,
      fileSize: attachment.file.size
    }));
    
    return [photoAttachment, ...otherAttachments];
  }, [formData.picture, attachments]);

  // Helper function to prepare previous entries data
  const preparePreviousEntriesData = useCallback(() => {
    if (formData.everBeenToLibya !== 'yes') {
      return undefined;
    }
    
    return {
      lastEntryDate: formData.lastEntryDate,
      lastDepartureDate: formData.lastDepartureDate,
      previousVisitPurpose: formData.previousVisitPurpose,
      lastAddressInLibya: formData.lastAddressInLibya,
      previousEntryNature: formData.previousEntryNature || undefined,
      previousMeansOfTravel: formData.previousMeansOfTravel || undefined
    };
  }, [
    formData.everBeenToLibya,
    formData.lastEntryDate,
    formData.lastDepartureDate,
    formData.previousVisitPurpose,
    formData.lastAddressInLibya,
    formData.previousEntryNature,
    formData.previousMeansOfTravel
  ]);

  // Helper function to build visa application data
  const buildVisaApplicationData = useCallback(() => {
    // Get attachments and previous entries data
    const attachmentsData = prepareAttachmentData();
    const previousEntriesData = preparePreviousEntriesData();
    
    return {
      // Required fields from VisaRegistrationData type
      citizenId: formData.passportNumber,
      visaType: formData.purposeOfVisit,
      country: formData.nationality,
      applicationDate: new Date().toISOString(),
      
      // Applicant personal information
      applicant: {
        firstName: formData.firstName,
        surname: formData.surname,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        nationality: formData.nationality,
        formerNationality: formData.formerNationality || undefined,
        dob: formData.dob,
        placeOfBirth: formData.placeOfBirth,
        sex: formData.sex,
        occupation: formData.occupation || undefined,
        qualifications: formData.qualifications || undefined,
        maritalStatus: formData.maritalStatus,
        religion: formData.religion || undefined
      },
      
      // Contact information
      contactInfo: {
        address: formData.address,
        unitOrApt: formData.unitOrApt || undefined,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
        phone: formData.phone,
        email: formData.email
      },
      
      // Travel document information
      travelDocument: {
        passportNumber: formData.passportNumber,
        documentType: formData.documentType,
        issuedOn: formData.issuedOn,
        validTo: formData.validTo
      },
      
      // Visa request details
      visaDetails: {
        purposeOfVisit: formData.purposeOfVisit,
        requiredPeriod: formData.requiredPeriod,
        transitDestination: formData.purposeOfVisit === 'transit' ? formData.transitDestination : undefined
      },
      
      // Sponsor information
      sponsor: {
        sponsorType: formData.sponsorType,
        sponsorName: formData.sponsorName,
        sponsorAddress: formData.sponsorAddressInLibya,
        sponsorPhone: formData.sponsorPhone
      },
      
      // Previous entries information
      previousEntries: previousEntriesData,
      
      // Additional information
      additionalInfo: {
        referencesInLibya: formData.referencesInLibya || undefined
      },
      
      // Attach prepared metadata
      attachments: attachmentsData
    };
  }, [
    formData,
    prepareAttachmentData,
    preparePreviousEntriesData
  ]);

  // Define the expected response type for visa registration
  interface RegisterVisaResponse {
    applicationId?: string;
    id?: string;
    [key: string]: unknown;
  }
  
  // Helper function to handle submission success
  const handleSubmitSuccess = useCallback((response: RegisterVisaResponse) => {
    setSubmitStatus({
      isSubmitting: false,
      success: true,
      message: `تم تقديم طلب التأشيرة بنجاح! رقم الطلب: ${response.applicationId || response.id}`
    });
    
    // Reset form after successful submission
    resetForm();
  }, [resetForm]);

  // Helper function to handle submission error
  const handleSubmitError = useCallback((error: unknown) => {
    console.error("Error submitting visa application:", error);
    setSubmitStatus({
      isSubmitting: false,
      success: false,
      message: error instanceof Error ? error.message : "حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى."
    });
  }, []);

  // Main submit handler with reduced nesting
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Begin submission - set loading state
    setSubmitStatus({
      isSubmitting: true,
      message: "جاري تقديم الطلب...",
      success: undefined
    });

    // Validate the form
    const validationResult = validateForm();
    if (!validationResult.isValid) {
      setSubmitStatus({
        isSubmitting: false,
        success: false,
        message: validationResult.errorMessage
      });
      return;
    }

    try {
      // Prepare visa application data
      const visaApplication = buildVisaApplicationData();
      
      // Submit the application
      const response = await registerVisa(visaApplication);
      
      // Handle success
      handleSubmitSuccess(response);
    } catch (error: unknown) {
      // Handle error
      handleSubmitError(error);
    }
  }, [validateForm, buildVisaApplicationData, handleSubmitSuccess, handleSubmitError]);

  // Memoized form sections
  const personalInfoSection = useMemo(() => (
    <Section title="بيانات شخصية عن طالب تأشيرة الدخول">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
        {/* Picture Upload */}
        <div className="md:col-span-1 mb-4 md:mb-0 flex flex-col items-center justify-center">
          <label htmlFor="picture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الصورة
          </label>
          <div className="w-32 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center text-gray-400 dark:text-gray-500 relative overflow-hidden">
            {picturePreview ? (
              <img src={picturePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <FilePlus size={40} />
            )}
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
        
        {/* Personal Details Fields */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <InputField
            label="الاسم"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(value) => handleChange('firstName', value)}
            required
          />
          <InputField
            label="اللقب"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={(value) => handleChange('surname', value)}
            required
          />
          <InputField
            label="اسم الأب الثلاثي"
            id="fatherName"
            name="fatherName"
            value={formData.fatherName}
            onChange={(value) => handleChange('fatherName', value)}
            required
          />
          <InputField
            label="اسم الأم الثلاثي"
            id="motherName"
            name="motherName"
            value={formData.motherName}
            onChange={(value) => handleChange('motherName', value)}
            required
          />
          <SelectField
            label="الجنسية"
            id="nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            options={COUNTRIES}
            required
          />
          <InputField
            label="الجنسية السابقة"
            id="formerNationality"
            name="formerNationality"
            value={formData.formerNationality}
            onChange={(value) => handleChange('formerNationality', value)}
          />
          <InputField
            label="تاريخ الميلاد"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={(value) => handleChange('dob', value)}
            type="date"
            required
          />
          <InputField
            label="مكان الميلاد"
            id="placeOfBirth"
            name="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={(value) => handleChange('placeOfBirth', value)}
            required
          />
          <SelectField
            label="الجنس"
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            options={SEX_OPTIONS}
            required
          />
          <InputField
            label="المهنة"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={(value) => handleChange('occupation', value)}
          />
          <InputField
            label="المؤهل"
            id="qualifications"
            name="qualifications"
            value={formData.qualifications}
            onChange={(value) => handleChange('qualifications', value)}
          />
          <SelectField
            label="الوضع العائلي"
            id="maritalStatus"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            options={MARITAL_STATUSES}
            required
          />
          <InputField
            label="الديانة"
            id="religion"
            name="religion"
            value={formData.religion}
            onChange={(value) => handleChange('religion', value)}
          />
        </div>
      </div>
    </Section>
  ), [
    formData.firstName, formData.surname, formData.fatherName, formData.motherName,
    formData.nationality, formData.formerNationality, formData.dob, formData.placeOfBirth,
    formData.sex, formData.occupation, formData.qualifications, formData.maritalStatus,
    formData.religion, picturePreview, handleChange, handleFileChange
  ]);

  const contactInfoSection = useMemo(() => (
    <Section title="معلومات الإتصال">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
        <InputField
          label="العنوان"
          id="address"
          name="address"
          value={formData.address}
          onChange={(value) => handleChange('address', value)}
          required
        />
        <InputField
          label="رقم الوحدة أو الشقة"
          id="unitOrApt"
          name="unitOrApt"
          value={formData.unitOrApt}
          onChange={(value) => handleChange('unitOrApt', value)}
        />
        <InputField
          label="المدينة"
          id="city"
          name="city"
          value={formData.city}
          onChange={(value) => handleChange('city', value)}
          required
        />
        <SelectField
          label="الدولة"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          options={COUNTRIES}
          required
        />
        <InputField
          label="الرمز البريدي"
          id="postalCode"
          name="postalCode"
          value={formData.postalCode}
          onChange={(value) => handleChange('postalCode', value)}
          required
        />
        <PhoneNumberField
          label="الهاتف"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={(value) => handleChange('phone', value)}
          required
        />
        <InputField
          label="البريد الألكتروني"
          id="email"
          name="email"
          value={formData.email}
          onChange={(value) => handleChange('email', value)}
          type="email"
          required
        />
      </div>
    </Section>
  ), [
    formData.address, formData.unitOrApt, formData.city, formData.country,
    formData.postalCode, formData.phone, formData.email, handleChange
  ]);

  const passportInfoSection = useMemo(() => (
    <Section title="بيانات جواز السفر">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
        <InputField
          label="رقم الجواز"
          id="passportNumber"
          name="passportNumber"
          value={formData.passportNumber}
          onChange={(value) => handleChange('passportNumber', value)}
          required
        />
        <SelectField
          label="نوع مستند السفر"
          id="documentType"
          name="documentType"
          value={formData.documentType}
          onChange={handleChange}
          options={DOCUMENT_TYPES}
          required
        />
        <InputField
          label="تاريخ إصداره"
          id="issuedOn"
          name="issuedOn"
          value={formData.issuedOn}
          onChange={(value) => handleChange('issuedOn', value)}
          type="date"
          required
        />
        <InputField
          label="تاريخ انتهاء صلاحيته"
          id="validTo"
          name="validTo"
          value={formData.validTo}
          onChange={(value) => handleChange('validTo', value)}
          type="date"
          required
        />
      </div>
    </Section>
  ), [
    formData.passportNumber, formData.documentType, 
    formData.issuedOn, formData.validTo, handleChange
  ]);

  const generalInfoSection = useMemo(() => (
    <Section title="معلومات عامة">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <SelectField
          label="الغرض من الدخول"
          id="purposeOfVisit"
          name="purposeOfVisit"
          value={formData.purposeOfVisit}
          onChange={handleChange}
          options={VISA_PURPOSES}
          required
        />
        <InputField
          label="المدة المطلوبة للإقامة"
          id="requiredPeriod"
          name="requiredPeriod"
          value={formData.requiredPeriod}
          onChange={(value) => handleChange('requiredPeriod', value)}
          required
        />
      </div>
      {formData.purposeOfVisit === 'transit' && (
        <InputField
          label="إذا كانت عبور اذكر الوجهة"
          id="transitDestination"
          name="transitDestination"
          value={formData.transitDestination}
          onChange={(value) => handleChange('transitDestination', value)}
          required
        />
      )}
    </Section>
  ), [
    formData.purposeOfVisit, formData.requiredPeriod, 
    formData.transitDestination, handleChange
  ]);

  const sponsorInfoSection = useMemo(() => (
    <Section title="معلومات الضامن">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
        <SelectField
          label="نوع الضامن"
          id="sponsorType"
          name="sponsorType"
          value={formData.sponsorType}
          onChange={handleChange}
          options={SPONSOR_TYPES}
          required
        />
        <InputField
          label="اسم الضامن"
          id="sponsorName"
          name="sponsorName"
          value={formData.sponsorName}
          onChange={(value) => handleChange('sponsorName', value)}
          required
        />
        <InputField
          label="عنوان الإقامة في ليبيا"
          id="sponsorAddressInLibya"
          name="sponsorAddressInLibya"
          value={formData.sponsorAddressInLibya}
          onChange={(value) => handleChange('sponsorAddressInLibya', value)}
          required
        />
        <PhoneNumberField
          label="رقم الهاتف"
          id="sponsorPhone"
          name="sponsorPhone"
          value={formData.sponsorPhone}
          onChange={(value) => handleChange('sponsorPhone', value)}
          required
        />
      </div>
    </Section>
  ), [
    formData.sponsorType, formData.sponsorName, 
    formData.sponsorAddressInLibya, formData.sponsorPhone, handleChange
  ]);

  const previousEntriesSection = useMemo(() => (
    <Section title="الدخول السابق الى ليبيا">
      <SelectField
        label="هل سبق لك الدخول الى ليبيا؟"
        id="everBeenToLibya"
        name="everBeenToLibya"
        value={formData.everBeenToLibya}
        onChange={handleChange}
        options={YES_NO_OPTIONS}
        required
      />
      
      {formData.everBeenToLibya === 'yes' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 space-y-4 border-t pt-4 border-gray-200 dark:border-gray-600"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField
              label="متى دخلت آخر مرة؟"
              id="lastEntryDate"
              name="lastEntryDate"
              value={formData.lastEntryDate}
              onChange={(value) => handleChange('lastEntryDate', value)}
              type="date"
              required
            />
            <InputField
              label="متى غادرت آخر مرة؟"
              id="lastDepartureDate"
              name="lastDepartureDate"
              value={formData.lastDepartureDate}
              onChange={(value) => handleChange('lastDepartureDate', value)}
              type="date"
              required
            />
          </div>
          <InputField
            label="غرض الزيارة السابقة"
            id="previousVisitPurpose"
            name="previousVisitPurpose"
            value={formData.previousVisitPurpose}
            onChange={(value) => handleChange('previousVisitPurpose', value)}
            required
          />
          <InputField
            label="اخر عنوان اقمت به في ليبيا"
            id="lastAddressInLibya"
            name="lastAddressInLibya"
            value={formData.lastAddressInLibya}
            onChange={(value) => handleChange('lastAddressInLibya', value)}
            required
          />
          <InputField
            label="إذا كان الدخول للعمل أو المهمة، حدد النوع"
            id="previousEntryNature"
            name="previousEntryNature"
            value={formData.previousEntryNature}
            onChange={(value) => handleChange('previousEntryNature', value)}
          />
          {formData.purposeOfVisit === 'transit' && (
            <InputField
              label="واسطة السفر إليه (للعبور)"
              id="previousMeansOfTravel"
              name="previousMeansOfTravel"
              value={formData.previousMeansOfTravel}
              onChange={(value) => handleChange('previousMeansOfTravel', value)}
            />
          )}
        </motion.div>
      )}
    </Section>
  ), [
    formData.everBeenToLibya, formData.lastEntryDate, formData.lastDepartureDate,
    formData.previousVisitPurpose, formData.lastAddressInLibya, formData.previousEntryNature,
    formData.previousMeansOfTravel, formData.purposeOfVisit, handleChange
  ]);

  const additionalInfoSection = useMemo(() => (
    <Section title="معلومات إضافية">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <TextAreaField
          label="أهم المعارف والأصدقاء بليبيا"
          id="referencesInLibya"
          name="referencesInLibya"
          value={formData.referencesInLibya}
          onChange={(value) => handleChange('referencesInLibya', value)}
        />
      </div>
    </Section>
  ), [formData.referencesInLibya, handleChange]);

  const attachmentsSection = useMemo(() => (
    <Section title="المرفقات">
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          يرجى تحميل المستندات المطلوبة وتحديد نوع كل مستند
        </p>
        <AttachmentDocuments
          uploadedAttachments={attachments}
          onAttachmentTypeChange={handleAttachmentTypeChange}
          onRemoveAttachment={handleRemoveAttachment}
          onAttachmentUpload={handleAttachmentUpload}
          attachmentTypeOptions={VISA_DOCUMENT_TYPES}
        />
      </div>
    </Section>
  ), [attachments, handleAttachmentTypeChange, handleRemoveAttachment, handleAttachmentUpload]);

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        نموذج تأشيرة دخول
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {personalInfoSection}
        {contactInfoSection}
        {passportInfoSection}
        {generalInfoSection}
        {sponsorInfoSection}
        {previousEntriesSection}
        {additionalInfoSection}
        {attachmentsSection}

        {/* Submission Status Message */}
        {submitStatus.message && (
          <div className={`p-4 rounded-md mb-4 ${
            submitStatus.success 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
              : submitStatus.success === false
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          }`}>
            <p className="text-center font-semibold">{submitStatus.message}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={submitStatus.isSubmitting}
            className={`py-2 px-6 ${
              submitStatus.isSubmitting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700"
            } text-white border-none rounded-md font-semibold transition-colors duration-200`}
          >
            {submitStatus.isSubmitting ? "جاري تقديم الطلب..." : "تقديم الطلب"}
            {!submitStatus.isSubmitting && <Send className="mr-2 inline-block" size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRequestVisas;