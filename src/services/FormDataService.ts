import { FormData } from '../types/BirthRegistration.types';
import { ValidationService } from './ValidationService';
import { useState, useCallback } from 'react';
import { FormSection, VisaFormProgress } from '../types/visa.types';

export interface FamilyMember {
  name: string;
  relationship: string;
  gender: string;
}

// Define a complete VisaFormData interface that matches ValidationService expectations
export interface VisaFormData {
  // Personal Information
  firstName: string;
  surname: string;
  fatherName: string;
  nationality: string;
  dob: string | Date;
  sex: string;
  placeOfBirth: string;
  maritalStatus: string;
  profession: string;
  
  // US Address
  usAddress: string;
  city: string;
  state: string;
  zip: string;
  
  // Contact Information
  phone: string;
  email: string;
  
  // Passport Information
  passportNumber: string;
  documentType: string;
  issuedOn: string | Date;
  validTo: string | Date;
  placeOfIssue: string;
  
  // Visa Request Information
  purposeOfVisit: string;
  transitDestination: string;
  requiredPeriod: string;
  numberOfEntries: string;
  
  // Sponsor Information
  sponsorType: string;
  sponsorName: string;
  sponsorAddressInLibya: string;
  sponsorPhone: string;
  
  // Previous Travel History
  everBeenToLibya: string;
  lastEntryDate?: string | Date;
  lastDepartureDate?: string | Date;
  previousVisitPurpose?: string;
  lastAddressInLibya?: string;
  
  // Additional Information
  additionalInformation?: string;
  
  // Attachments
  passportCopy: File | null;
  photoId: File | null;
  invitationLetter: File | null;
  additionalDocuments: File[] | null;
  
  // Index signature to allow dynamic access
  [key: string]: string | Date | File | File[] | null | undefined;
}

const initialFormData: VisaFormData = {
  // Personal Information
  firstName: '',
  surname: '',
  fatherName: '',
  nationality: '',
  dob: '',
  sex: '',
  placeOfBirth: '',
  maritalStatus: '',
  profession: '',
  
  // US Address
  usAddress: '',
  city: '',
  state: '',
  zip: '',
  
  // Contact Information
  phone: '',
  email: '',
  
  // Passport Information
  passportNumber: '',
  documentType: '',
  issuedOn: '',
  validTo: '',
  placeOfIssue: '',
  
  // Visa Request Information
  purposeOfVisit: '',
  transitDestination: '',
  requiredPeriod: '',
  numberOfEntries: '',
  
  // Sponsor Information
  sponsorType: '',
  sponsorName: '',
  sponsorAddressInLibya: '',
  sponsorPhone: '',
  
  // Previous Travel History
  everBeenToLibya: '',
  lastEntryDate: '',
  lastDepartureDate: '',
  previousVisitPurpose: '',
  lastAddressInLibya: '',
  
  // Additional Information
  additionalInformation: '',
  
  // Attachments
  passportCopy: null,
  photoId: null,
  invitationLetter: null,
  additionalDocuments: null,
};

const initialProgress: VisaFormProgress = {
  currentStep: 'personalInfo',
  completedSections: new Set(),
  hasErrors: false,
};

// Validation service instance
const validationService = new ValidationService();

export const useVisaFormState = () => {
  const [formData, setFormData] = useState<VisaFormData>(initialFormData);
  const [progress, setProgress] = useState<VisaFormProgress>(initialProgress);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  // Update form field
  const updateField = useCallback((field: keyof VisaFormData, value: string | null | File | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user makes changes
    setErrors([]);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((field: keyof VisaFormData, files: FileList | null) => {
    if (!files) return;
    
    if (field === 'additionalDocuments') {
      const fileArray = Array.from(files);
      setFormData(prev => ({ ...prev, [field]: fileArray }));
    } else {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  }, []);

  // Validate current section
  const validateSection = useCallback((section: FormSection) => {
    // Get all fields relevant to the current section
    const sectionFields: Record<FormSection, (keyof VisaFormData)[]> = {
      personalInfo: ['firstName', 'surname', 'fatherName', 'nationality', 'dob', 'sex', 'placeOfBirth', 'maritalStatus', 'profession'],
      contactInfo: ['usAddress', 'city', 'state', 'zip', 'phone', 'email'],
      passportInfo: ['passportNumber', 'documentType', 'issuedOn', 'validTo', 'placeOfIssue'],
      visaDetails: ['purposeOfVisit', 'transitDestination', 'requiredPeriod', 'numberOfEntries'],
      sponsorInfo: ['sponsorType', 'sponsorName', 'sponsorAddressInLibya', 'sponsorPhone'],
      travelHistory: ['everBeenToLibya', 'lastEntryDate', 'lastDepartureDate', 'previousVisitPurpose', 'lastAddressInLibya'],
      additionalInfo: ['additionalInformation'],
      attachments: ['passportCopy', 'photoId', 'invitationLetter', 'additionalDocuments'],
      review: [], // Review doesn't have specific fields to validate
    };
    
    // For the review section, validate the entire form
    if (section === 'review') {
      const validationResult = validationService.validateVisaForm(formData);
      setErrors(validationResult.errors);
      return validationResult.isValid;
    }
    
    // We only check required fields for this section
    const validationResult = validationService.validateVisaForm(formData);
    
    // Filter errors to only show those relevant to the current section
    const sectionErrors = validationResult.errors.filter(error => {
      // Check if error message contains any of the field names from this section
      return sectionFields[section].some(field => {
        // Convert the field name to a readable format with proper typing
        const fieldStr: string = field.toString();
        const readableField = fieldStr
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str: string) => str.toUpperCase());
        
        return error.includes(readableField);
      });
    });
    
    setErrors(sectionErrors);
    return sectionErrors.length === 0;
  }, [formData]);

  // Move to next section
  const nextSection = useCallback(() => {
    const sectionOrder: FormSection[] = [
      'personalInfo',
      'contactInfo',
      'passportInfo',
      'visaDetails',
      'sponsorInfo',
      'travelHistory',
      'additionalInfo',
      'attachments',
      'review'
    ];
    
    const currentIndex = sectionOrder.indexOf(progress.currentStep);
    
    // Validate current section before proceeding
    if (!validateSection(progress.currentStep)) {
      setProgress(prev => ({ ...prev, hasErrors: true }));
      return;
    }
    
    // If we're at the last step, there's no next section
    if (currentIndex === sectionOrder.length - 1) return;
    
    // Mark current section as complete
    const updatedCompletedSections = new Set(progress.completedSections);
    updatedCompletedSections.add(progress.currentStep);
    
    // Move to next section
    setProgress({
      currentStep: sectionOrder[currentIndex + 1],
      completedSections: updatedCompletedSections,
      hasErrors: false,
    });
  }, [progress, validateSection]);

  // Move to previous section
  const prevSection = useCallback(() => {
    const sectionOrder: FormSection[] = [
      'personalInfo',
      'contactInfo',
      'passportInfo',
      'visaDetails',
      'sponsorInfo',
      'travelHistory',
      'additionalInfo',
      'attachments',
      'review'
    ];
    
    const currentIndex = sectionOrder.indexOf(progress.currentStep);
    
    // If we're at the first step, there's no previous section
    if (currentIndex === 0) return;
    
    // Move to previous section
    setProgress(prev => ({
      ...prev,
      currentStep: sectionOrder[currentIndex - 1],
      hasErrors: false,
    }));
    
    // Clear errors when moving back
    setErrors([]);
  }, [progress]);

  // Go to specific section
  const goToSection = useCallback((section: FormSection) => {
    setProgress(prev => ({
      ...prev,
      currentStep: section,
      hasErrors: false,
    }));
    setErrors([]);
  }, []);

  // Submit form
  const submitForm = useCallback(async () => {
    // Validate entire form
    const validationResult = validationService.validateVisaForm(formData);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setProgress(prev => ({ ...prev, hasErrors: true }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would send the form data to the server
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulating successful submission
      setSubmitSuccess(true);
      setReferenceNumber(`VISA-${Date.now().toString().slice(-8)}`);
    } catch (error) {
      console.error('Error submitting visa form:', error);
      setSubmitSuccess(false);
      setErrors(['حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى. / An error occurred while submitting your application. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setProgress(initialProgress);
    setErrors([]);
    setSubmitSuccess(null);
    setReferenceNumber(null);
  }, []);

  return {
    formData,
    progress,
    errors,
    isSubmitting,
    submitSuccess,
    referenceNumber,
    updateField,
    handleFileUpload,
    validateSection,
    nextSection,
    prevSection,
    goToSection,
    submitForm,
    resetForm
  };
};

class FormDataService {
  private initialData: FormData = {
    // Child Info
    childName: "",
    dateOfBirth: "",
    placeOfBirthCity: "",
    placeOfBirthState: "",
    placeOfBirthCountry: "كندا",
    childGender: "",
    childType: "",
    childWeight: "",
    childCondition: "",
    previousBirths: "",

    // Parents Info
    fatherName: "",
    fatherLastName: "",
    motherName: "",
    motherLastName: "",
    motherNationality: "",
    motherAddressCity: "",
    motherEmail: "",
    motherPhoneNumber: "",
    fatherIdNumber: "",
    fatherOccupation: "",
    fatherReligion: "",
    marriageDate: "",
    familyBookNumber: "",

    // Informant Info
    informantType: "",
    informantName: "",
    informantLastName: "",
    informantIdNumber: "",
    informantOccupation: "",
    informantSignature: "",

    // Medical Info
    doctorName: "",

    // Witness Info
    witness1Name: "",
    witness1IdNumber: "",
    witness2Name: "",
    witness2IdNumber: "",

    // Family Members
      familyMembers: [] as FamilyMember[],
  };

  getInitialData = () => ({ ...this.initialData });

  // Simulate asynchronous API call using a pre-resolved promise
  submitForm = (formData: FormData): Promise<{ success: boolean; message: string }> => {
    // Log data for debugging only
    console.log("تم إرسال النموذج:", formData); // Note: Keeping the log message in Arabic as it's likely for internal debugging in Arabic context

    // Return a pre-resolved promise to avoid unnecessary setTimeout
    return Promise.resolve({
      success: true,
      message: "تم تسجيل الولادة بنجاح!", // Note: Keeping the success message in Arabic as it's likely part of the UI
    });
  }

  async submit(formData: FormData) {
    const validationService = new ValidationService();
    const { isValid, errors } = validationService.validateForm(formData);

    if (!isValid) {
      return { isValid: false, errors };
    }

    const submissionResult = await this.submitForm(formData);
    return { isValid: true, submissionResult };
  }
}

export { FormDataService };