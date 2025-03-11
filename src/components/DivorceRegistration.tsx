// filepath: /abroad/abroad/src/components/DivorceRegistration.tsx
import React, { useState, useCallback } from "react";
import { Upload, File, XCircle } from "lucide-react";

// --- Helper Components (FormComponents.tsx content is included here) ---
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
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
      className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

// --- New Component: AttachmentTable (for SRP in AttachmentsForm) ---
interface AttachmentTableProps {
  uploadedAttachments: { file: File; type: string }[];
  onAttachmentTypeChange: (index: number, newType: string) => void;
  onRemoveAttachment: (index: number) => void;
}

const AttachmentTable: React.FC<AttachmentTableProps> = ({
  uploadedAttachments,
  onAttachmentTypeChange,
  onRemoveAttachment,
}) => {
  const attachmentTypeOptions: string[] = [
    "صورة عن الهوية",
    "صورة عن جواز السفر",
    "شهادة الطلاق",
    "إخراج قيد",
    "أخرى",
  ];

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
                  options={attachmentTypeOptions.map(opt => ({value: opt, label: opt}))}
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
  );
};


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

        {/* Display uploaded attachments in a table - Now using AttachmentTable component */}
        <AttachmentTable
          uploadedAttachments={uploadedAttachments}
          onAttachmentTypeChange={onAttachmentTypeChange}
          onRemoveAttachment={onRemoveAttachment}
        />
      </div>
    </Section>
  );
};


// --- Interfaces ---
interface DivorceFormData {
  husbandFamilyCardNumber: string;
  civilRegistryOffice: string;
  municipality: string;
  divorceRecordYear: string;
  divorceRecordDay: string;
  divorceRecordMonth: string;
  applicantIdNumber: string;
  applicantIssueDate: string;
  applicantIssueAuthority: string;
  applicantResidence: string;
  divorceCertificateDay: string;
  divorceCertificateMonth: string;
  divorceCertificateYear: string;
  divorceHour: string;
  divorceMinute: string;
  divorceYear: string;
  husbandName: string;
  husbandBirthDate: string;
  husbandBirthPlace: string;
  husbandOccupation: string;
  husbandReligion: string;
  husbandResidence: string;
  husbandIdNumber: string;
  husbandIdIssueDate: string;
  husbandIdIssueAuthority: string;
  husbandFatherName: string;
  husbandMotherName: string;
  wifeName: string;
  wifeOccupation: string;
  wifeReligion: string;
  wifeResidence: string;
  wifeBirthDate: string;
  wifeBirthPlace: string;
  wifeIdNumber: string;
  wifeIdIssueDate: string;
  wifeIdIssueAuthority: string;
  recordDate: string;
  recordNumber: string;
  consularOfficerSignature: string;
  wifeFatherName: string;
  wifeMotherName: string;
}


// --- Custom Hook for Form State Management (DIP & SRP) ---
interface UseDivorceFormStateResult {
  formData: DivorceFormData;
  uploadedAttachments: { file: File; type: string }[];
  handleChange: (name: string, value: string) => void;
  handleAttachmentUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAttachmentTypeChange: (index: number, newType: string) => void;
  removeAttachment: (index: number) => void;
  setFormData: React.Dispatch<React.SetStateAction<DivorceFormData>>; // Expose setter if needed
  setUploadedAttachments: React.Dispatch<React.SetStateAction<{ file: File; type: string; }[]>>; // Expose setter if needed
}


const useDivorceFormState = (): UseDivorceFormStateResult => {
  const [formData, setFormData] = useState<DivorceFormData>({
    husbandFamilyCardNumber: "",
    civilRegistryOffice: "",
    municipality: "",
    divorceRecordYear: "",
    divorceRecordDay: "",
    divorceRecordMonth: "",
    applicantIdNumber: "",
    applicantIssueDate: "",
    applicantIssueAuthority: "",
    applicantResidence: "",
    divorceCertificateDay: "",
    divorceCertificateMonth: "",
    divorceCertificateYear: "",
    divorceHour: "",
    divorceMinute: "",
    divorceYear: "",
    husbandName: "",
    husbandBirthDate: "",
    husbandBirthPlace: "",
    husbandOccupation: "",
    husbandReligion: "",
    husbandResidence: "",
    husbandIdNumber: "",
    husbandIdIssueDate: "",
    husbandIdIssueAuthority: "",
    husbandFatherName: "",
    husbandMotherName: "",
    wifeName: "",
    wifeOccupation: "",
    wifeReligion: "",
    wifeResidence: "",
    wifeBirthDate: "",
    wifeBirthPlace: "",
    wifeIdNumber: "",
    wifeIdIssueDate: "",
    wifeIdIssueAuthority: "",
    recordDate: "",
    recordNumber: "",
    consularOfficerSignature: "",
    wifeFatherName: "",
    wifeMotherName: "",
  });

  const [uploadedAttachments, setUploadedAttachments] = useState<
    { file: File; type: string }[]
  >([]);

  const handleAttachmentUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newAttachments = Array.from(files).map((file) => ({
          file: file,
          type: "صورة عن الهوية", // Default type
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


  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  return {
    formData,
    uploadedAttachments,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
    setFormData, // Expose setters if needed for more advanced scenarios
    setUploadedAttachments, // Expose setters if needed for more advanced scenarios
  };
};


// --- Main Component ---
const DivorceRegistration: React.FC = () => {
  const {
    formData,
    uploadedAttachments,
    handleChange,
    handleAttachmentUpload,
    handleAttachmentTypeChange,
    removeAttachment,
    // setFormData, // If you need to directly set formData from DivorceRegistration
    // setUploadedAttachments, // If you need to directly set uploadedAttachments from DivorceRegistration
  } = useDivorceFormState();


  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log(formData);
      alert("Form submitted! Check console for data.");
    },
    [formData]
  );

  const months = [
    { value: "1", label: "يناير" },
    { value: "2", label: "فبراير" },
    { value: "3", label: "مارس" },
    { value: "4", label: "أبريل" },
    { value: "5", label: "مايو" },
    { value: "6", label: "يونيو" },
    { value: "7", label: "يوليو" },
    { value: "8", label: "أغسطس" },
    { value: "9", label: "سبتمبر" },
    { value: "10", label: "أكتوبر" },
    { value: "11", label: "نوفمبر" },
    { value: "12", label: "ديسمبر" },
  ];

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1).padStart(2, "0"),
  }));
  const years = Array.from({ length: 100 }, (_, i) => ({
    value: String(new Date().getFullYear() - i),
    label: String(new Date().getFullYear() - i),
  }));

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        نموذج تسجيل واقعة الطلاق
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <Section title="بيانات المطلق">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InputField
              label="1 - إسم المطلق:"
              id="husbandName"
              name="husbandName"
              value={formData.husbandName}
              onChange={(value) => handleChange("husbandName", value)}
            />
            <InputField
              label="تاريخ الميلاد:"
              id="husbandBirthDate"
              name="husbandBirthDate"
              value={formData.husbandBirthDate}
              onChange={(value) => handleChange("husbandBirthDate", value)}
              type="date"
            />
            <InputField
              label="مكان الميلاد:"
              id="husbandBirthPlace"
              name="husbandBirthPlace"
              value={formData.husbandBirthPlace}
              onChange={(value) => handleChange("husbandBirthPlace", value)}
            />
            <InputField
              label="مهنته:"
              id="husbandOccupation"
              name="husbandOccupation"
              value={formData.husbandOccupation}
              onChange={(value) => handleChange("husbandOccupation", value)}
            />
            <InputField
              label="ديانته:"
              id="husbandReligion"
              name="husbandReligion"
              value={formData.husbandReligion}
              onChange={(value) => handleChange("husbandReligion", value)}
            />
            <InputField
              label="محل إقامته:"
              id="husbandResidence"
              name="husbandResidence"
              value={formData.husbandResidence}
              onChange={(value) => handleChange("husbandResidence", value)}
            />
            <InputField
              label="رقم بطاقته الشخصية / جواز سفره:"
              id="husbandIdNumber"
              name="husbandIdNumber"
              value={formData.husbandIdNumber}
              onChange={(value) => handleChange("husbandIdNumber", value)}
            />
            <InputField
              label="تاريخ الإصدار:"
              id="husbandIdIssueDate"
              name="husbandIdIssueDate"
              value={formData.husbandIdIssueDate}
              onChange={(value) => handleChange("husbandIdIssueDate", value)}
              type="date"
            />
            <InputField
              label="جهة الإصدار:"
              id="husbandIdIssueAuthority"
              name="husbandIdIssueAuthority"
              value={formData.husbandIdIssueAuthority}
              onChange={(value) =>
                handleChange("husbandIdIssueAuthority", value)
              }
            />
            <InputField
              label="إسم والد الزوج:"
              id="husbandFatherName"
              name="husbandFatherName"
              value={formData.husbandFatherName}
              onChange={(value) => handleChange("husbandFatherName", value)}
            />
            <InputField
              label="إسم والدة الزوج:"
              id="husbandMotherName"
              name="husbandMotherName"
              value={formData.husbandMotherName}
              onChange={(value) => handleChange("husbandMotherName", value)}
            />
          </div>
        </Section>

        <Section title="بيانات المطلقة">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InputField
              label="2 - إسم المطلقة:"
              id="wifeName"
              name="wifeName"
              value={formData.wifeName}
              onChange={(value) => handleChange("wifeName", value)}
            />
            <InputField
              label="تاريخ الميلاد:"
              id="wifeBirthDate"
              name="wifeBirthDate"
              value={formData.wifeBirthDate}
              onChange={(value) => handleChange("wifeBirthDate", value)}
              type="date"
            />
            <InputField
              label="مكان الميلاد:"
              id="wifeBirthPlace"
              name="wifeBirthPlace"
              value={formData.wifeBirthPlace}
              onChange={(value) => handleChange("wifeBirthPlace", value)}
            />
            <InputField
              label="مهنتها:"
              id="wifeOccupation"
              name="wifeOccupation"
              value={formData.wifeOccupation}
              onChange={(value) => handleChange("wifeOccupation", value)}
            />
            <InputField
              label="ديانتها:"
              id="wifeReligion"
              name="wifeReligion"
              value={formData.wifeReligion}
              onChange={(value) => handleChange("wifeReligion", value)}
            />
            <InputField
              label="محل إقامتها:"
              id="wifeResidence"
              name="wifeResidence"
              value={formData.wifeResidence}
              onChange={(value) => handleChange("wifeResidence", value)}
            />
            <InputField
              label="رقم بطاقتها الشخصية / جواز سفرها:"
              id="wifeIdNumber"
              name="wifeIdNumber"
              value={formData.wifeIdNumber}
              onChange={(value) => handleChange("wifeIdNumber", value)}
            />
            <InputField
              label="تاريخ الإصدار:"
              id="wifeIdIssueDate"
              name="wifeIdIssueDate"
              value={formData.wifeIdIssueDate}
              onChange={(value) => handleChange("wifeIdIssueDate", value)}
              type="date"
            />
            <InputField
              label="جهة الإصدار:"
              id="wifeIdIssueAuthority"
              name="wifeIdIssueAuthority"
              value={formData.wifeIdIssueAuthority}
              onChange={(value) => handleChange("wifeIdIssueAuthority", value)}
            />
            <InputField
              label="إسم والد الزوجة:"
              id="wifeFatherName"
              name="wifeFatherName"
              value={formData.wifeFatherName}
              onChange={(value) => handleChange("wifeFatherName", value)}
            />
            <InputField
              label="إسم والدة الزوجة:"
              id="wifeMotherName"
              name="wifeMotherName"
              value={formData.wifeMotherName}
              onChange={(value) => handleChange("wifeMotherName", value)}
            />
          </div>
        </Section>
        <Section title="بيانات شهادة الطلاق">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InputField
              label="رقم ورقة عائلة الزوج:"
              id="husbandFamilyCardNumber"
              name="husbandFamilyCardNumber"
              value={formData.husbandFamilyCardNumber}
              onChange={(value) =>
                handleChange("husbandFamilyCardNumber", value)
              }
            />
            <InputField
              label="مكتب إصدار السجل المدني:"
              id="civilRegistryOffice"
              name="civilRegistryOffice"
              value={formData.civilRegistryOffice}
              onChange={(value) => handleChange("civilRegistryOffice", value)}
            />
            <InputField
              label="بلدية:"
              id="municipality"
              name="municipality"
              value={formData.municipality}
              onChange={(value) => handleChange("municipality", value)}
            />
          </div>
          <p className="mt-2 font-semibold">
            صورة طبق الأصل من سجل واقعات الطلاق وما في حكمها
          </p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-2">
            <div>
              <SelectField
                label="يوم:"
                id="divorceCertificateDay"
                name="divorceCertificateDay"
                value={formData.divorceCertificateDay}
                onChange={(value) =>
                  handleChange("divorceCertificateDay", value)
                }
                options={days}
              />
            </div>
            <div>
              <SelectField
                label="من شهر:"
                id="divorceCertificateMonth"
                name="divorceCertificateMonth"
                value={formData.divorceCertificateMonth}
                onChange={(value) =>
                  handleChange("divorceCertificateMonth", value)
                }
                options={months}
              />
            </div>
            <div>
              <SelectField
                label="في سنة:"
                id="divorceCertificateYear"
                name="divorceCertificateYear"
                value={formData.divorceCertificateYear}
                onChange={(value) =>
                  handleChange("divorceCertificateYear", value)
                }
                options={years}
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="block text-gray-700 dark:text-gray-300">
                الموافق:
              </label>
            </div>
            <div> </div>
          </div>
        </Section>

        {/* Attachments Section */}
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
          حفظ
        </button>
      </form>
    </div>
  );
};

export default DivorceRegistration;