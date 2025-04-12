import React, { useState, useCallback } from "react";

// --- Interfaces ---
interface FormData {
  firstName: string;
  fatherName: string;
  grandfatherName: string;
  familyName: string;
  birthPlace: string;
  birthDate: string;
  nationality: string;
  gender: "male" | "female";
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  religion: string;
  occupation: string;
  workPlace: string;
  education: string;
  educationPlace: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportIssuePlace: string;
  residencePermitNumber: string;
  residencePermitIssueDate: string;
  residencePermitExpiryDate: string;
  visaNumber: string; 
  visaIssueDate: string;
  visaExpiryDate: string;
  visaType: string;
  currentAddressLibya: string;
  phoneLibya: string;
  emailAddress: string;
  addressInHomeCountry: string;
  phoneInHomeCountry: string;
  purposeOfStay: "work" | "study" | "family" | "tourism" | "business" | "medical" | "other";
  expectedDurationOfStay: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  referenceInLibya: string;
  referencePhoneInLibya: string;
  healthStatus: string;
  criminalRecord: boolean;
  criminalRecordDetails?: string;
  photo?: File;
  attachments: { file: File; type: string }[];
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

const PURPOSE_OF_STAY_TYPES = [
  { value: "work", label: "العمل" },
  { value: "study", label: "الدراسة" },
  { value: "family", label: "أسباب عائلية" },
  { value: "tourism", label: "السياحة" },
  { value: "business", label: "أعمال تجارية" },
  { value: "medical", label: "أسباب طبية" },
  { value: "other", label: "أخرى" },
] as const;

const VISA_TYPES = [
  { value: "tourist", label: "سياحية" },
  { value: "business", label: "أعمال" },
  { value: "student", label: "طالب" },
  { value: "work", label: "عمل" },
  { value: "family", label: "عائلية" },
  { value: "medical", label: "طبية" },
  { value: "diplomatic", label: "دبلوماسية" },
  { value: "transit", label: "عبور" },
  { value: "other", label: "أخرى" },
] as const;

const ATTACHMENT_TYPES = [
  { value: "passport", label: "جواز السفر" },
  { value: "visa", label: "التأشيرة" },
  { value: "residencePermit", label: "تصريح الإقامة" },
  { value: "photo", label: "صورة شخصية" },
  { value: "workContract", label: "عقد العمل" },
  { value: "studyCertificate", label: "شهادة دراسية" },
  { value: "medicalCertificate", label: "شهادة طبية" },
  { value: "marriageCertificate", label: "شهادة زواج" },
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
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md"
      placeholder={placeholder}
      required={required}
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
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required,
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
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md"
      required={required}
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

// --- Main Component ---
const RegisterForeign: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    familyName: "",
    birthPlace: "",
    birthDate: "",
    nationality: "",
    gender: "male",
    maritalStatus: "single",
    religion: "",
    occupation: "",
    workPlace: "",
    education: "",
    educationPlace: "",
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    passportIssuePlace: "",
    residencePermitNumber: "",
    residencePermitIssueDate: "",
    residencePermitExpiryDate: "",
    visaNumber: "",
    visaIssueDate: "",
    visaExpiryDate: "",
    visaType: "",
    currentAddressLibya: "",
    phoneLibya: "",
    emailAddress: "",
    addressInHomeCountry: "",
    phoneInHomeCountry: "",
    purposeOfStay: "work",
    expectedDurationOfStay: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    referenceInLibya: "",
    referencePhoneInLibya: "",
    healthStatus: "",
    criminalRecord: false,
    criminalRecordDetails: "",
    attachments: [],
  });

  const handleChange = useCallback((name: string, value: string) => {
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

  const handleAttachmentUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newAttachments = Array.from(files).map((file) => ({
          file,
          type: "",
        }));

        setFormData((prevFormData) => ({
          ...prevFormData,
          attachments: [...prevFormData.attachments, ...newAttachments],
        }));
      }
    },
    []
  );

  const handleAttachmentTypeChange = useCallback(
    (index: number, newType: string) => {
      setFormData((prevFormData) => {
        const newAttachments = [...prevFormData.attachments];
        newAttachments[index] = {
          ...newAttachments[index],
          type: newType,
        };
        return { ...prevFormData, attachments: newAttachments };
      });
    },
    []
  );

  const removeAttachment = useCallback(
    (index: number) => {
      setFormData((prevFormData) => {
        const newAttachments = [...prevFormData.attachments];
        newAttachments.splice(index, 1);
        return { ...prevFormData, attachments: newAttachments };
      });
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log(formData);

      // Validation logic here
      if (
        !formData.firstName ||
        !formData.fatherName ||
        !formData.familyName ||
        !formData.nationality ||
        !formData.passportNumber
      ) {
        alert("الرجاء إكمال البيانات الشخصية الأساسية وبيانات جواز السفر");
        return;
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
      نموذج تسجيل أجنبي
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Photo Upload */}
        <div className="text-center border border-gray-300 dark:border-gray-700 p-4 rounded-md">
          <label htmlFor="photo" className="block mb-2 font-medium">
            صورة شخصية
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-gray-700 dark:text-gray-300 
                      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                      file:text-sm file:font-semibold file:bg-red-800 file:text-white
                      hover:file:bg-red-700"
          />
        </div>

        {/* Personal Information Section */}
        <Section title="المعلومات الشخصية">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="الاسم الأول:"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={(value) => handleChange("firstName", value)}
              required
            />
            <InputField
              label="إسم الأب:"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={(value) => handleChange("fatherName", value)}
              required
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
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <InputField
              label="مكان الميلاد:"
              id="birthPlace"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={(value) => handleChange("birthPlace", value)}
              required
            />
            <InputField
              label="تاريخ الميلاد:"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={(value) => handleChange("birthDate", value)}
              type="date"
              required
            />
            <InputField
              label="الجنسية:"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={(value) => handleChange("nationality", value)}
              required
            />
            <SelectField
              label="الجنس:"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
              options={GENDER_TYPES}
              required
            />
            <SelectField
              label="الحالة الاجتماعية:"
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={(value) => handleChange("maritalStatus", value)}
              options={MARITAL_STATUS_TYPES}
              required
            />
            <InputField
              label="الديانة:"
              id="religion"
              name="religion"
              value={formData.religion}
              onChange={(value) => handleChange("religion", value)}
            />
          </div>
        </Section>

        {/* Education and Occupation Section */}
        <Section title="المؤهل العلمي والمهنة">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label="المهنة:"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={(value) => handleChange("occupation", value)}
              required
            />
            <InputField
              label="مكان العمل في ليبيا:"
              id="workPlace"
              name="workPlace"
              value={formData.workPlace}
              onChange={(value) => handleChange("workPlace", value)}
            />
          </div>
        </Section>

        {/* Passport and Residence Information */}
        <Section title="بيانات جواز السفر والإقامة">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="رقم جواز السفر:"
              id="passportNumber"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={(value) => handleChange("passportNumber", value)}
              required
            />
            <InputField
              label="مكان صدور جواز السفر:"
              id="passportIssuePlace"
              name="passportIssuePlace"
              value={formData.passportIssuePlace}
              onChange={(value) => handleChange("passportIssuePlace", value)}
              required
            />
            <InputField
              label="تاريخ صدور جواز السفر:"
              id="passportIssueDate"
              name="passportIssueDate"
              value={formData.passportIssueDate}
              onChange={(value) => handleChange("passportIssueDate", value)}
              type="date"
              required
            />
            <InputField
              label="تاريخ انتهاء جواز السفر:"
              id="passportExpiryDate"
              name="passportExpiryDate"
              value={formData.passportExpiryDate}
              onChange={(value) => handleChange("passportExpiryDate", value)}
              type="date"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <InputField
              label="رقم تصريح الإقامة:"
              id="residencePermitNumber"
              name="residencePermitNumber"
              value={formData.residencePermitNumber}
              onChange={(value) => handleChange("residencePermitNumber", value)}
            />
            <InputField
              label="تاريخ إصدار تصريح الإقامة:"
              id="residencePermitIssueDate"
              name="residencePermitIssueDate"
              value={formData.residencePermitIssueDate}
              onChange={(value) => handleChange("residencePermitIssueDate", value)}
              type="date"
            />
            <InputField
              label="تاريخ انتهاء تصريح الإقامة:"
              id="residencePermitExpiryDate"
              name="residencePermitExpiryDate"
              value={formData.residencePermitExpiryDate}
              onChange={(value) => handleChange("residencePermitExpiryDate", value)}
              type="date"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <InputField
              label="رقم التأشيرة:"
              id="visaNumber"
              name="visaNumber"
              value={formData.visaNumber}
              onChange={(value) => handleChange("visaNumber", value)}
            />
            <SelectField
              label="نوع التأشيرة:"
              id="visaType"
              name="visaType"
              value={formData.visaType}
              onChange={(value) => handleChange("visaType", value)}
              options={VISA_TYPES}
            />
            <InputField
              label="تاريخ إصدار التأشيرة:"
              id="visaIssueDate"
              name="visaIssueDate"
              value={formData.visaIssueDate}
              onChange={(value) => handleChange("visaIssueDate", value)}
              type="date"
            />
            <InputField
              label="تاريخ انتهاء التأشيرة:"
              id="visaExpiryDate"
              name="visaExpiryDate"
              value={formData.visaExpiryDate}
              onChange={(value) => handleChange("visaExpiryDate", value)}
              type="date"
            />
          </div>
        </Section>

        {/* Address and Contact Information */}
        <Section title="معلومات الاتصال والعنوان">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="عنوان الإقامة في ليبيا:"
              id="currentAddressLibya"
              name="currentAddressLibya"
              value={formData.currentAddressLibya}
              onChange={(value) => handleChange("currentAddressLibya", value)}
              required
            />
            <InputField
              label="رقم الهاتف في ليبيا:"
              id="phoneLibya"
              name="phoneLibya"
              value={formData.phoneLibya}
              onChange={(value) => handleChange("phoneLibya", value)}
              type="tel"
              required
            />
            <InputField
              label="البريد الإلكتروني:"
              id="emailAddress"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={(value) => handleChange("emailAddress", value)}
              type="email"
            />
            <InputField
              label="عنوان الإقامة في البلد الأصلي:"
              id="addressInHomeCountry"
              name="addressInHomeCountry"
              value={formData.addressInHomeCountry}
              onChange={(value) => handleChange("addressInHomeCountry", value)}
            />
            <InputField
              label="رقم الهاتف في البلد الأصلي:"
              id="phoneInHomeCountry"
              name="phoneInHomeCountry"
              value={formData.phoneInHomeCountry}
              onChange={(value) => handleChange("phoneInHomeCountry", value)}
              type="tel"
            />
          </div>
        </Section>

        {/* Stay Information */}
        <Section title="معلومات الإقامة">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="الغرض من الإقامة:"
              id="purposeOfStay"
              name="purposeOfStay"
              value={formData.purposeOfStay}
              onChange={(value) => handleChange("purposeOfStay", value)}
              options={PURPOSE_OF_STAY_TYPES}
              required
            />
            <InputField
              label="المدة المتوقعة للإقامة:"
              id="expectedDurationOfStay"
              name="expectedDurationOfStay"
              value={formData.expectedDurationOfStay}
              onChange={(value) => handleChange("expectedDurationOfStay", value)}
              required
            />
          </div>
        </Section>

        {/* Emergency Contact */}
        <Section title="جهة الاتصال في حالات الطوارئ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="اسم جهة الاتصال:"
              id="emergencyContactName"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={(value) => handleChange("emergencyContactName", value)}
              required
            />
            <InputField
              label="صلة القرابة:"
              id="emergencyContactRelation"
              name="emergencyContactRelation"
              value={formData.emergencyContactRelation}
              onChange={(value) => handleChange("emergencyContactRelation", value)}
              required
            />
            <InputField
              label="رقم الهاتف:"
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={(value) => handleChange("emergencyContactPhone", value)}
              type="tel"
              required
            />
          </div>
        </Section>

        {/* Reference in Libya */}
        <Section title="معارف في ليبيا">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="اسم المعارف في ليبيا:"
              id="referenceInLibya"
              name="referenceInLibya"
              value={formData.referenceInLibya}
              onChange={(value) => handleChange("referenceInLibya", value)}
            />
            <InputField
              label="رقم هاتف المعارف:"
              id="referencePhoneInLibya"
              name="referencePhoneInLibya"
              value={formData.referencePhoneInLibya}
              onChange={(value) => handleChange("referencePhoneInLibya", value)}
              type="tel"
            />
          </div>
        </Section>

        

        {/* Attachments */}
        <Section title="المرفقات">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              إضافة مستندات:
            </label>
            <input
              type="file"
              multiple
              onChange={handleAttachmentUpload}
              className="block w-full text-sm text-gray-700 dark:text-gray-300 
                      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                      file:text-sm file:font-semibold file:bg-red-800 file:text-white
                      hover:file:bg-red-700"
            />
          </div>

          {formData.attachments.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">المستندات المرفقة:</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">م</th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">اسم الملف</th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">نوع المستند</th>
                    <th className="border border-gray-300 dark:border-gray-700 p-2">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.attachments.map((attachment, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        {attachment.file.name}
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2">
                        <select
                          value={attachment.type}
                          onChange={(e) =>
                            handleAttachmentTypeChange(index, e.target.value)
                          }
                          className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md"
                        >
                          <option value="">-- اختر نوع المستند --</option>
                          {ATTACHMENT_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Submit Button */}

        <button
          type="submit"
          className="py-2 bg-red-800 hover:bg-red-700 text-white border-none rounded-md font-semibold"
        >
          تسجيل
        </button>
      </form>
    </div>
  );
};

export default RegisterForeign;