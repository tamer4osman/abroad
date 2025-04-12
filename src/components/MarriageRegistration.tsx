import React, { useState, useCallback } from "react";
import { Upload, File, XCircle } from "lucide-react";

// --- Interfaces ---
interface FormData {
  husbandName: string;
  husbandBirthDate: string;
  husbandBirthPlace: string;
  husbandNationality: string;
  husbandPassportNumber: string;
  husbandPassportIssueDate: string;
  husbandPassportIssuePlace: string;
  husbandResidence: string;
  husbandFatherName: string;
  husbandMotherName: string;
  husbandMotherResidence: string;
  husbandReligion: string;
  husbandProfession: string;

  wifeName: string;
  wifeBirthDate: string;
  wifeBirthPlace: string;
  wifeNationality: string;
  wifePassportNumber: string;
  wifePassportIssueDate: string;
  wifePassportIssuePlace: string;
  wifeResidence: string;
  wifeFatherName: string;
  wifeMotherName: string;
  wifeMotherResidence: string;
  wifeReligion: string;
  wifeProfession: string;

  marriageDate: string;
  marriageTime: string;
  marriageMinute: string;
  marriageCity: string;
  registrationDate: string;
  registrationNumber: string;
  familyPaperNumber: string;
  familyRecordNumber: string;

  contactPhoneUS: string;
  contactEmailUS: string;
  contactAddressUS: string;
  residenceTypeUS: "مؤقتة" | "دائمة"; // Assuming these are the types
}

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
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder={placeholder}
      required={required}
    />
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

const SelectField: React.FC<{
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
}> = ({ label, id, name, value, onChange, options, required }) => (
  <div>
    <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      required={required}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// --- Section Components ---
const FamilyNumbersForm: React.FC<{
  formData: FormData;
  onChange: (name: string, value: string) => void;
}> = ({ formData, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <InputField
      label="رقم ورقة العائلة"
      id="familyPaperNumber"
      name="familyPaperNumber"
      value={formData.familyPaperNumber}
      onChange={(value) => onChange("familyPaperNumber", value)}
    />
    <InputField
      label="رقم قيد العائلة"
      id="familyRecordNumber"
      name="familyRecordNumber"
      value={formData.familyRecordNumber}
      onChange={(value) => onChange("familyRecordNumber", value)}
    />
  </div>
);

const HusbandInfoForm: React.FC<{
  formData: FormData;
  onChange: (name: string, value: string) => void;
}> = ({ formData, onChange }) => (
  <Section title="بيانات الزوج">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="اسم الزوج واللقب:"
        id="husbandName"
        name="husbandName"
        value={formData.husbandName}
        onChange={(value) => onChange("husbandName", value)}
        required
      />
      <InputField
        label="الجنسية:"
        id="husbandNationality"
        name="husbandNationality"
        value={formData.husbandNationality}
        onChange={(value) => onChange("husbandNationality", value)}
      />
      <InputField
        label="مكان الميلاد:"
        id="husbandBirthPlace"
        name="husbandBirthPlace"
        value={formData.husbandBirthPlace}
        onChange={(value) => onChange("husbandBirthPlace", value)}
      />
      <InputField
        label="تاريخ الميلاد:"
        id="husbandBirthDate"
        name="husbandBirthDate"
        value={formData.husbandBirthDate}
        onChange={(value) => onChange("husbandBirthDate", value)}
        type="date"
      />
      <InputField
        label="رقم جواز السفر / البطاقة الشخصية:"
        id="husbandPassportNumber"
        name="husbandPassportNumber"
        value={formData.husbandPassportNumber}
        onChange={(value) => onChange("husbandPassportNumber", value)}
      />
      <InputField
        label="جهة الإصدار:"
        id="husbandPassportIssuePlace"
        name="husbandPassportIssuePlace"
        value={formData.husbandPassportIssuePlace}
        onChange={(value) => onChange("husbandPassportIssuePlace", value)}
      />
      <InputField
        label="تاريخ الإصدار:"
        id="husbandPassportIssueDate"
        name="husbandPassportIssueDate"
        value={formData.husbandPassportIssueDate}
        onChange={(value) => onChange("husbandPassportIssueDate", value)}
        type="date"
      />
      <InputField
        label="محل إقامته:"
        id="husbandResidence"
        name="husbandResidence"
        value={formData.husbandResidence}
        onChange={(value) => onChange("husbandResidence", value)}
      />
      <InputField
        label="ديانته:"
        id="husbandReligion"
        name="husbandReligion"
        value={formData.husbandReligion}
        onChange={(value) => onChange("husbandReligion", value)}
      />
      <InputField
        label="مهنته:"
        id="husbandProfession"
        name="husbandProfession"
        value={formData.husbandProfession}
        onChange={(value) => onChange("husbandProfession", value)}
      />
      <InputField
        label="اسم والد الزوج:"
        id="husbandFatherName"
        name="husbandFatherName"
        value={formData.husbandFatherName}
        onChange={(value) => onChange("husbandFatherName", value)}
      />
      <InputField
        label="اسم والدة الزوج:"
        id="husbandMotherName"
        name="husbandMotherName"
        value={formData.husbandMotherName}
        onChange={(value) => onChange("husbandMotherName", value)}
      />
    </div>
  </Section>
);

const WifeInfoForm: React.FC<{
  formData: FormData;
  onChange: (name: string, value: string) => void;
}> = ({ formData, onChange }) => (
  <Section title="بيانات الزوجة">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="اسم الزوجة واللقب:"
        id="wifeName"
        name="wifeName"
        value={formData.wifeName}
        onChange={(value) => onChange("wifeName", value)}
        required
      />
      <InputField
        label="الجنسية:"
        id="wifeNationality"
        name="wifeNationality"
        value={formData.wifeNationality}
        onChange={(value) => onChange("wifeNationality", value)}
      />
      <InputField
        label="مكان الميلاد:"
        id="wifeBirthPlace"
        name="wifeBirthPlace"
        value={formData.wifeBirthPlace}
        onChange={(value) => onChange("wifeBirthPlace", value)}
      />
      <InputField
        label="تاريخ الميلاد:"
        id="wifeBirthDate"
        name="wifeBirthDate"
        value={formData.wifeBirthDate}
        onChange={(value) => onChange("wifeBirthDate", value)}
        type="date"
      />
      <InputField
        label="رقم جواز السفر / البطاقة الشخصية:"
        id="wifePassportNumber"
        name="wifePassportNumber"
        value={formData.wifePassportNumber}
        onChange={(value) => onChange("wifePassportNumber", value)}
      />
      <InputField
        label="جهة الإصدار:"
        id="wifePassportIssuePlace"
        name="wifePassportIssuePlace"
        value={formData.wifePassportIssuePlace}
        onChange={(value) => onChange("wifePassportIssuePlace", value)}
      />
      <InputField
        label="تاريخ الإصدار:"
        id="wifePassportIssueDate"
        name="wifePassportIssueDate"
        value={formData.wifePassportIssueDate}
        onChange={(value) => onChange("wifePassportIssueDate", value)}
        type="date"
      />
      <InputField
        label="محل إقامتها:"
        id="wifeResidence"
        name="wifeResidence"
        value={formData.wifeResidence}
        onChange={(value) => onChange("wifeResidence", value)}
      />
      <InputField
        label="ديانتها:"
        id="wifeReligion"
        name="wifeReligion"
        value={formData.wifeReligion}
        onChange={(value) => onChange("wifeReligion", value)}
      />
      <InputField
        label="مهنتها:"
        id="wifeProfession"
        name="wifeProfession"
        value={formData.wifeProfession}
        onChange={(value) => onChange("wifeProfession", value)}
      />
      <InputField
        label="اسم والد الزوجة:"
        id="wifeFatherName"
        name="wifeFatherName"
        value={formData.wifeFatherName}
        onChange={(value) => onChange("wifeFatherName", value)}
      />
      <InputField
        label="اسم والدة الزوجة:"
        id="wifeMotherName"
        name="wifeMotherName"
        value={formData.wifeMotherName}
        onChange={(value) => onChange("wifeMotherName", value)}
      />
    </div>
  </Section>
);

const MarriageDetailsForm: React.FC<{
  formData: FormData;
  onChange: (name: string, value: string) => void;
}> = ({ formData, onChange }) => (
  <Section title="بيانات عقد الزواج">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="تاريخ الزواج:"
        id="marriageDate"
        name="marriageDate"
        value={formData.marriageDate}
        onChange={(value) => onChange("marriageDate", value)}
        type="date"
        required
      />
      <InputField
        label="مدينة:"
        id="marriageCity"
        name="marriageCity"
        value={formData.marriageCity}
        onChange={(value) => onChange("marriageCity", value)}
      />
      <InputField
        label="تاريخ التسجيل:"
        id="registrationDate"
        name="registrationDate"
        value={formData.registrationDate}
        onChange={(value) => onChange("registrationDate", value)}
        type="date"
      />
      <InputField
        label="تحت رقم:"
        id="registrationNumber"
        name="registrationNumber"
        value={formData.registrationNumber}
        onChange={(value) => onChange("registrationNumber", value)}
      />
    </div>
  </Section>
);

interface AttachmentsFormProps {
  uploadedAttachments: { file: File; type: string }[];
  onAttachmentUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAttachmentTypeChange: (index: number, newType: string) => void;
  onRemoveAttachment: (index: number) => void;
}

const AttachmentsForm: React.FC<AttachmentsFormProps> = ({
  uploadedAttachments,
  onAttachmentUpload,
  onAttachmentTypeChange,
  onRemoveAttachment,
}) => {
  const attachmentTypeOptions: string[] = [
    "صورة عن الهوية",
    "صورة عن جواز السفر",
    "عقد الزواج",
    "شهادة ميلاد",
    "إخراج قيد",
    "أخرى",
  ];

  return (
    <Section title="المرفقات">
      {/* Attachment Upload */}
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

        {/* Display uploaded attachments in a table */}
        <div className="mt-4 overflow-x-auto">
          {" "}
          {/* Added overflow-x-auto for horizontal scrolling if needed */}
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
              {uploadedAttachments.map((attachment, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap text-right dark:text-white">
                    <div className="flex items-center">
                      <File className="mr-2" size={16} />
                      {attachment.file.name}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right dark:text-white">
                    <SelectField
                      label=""
                      id={`attachmentType-${index}`}
                      name={`attachmentType-${index}`}
                      value={attachment.type}
                      onChange={(value) => onAttachmentTypeChange(index, value)}
                      options={attachmentTypeOptions}
                      required
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right dark:text-white">
                    <button
                      type="button"
                      onClick={() => onRemoveAttachment(index)}
                      className="px-2 py-1  text-white rounded-md"
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
      </div>
    </Section>
  );
};

// --- Main Component ---
const MarriageRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    husbandName: "",
    husbandBirthDate: "",
    husbandBirthPlace: "",
    husbandNationality: "",
    husbandPassportNumber: "",
    husbandPassportIssueDate: "",
    husbandPassportIssuePlace: "",
    husbandResidence: "",
    husbandFatherName: "",
    husbandMotherName: "",
    husbandMotherResidence: "",
    husbandReligion: "",
    husbandProfession: "",

    wifeName: "",
    wifeBirthDate: "",
    wifeBirthPlace: "",
    wifeNationality: "",
    wifePassportNumber: "",
    wifePassportIssueDate: "",
    wifePassportIssuePlace: "",
    wifeResidence: "",
    wifeFatherName: "",
    wifeMotherName: "",
    wifeMotherResidence: "",
    wifeReligion: "",
    wifeProfession: "",

    marriageDate: "",
    marriageTime: "",
    marriageMinute: "",
    marriageCity: "",
    registrationDate: "",
    registrationNumber: "",
    familyPaperNumber: "",
    familyRecordNumber: "",

    contactPhoneUS: "",
    contactEmailUS: "",
    contactAddressUS: "",
    residenceTypeUS: "مؤقتة", // default value
  });

  const handleChange = useCallback(
    (name: string, value: string) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    },
    [setFormData]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("بيانات الزواج المقدمة:", formData);
      // Here you would typically handle form submission, e.g., sending data to a server.
    },
    [formData]
  );

  const [uploadedAttachments, setUploadedAttachments] = useState<
    { file: File; type: string }[]
  >([]);

  const handleAttachmentUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newAttachments = Array.from(files).map((file) => ({
          file: file,
          type: "صورة عن الهوية", // Default type - you might want to make this more dynamic
        }));
        setUploadedAttachments((prevAttachments) => [
          ...prevAttachments,
          ...newAttachments,
        ]);
      }
    },
    [setUploadedAttachments]
  );

  const handleAttachmentTypeChange = useCallback(
    (index: number, newType: string) => {
      setUploadedAttachments((prevAttachments) => {
        const updatedAttachments = [...prevAttachments];
        updatedAttachments[index] = {
          ...updatedAttachments[index],
          type: newType,
        };
        return updatedAttachments;
      });
    },
    [setUploadedAttachments]
  );

  const removeAttachment = useCallback(
    (index: number) => {
      setUploadedAttachments((prevAttachments) => {
        const updatedAttachments = [...prevAttachments];
        updatedAttachments.splice(index, 1);
        return updatedAttachments;
      });
    },
    [setUploadedAttachments]
  );

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        نموذج تسجيل واقعة الزواج
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Family Numbers */}
        <Section title="أرقام العائلة">
          <FamilyNumbersForm formData={formData} onChange={handleChange} />
        </Section>

        {/* Husband's Information Section */}
        <HusbandInfoForm formData={formData} onChange={handleChange} />

        {/* Wife's Information Section */}
        <WifeInfoForm formData={formData} onChange={handleChange} />

        {/* Marriage Contract Information Section */}
        <MarriageDetailsForm formData={formData} onChange={handleChange} />

        {/* Attachments */}
        <AttachmentsForm
          uploadedAttachments={uploadedAttachments}
          onAttachmentUpload={handleAttachmentUpload}
          onAttachmentTypeChange={handleAttachmentTypeChange}
          onRemoveAttachment={removeAttachment}
        />

        <button
          type="submit"
          className="py-2 bg-green-500 text-white border-none rounded-md hover:bg-green-600 transition-colors duration-150 ease-in-out"
        >
          تسجيل عقد الزواج
        </button>
      </form>
    </div>
  );
};

export default MarriageRegistration;
