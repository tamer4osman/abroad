import { FormData } from '../types/BirthRegistration.types';
import { isValidPhone, EMAIL_REGEX } from '../constants/VisaForm.constants';

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
  
  // Visa Request Information
  purposeOfVisit: string;
  requiredPeriod: string;
  
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
  
  // Attachments
  passportCopy: File | null;
  photoId: File | null;

  [key: string]: string | Date | File | File[] | null | undefined; // Updated to allow File[]
}

export class ValidationService {
  validateForm(formData: FormData) {
    const errors: string[] = [];

    // Required fields for Birth Registration
    const requiredFields = [
      { key: 'childName', label: 'اسم الطفل / Child Name' },
      { key: 'dateOfBirth', label: 'تاريخ الميلاد / Date of Birth' },
      { key: 'placeOfBirthCity', label: 'مدينة الولادة / Place of Birth (City)' },
      { key: 'placeOfBirthCountry', label: 'بلد الولادة / Place of Birth (Country)' },
      { key: 'childGender', label: 'جنس الطفل / Child Gender' },
      { key: 'childType', label: 'نوع الولادة / Birth Type' },
      { key: 'childWeight', label: 'وزن الطفل / Child Weight' },
      { key: 'childCondition', label: 'حالة الطفل / Child Condition' },
      { key: 'fatherName', label: 'اسم الأب / Father Name' },
      { key: 'fatherLastName', label: 'لقب الأب / Father Last Name' },
      { key: 'motherName', label: 'اسم الأم / Mother Name' },
      { key: 'motherLastName', label: 'لقب الأم / Mother Last Name' },
      { key: 'motherNationality', label: 'جنسية الأم / Mother Nationality' },
      { key: 'motherAddressCity', label: 'مدينة سكن الأم / Mother City of Residence' },
      { key: 'motherEmail', label: 'البريد الإلكتروني للأم / Mother Email' },
      { key: 'motherPhoneNumber', label: 'رقم هاتف الأم / Mother Phone Number' },
      { key: 'fatherIdNumber', label: 'رقم بطاقة الأب / Father ID Number' },
      { key: 'fatherOccupation', label: 'مهنة الأب / Father Occupation' },
      { key: 'fatherReligion', label: 'ديانة الأب / Father Religion' },
      { key: 'marriageDate', label: 'تاريخ الزواج / Marriage Date' },
      { key: 'informantType', label: 'صفة المبلغ / Informant Type' },
      { key: 'informantName', label: 'اسم المبلغ / Informant Name' },
      { key: 'informantLastName', label: 'لقب المبلغ / Informant Last Name' },
      { key: 'informantIdNumber', label: 'رقم بطاقة المبلغ / Informant ID Number' },
      { key: 'informantOccupation', label: 'مهنة المبلغ / Informant Occupation' },
      { key: 'informantSignature', label: 'توقيع المبلغ / Informant Signature' },
      { key: 'doctorName', label: 'اسم الطبيب / Doctor Name' },
      { key: 'witness1Name', label: 'اسم الشاهد الأول / First Witness Name' },
      { key: 'witness1IdNumber', label: 'رقم بطاقة الشاهد الأول / First Witness ID Number' },
      { key: 'witness2Name', label: 'اسم الشاهد الثاني / Second Witness Name' },
      { key: 'witness2IdNumber', label: 'رقم بطاقة الشاهد الثاني / Second Witness ID Number' },
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!formData[field.key as keyof FormData]) {
        errors.push(`${field.label} مطلوب / is required`);
      }
    }

    // Validate email format
    if (formData.motherEmail && !this.isValidEmail(formData.motherEmail)) {
      errors.push('البريد الإلكتروني للأم غير صالح / Mother Email is invalid');
    }

    // Validate phone number format
    if (formData.motherPhoneNumber && !this.isValidPhoneNumber(formData.motherPhoneNumber)) {
      errors.push('رقم هاتف الأم غير صالح / Mother Phone Number is invalid');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateVisaForm(formData: VisaFormData) {
    const errors: string[] = [];

    // Define required fields for visa application
    const requiredFields = [
      // Personal Information
      { key: 'firstName', label: 'First Name / الاسم الأول' },
      { key: 'surname', label: 'Surname / اللقب' },
      { key: 'fatherName', label: 'Father Name / اسم الأب' },
      { key: 'nationality', label: 'Nationality / الجنسية' },
      { key: 'dob', label: 'Date of Birth / تاريخ الميلاد' },
      { key: 'sex', label: 'Sex / الجنس' },
      { key: 'placeOfBirth', label: 'Place of Birth / مكان الميلاد' },
      { key: 'maritalStatus', label: 'Marital Status / الحالة الاجتماعية' },
      { key: 'profession', label: 'Profession / المهنة' },
      
      // US Address
      { key: 'usAddress', label: 'US Address / العنوان في الولايات المتحدة' },
      { key: 'city', label: 'City / المدينة' },
      { key: 'state', label: 'State / الولاية' },
      { key: 'zip', label: 'ZIP Code / الرمز البريدي' },
      
      // Contact Information
      { key: 'phone', label: 'Phone Number / رقم الهاتف' },
      { key: 'email', label: 'Email / البريد الإلكتروني' },
      
      // Passport Information
      { key: 'passportNumber', label: 'Passport Number / رقم جواز السفر' },
      { key: 'documentType', label: 'Document Type / نوع الوثيقة' },
      { key: 'issuedOn', label: 'Issued On / تاريخ الإصدار' },
      { key: 'validTo', label: 'Valid To / تاريخ الانتهاء' },
      
      // Visa Request Information
      { key: 'purposeOfVisit', label: 'Purpose of Visit / غرض الزيارة' },
      { key: 'requiredPeriod', label: 'Required Period / المدة المطلوبة' },
      
      // Sponsor Information
      { key: 'sponsorType', label: 'Sponsor Type / نوع الكفيل' },
      { key: 'sponsorName', label: 'Sponsor Name / اسم الكفيل' },
      { key: 'sponsorAddressInLibya', label: 'Sponsor Address in Libya / عنوان الكفيل في ليبيا' },
      { key: 'sponsorPhone', label: 'Sponsor Phone / هاتف الكفيل' },
      
      // Previous Travel History
      { key: 'everBeenToLibya', label: 'Ever Been to Libya / هل سبق لك زيارة ليبيا' },
    ];

    // Additional required fields based on conditions
    if (formData.everBeenToLibya === 'yes') {
      requiredFields.push(
        { key: 'lastEntryDate', label: 'Last Entry Date / تاريخ آخر دخول' },
        { key: 'lastDepartureDate', label: 'Last Departure Date / تاريخ آخر مغادرة' },
        { key: 'previousVisitPurpose', label: 'Previous Visit Purpose / غرض الزيارة السابقة' },
        { key: 'lastAddressInLibya', label: 'Last Address in Libya / آخر عنوان في ليبيا' }
      );
    }

    // Check required fields
    for (const field of requiredFields) {
      const value = formData[field.key as keyof VisaFormData];
      if (value === undefined || value === null || value === '') {
        errors.push(`${field.label} is required / مطلوب`);
      }
    }

    // Validate email format
    if (formData.email && !this.isValidEmail(formData.email)) {
      errors.push('Email is invalid / البريد الإلكتروني غير صالح');
    }

    // Validate phone number format
    if (formData.phone && !this.isValidPhoneNumber(formData.phone)) {
      errors.push('Phone Number is invalid / رقم الهاتف غير صالح');
    }

    if (formData.sponsorPhone && !this.isValidPhoneNumber(formData.sponsorPhone)) {
      errors.push('Sponsor Phone Number is invalid / رقم هاتف الكفيل غير صالح');
    }

    // Validate dates
    const dateFields = [
      { key: 'dob', label: 'Date of Birth / تاريخ الميلاد' },
      { key: 'issuedOn', label: 'Issued On / تاريخ الإصدار' },
      { key: 'validTo', label: 'Valid To / تاريخ الانتهاء' },
      { key: 'lastEntryDate', label: 'Last Entry Date / تاريخ آخر دخول' },
      { key: 'lastDepartureDate', label: 'Last Departure Date / تاريخ آخر مغادرة' }
    ];

    for (const field of dateFields) {
      const value = formData[field.key as keyof VisaFormData];
      if (value && !this.isValidDate(value.toString())) {
        errors.push(`${field.label} has an invalid date format / صيغة التاريخ غير صالحة`);
      }
    }
    
    // Check attachment requirements
    if (!formData.passportCopy) {
      errors.push('Passport Copy is required / نسخة من جواز السفر مطلوبة');
    }
    
    if (!formData.photoId) {
      errors.push('Photo ID is required / صورة شخصية مطلوبة');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Helper validation methods
  isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
  }

  isValidPhoneNumber(phone: string): boolean {
    return isValidPhone(phone);
  }

  isValidDate(dateString: string): boolean {
    // Check if the date format is valid and is a real date
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
}