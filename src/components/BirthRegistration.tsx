// --- Interfaces ---
interface FamilyMember {
  name: string;
  relationship: string;
  gender: string;
}

interface ChildInfo {
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

interface ParentsInfo {
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

interface InformantInfo {
  informantType: "father" | "mother" | "other" | "";
  informantName: string;
  informantLastName: string;
  informantIdNumber: string;
  informantOccupation: string;
  informantSignature: string;
}

interface MedicalInfo {
  doctorName: string;
}

interface WitnessInfo {
  witness1Name: string;
  witness1IdNumber: string;
  witness2Name: string;
  witness2IdNumber: string;
}

// Combine all interfaces into a single interface
interface FormData extends ChildInfo, ParentsInfo, InformantInfo, MedicalInfo, WitnessInfo {
  familyMembers: FamilyMember[];
}

// --- Constants ---
// Improvement: Use const instead of as const
const GENDER_TYPES = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
];

const CHILD_TYPE = [
  { value: "single", label: "فردية" },
  { value: "twin", label: "توأم" },
  { value: "multiple", label: "اكثر من توائم" },
];

const CHILD_CONDITION = [
  { value: "healthy", label: "سليم" },
  { value: "sick", label: "مريض" },
  { value: "critical", label: "حالة حرجة" },
  { value: "deceased", label: "متوفى" },
];

const INFORMANT_TYPE = [
  { value: "father", label: "الأب" },
  { value: "mother", label: "الأم" },
  { value: "other", label: "آخر" },
];

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

// --- Data Validation Service ---
class ValidationService {
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

// --- Data Service ---
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
    familyMembers: [],
  };

  getInitialData = () => ({ ...this.initialData });

  // Improvement: Implement asynchronous API user interface using pre-resolved promises
  submitForm = (formData: FormData): Promise<{ success: boolean; message: string }> => {
    // Log data for debugging only
    console.log("تم إرسال النموذج:", formData); // Note: Keeping the log message in Arabic as it's likely for internal debugging in Arabic context

    // Return a pre-resolved promise to avoid unnecessary setTimeout
    return Promise.resolve({
      success: true,
      message: "تم تسجيل الولادة بنجاح!", // Note: Keeping the success message in Arabic as it's likely part of the UI
    });
  }
}

// --- Small UI Components ---
import React, { useState, useCallback, useMemo, memo } from "react";

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

// Improvement: Use React.memo to prevent unnecessary re-renders
const InputField = memo(({
  label,
  id,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
      placeholder={placeholder}
      required={required}
    />
  </div>
));

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

// Improvement: Use React.memo
const SelectField = memo(({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required = false,
}: SelectFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
      required={required}
    >
      <option value="" disabled>
        -- اختر --
      </option>
      {options.map(option => (
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

// Improvement: Use React.memo
const Section = memo(({ title, children }: SectionProps) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
));

// --- Different Sections Components ---
// Improvement: Use React.memo to avoid excessive re-renders
interface ChildInfoSectionProps {
  childInfo: ChildInfo;
  onChange: (name: string, value: string) => void;
}

const ChildInfoSection = memo(({ childInfo, onChange }: ChildInfoSectionProps) => (
  <Section title="أولاً: ( الحالة الطبية للمولود تقدم من الطبيب أوالقابلة أو الجهة الصحية التي تمت بها الولادة ).">
    <div className="grid grid-cols-3 gap-4">
      <InputField
        label="تاريخ الولادة / اليوم"
        id="dateOfBirth"
        name="dateOfBirth"
        value={childInfo.dateOfBirth}
        onChange={value => onChange("dateOfBirth", value)}
        type="date"
        required
      />
      <InputField
        label="مكان الولادة-المدينة"
        id="placeOfBirthCity"
        name="placeOfBirthCity"
        value={childInfo.placeOfBirthCity}
        onChange={value => onChange("placeOfBirthCity", value)}
        required
      />
      <InputField
        label="مكان الولادة-الولاية"
        id="placeOfBirthState"
        name="placeOfBirthState"
        value={childInfo.placeOfBirthState}
        onChange={value => onChange("placeOfBirthState", value)}
      />
    </div>

    <div className="grid grid-cols-3 gap-4 mt-4">
      <SelectField
        label="الدولة"
        id="placeOfBirthCountry"
        name="placeOfBirthCountry"
        value={childInfo.placeOfBirthCountry}
        onChange={value => onChange("placeOfBirthCountry", value)}
        options={[{ value: "كندا", label: "كندا" }]}
        required
      />

      <SelectField
        label="جنس المولود"
        id="childGender"
        name="childGender"
        value={childInfo.childGender}
        onChange={value => onChange("childGender", value)}
        options={GENDER_TYPES}
        required
      />
      <SelectField
        label="نوع الولادة"
        id="childType"
        name="childType"
        value={childInfo.childType}
        onChange={value => onChange("childType", value)}
        options={CHILD_TYPE}
        required
      />
    </div>
    <div className="grid grid-cols-3 gap-4 mt-4">
      <InputField
        label="وزن المولود"
        id="childWeight"
        name="childWeight"
        value={childInfo.childWeight}
        onChange={value => onChange("childWeight", value)}
      />

      <SelectField
        label="حالة المولود"
        id="childCondition"
        name="childCondition"
        value={childInfo.childCondition}
        onChange={value => onChange("childCondition", value)}
        options={CHILD_CONDITION}
      />

      <InputField
        label="عدد الولادات السابقة"
        id="previousBirths"
        name="previousBirths"
        value={childInfo.previousBirths}
        onChange={value => onChange("previousBirths", value)}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 mt-4">
      <InputField
        label="اسم المولود"
        id="childName"
        name="childName"
        value={childInfo.childName}
        onChange={value => onChange("childName", value)}
        required
      />
    </div>
  </Section>
));

interface ParentsInfoSectionProps {
  parentsInfo: ParentsInfo;
  onChange: (name: string, value: string) => void;
}

const ParentsInfoSection = memo(({ parentsInfo, onChange }: ParentsInfoSectionProps) => (
  <Section title="معلومات الوالدين">
    <div className="grid grid-cols-3 gap-4">
      <InputField
        label="اسم الأم بالكامل"
        id="motherName"
        name="motherName"
        value={parentsInfo.motherName}
        onChange={value => onChange("motherName", value)}
        required
      />
      <InputField
        label="لقب الأم"
        id="motherLastName"
        name="motherLastName"
        value={parentsInfo.motherLastName}
        onChange={value => onChange("motherLastName", value)}
      />
      <InputField
        label="جنسيتها"
        id="motherNationality"
        name="motherNationality"
        value={parentsInfo.motherNationality}
        onChange={value => onChange("motherNationality", value)}
      />
    </div>

    <div className="grid grid-cols-3 gap-4 mt-4">
      <InputField
        label="عنوان إقامتها - المدينة"
        id="motherAddressCity"
        name="motherAddressCity"
        value={parentsInfo.motherAddressCity}
        onChange={value => onChange("motherAddressCity", value)}
      />
      <InputField
        label="عنوان البريد الإلكتروني"
        id="motherEmail"
        name="motherEmail"
        value={parentsInfo.motherEmail}
        onChange={value => onChange("motherEmail", value)}
        type="email"
      />
      <InputField
        label="رقم الهاتف"
        id="motherPhoneNumber"
        name="motherPhoneNumber"
        value={parentsInfo.motherPhoneNumber}
        onChange={value => onChange("motherPhoneNumber", value)}
        type="tel"
      />
    </div>

    <div className="grid grid-cols-4 gap-4 mt-4">
      <InputField
        label="اسم الأب"
        id="fatherName"
        name="fatherName"
        value={parentsInfo.fatherName}
        onChange={value => onChange("fatherName", value)}
        required
      />
      <InputField
        label="لقب الأب"
        id="fatherLastName"
        name="fatherLastName"
        value={parentsInfo.fatherLastName}
        onChange={value => onChange("fatherLastName", value)}
        required
      />

      <InputField
        label="رقم كتيب العائلة"
        id="familyBookNumber"
        name="familyBookNumber"
        value={parentsInfo.familyBookNumber}
        onChange={value => onChange("familyBookNumber", value)}
      />

      <InputField
        label="البطاقة الشخصية"
        id="fatherIdNumber"
        name="fatherIdNumber"
        value={parentsInfo.fatherIdNumber}
        onChange={value => onChange("fatherIdNumber", value)}
      />
    </div>

    <div className="grid grid-cols-3 gap-4 mt-4">
      <InputField
        label="المهنة"
        id="fatherOccupation"
        name="fatherOccupation"
        value={parentsInfo.fatherOccupation}
        onChange={value => onChange("fatherOccupation", value)}
      />
      <InputField
        label="الديانة"
        id="fatherReligion"
        name="fatherReligion"
        value={parentsInfo.fatherReligion}
        onChange={value => onChange("fatherReligion", value)}
      />
      <InputField
        label="تاريخ الزواج"
        id="marriageDate"
        name="marriageDate"
        value={parentsInfo.marriageDate}
        onChange={value => onChange("marriageDate", value)}
        type="date"
      />
    </div>
  </Section>
));

interface InformantInfoSectionProps {
  informantInfo: InformantInfo;
  onChange: (name: string, value: string) => void;
}

const InformantInfoSection = memo(({ informantInfo, onChange }: InformantInfoSectionProps) => (
  <Section title="ثانياً:  بيانات عن المُبلغ">
    <div className="grid grid-cols-4 gap-4">
      <SelectField
        label="اختر"
        id="informantType"
        name="informantType"
        value={informantInfo.informantType}
        onChange={value => onChange("informantType", value)}
        options={INFORMANT_TYPE}
        required
      />

      <InputField
        label="الإسم بالكامل"
        id="informantName"
        name="informantName"
        value={informantInfo.informantName}
        onChange={value => onChange("informantName", value)}
        required={informantInfo.informantType === "other"}
      />
      <InputField
        label="اللقب"
        id="informantLastName"
        name="informantLastName"
        value={informantInfo.informantLastName}
        onChange={value => onChange("informantLastName", value)}
      />

      <InputField
        label="البطاقة الشخصية"
        id="informantIdNumber"
        name="informantIdNumber"
        value={informantInfo.informantIdNumber}
        onChange={value => onChange("informantIdNumber", value)}
        required={informantInfo.informantType === "other"}
      />
    </div>

    <div className="grid grid-cols-2 gap-4 mt-4">
      <InputField
        label="المهنة"
        id="informantOccupation"
        name="informantOccupation"
        value={informantInfo.informantOccupation}
        onChange={value => onChange("informantOccupation", value)}
      />
    </div>
  </Section>
));

interface WitnessInfoSectionProps {
  witnessInfo: WitnessInfo;
  onChange: (name: string, value: string) => void;
}

const WitnessInfoSection = memo(({ witnessInfo, onChange }: WitnessInfoSectionProps) => (
  <Section title="شهادات الشهود عند الاقتضاء">
    <div className="grid grid-cols-2 gap-4">
      <InputField
        label="الشاهد الأول"
        id="witness1Name"
        name="witness1Name"
        value={witnessInfo.witness1Name}
        onChange={value => onChange("witness1Name", value)}
      />
      <InputField
        label="رقم البطاقة الشخصية"
        id="witness1IdNumber"
        name="witness1IdNumber"
        value={witnessInfo.witness1IdNumber}
        onChange={value => onChange("witness1IdNumber", value)}
      />
    </div>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <InputField
        label="الشاهد الثاني"
        id="witness2Name"
        name="witness2Name"
        value={witnessInfo.witness2Name}
        onChange={value => onChange("witness2Name", value)}
      />
      <InputField
        label="رقم البطاقة الشخصية"
        id="witness2IdNumber"
        name="witness2IdNumber"
        value={witnessInfo.witness2IdNumber}
        onChange={value => onChange("witness2IdNumber", value)}
      />
    </div>
  </Section>
));

interface MedicalInfoSectionProps {
  medicalInfo: MedicalInfo;
  onChange: (name: string, value: string) => void;
}

const MedicalInfoSection = memo(({ medicalInfo, onChange }: MedicalInfoSectionProps) => (
  <div className="grid grid-cols-1 gap-4 mt-4">
    <InputField
      label="اسم الطبيب أو القابلة"
      id="doctorName"
      name="doctorName"
      value={medicalInfo.doctorName}
      onChange={value => onChange("doctorName", value)}
    />
  </div>
));

// --- Main Component ---
// Improvement: Use memoization for functions not related to state
const BirthRegistration = () => {
  // Improvement: Use useMemo to create services once
  const formDataService = useMemo(() => new FormDataService(), []);
  const validationService = useMemo(() => new ValidationService(), []);

  // Improvement: Divide state into logical sections
  const [formData, setFormData] = useState<FormData>(formDataService.getInitialData());
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: string; text: string }>({ type: "", text: "" });

  // Improvement: Use useCallback for memoizing event handlers
  const handleChange = useCallback((name: string, value: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));

    // Improvement: Clear error messages on changes
    if (errors.length > 0) {
      setErrors([]);
      setSubmitMessage({ type: "", text: "" });
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Data validation
    const { isValid, errors: validationErrors } = validationService.validateForm(formData);
    setErrors(validationErrors);

    if (!isValid) {
      setSubmitMessage({
        type: "error",
        text: "يرجى تصحيح الأخطاء قبل الإرسال", // Note: Keeping the error message in Arabic as it's likely part of the UI
      });
      return;
    }

    // Submitting data
    setIsSubmitting(true);
    try {
      const { success, message } = await formDataService.submitForm(formData);
      setSubmitMessage({
        type: success ? "success" : "error",
        text: message,
      });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "حدث خطأ أثناء إرسال البيانات", // Note: Keeping the error message in Arabic as it's likely part of the UI
      });
      console.error("خطأ في التقديم:", error); // Note: Keeping the log message in Arabic as it's likely for internal debugging in Arabic context
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validationService, formDataService]);

  // Improvement: Use useMemo to process data to be displayed
  const messageTypeClass = useMemo(() =>
    submitMessage.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
  , [submitMessage.type]);

  // Improvement: Conditional rendering for message element
  const messageElement = useMemo(() => {
    if (!submitMessage.text) return null;

    return (
      <div className={`p-4 mb-4 ${messageTypeClass}`}>
        {submitMessage.text}
      </div>
    );
  }, [submitMessage.text, messageTypeClass]);

  // Improvement: Conditional rendering for errors element
  const errorsElement = useMemo(() => {
    if (errors.length === 0) return null;

    return (
      <div className="bg-red-100 text-red-800 p-4 mb-4 border border-red-300 rounded">
        <h3 className="font-bold mb-2">يرجى تصحيح الأخطاء التالية:</h3>
        <ul className="list-disc pr-5">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }, [errors]);

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        نموذج تسجيل واقعة الولادة
      </h1>

      {messageElement}
      {errorsElement}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <ChildInfoSection
          childInfo={formData}
          onChange={handleChange}
        />

        <ParentsInfoSection
          parentsInfo={formData}
          onChange={handleChange}
        />

        <InformantInfoSection
          informantInfo={formData}
          onChange={handleChange}
        />

        <Section title="معلومات طبية">
          <MedicalInfoSection
            medicalInfo={formData}
            onChange={handleChange}
          />
        </Section>

        <WitnessInfoSection
          witnessInfo={formData}
          onChange={handleChange}
        />

        <button
          type="submit"
          className={`py-2 ${isSubmitting ? "bg-gray-500" : "bg-green-500"} text-white border-none`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ"}
        </button>
      </form>
    </div>
  );
};

export default BirthRegistration;