import React, { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import AttachmentDocuments from "./common/AttachmentDocuments";
import { Attachment } from "../types/sidebar.types";
// --- Helper Components --- (No changes here)
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
    required = false,
}) => (
    <div>
        <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
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
    required = false,
}) => (
    <div>
        <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
            {label} {required}
        </label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border p-1  w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md"
            required={required}
        >
            <option value="">نوع المستند</option>
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
    className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className }) => (
    <div className={`border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg ${className}`}>
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        {children}
    </div>
);


// --- Main Component ---

const AddChildToPassport = () => {
    const [formData, setFormData] = useState({
        familyPaperNumber: "",
        familyRecordNumber: "",
        fatherName: "",
        fatherGrandfatherName: "",
        fatherSurname: "",
        fatherLatinName: "",
        fatherBirthDate: "",
        fatherBirthPlace: "",
        motherNameAndSurname: "",
        motherNationality: "",
        childName: "",
        childFatherName: "",
        childGrandfatherName: "",
        childSurname: "",
        childLatinName: "",
        childBirthDate: "",
        childBirthPlace: "",
        childGender: "",
        addressInCanada: "",
        attachments: {
            fatherPassport: false,
            motherPassport: false,
            familyBook: false,
            marriageCertificate: false,
            birthCertificate: false,
        },
        applicantName: "",
        submissionDate: "",
        signature: "",
    });

    const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
    const [uploadedAttachments, setUploadedAttachments] = useState<Attachment[]>([]);

    const genderOptions = [
        { value: "male", label: "ذكر" },
        { value: "female", label: "أنثى" },
    ] as const;

    const attachmentTypeOptions = [
        { value: "passport", label: "جواز" },
        { value: "familyBook", label: "كتيب العائلة" },
        { value: "marriageCertificate", label: "عقد الزواج" },
        { value: "birthCertificate", label: "شهادة الميلاد" },
        { value: "other", label: "أخرى" }
    ] as const;

    const handleChange = useCallback((name: string, value: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }, []);

    

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedPhoto(file);
        }
    };

    const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newAttachments = Array.from(files).map((file) => ({
                file,
                id: crypto.randomUUID(),
                type: "",
            }));
            setUploadedAttachments((prevAttachments) => [...prevAttachments, ...newAttachments]);
        }
    };

    const handleAttachmentTypeChange = (id: string, type: string) => {
        setUploadedAttachments((prevAttachments) =>
            prevAttachments.map((attachment, i) =>
                attachment.id === id
                    ? { ...attachment, type }
                    : attachment


            )
        );
    };

    const removeAttachment = (indexToRemove: number) => {
        setUploadedAttachments((prevAttachments) =>
            prevAttachments.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        for (const attachment of uploadedAttachments) {
            if (!attachment.type) {
                alert("Please select a type for all attachments.");
                return;
            }
        }

        console.log(formData);
        console.log("Uploaded Photo:", uploadedPhoto);
        console.log("Uploaded Attachments:", uploadedAttachments);

        const attachmentsForSubmission = uploadedAttachments.map(item => ({
            filename: item.file.name,
            type: item.type,
        }));
        console.log("Attachments for Submission:", attachmentsForSubmission)
    };

    return (
        <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                نموذج طلب إضافة مولود بجواز السفر
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Family information */}
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

                {/* Father Information */}
                <Section title="بيانات خاصة بوالد المولود">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="الإسم"
                            id="fatherName"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={(value) => handleChange("fatherName", value)}
                            required
                        />
                        <InputField
                            label="إسم الأب"
                            id="fatherGrandfatherName"
                            name="fatherGrandfatherName"
                            value={formData.fatherGrandfatherName}
                            onChange={(value) => handleChange("fatherGrandfatherName", value)}
                            required
                        />
                        <InputField
                            label="إسم الجد"
                            id="fatherSurname"
                            name="fatherSurname"
                            value={formData.fatherSurname}
                            onChange={(value) => handleChange("fatherSurname", value)}
                            required
                        />
                        <InputField
                            label="اللقب"
                            id="fatherLatinName"
                            name="fatherLatinName"
                            value={formData.fatherLatinName}
                            onChange={(value) => handleChange("fatherLatinName", value)}
                            placeholder="كما هو مكتوب في جواز السفر"
                            required
                        />

                        <div className="col-span-1 md:col-span-1">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="تاريخ الميلاد"
                                    id="fatherBirthDate"
                                    name="fatherBirthDate"
                                    type="date"
                                    value={formData.fatherBirthDate}
                                    onChange={(value) => handleChange("fatherBirthDate", value)}
                                    required
                                />
                                <InputField
                                    label="مكان الميلاد"
                                    id="fatherBirthPlace"
                                    name="fatherBirthPlace"
                                    value={formData.fatherBirthPlace}
                                    onChange={(value) => handleChange("fatherBirthPlace", value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </Section>
                {/* Mother's Information */}
                <Section title="بيانات خاصة بوالدة المولود">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="الإسم و اللقب"
                            id="motherNameAndSurname"
                            name="motherNameAndSurname"
                            value={formData.motherNameAndSurname}
                            onChange={(value) => handleChange("motherNameAndSurname", value)}
                            required
                        />
                        <InputField
                            label="جنسيتها"
                            id="motherNationality"
                            name="motherNationality"
                            value={formData.motherNationality}
                            onChange={(value) => handleChange("motherNationality", value)}
                            required
                        />
                    </div>
                </Section>
                {/* Child Information */}
                <Section title="بيانات خاصة بالمولود">
                    {/* Photo Upload */}
                    <Section className="mb-4" title="الصورة">
                        <div className="flex justify-center items-center">
                            <label
                                htmlFor="photoUpload"
                                className="cursor-pointer flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                {uploadedPhoto ? (
                                    <img
                                        src={URL.createObjectURL(uploadedPhoto)}
                                        alt="Uploaded"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                                        <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            تحميل صورة
                                        </span>
                                    </>
                                )}
                                <input
                                    id="photoUpload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                            </label>
                        </div>
                    </Section>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="الإسم"
                            id="childName"
                            name="childName"
                            value={formData.childName}
                            onChange={(value) => handleChange("childName", value)}
                            required
                        />
                        <InputField
                            label="إسم الأب"
                            id="childFatherName"
                            name="childFatherName"
                            value={formData.childFatherName}
                            onChange={(value) => handleChange("childFatherName", value)}
                            required
                        />
                        <InputField
                            label="إسم الجد"
                            id="childGrandfatherName"
                            name="childGrandfatherName"
                            value={formData.childGrandfatherName}
                            onChange={(value) =>
                                handleChange("childGrandfatherName", value)
                            }
                            required
                        />
                        <InputField
                            label="اللقب"
                            id="childSurname"
                            name="childSurname"
                            value={formData.childSurname}
                            onChange={(value) => handleChange("childSurname", value)}
                            required
                        />
                        <InputField
                            label="الاسم باللغة اللاتينية"
                            id="childLatinName"
                            name="childLatinName"
                            value={formData.childLatinName}
                            onChange={(value) => handleChange("childLatinName", value)}
                            placeholder="كما هو مكتوب في شهادة الميلاد"
                            required
                        />

                        <div className="col-span-1 md:col-span-1">
                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="تاريخ الميلاد"
                                    id="childBirthDate"
                                    name="childBirthDate"
                                    type="date"
                                    value={formData.childBirthDate}
                                    onChange={(value) => handleChange("childBirthDate", value)}
                                    required
                                />
                                <InputField
                                    label="مكان الميلاد"
                                    id="childBirthPlace"
                                    name="childBirthPlace"
                                    value={formData.childBirthPlace}
                                    onChange={(value) => handleChange("childBirthPlace", value)}
                                    required
                                />
                            </div>
                        </div>

                        <SelectField
                            label="جنس المولود"
                            id="childGender"
                            name="childGender"
                            value={formData.childGender}
                            onChange={(value) => handleChange("childGender", value)}
                            options={genderOptions}
                            required
                        />

                        <InputField
                            label="العنوان "
                            id="addressInCanada"
                            name="addressInCanada"
                            value={formData.addressInCanada}
                            onChange={(value) => handleChange("addressInCanada", value)}
                        />
                    </div>
                </Section>

                {/* Attachments */}
                <Section title="المرفقات">
                    <AttachmentDocuments
                        uploadedAttachments={uploadedAttachments}
                        onAttachmentTypeChange={handleAttachmentTypeChange}
                        onRemoveAttachment={removeAttachment}
                        onAttachmentUpload={handleAttachmentUpload}
                        attachmentTypeOptions={attachmentTypeOptions}
                    />
                </Section>

                {/* Submission and Signature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="اسم مقدم الطلب"
                        id="applicantName"
                        name="applicantName"
                        value={formData.applicantName}
                        onChange={(value) => handleChange("applicantName", value)}
                    />

                    <InputField
                        label="التاريخ"
                        id="submissionDate"
                        name="submissionDate"
                        type="date"
                        value={formData.submissionDate}
                        onChange={(value) => handleChange("submissionDate", value)}
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg text-sm"
                    >
                        حفظ
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddChildToPassport;