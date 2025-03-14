// filepath: /abroad/abroad/src/components/DeathRegistration.tsx
import React, { useState, useCallback, useMemo } from "react";
import { Upload, File, XCircle } from "lucide-react";

// --- Interfaces ---

interface FormData {
  familyPaperNumber: string;
  municipalityName: string;
  year: string;
  month: string;
  day: string;
  hour: string;
  informantName: string;
  informantRelationship: string;
  informantBirthDate: string;
  informantIdNumber: string;
  informantIdIssueDate: string;
  informantIdIssuePlace: string;
  informantAddress: string;
  deceasedName: string;
  deceasedBirthDate: string;
  deceasedBirthPlace: string;
  deceasedOccupation: string;
  deceasedNationality: string;
  deceasedIdNumber: string;
  deceasedIdIssueDate: string;
  deceasedIdIssuePlace: string;
  deceasedAddress: string;
  dateOfDeath: string;
  placeOfDeath: string;
  deceasedReligion: string;
  deceasedMaritalStatus: string;
  deceasedTribe: string;
  deceasedFatherName: string;
  deceasedMotherName: string;
  deceasedResidence: string;
  deceasedRecordPlace: string;
  deceasedGender: string;
  notifierOccupation: string;
  notifierRelationToDeceased: string;
  signature: string;
  date: string;
  photo?: File;
}

// --- Constants ---
const GENDER_TYPES = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
] as const;
const MARITAL_STATUS_TYPES = [
  { value: "single", label: "أعزب / عزباء" },
  { value: "married", label: "متزوج / متزوجة" },
  { value: "widowed", label: "أرمل / أرملة" },
  { value: "divorced", label: "مطلق / مطلقة" },
] as const;
const ATTACHMENT_TYPES = [
  "صورة عن الهوية",
  "صورة عن جواز السفر",
  "شهادة الوفاة",
  "إخراج قيد",
  "أخرى",
];

// --- Helper Components ---

// Use React.memo to prevent unnecessary re-renders of these simple components.
const InputField = React.memo(
  ({
    label,
    id,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
  }: {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) => (
    <div>
      <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
);

const SelectField = React.memo(
  ({
    label,
    id,
    name,
    value,
    onChange,
    options,
    required = false,
  }: {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: readonly { value: string; label: string }[];
    required?: boolean;
  }) => (
    <div>
      <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required={required}
      >
        <option value="" disabled>
          اختر...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
);

const Section = React.memo(
  ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-3">{title}</h2> {children}
    </div>
  )
);

// --- Attachment Components ---
const AttachmentTable = React.memo(
  ({
    uploadedAttachments,
    onAttachmentTypeChange,
    onRemoveAttachment,
  }: {
    uploadedAttachments: { file: File; type: string }[];
    onAttachmentTypeChange: (index: number, newType: string) => void;
    onRemoveAttachment: (index: number) => void;
  }) => {
    // Memoize the options to prevent re-renders caused by object recreation
    const attachmentTypeOptions = useMemo(
      () => ATTACHMENT_TYPES.map((opt) => ({ value: opt, label: opt })),
      []
    );

    return (
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full table-auto bg-white dark:bg-gray-800 rounded-md shadow-md">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                اسم الملف
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                نوع المرفق
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                إجراء
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {uploadedAttachments.map(({ file, type }, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap text-right dark:text-white">
                  <div className="flex items-center">
                    <File className="mr-2" size={16} />
                    {file.name}
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right dark:text-white">
                  <SelectField
                    label=""
                    id={`attachmentType-${index}`}
                    name={`attachmentType-${index}`}
                    value={type}
                    onChange={(value) => onAttachmentTypeChange(index, value)}
                    options={attachmentTypeOptions}
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right dark:text-white">
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(index)}
                    className="px-2 py-1 text-white rounded-md"
                  >
                    <XCircle
                      className="text-red-500 hover:text-red-700"
                      size={16}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

const AttachmentsForm = React.memo(
  ({
    uploadedAttachments,
    onAttachmentUpload,
    onAttachmentTypeChange,
    onRemoveAttachment,
  }: {
    uploadedAttachments: { file: File; type: string }[];
    onAttachmentUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAttachmentTypeChange: (index: number, newType: string) => void;
    onRemoveAttachment: (index: number) => void;
  }) => (
    <Section title="المرفقات">
      <div>
        <label
          htmlFor="attachmentUpload"
          className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <Upload className="mr-2" size={16} />
          <span>تحميل المرفقات</span>
        </label>
        <input
          type="file"
          id="attachmentUpload"
          multiple
          className="hidden"
          onChange={onAttachmentUpload}
        />
        <AttachmentTable
          uploadedAttachments={uploadedAttachments}
          onAttachmentTypeChange={onAttachmentTypeChange}
          onRemoveAttachment={onRemoveAttachment}
        />
      </div>
    </Section>
  )
);

// --- Custom Hook for Form State Management ---
const useDeathFormState = () => {
  const [formData, setFormData] = useState<FormData>({
    familyPaperNumber: "",
    municipalityName: "",
    year: "",
    month: "",
    day: "",
    hour: "",
    informantName: "",
    informantRelationship: "",
    informantBirthDate: "",
    informantIdNumber: "",
    informantIdIssueDate: "",
    informantIdIssuePlace: "",
    informantAddress: "",
    deceasedName: "",
    deceasedBirthDate: "",
    deceasedBirthPlace: "",
    deceasedOccupation: "",
    deceasedNationality: "",
    deceasedIdNumber: "",
    deceasedIdIssueDate: "",
    deceasedIdIssuePlace: "",
    deceasedAddress: "",
    dateOfDeath: "",
    placeOfDeath: "",
    deceasedReligion: "",
    deceasedMaritalStatus: "",
    deceasedTribe: "",
    deceasedFatherName: "",
    deceasedMotherName: "",
    deceasedResidence: "",
    deceasedRecordPlace: "",
    deceasedGender: "",
    notifierOccupation: "",
    notifierRelationToDeceased: "",
    signature: "",
    date: "",
  });

  const [uploadedAttachments, setUploadedAttachments] = useState<
    { file: File; type: string }[]
  >([]);

  const handleAttachmentUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newAttachments = Array.from(files).map((file) => ({
          file,
          type: "صورة عن الهوية",
        }));
        setUploadedAttachments((prev) => [...prev, ...newAttachments]);
      }
    },
    []
  );

  const handleAttachmentTypeChange = useCallback(
    (index: number, newType: string) =>
      setUploadedAttachments((prev) =>
        prev.map((a, i) => (i === index ? { ...a, type: newType } : a))
      ),
    []
  );

  const removeAttachment = useCallback(
    (index: number) =>
      setUploadedAttachments((prev) => prev.filter((_, i) => i !== index)),
    []
  );
  const handleChange = useCallback(
    (name: string, value: string) =>
      setFormData((prev) => ({ ...prev, [name]: value })),
    []
  );

  return {
    formData,
    uploadedAttachments,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
  };
};

// --- Main Component ---
const DeathRegistration: React.FC = () => {
  const {
    formData,
    uploadedAttachments,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
  } = useDeathFormState();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log(formData, uploadedAttachments);
      if (!formData.familyPaperNumber || !formData.municipalityName) {
        alert("Please fill in Family Paper Number and Municipality Name.");
      }
    },
    [formData, uploadedAttachments]
  );

  // Memoize the form sections to avoid unnecessary re-renders if the props don't change
  const initialInfoSection = useMemo(
    () => (
      <Section title="معلومات أساسية">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="رقم ورقة العائلة:"
            id="familyPaperNumber"
            name="familyPaperNumber"
            value={formData.familyPaperNumber}
            onChange={(value) => handleChange("familyPaperNumber", value)}
            required
          />
          <InputField
            label="اسم البلدية:"
            id="municipalityName"
            name="municipalityName"
            value={formData.municipalityName}
            onChange={(value) => handleChange("municipalityName", value)}
            required
          />
        </div>
      </Section>
    ),
    [formData.familyPaperNumber, formData.municipalityName, handleChange]
  );

  const deathInfoSection = useMemo(
    () => (
      <Section title="معلومات الوفاة">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="تاريخ الوفاة:"
            id="dateOfDeath"
            name="dateOfDeath"
            value={formData.dateOfDeath}
            onChange={(value) => handleChange("dateOfDeath", value)}
            type="date"
          />
          <InputField
            label="مكان الوفاة:"
            id="placeOfDeath"
            name="placeOfDeath"
            value={formData.placeOfDeath}
            onChange={(value) => handleChange("placeOfDeath", value)}
          />
        </div>
      </Section>
    ),
    [formData.dateOfDeath, formData.placeOfDeath, handleChange]
  );

  const deceasedInfoSection = useMemo(
    () => (
      <Section title="معلومات المتوفى">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="اسم المتوفى:"
            id="deceasedName"
            name="deceasedName"
            value={formData.deceasedName}
            onChange={(value) => handleChange("deceasedName", value)}
          />
          <InputField
            label="تاريخ الميلاد:"
            id="deceasedBirthDate"
            name="deceasedBirthDate"
            value={formData.deceasedBirthDate}
            onChange={(value) => handleChange("deceasedBirthDate", value)}
            type="date"
          />
          <InputField
            label="مكان الميلاد:"
            id="deceasedBirthPlace"
            name="deceasedBirthPlace"
            value={formData.deceasedBirthPlace}
            onChange={(value) => handleChange("deceasedBirthPlace", value)}
          />
          <InputField
            label="المهنة:"
            id="deceasedOccupation"
            name="deceasedOccupation"
            value={formData.deceasedOccupation}
            onChange={(value) => handleChange("deceasedOccupation", value)}
          />
          <InputField
            label="الجنسية:"
            id="deceasedNationality"
            name="deceasedNationality"
            value={formData.deceasedNationality}
            onChange={(value) => handleChange("deceasedNationality", value)}
          />
          <SelectField
            label="الجنس:"
            id="deceasedGender"
            name="deceasedGender"
            value={formData.deceasedGender || ""}
            onChange={(value) => handleChange("deceasedGender", value)}
            options={GENDER_TYPES}
          />
          <SelectField
            label="الحالة المدنية"
            id="deceasedMaritalStatus"
            name="deceasedMaritalStatus"
            value={formData.deceasedMaritalStatus || ""}
            onChange={(value) => handleChange("deceasedMaritalStatus", value)}
            options={MARITAL_STATUS_TYPES}
          />
          <InputField
            label="الديانة:"
            id="deceasedReligion"
            name="deceasedReligion"
            value={formData.deceasedReligion}
            onChange={(value) => handleChange("deceasedReligion", value)}
          />
          <InputField
            label="رقم البطاقة الشخصية أوجواز السفر:"
            id="deceasedIdNumber"
            name="deceasedIdNumber"
            value={formData.deceasedIdNumber}
            onChange={(value) => handleChange("deceasedIdNumber", value)}
          />
          <InputField
            label="تاريخ الإصدار:"
            id="deceasedIdIssueDate"
            name="deceasedIdIssueDate"
            value={formData.deceasedIdIssueDate}
            onChange={(value) => handleChange("deceasedIdIssueDate", value)}
            type="date"
          />
          <InputField
            label="جهة الإصدار:"
            id="deceasedIdIssuePlace"
            name="deceasedIdIssuePlace"
            value={formData.deceasedIdIssuePlace}
            onChange={(value) => handleChange("deceasedIdIssuePlace", value)}
          />
          <InputField
            label="عنوان المتوفي:"
            id="deceasedAddress"
            name="deceasedAddress"
            value={formData.deceasedAddress}
            onChange={(value) => handleChange("deceasedAddress", value)}
          />
          <InputField
            label="اسم القبيلة:"
            id="deceasedTribe"
            name="deceasedTribe"
            value={formData.deceasedTribe}
            onChange={(value) => handleChange("deceasedTribe", value)}
          />
          <InputField
            label="اسم والد المتوفى:"
            id="deceasedFatherName"
            name="deceasedFatherName"
            value={formData.deceasedFatherName}
            onChange={(value) => handleChange("deceasedFatherName", value)}
          />
          <InputField
            label="اسم والدة المتوفى:"
            id="deceasedMotherName"
            name="deceasedMotherName"
            value={formData.deceasedMotherName}
            onChange={(value) => handleChange("deceasedMotherName", value)}
          />
          <InputField
            label="محل إقامة المتوفى:"
            id="deceasedResidence"
            name="deceasedResidence"
            value={formData.deceasedResidence}
            onChange={(value) => handleChange("deceasedResidence", value)}
          />
          <InputField
            label="محل قيد المتوفى:"
            id="deceasedRecordPlace"
            name="deceasedRecordPlace"
            value={formData.deceasedRecordPlace}
            onChange={(value) => handleChange("deceasedRecordPlace", value)}
          />
        </div>
      </Section>
    ),
    [
      formData.deceasedName,
      formData.deceasedBirthDate,
      formData.deceasedBirthPlace,
      formData.deceasedOccupation,
      formData.deceasedNationality,
      formData.deceasedGender,
      formData.deceasedMaritalStatus,
      formData.deceasedReligion,
      formData.deceasedIdNumber,
      formData.deceasedIdIssueDate,
      formData.deceasedIdIssuePlace,
      formData.deceasedAddress,
      formData.deceasedTribe,
      formData.deceasedFatherName,
      formData.deceasedMotherName,
      formData.deceasedResidence,
      formData.deceasedRecordPlace,
      handleChange,
    ]
  );

  const informantInfoSection = useMemo(
    () => (
      <Section title="معلومات المبلغ">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="اسم المبلغ:"
            id="informantName"
            name="informantName"
            value={formData.informantName}
            onChange={(value) => handleChange("informantName", value)}
          />
          <InputField
            label="صلته بالمتوفى:"
            id="informantRelationship"
            name="informantRelationship"
            value={formData.informantRelationship}
            onChange={(value) => handleChange("informantRelationship", value)}
          />
          <InputField
            label="مهنة المبلغ:"
            id="notifierOccupation"
            name="notifierOccupation"
            value={formData.notifierOccupation || ""}
            onChange={(value) => handleChange("notifierOccupation", value)}
          />
          <InputField
            label="تاريخ ميلاد المبلغ:"
            id="informantBirthDate"
            name="informantBirthDate"
            value={formData.informantBirthDate}
            onChange={(value) => handleChange("informantBirthDate", value)}
            type="date"
          />
          <InputField
            label="رقم البطاقة الشخصية أوجواز السفر:"
            id="informantIdNumber"
            name="informantIdNumber"
            value={formData.informantIdNumber}
            onChange={(value) => handleChange("informantIdNumber", value)}
          />
          <InputField
            label="تاريخ الإصدار:"
            id="informantIdIssueDate"
            name="informantIdIssueDate"
            value={formData.informantIdIssueDate}
            onChange={(value) => handleChange("informantIdIssueDate", value)}
            type="date"
          />
          <InputField
            label="جهة الإصدار:"
            id="informantIdIssuePlace"
            name="informantIdIssuePlace"
            value={formData.informantIdIssuePlace}
            onChange={(value) => handleChange("informantIdIssuePlace", value)}
          />
          <InputField
            label="محل الإقامة:"
            id="informantAddress"
            name="informantAddress"
            value={formData.informantAddress}
            onChange={(value) => handleChange("informantAddress", value)}
          />
        </div>
      </Section>
    ),
    [
      formData.informantName,
      formData.informantRelationship,
      formData.notifierOccupation,
      formData.informantBirthDate,
      formData.informantIdNumber,
      formData.informantIdIssueDate,
      formData.informantIdIssuePlace,
      formData.informantAddress,
      handleChange,
    ]
  );

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        نموذج تسجيل واقعة الوفاة
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {initialInfoSection}
        {deathInfoSection}
        {deceasedInfoSection}
        {informantInfoSection}
        <AttachmentsForm
          uploadedAttachments={uploadedAttachments}
          onAttachmentUpload={handleAttachmentUpload}
          onAttachmentTypeChange={handleAttachmentTypeChange}
          onRemoveAttachment={removeAttachment}
        />
        <button
          type="submit"
          className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-150 ease-in-out"
        >
          حفظ
        </button>
      </form>
    </div>
  );
};
export default DeathRegistration;
