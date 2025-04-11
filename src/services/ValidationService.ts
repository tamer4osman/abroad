ts
import { FormData, FamilyMember, ChildInfo, ParentsInfo, InformantInfo, MedicalInfo, WitnessInfo } from '../types/BirthRegistration.types';


// Improvement: Use a Set for required fields
const REQUIRED_FIELDS = new Set([
  'childName',
  'dateOfBirth',
  'fatherName',
  'placeOfBirthCity',
  'childGender',
  'childType',
  'motherName'
]);

export class ValidationService {
  validateForm = (formData: FormData) => {
    const errors: string[] = [];

    // Improvement: Use a loop to check for required fields
    for (const field of REQUIRED_FIELDS) {
      if (!formData[field as keyof FormData]) {
        errors.push(`${field} مطلوب`); // Note: Keeping the label in Arabic as it's likely part of the UI
      }
    }

    // Check the informant if the type is "other"
    if (formData.informantType === "other" && !formData.informantName) {
      errors.push("اسم المبلّغ مطلوب"); // Note: Keeping the label in Arabic as it's likely part of the UI
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}