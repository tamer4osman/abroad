// A utility file for visa form validation constants and functions

// Required fields for visa applications
export const VISA_REQUIRED_FIELDS = new Set([
  'firstName',
  'surname',
  'fatherName',
  'nationality',
  'dob',
  'sex',
  'placeOfBirth',
  'maritalStatus',
  'address', // Changed from usAddress to be more global
  'city',
  'country', // Changed from state to country
  'postalCode', // Changed from zip to postalCode
  'phone',
  'email',
  'passportNumber',
  'documentType',
  'issuedOn',
  'validTo',
  'purposeOfVisit',
  'requiredPeriod',
  'sponsorType',
  'sponsorName',
  'sponsorAddressInLibya',
  'sponsorPhone',
  'everBeenToLibya'
]);

// Conditional required fields based on other field values
export const CONDITIONAL_REQUIRED_FIELDS = {
  purposeOfVisit: {
    transit: ['transitDestination']
  },
  everBeenToLibya: {
    yes: ['lastEntryDate', 'lastDepartureDate', 'previousVisitPurpose', 'lastAddressInLibya']
  }
};

// Countries list for dropdowns
export const COUNTRIES = [
  { value: 'AF', label: 'أفغانستان' },
  { value: 'AL', label: 'ألبانيا' },
  { value: 'DZ', label: 'الجزائر' },
  { value: 'AR', label: 'الأرجنتين' },
  { value: 'AU', label: 'أستراليا' },
  { value: 'AT', label: 'النمسا' },
  { value: 'BE', label: 'بلجيكا' },
  { value: 'BR', label: 'البرازيل' },
  { value: 'CA', label: 'كندا' },
  { value: 'CN', label: 'الصين' },
  { value: 'EG', label: 'مصر' },
  { value: 'FR', label: 'فرنسا' },
  { value: 'DE', label: 'ألمانيا' },
  { value: 'IN', label: 'الهند' },
  { value: 'ID', label: 'إندونيسيا' },
  { value: 'IT', label: 'إيطاليا' },
  { value: 'JP', label: 'اليابان' },
  { value: 'JO', label: 'الأردن' },
  { value: 'KR', label: 'كوريا الجنوبية' },
  { value: 'LB', label: 'لبنان' },
  { value: 'LY', label: 'ليبيا' },
  { value: 'MY', label: 'ماليزيا' },
  { value: 'MX', label: 'المكسيك' },
  { value: 'MA', label: 'المغرب' },
  { value: 'NL', label: 'هولندا' },
  { value: 'NZ', label: 'نيوزيلندا' },
  { value: 'NG', label: 'نيجيريا' },
  { value: 'PK', label: 'باكستان' },
  { value: 'PS', label: 'فلسطين' },
  { value: 'PH', label: 'الفلبين' },
  { value: 'QA', label: 'قطر' },
  { value: 'SA', label: 'المملكة العربية السعودية' },
  { value: 'SG', label: 'سنغافورة' },
  { value: 'ZA', label: 'جنوب أفريقيا' },
  { value: 'ES', label: 'إسبانيا' },
  { value: 'SE', label: 'السويد' },
  { value: 'CH', label: 'سويسرا' },
  { value: 'SY', label: 'سوريا' },
  { value: 'TR', label: 'تركيا' },
  { value: 'AE', label: 'الإمارات العربية المتحدة' },
  { value: 'GB', label: 'المملكة المتحدة' },
  { value: 'US', label: 'الولايات المتحدة الأمريكية' },
  { value: 'YE', label: 'اليمن' }
];

// Document types for visa applications
export const DOCUMENT_TYPES = [
  { value: 'passport', label: 'جواز السفر' },
  { value: 'travel_document', label: 'وثيقة سفر' },
  { value: 'diplomatic_passport', label: 'جواز سفر دبلوماسي' },
  { value: 'service_passport', label: 'جواز سفر خدمة' },
  { value: 'refugee_travel_document', label: 'وثيقة سفر للاجئين' }
];

// Visa purposes
export const VISA_PURPOSES = [
  { value: 'transit', label: 'عبور' },
  { value: 'tourism', label: 'سياحة' },
  { value: 'business', label: 'أعمال' },
  { value: 'work', label: 'عمل' },
  { value: 'study', label: 'دراسة' },
  { value: 'family_visit', label: 'زيارة عائلية' },
  { value: 'medical', label: 'علاج طبي' },
  { value: 'diplomatic', label: 'دبلوماسي' },
  { value: 'official', label: 'رسمي' },
  { value: 'religious', label: 'ديني' },
  { value: 'other', label: 'أخرى' }
];

// Marital statuses
export const MARITAL_STATUSES = [
  { value: 'single', label: 'أعزب' },
  { value: 'married', label: 'متزوج' },
  { value: 'divorced', label: 'مطلق' },
  { value: 'widowed', label: 'أرمل' },
  { value: 'separated', label: 'منفصل' }
];

// Sponsor types
export const SPONSOR_TYPES = [
  { value: 'family', label: 'عائلة' },
  { value: 'company', label: 'شركة' },
  { value: 'government', label: 'جهة حكومية' },
  { value: 'educational', label: 'مؤسسة تعليمية' },
  { value: 'religious', label: 'مؤسسة دينية' },
  { value: 'organization', label: 'منظمة' },
  { value: 'self', label: 'بدون كفيل' },
  { value: 'other', label: 'اخرى' }
];

// Yes/No options
export const YES_NO_OPTIONS = [
  { value: 'yes', label: 'نعم' },
  { value: 'no', label: 'لا' }
];

// Sex options
export const SEX_OPTIONS = [
  { value: 'male', label: 'ذكر' },
  { value: 'female', label: 'أنثى' }
];

// Email validation regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone number validation regex (international format)
// Matches formats like:
// +218-91-1234567
// +1 (555) 123-4567
// 00218911234567
// +218 91 123 4567
export const PHONE_REGEX = /^(\+|00)[0-9\s\-().]{8,20}$/;

// Function to clean phone number and count actual digits
export const getDigitsFromPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Simple validation for international phone numbers
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Remove common formatting characters for normalization
  const normalizedPhone = phone.replace(/[\s\-()]/g, '');
  
  // Check if it starts with + or 00 (international format)
  const hasInternationalPrefix = normalizedPhone.startsWith('+') || normalizedPhone.startsWith('00');
  
  // Must have international prefix and be of reasonable length
  if (!hasInternationalPrefix) return false;
  if (normalizedPhone.length < 8) return false;
  if (normalizedPhone.length > 15) return false;
  
  // Check against regex pattern
  return PHONE_REGEX.test(phone);
};

// Date validation helper function
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Passport number validation (generic pattern)
export const PASSPORT_REGEX = /^[A-Z0-9]{6,12}$/;

// Age validation helper (must be 18+ for certain visa types)
export const isAdult = (dateOfBirth: string): boolean => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age >= 18;
};