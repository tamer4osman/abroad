import React, { useState, useCallback } from "react";
import { registerCitizen } from "../services/api";
import { mapCitizenFormToApiSchema } from "../utils/dataTransformer";

// --- Interfaces ---
interface FamilyMember {
  name: string;
  relationship: string;
  nationality: string;
  birthDate: string;
  gender: string;
}

interface FormData {
  firstName: string;
  fatherName: string;
  grandfatherName: string;
  familyName: string;
  birthPlace: string;
  birthDate: string;
  fatherBirthPlace: string;
  fatherBirthDate: string;
  motherName: string;
  motherNationality: string;
  motherBirthPlace: string;
  education: string;
  educationPlace: string;
  occupation: string;
  workPlace: string;
  delegation: string;
  passportNumber: string;
  passportValidity: string;
  passportIssuePlace: string;
  passportIssueDate: string;
  idNumber: string;
  idIssuePlace: string;
  idIssueDate: string;
  currentAddressUSA: string;
  phoneUSA: string;
  email: string;
  addressLibya: string;
  phoneLibya: string;
  relativesAddressLibya: string;
  relativesPhoneLibya: string;
  residenceType: "naturalization" | "permanent" | "temporary" | "withSpouse";
  spouseFullName?: string; // New field
  spouseRelation?: string; // New field
  familyMembers: FamilyMember[];
  signature: string;
  date: string;
  photo?: File;
}

// --- Constants ---
const RESIDENCE_TYPES = [
  { value: "naturalization", label: "مجنس" },
  { value: "permanent", label: "إقامة دائمة" },
  { value: "temporary", label: "إقامة مؤقتة" },
  { value: "withSpouse", label: "مرافق" },
] as const;

const RELATIONSHIP_TYPES = [
  { value: "spouse", label: "زوج/زوجة" },
  { value: "child", label: "ابن/ابنة" },
  { value: "parent", label: "أب/أم" },
  { value: "sibling", label: "أخ/أخت" },
] as const;

const GENDER_TYPES = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
] as const;

const MAX_FAMILY_MEMBERS = 10; // Maximum number of family members

// --- Helper Components ---
interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
      placeholder={placeholder}
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
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
}) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

// --- Main Component ---
const RegisterCitizen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    familyName: "",
    birthPlace: "",
    birthDate: "",
    fatherBirthPlace: "",
    fatherBirthDate: "",
    motherName: "",
    motherNationality: "",
    motherBirthPlace: "",
    education: "",
    educationPlace: "",
    occupation: "",
    workPlace: "",
    delegation: "",
    passportNumber: "",
    passportValidity: "",
    passportIssuePlace: "",
    passportIssueDate: "",
    idNumber: "",
    idIssuePlace: "",
    idIssueDate: "",
    currentAddressUSA: "",
    phoneUSA: "",
    email: "",
    addressLibya: "",
    phoneLibya: "",
    relativesAddressLibya: "",
    relativesPhoneLibya: "",
    residenceType: "temporary",
    spouseFullName: "", // New field
    spouseRelation: "", // New field
    familyMembers: [],
    signature: "",
    date: "",
  });

  const [submitStatus, setSubmitStatus] = useState<null | { type: 'success' | 'error', message: string }>(null);

  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleFamilyMemberChange = useCallback(
    (index: number, field: keyof FamilyMember, value: string) => {
      setFormData((prevFormData) => {
        const newFamilyMembers = [...prevFormData.familyMembers];
        newFamilyMembers[index] = {
          ...newFamilyMembers[index],
          [field]: value,
        };
        return { ...prevFormData, familyMembers: newFamilyMembers };
      });
    },
    []
  );

  const handleAddFamilyMember = useCallback(() => {
    if (formData.familyMembers.length < MAX_FAMILY_MEMBERS) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        familyMembers: [
          ...prevFormData.familyMembers,
          {
            name: "",
            relationship: "",
            nationality: "",
            birthDate: "",
            gender: "",
          },
        ],
      }));
    }
  }, [formData.familyMembers.length]);

  const handleRemoveFamilyMember = useCallback((index: number) => {
    setFormData((prevFormData) => {
      const newFamilyMembers = [...prevFormData.familyMembers];
      newFamilyMembers.splice(index, 1);
      return { ...prevFormData, familyMembers: newFamilyMembers };
    });
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation
      if (
        !formData.firstName ||
        !formData.fatherName ||
        !formData.familyName
      ) {
        setSubmitStatus({ type: 'error', message: "الرجاء ملء جميع حقول الاسم المطلوبة" });
        return;
      }

      try {
        // Use the data transformer utility to map frontend fields to backend schema
        const apiData = mapCitizenFormToApiSchema({
          // Map specific fields to match backend expectations
          first_name_ar: formData.firstName,
          father_name_ar: formData.fatherName,
          grandfather_name_ar: formData.grandfatherName,
          last_name_ar: formData.familyName,
          // Use English names when available, or use Arabic names as fallback
          first_name_en: formData.firstName, 
          father_name_en: formData.fatherName,
          last_name_en: formData.familyName,
          // Personal details
          national_id: formData.idNumber,
          date_of_birth: formData.birthDate,
          place_of_birth: formData.birthPlace,
          gender: formData.familyMembers.length > 0 ? formData.familyMembers[0].gender : "male", // Default to male if not specified
          occupation: formData.occupation,
          // Contact information
          email: formData.email,
          // Additional fields needed by the backend
          mother_name_ar: formData.motherName,
          mother_name_en: formData.motherName,
          nationality: "Libyan", // Default nationality
          marital_status: "SINGLE", // Default status if not provided
          is_alive: true, // Default to alive
        });
        
        await registerCitizen(apiData);
        setSubmitStatus({ type: 'success', message: 'تم حفظ البيانات بنجاح' });
      } catch (err: unknown) {
        console.error("Error registering citizen:", err);
        // Use optional chaining for more concise error handling
        const errorMessage = (err as { message?: string })?.message ?? 'حدث خطأ أثناء الحفظ';
        
        setSubmitStatus({ type: 'error', message: errorMessage });
      }
    },
    [formData]
  );

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
      نموذج تسجيل مواطن
            </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Show submit status */}
        {submitStatus && (
          <div className={`text-center py-2 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus.message}
          </div>
        )}
        {/* Photo Upload */}
        <div className="text-center border border-black p-2">
          <label htmlFor="photo" className="block">
            صورة شخصية
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>

        {/* Personal Information Section */}
        <Section title="المعلومات الشخصية">
          <div className="grid grid-cols-4 gap-4">
            <InputField
              label="الاسم الأول:"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={(value) => handleChange("firstName", value)}
            />
            <InputField
              label="إسم الأب:"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={(value) => handleChange("fatherName", value)}
            />
            <InputField
              label="إسم الجد:"
              id="grandfatherName"
              name="grandfatherName"
              value={formData.grandfatherName}
              onChange={(value) => handleChange("grandfatherName", value)}
            />
            <InputField
              label="اسم العائلة:"
              id="familyName"
              name="familyName"
              value={formData.familyName}
              onChange={(value) => handleChange("familyName", value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
          <InputField
              label="مكان الميلاد:"
              id="birthPlace"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={(value) => handleChange("birthPlace", value)}
            />
            <InputField
              label="الرقم الوطني:"
              id="nationalNumber"
              name="nationalNumber"
              value={formData.idNumber}
              onChange={(value) => handleChange("idNumber", value)}
            />
            <InputField
              label="تاريخ الميلاد:"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={(value) => handleChange("birthDate", value)}
              type="date"
            />
            <br />
            <InputField
              label="مكان ميلاد الأب:"
              id="fatherBirthPlace"
              name="fatherBirthPlace"
              value={formData.fatherBirthPlace}
              onChange={(value) => handleChange("fatherBirthPlace", value)}
            />
            <InputField
              label="تاريخ ميلاد الأب:"
              id="fatherBirthDate"
              name="fatherBirthDate"
              value={formData.fatherBirthDate}
              onChange={(value) => handleChange("fatherBirthDate", value)}
              type="date"
            />
            <InputField
              label="إسم الأم:"
              id="motherName"
              name="motherName"
              value={formData.motherName}
              onChange={(value) => handleChange("motherName", value)}
            />
            <InputField
              label="جنسيتها:"
              id="motherNationality"
              name="motherNationality"
              value={formData.motherNationality}
              onChange={(value) => handleChange("motherNationality", value)}
            />
            <InputField
              label="مكان ميلادها:"
              id="motherBirthPlace"
              name="motherBirthPlace"
              value={formData.motherBirthPlace}
              onChange={(value) => handleChange("motherBirthPlace", value)}
            />
          </div>
        </Section>

        {/* Education and Occupation Section */}
        <Section title="المؤهل العلمي والمهنة">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="المؤهل العلمي:"
              id="education"
              name="education"
              value={formData.education}
              onChange={(value) => handleChange("education", value)}
            />
            <InputField
              label="مكان الحصول عليه:"
              id="educationPlace"
              name="educationPlace"
              value={formData.educationPlace}
              onChange={(value) => handleChange("educationPlace", value)}
            />
            <InputField
              label="المهنة بالتحديد:"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={(value) => handleChange("occupation", value)}
            />
            <InputField
              label="مكان العمل:"
              id="workPlace"
              name="workPlace"
              value={formData.workPlace}
              onChange={(value) => handleChange("workPlace", value)}
            />
            <InputField
              label="الجهة الموفدة:"
              id="delegation"
              name="delegation"
              value={formData.delegation}
              onChange={(value) => handleChange("delegation", value)}
            />
          </div>
        </Section>

        {/* Passport and ID Section */}
        <Section title="جواز السفر والبطاقة الشخصية">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="رقم جواز السفر:"
              id="passportNumber"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={(value) => handleChange("passportNumber", value)}
            />
            <InputField
              label="الصلاحية:"
              id="passportValidity"
              name="passportValidity"
              value={formData.passportValidity}
              onChange={(value) => handleChange("passportValidity", value)}
              type="date"
            />
            <InputField
              label="مكان صدور جواز السفر:"
              id="passportIssuePlace"
              name="passportIssuePlace"
              value={formData.passportIssuePlace}
              onChange={(value) => handleChange("passportIssuePlace", value)}
            />
            <InputField
              label="تاريخ صدور جواز السفر:"
              id="passportIssueDate"
              name="passportIssueDate"
              value={formData.passportIssueDate}
              onChange={(value) => handleChange("passportIssueDate", value)}
              type="date"
            />
            <InputField
              label="رقم البطاقة الشخصية:"
              id="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={(value) => handleChange("idNumber", value)}
            />
            <InputField
              label="مكان صدور البطاقة:"
              id="idIssuePlace"
              name="idIssuePlace"
              value={formData.idIssuePlace}
              onChange={(value) => handleChange("idIssuePlace", value)}
            />
            <InputField
              label="تاريخ صدور البطاقة:"
              id="idIssueDate"
              name="idIssueDate"
              value={formData.idIssueDate}
              onChange={(value) => handleChange("idIssueDate", value)}
              type="date"
            />
          </div>
        </Section>

        {/* Address and Contact Section */}
        <Section title="العنوان ومعلومات الاتصال">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="عنوان الاقامة الحالي بالخارج:"
              id="currentAddressUSA"
              name="currentAddressUSA"
              value={formData.currentAddressUSA}
              onChange={(value) => handleChange("currentAddressUSA", value)}
            />
            <InputField
              label="رقم الهاتف بالخارج:"
              id="phoneUSA"
              name="phoneUSA"
              value={formData.phoneUSA}
              onChange={(value) => handleChange("phoneUSA", value)}
              type="tel"
            />
            <InputField
              label="البريد الألكتروني:"
              id="email"
              name="email"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              type="email"
            />
            <br />
            <InputField
              label="عنوان الأقامة في ليبيا:"
              id="addressLibya"
              name="addressLibya"
              value={formData.addressLibya}
              onChange={(value) => handleChange("addressLibya", value)}
            />
            <InputField
              label="رقم الهاتف في ليبيا:"
              id="phoneLibya"
              name="phoneLibya"
              value={formData.phoneLibya}
              onChange={(value) => handleChange("phoneLibya", value)}
              type="tel"
            />
            <InputField
              label="عنوان الأقارب في ليبيا:"
              id="relativesAddressLibya"
              name="relativesAddressLibya"
              value={formData.relativesAddressLibya}
              onChange={(value) => handleChange("relativesAddressLibya", value)}
            />
            <InputField
              label="رقم هاتف الأقارب :"
              id="relativesPhoneLibya"
              name="relativesPhoneLibya"
              value={formData.relativesPhoneLibya}
              onChange={(value) => handleChange("relativesPhoneLibya", value)}
              type="tel"
            />
          </div>
        </Section>

        {/* Residence Section */}
        <Section title="الإقامة">
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="نوع الأقامة :"
              id="residenceType"
              name="residenceType"
              value={formData.residenceType}
              onChange={(value) => handleChange("residenceType", value)}
              options={RESIDENCE_TYPES}
            />
          </div>
          {formData.residenceType === "withSpouse" && (
            <div className="mb-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="اسم المرافق له:"
                  id="spouseFullName"
                  name="spouseFullName"
                  value={formData.spouseFullName || ""}
                  onChange={(value) => handleChange("spouseFullName", value)}
                />
                <SelectField // Changed from InputField to SelectField
                  label="العلاقة:"
                  id="spouseRelation"
                  name="spouseRelation"
                  value={formData.spouseRelation || ""}
                  onChange={(value) => handleChange("spouseRelation", value)}
                  options={RELATIONSHIP_TYPES}
                />
              </div>
            </div>
          )}
        </Section>

        {/* Family Information Section */}
        <Section title="معلومات العائلة">
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">أفراد العائلة</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-black p-2">م</th>
                  <th className="border border-black p-2">الإسم</th>
                  <th className="border border-black p-2">العلاقة</th>
                  <th className="border border-black p-2">الجنس</th>
                  <th className="border border-black p-2">الجنسية</th>
                  <th className="border border-black p-2">تاريخ الميلاد</th>
                  <th className="border border-black p-2">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {formData.familyMembers.map((member, index) => (
                  <tr key={`family-member-${member.name}-${index}`}>
                    <td className="border border-black p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-black p-2">
                      <label htmlFor={`family-member-name-${index}`} className="sr-only">
                        اسم فرد العائلة {index + 1}
                      </label>
                      <input
                        type="text"
                        id={`family-member-name-${index}`}
                        value={member.name}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="border border-black p-2">
                      <label htmlFor={`family-member-relationship-${index}`} className="sr-only">
                        صلة القرابة لفرد العائلة {index + 1}
                      </label>
                      <select
                        id={`family-member-relationship-${index}`}
                        value={member.relationship}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            index,
                            "relationship",
                            e.target.value
                          )
                        }
                        className="border p-1 w-full"
                      >
                        {RELATIONSHIP_TYPES.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-black p-2">
                      <label htmlFor={`family-member-gender-${index}`} className="sr-only">
                        جنس فرد العائلة {index + 1}
                      </label>
                      <select
                        id={`family-member-gender-${index}`}
                        value={member.gender}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            index,
                            "gender",
                            e.target.value
                          )
                        }
                        className="border p-1 w-full"
                      >
                        {GENDER_TYPES.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-black p-2">
                      <label htmlFor={`family-member-nationality-${index}`} className="sr-only">
                        جنسية فرد العائلة {index + 1}
                      </label>
                      <input
                        type="text"
                        id={`family-member-nationality-${index}`}
                        value={member.nationality}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            index,
                            "nationality",
                            e.target.value
                          )
                        }
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="border border-black p-2">
                      <label htmlFor={`family-member-birthDate-${index}`} className="sr-only">
                        تاريخ ميلاد فرد العائلة {index + 1}
                      </label>
                      <input
                        type="date"
                        id={`family-member-birthDate-${index}`}
                        value={member.birthDate}
                        onChange={(e) =>
                          handleFamilyMemberChange(
                            index,
                            "birthDate",
                            e.target.value
                          )
                        }
                        className="border p-1 w-full"
                      />
                    </td>
                    <td className="border border-black p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveFamilyMember(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddFamilyMember}
                disabled={formData.familyMembers.length >= MAX_FAMILY_MEMBERS}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                إضافة فرد عائلة
              </button>
            </div>
          </div>
        </Section>


        <button
          type="submit"
          className="py-2 bg-green-500 text-white border-none"
        >
          حفظ
        </button>
      </form>
    </div>
  );
};

export default RegisterCitizen;
