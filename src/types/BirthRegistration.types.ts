export interface FamilyMember {
  name: string;
  relationship: string;
  gender: string;
}

export interface ChildInfo {
  childName: string;
  dateOfBirth: string;
  placeOfBirthCity: string;
  placeOfBirthState: string;
  placeOfBirthCountry: string;
  childGender: "male" | "female" | "";
  childType: "single" | "twin" | "multiple" | "";
  childWeight: string;
  childCondition: "healthy" | "sick" | "critical" | "deceased" | "";
  previousBirths: string;
}

export interface ParentsInfo {
  fatherName: string;
  fatherLastName: string;
  fatherIdNumber: string;
  fatherOccupation: string;
  fatherReligion: string;
  motherName: string;
  motherLastName: string;
  motherNationality: string;
  motherAddressCity: string;
  motherEmail: string;
  motherPhoneNumber: string;
  marriageDate: string;
  familyBookNumber: string;
}

export interface InformantInfo {
  informantType: "father" | "mother" | "other" | "";
  informantName: string;
  informantLastName: string;
  informantIdNumber: string;
  informantOccupation: string;
  informantSignature: string;
}

export interface MedicalInfo {
  doctorName: string;
}

export interface WitnessInfo {
  witness1Name: string;
  witness1IdNumber: string;
  witness2Name: string;
  witness2IdNumber: string;
}

// Combine all interfaces into a single interface
export interface FormData
  extends ChildInfo,
    ParentsInfo,
    InformantInfo,
    MedicalInfo,
    WitnessInfo {
  familyMembers: FamilyMember[];
}