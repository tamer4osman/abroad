// Types for Visa application form
export interface VisaFormData {
  // Personal Information
  firstName: string;
  surname: string;
  fatherName: string;
  nationality: string;
  dob: string;
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
  issuedOn: string;
  validTo: string;
  placeOfIssue?: string;
  
  // Visa Request Information
  purposeOfVisit: string;
  transitDestination?: string;
  requiredPeriod: string;
  numberOfEntries?: string;
  
  // Sponsor Information
  sponsorType: string;
  sponsorName: string;
  sponsorAddressInLibya: string;
  sponsorPhone: string;
  
  // Previous Travel History
  everBeenToLibya: string;
  lastEntryDate?: string;
  lastDepartureDate?: string;
  previousVisitPurpose?: string;
  lastAddressInLibya?: string;
  
  // Additional Information
  additionalInformation?: string;
  
  // Attachments
  passportCopy?: File | null;
  photoId?: File | null;
  invitationLetter?: File | null;
  additionalDocuments?: File[] | null;
}

// Form section types
export type FormSection = 
  | 'personalInfo'
  | 'contactInfo'
  | 'passportInfo'
  | 'visaDetails'
  | 'sponsorInfo'
  | 'travelHistory'
  | 'additionalInfo'
  | 'attachments'
  | 'review';

// Form progress tracking
export interface VisaFormProgress {
  currentStep: FormSection;
  completedSections: Set<FormSection>;
  hasErrors: boolean;
}

// API return type when submitting form
export interface VisaFormSubmissionResult {
  success: boolean;
  message: string;
  referenceNumber?: string;
  errors?: string[];
}