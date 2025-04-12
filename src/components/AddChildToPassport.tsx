import React, { useState, useCallback, useMemo } from "react";
import { Upload } from "lucide-react";
import AttachmentDocuments from "./common/AttachmentDocuments";

interface Attachment {
    id: string;
    file: File;
    type: string;
}

interface FormData {
    // Family Information
    familyPaperNumber: string;
    familyRecordNumber: string;
    
    // Father Information
    fatherName: string;
    fatherGrandfatherName: string;
    fatherSurname: string;
    fatherLatinName: string;
    fatherBirthDate: string;
    fatherBirthPlace: string;
    fatherPassportNumber: string;
    fatherPassportIssueDate: string;
    fatherPassportIssuePlace: string;
    
    // Mother Information
    motherNameAndSurname: string;
    motherNationality: string;
    motherPassportNumber: string;
    motherPassportIssueDate: string;
    motherPassportIssuePlace: string;
    
    // Child Information
    childName: string;
    childFatherName: string;
    childGrandfatherName: string;
    childSurname: string;
    childLatinName: string;
    childBirthDate: string;
    childBirthPlace: string;
    childGender: string;
    childNationality: string;
    
    // Contact Information
    addressAbroad: string;
    phoneAbroad: string;
    addressLibya: string;
    phoneLibya: string;
    email: string;
    
    // Application Information
    applicantName: string;
    applicantRelationship: string;
    submissionDate: string;
    agreesToTerms: boolean;
    
    // Photo will be managed separately
    photo?: File;
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
            className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
    className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className }) => (
    <div className={`border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md shadow-md mb-4 ${className}`}>
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        {children}
    </div>
);

// --- Constants ---
const GENDER_OPTIONS = [
    { value: "male", label: "ذكر" },
    { value: "female", label: "أنثى" },
] as const;

const RELATIONSHIP_OPTIONS = [
    { value: "father", label: "الأب" },
    { value: "mother", label: "الأم" },
    { value: "guardian", label: "الوصي القانوني" },
    { value: "other", label: "أخرى" },
] as const;

const ATTACHMENT_TYPE_OPTIONS = [
    { value: "birthCertificate", label: "شهادة الميلاد" },
    { value: "fatherPassport", label: "جواز سفر الأب" },
    { value: "motherPassport", label: "جواز سفر الأم" },
    { value: "familyBook", label: "كتيب العائلة" },
    { value: "marriageCertificate", label: "عقد الزواج" },
    { value: "guardianshipDocuments", label: "وثائق الوصاية" },
    { value: "other", label: "أخرى" },
] as const;

// --- Custom Hook ---
const useChildPassportFormState = () => {
    const [formData, setFormData] = useState<FormData>({
        // Family Information
        familyPaperNumber: "",
        familyRecordNumber: "",
        
        // Father Information
        fatherName: "",
        fatherGrandfatherName: "",
        fatherSurname: "",
        fatherLatinName: "",
        fatherBirthDate: "",
        fatherBirthPlace: "",
        fatherPassportNumber: "",
        fatherPassportIssueDate: "",
        fatherPassportIssuePlace: "",
        
        // Mother Information
        motherNameAndSurname: "",
        motherNationality: "",
        motherPassportNumber: "",
        motherPassportIssueDate: "",
        motherPassportIssuePlace: "",
        
        // Child Information
        childName: "",
        childFatherName: "",
        childGrandfatherName: "",
        childSurname: "",
        childLatinName: "",
        childBirthDate: "",
        childBirthPlace: "",
        childGender: "",
        childNationality: "ليبي",
        
        // Contact Information
        addressAbroad: "",
        phoneAbroad: "",
        addressLibya: "",
        phoneLibya: "",
        email: "",
        
        // Application Information
        applicantName: "",
        applicantRelationship: "",
        submissionDate: new Date().toISOString().split('T')[0],
        agreesToTerms: false,
    });

    const [uploadedAttachments, setUploadedAttachments] = useState<Attachment[]>([]);

    const handleChange = useCallback((name: keyof FormData, value: string | boolean | File | undefined) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }, []);

    const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                photo: e.target.files![0],
            }));
        }
    }, []);

    const handleAttachmentUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newAttachments = Array.from(files).map((file) => ({
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                file,
                type: "",
            }));
            setUploadedAttachments((prev) => [...prev, ...newAttachments]);
        }
        // Reset the file input value to allow uploading the same file again if needed
        if (event.target) {
            event.target.value = '';
        }
    }, []);

    const handleAttachmentTypeChange = useCallback((id: string, newType: string) => {
        setUploadedAttachments((prev) =>
            prev.map((attachment) =>
                attachment.id === id ? { ...attachment, type: newType } : attachment
            )
        );
    }, []);

    const removeAttachment = useCallback((id: string) => {
        setUploadedAttachments((prev) =>
            prev.filter((attachment) => attachment.id !== id)
        );
    }, []);

    return {
        formData,
        uploadedAttachments,
        handleChange,
        handlePhotoChange,
        handleAttachmentUpload,
        handleAttachmentTypeChange,
        removeAttachment,
    };
};

// --- Main Component ---
const AddChildToPassport: React.FC = () => {
    const {
        formData,
        uploadedAttachments,
        handleChange,
        handlePhotoChange,
        handleAttachmentUpload,
        handleAttachmentTypeChange,
        removeAttachment,
    } = useChildPassportFormState();

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            
            // Basic validation
            if (!formData.childName || !formData.childBirthDate || !formData.childGender) {
                alert("يرجى ملء جميع الحقول الإلزامية الخاصة بالمولود");
                return;
            }

            if (!formData.photo) {
                alert("يرجى إرفاق صورة شخصية للمولود");
                return;
            }

            if (!formData.agreesToTerms) {
                alert("يرجى الموافقة على الشروط والأحكام");
                return;
            }

            // Here you would typically send the data to an API
            console.log("Form Data:", formData);
            console.log("Uploaded Attachments:", uploadedAttachments);
            
            alert("تم تقديم طلب إضافة المولود بنجاح");
        },
        [formData, uploadedAttachments]
    );

    // Memoize form sections to prevent unnecessary re-renders
    const familyInfoSection = useMemo(
        () => (
            <Section title="معلومات عائلية">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="رقم ورقة العائلة"
                        id="familyPaperNumber"
                        name="familyPaperNumber"
                        value={formData.familyPaperNumber}
                        onChange={(value) => handleChange("familyPaperNumber", value)}
                        required
                    />
                    <InputField
                        label="رقم قيد العائلة"
                        id="familyRecordNumber"
                        name="familyRecordNumber"
                        value={formData.familyRecordNumber}
                        onChange={(value) => handleChange("familyRecordNumber", value)}
                        required
                    />
                </div>
            </Section>
        ),
        [formData.familyPaperNumber, formData.familyRecordNumber, handleChange]
    );

    const fatherInfoSection = useMemo(
        () => (
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
                        label="اللقب"
                        id="fatherSurname"
                        name="fatherSurname"
                        value={formData.fatherSurname}
                        onChange={(value) => handleChange("fatherSurname", value)}
                        required
                    />
                    <InputField
                        label="الاسم باللغة اللاتينية"
                        id="fatherLatinName"
                        name="fatherLatinName"
                        value={formData.fatherLatinName}
                        onChange={(value) => handleChange("fatherLatinName", value)}
                        placeholder="كما هو مكتوب في جواز السفر"
                        required
                    />
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
                    <InputField
                        label="رقم جواز السفر"
                        id="fatherPassportNumber"
                        name="fatherPassportNumber"
                        value={formData.fatherPassportNumber}
                        onChange={(value) => handleChange("fatherPassportNumber", value)}
                        required
                    />
                    <InputField
                        label="تاريخ إصدار الجواز"
                        id="fatherPassportIssueDate"
                        name="fatherPassportIssueDate"
                        type="date"
                        value={formData.fatherPassportIssueDate}
                        onChange={(value) => handleChange("fatherPassportIssueDate", value)}
                    />
                    <InputField
                        label="مكان إصدار الجواز"
                        id="fatherPassportIssuePlace"
                        name="fatherPassportIssuePlace"
                        value={formData.fatherPassportIssuePlace}
                        onChange={(value) => handleChange("fatherPassportIssuePlace", value)}
                    />
                </div>
            </Section>
        ),
        [
            formData.fatherName,
            formData.fatherGrandfatherName,
            formData.fatherSurname,
            formData.fatherLatinName,
            formData.fatherBirthDate,
            formData.fatherBirthPlace,
            formData.fatherPassportNumber,
            formData.fatherPassportIssueDate,
            formData.fatherPassportIssuePlace,
            handleChange,
        ]
    );

    const motherInfoSection = useMemo(
        () => (
            <Section title="بيانات خاصة بوالدة المولود">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <InputField
                        label="رقم جواز السفر / البطاقة الشخصية"
                        id="motherPassportNumber"
                        name="motherPassportNumber"
                        value={formData.motherPassportNumber}
                        onChange={(value) => handleChange("motherPassportNumber", value)}
                    />
                    <InputField
                        label="تاريخ إصدار الجواز"
                        id="motherPassportIssueDate"
                        name="motherPassportIssueDate"
                        type="date"
                        value={formData.motherPassportIssueDate}
                        onChange={(value) => handleChange("motherPassportIssueDate", value)}
                    />
                    <InputField
                        label="مكان إصدار الجواز"
                        id="motherPassportIssuePlace"
                        name="motherPassportIssuePlace"
                        value={formData.motherPassportIssuePlace}
                        onChange={(value) => handleChange("motherPassportIssuePlace", value)}
                    />
                </div>
            </Section>
        ),
        [
            formData.motherNameAndSurname,
            formData.motherNationality,
            formData.motherPassportNumber,
            formData.motherPassportIssueDate,
            formData.motherPassportIssuePlace,
            handleChange,
        ]
    );

    const contactInfoSection = useMemo(
        () => (
            <Section title="معلومات الاتصال">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="العنوان في الخارج"
                        id="addressAbroad"
                        name="addressAbroad"
                        value={formData.addressAbroad}
                        onChange={(value) => handleChange("addressAbroad", value)}
                        required
                    />
                    <InputField
                        label="رقم الهاتف في الخارج"
                        id="phoneAbroad"
                        name="phoneAbroad"
                        value={formData.phoneAbroad}
                        onChange={(value) => handleChange("phoneAbroad", value)}
                        type="tel"
                        required
                    />
                    <InputField
                        label="العنوان في ليبيا"
                        id="addressLibya"
                        name="addressLibya"
                        value={formData.addressLibya}
                        onChange={(value) => handleChange("addressLibya", value)}
                    />
                    <InputField
                        label="رقم الهاتف في ليبيا"
                        id="phoneLibya"
                        name="phoneLibya"
                        value={formData.phoneLibya}
                        onChange={(value) => handleChange("phoneLibya", value)}
                        type="tel"
                    />
                    <InputField
                        label="البريد الإلكتروني"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(value) => handleChange("email", value)}
                        type="email"
                    />
                </div>
            </Section>
        ),
        [
            formData.addressAbroad,
            formData.phoneAbroad,
            formData.addressLibya,
            formData.phoneLibya,
            formData.email,
            handleChange,
        ]
    );

    const childInfoSection = useMemo(
        () => (
            <Section title="بيانات خاصة بالمولود">
                {/* Photo Upload */}
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        الصورة الشخصية
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-center">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 rounded-md w-full max-w-md">
                            <div className="flex flex-col items-center">
                                {formData.photo ? (
                                    <div className="mb-3">
                                        <img
                                            src={URL.createObjectURL(formData.photo)}
                                            alt="صورة شخصية"
                                            className="h-40 w-32 object-cover border rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleChange("photo", undefined)}
                                            className="mt-2 text-red-600 hover:text-red-800 text-sm dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            إزالة الصورة
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-3 text-gray-400 dark:text-gray-600">
                                        <div className="h-40 w-32 border-2 border-dashed rounded-md flex items-center justify-center">
                                            <span>معاينة الصورة</span>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="photo"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                >
                                    <Upload className="ml-2" size={16} />
                                    <span>تحميل صورة</span>
                                </label>
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    PNG، JPG، أو JPEG (الحد الأقصى: 2MB)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

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
                        onChange={(value) => handleChange("childGrandfatherName", value)}
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
                    <SelectField
                        label="جنس المولود"
                        id="childGender"
                        name="childGender"
                        value={formData.childGender}
                        onChange={(value) => handleChange("childGender", value)}
                        options={GENDER_OPTIONS}
                        required
                    />
                    <InputField
                        label="الجنسية"
                        id="childNationality"
                        name="childNationality"
                        value={formData.childNationality}
                        onChange={(value) => handleChange("childNationality", value)}
                        required
                    />
                </div>
            </Section>
        ),
        [
            formData.photo,
            formData.childName,
            formData.childFatherName,
            formData.childGrandfatherName,
            formData.childSurname,
            formData.childLatinName,
            formData.childBirthDate,
            formData.childBirthPlace,
            formData.childGender,
            formData.childNationality,
            handleChange,
            handlePhotoChange,
        ]
    );

    return (
        <div
            className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            dir="rtl"
        >
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                نموذج طلب إضافة مولود بجواز السفر
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                {/* Family information */}
                {familyInfoSection}

                {/* Father Information */}
                {fatherInfoSection}

                {/* Mother Information */}
                {motherInfoSection}

                {/* Child Information */}
                {childInfoSection}

                {/* Contact Information */}
                {contactInfoSection}

                {/* Attachments */}
                <Section title="المرفقات">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        يرجى إرفاق المستندات التالية: شهادة الميلاد، صورة جواز سفر الأب، صورة جواز سفر الأم، وأي وثائق أخرى داعمة.
                    </p>
                    <AttachmentDocuments
                        uploadedAttachments={uploadedAttachments}
                        onAttachmentTypeChange={handleAttachmentTypeChange}
                        onRemoveAttachment={removeAttachment}
                        onAttachmentUpload={handleAttachmentUpload}
                        attachmentTypeOptions={ATTACHMENT_TYPE_OPTIONS}
                    />
                </Section>

                {/* Submission Information */}
                <Section title="معلومات مقدم الطلب">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                            label="اسم مقدم الطلب"
                            id="applicantName"
                            name="applicantName"
                            value={formData.applicantName}
                            onChange={(value) => handleChange("applicantName", value)}
                            required
                        />
                        <SelectField
                            label="صلة القرابة بالمولود"
                            id="applicantRelationship"
                            name="applicantRelationship"
                            value={formData.applicantRelationship}
                            onChange={(value) => handleChange("applicantRelationship", value)}
                            options={RELATIONSHIP_OPTIONS}
                            required
                        />
                        <InputField
                            label="تاريخ تقديم الطلب"
                            id="submissionDate"
                            name="submissionDate"
                            type="date"
                            value={formData.submissionDate}
                            onChange={(value) => handleChange("submissionDate", value)}
                            required
                        />
                    </div>
                </Section>


                {/* Submit Button */}
                <button
                    type="submit"
                    className="py-2 bg-green-600 hover:bg-green-700 text-white border-none rounded-md font-semibold transition-colors duration-200"
                >
                    تقديم الطلب
                </button>
            </form>
        </div>
    );
};

export default AddChildToPassport;