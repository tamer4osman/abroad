import { FormData } from '../types/BirthRegistration.types';
import { ValidationService } from './ValidationService';

export interface FamilyMember {
  name: string;
  relationship: string;
  gender: string;
}


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