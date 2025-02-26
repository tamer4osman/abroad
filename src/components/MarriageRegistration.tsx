import React, { useState, useCallback } from "react";
import { Upload, File, XCircle } from "lucide-react";

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
  const attachmentTypeOptions: string[] = [
    "صورة عن الهوية",
    "صورة عن جواز السفر",
    "عقد الزواج",
    "شهادة ميلاد",
    "إخراج قيد",
    "أخرى",
  ];

  const handleAttachmentUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        file: file,
        type: attachmentTypeOptions[0], // Default type
      }));
      setUploadedAttachments((prevAttachments) => [
        ...prevAttachments,
        ...newAttachments,
      ]);
    }
  };

  const handleAttachmentTypeChange = (index: number, newType: string) => {
    setUploadedAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments[index] = {
        ...updatedAttachments[index],
        type: newType,
      };
      return updatedAttachments;
    });
  };

  const removeAttachment = (index: number) => {
    setUploadedAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments.splice(index, 1);
      return updatedAttachments;
    });
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="رقم ورقة العائلة"
            id="familyPaperNumber"
            name="familyPaperNumber"
            value={formData.familyPaperNumber}
            onChange={(value) => handleChange("familyPaperNumber", value)}
          />
          <InputField
            label="رقم قيد العائلة"
            id="familyRecordNumber"
            name="familyRecordNumber"
            value={formData.familyRecordNumber}
            onChange={(value) => handleChange("familyRecordNumber", value)}
          />
        </div>
        {/* Husband's Information Section */}
        <Section title="بيانات الزوج">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="اسم الزوج واللقب:"
              id="husbandName"
              name="husbandName"
              value={formData.husbandName}
              onChange={(value) => handleChange("husbandName", value)}
              required
            />
            <InputField
              label="الجنسية:"
              id="husbandNationality"
              name="husbandNationality"
              value={formData.husbandNationality}
              onChange={(value) => handleChange("husbandNationality", value)}
            />
            <InputField
              label="مكان الميلاد:"
              id="husbandBirthPlace"
              name="husbandBirthPlace"
              value={formData.husbandBirthPlace}
              onChange={(value) => handleChange("husbandBirthPlace", value)}
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
              label="رقم جواز السفر / البطاقة الشخصية:"
              id="husbandPassportNumber"
              name="husbandPassportNumber"
              value={formData.husbandPassportNumber}
              onChange={(value) => handleChange("husbandPassportNumber", value)}
            />
            <InputField
              label="جهة الإصدار:"
              id="husbandPassportIssuePlace"
              name="husbandPassportIssuePlace"
              value={formData.husbandPassportIssuePlace}
              onChange={(value) =>
                handleChange("husbandPassportIssuePlace", value)
              }
            />
            <InputField
              label="تاريخ الإصدار:"
              id="husbandPassportIssueDate"
              name="husbandPassportIssueDate"
              value={formData.husbandPassportIssueDate}
              onChange={(value) =>
                handleChange("husbandPassportIssueDate", value)
              }
              type="date"
            />
            <InputField
              label="محل إقامته:"
              id="husbandResidence"
              name="husbandResidence"
              value={formData.husbandResidence}
              onChange={(value) => handleChange("husbandResidence", value)}
            />
            <InputField
              label="ديانته:"
              id="husbandReligion"
              name="husbandReligion"
              value={formData.husbandReligion}
              onChange={(value) => handleChange("husbandReligion", value)}
            />
            <InputField
              label="مهنته:"
              id="husbandProfession"
              name="husbandProfession"
              value={formData.husbandProfession}
              onChange={(value) => handleChange("husbandProfession", value)}
            />
            <InputField
              label="اسم والد الزوج:"
              id="husbandFatherName"
              name="husbandFatherName"
              value={formData.husbandFatherName}
              onChange={(value) => handleChange("husbandFatherName", value)}
            />
            <InputField
              label="اسم والدة الزوج:"
              id="husbandMotherName"
              name="husbandMotherName"
              value={formData.husbandMotherName}
              onChange={(value) => handleChange("husbandMotherName", value)}
            />
            <InputField
              label="محل إقامة والدة الزوج:"
              id="husbandMotherResidence"
              name="husbandMotherResidence"
              value={formData.husbandMotherResidence}
              onChange={(value) =>
                handleChange("husbandMotherResidence", value)
              }
            />
          </div>
        </Section>

        {/* Wife's Information Section */}
        <Section title="بيانات الزوجة">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="اسم الزوجة واللقب:"
              id="wifeName"
              name="wifeName"
              value={formData.wifeName}
              onChange={(value) => handleChange("wifeName", value)}
              required
            />
            <InputField
              label="الجنسية:"
              id="wifeNationality"
              name="wifeNationality"
              value={formData.wifeNationality}
              onChange={(value) => handleChange("wifeNationality", value)}
            />
            <InputField
              label="مكان الميلاد:"
              id="wifeBirthPlace"
              name="wifeBirthPlace"
              value={formData.wifeBirthPlace}
              onChange={(value) => handleChange("wifeBirthPlace", value)}
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
              label="رقم جواز السفر / البطاقة الشخصية:"
              id="wifePassportNumber"
              name="wifePassportNumber"
              value={formData.wifePassportNumber}
              onChange={(value) => handleChange("wifePassportNumber", value)}
            />
            <InputField
              label="جهة الإصدار:"
              id="wifePassportIssuePlace"
              name="wifePassportIssuePlace"
              value={formData.wifePassportIssuePlace}
              onChange={(value) =>
                handleChange("wifePassportIssuePlace", value)
              }
            />
            <InputField
              label="تاريخ الإصدار:"
              id="wifePassportIssueDate"
              name="wifePassportIssueDate"
              value={formData.wifePassportIssueDate}
              onChange={(value) => handleChange("wifePassportIssueDate", value)}
              type="date"
            />
            <InputField
              label="محل إقامتها:"
              id="wifeResidence"
              name="wifeResidence"
              value={formData.wifeResidence}
              onChange={(value) => handleChange("wifeResidence", value)}
            />
            <InputField
              label="ديانتها:"
              id="wifeReligion"
              name="wifeReligion"
              value={formData.wifeReligion}
              onChange={(value) => handleChange("wifeReligion", value)}
            />
            <InputField
              label="مهنتها:"
              id="wifeProfession"
              name="wifeProfession"
              value={formData.wifeProfession}
              onChange={(value) => handleChange("wifeProfession", value)}
            />
            <InputField
              label="اسم والد الزوجة:"
              id="wifeFatherName"
              name="wifeFatherName"
              value={formData.wifeFatherName}
              onChange={(value) => handleChange("wifeFatherName", value)}
            />
            <InputField
              label="اسم والدة الزوجة:"
              id="wifeMotherName"
              name="wifeMotherName"
              value={formData.wifeMotherName}
              onChange={(value) => handleChange("wifeMotherName", value)}
            />
            <InputField
              label="محل إقامة والدة الزوجة:"
              id="wifeMotherResidence"
              name="wifeMotherResidence"
              value={formData.wifeMotherResidence}
              onChange={(value) => handleChange("wifeMotherResidence", value)}
            />
          </div>
        </Section>

        {/* Marriage Contract Information Section */}
        <Section title="بيانات عقد الزواج">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="تاريخ الزواج:"
              id="marriageDate"
              name="marriageDate"
              value={formData.marriageDate}
              onChange={(value) => handleChange("marriageDate", value)}
              type="date"
              required
            />
            <div className="flex gap-2">
              <InputField
                label="الساعة:"
                id="marriageTime"
                name="marriageTime"
                value={formData.marriageTime}
                onChange={(value) => handleChange("marriageTime", value)}
                type="number"
                placeholder="HH"
              />
              <InputField
                label="الدقيقة:"
                id="marriageMinute"
                name="marriageMinute"
                value={formData.marriageMinute}
                onChange={(value) => handleChange("marriageMinute", value)}
                type="number"
                placeholder="MM"
              />
            </div>
            <InputField
              label="مدينة:"
              id="marriageCity"
              name="marriageCity"
              value={formData.marriageCity}
              onChange={(value) => handleChange("marriageCity", value)}
            />
            <InputField
              label="تاريخ التسجيل:"
              id="registrationDate"
              name="registrationDate"
              value={formData.registrationDate}
              onChange={(value) => handleChange("registrationDate", value)}
              type="date"
            />
            <InputField
              label="تحت رقم:"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={(value) => handleChange("registrationNumber", value)}
            />
          </div>
        </Section>

        {/* Contact Information in US Section */}
        <Section title="معلومات الاتصال">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="رقم الهاتف:"
              id="contactPhoneUS"
              name="contactPhoneUS"
              value={formData.contactPhoneUS}
              onChange={(value) => handleChange("contactPhoneUS", value)}
              type="tel"
            />
            <InputField
              label="البريد الإلكتروني:"
              id="contactEmailUS"
              name="contactEmailUS"
              value={formData.contactEmailUS}
              onChange={(value) => handleChange("contactEmailUS", value)}
              type="email"
            />
            <InputField
              label="عنوان الإقامة:"
              id="contactAddressUS"
              name="contactAddressUS"
              value={formData.contactAddressUS}
              onChange={(value) => handleChange("contactAddressUS", value)}
            />
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                نوع الإقامة:
              </label>
              <div className="mt-2 space-x-4 flex flex-row-reverse">
                <div className="flex items-center">
                  <input
                    id="residenceTypeTemp"
                    name="residenceTypeUS"
                    type="radio"
                    value="مؤقتة"
                    checked={formData.residenceTypeUS === "مؤقتة"}
                    onChange={(e) =>
                      handleChange("residenceTypeUS", e.target.value)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="residenceTypeTemp"
                    className="mr-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    مؤقتة
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="residenceTypePerm"
                    name="residenceTypeUS"
                    type="radio"
                    value="دائمة"
                    checked={formData.residenceTypeUS === "دائمة"}
                    onChange={(e) =>
                      handleChange("residenceTypeUS", e.target.value)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="residenceTypePerm"
                    className="mr-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    دائمة
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Section>
        {/* Attachments */}
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
              onChange={handleAttachmentUpload}
            />

            {/* Display uploaded attachments with type selection */}
            <div className="mt-2 space-y-2">
              {uploadedAttachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md"
                >
                  <div className="flex items-center flex-grow">
                    {" "}
                    {/* Use flex-grow */}
                    <span className="text-gray-900 dark:text-white m-2">
                      <File className="inline mr-2" size={16} />
                      {attachment.file.name}
                    </span>
                    <SelectField
                      label=""
                      id={`attachmentType-${index}`}
                      name={`attachmentType-${index}`}
                      value={attachment.type}
                      onChange={(value) =>
                        handleAttachmentTypeChange(index, value)
                      }
                      options={attachmentTypeOptions}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="px-2 py-1  text-white rounded-md"
                  >
                    <XCircle
                      className="text-red-500 hover:text-red-700"
                      size={16}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Section>

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
