// src/components/CourtProxy.tsx
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, User, Send, Hash, MapPin, Calendar } from "lucide-react";

const CourtProxy = () => {
  const [formData, setFormData] = useState({
    // Principal (الموكل)
    principalName: "",
    principalPassportNumber: "",
    principalPassportIssueDate: "",
    principalIdNumber: "", // بطاقة / رخصة رقم
    principalResidency: "", // المقيم

    // Agent (الوكيل)
    agentName: "",
    agentPassportIdNumber: "", // جواز سفر/بطاقة رقم
    agentIssueDate: "", // تاريخ الصدور
    agentResidency: "", // المقيم

    // Proxy Details
    proxySubject: "", // بخصوص: (Specific subject matter)

    // Signatures/Dates
    principalSignedName: "", // اسم الموكل (near signature)
    proxyDate: "", // التاريخ

    // Notary/Consular Info (from bottom section of form)
    grantorFullNameEnglish: "", // Full Name of the Grantor of Authority
    grantorIdNumber: "", // U.S ID Number (kept generic)
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // TODO: Implement form submission logic (e.g., API call)
      console.log("Court Proxy Form Data:", formData);
      // Add success message/redirect logic here
    },
    [formData]
  );

  const inputVariants = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.3 },
  };

  const renderInput = (
    name: keyof typeof formData,
    label: string,
    type: string = "text",
    icon?: React.ReactNode,
    placeholder?: string
  ) => (
    <motion.div variants={inputVariants} className="mb-4">
      <label
        htmlFor={name}
        className="flex justify-end items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {icon && <span className="ms-2 text-gray-500">{icon}</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder || ""}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white text-right"
        dir="rtl" // Right-to-left for Arabic input
        required
      />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg"
    >
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          نموذج توكيل للمحاكم (خاص)
        </h1>
        <FileText className="text-red-800 dark:text-red-500" size={32} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section: Principal Information */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-right text-gray-700 dark:text-gray-200">
            بيانات الموكل (أقر أنا السيد/السيدة)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {renderInput("principalName", "الاسم الكامل", "text", <User />)}
            {renderInput("principalPassportNumber", "رقم جواز السفر", "text", <Hash />)}
            {renderInput("principalPassportIssueDate", "تاريخ صدور الجواز", "date", <Calendar />)}
            {renderInput("principalIdNumber", "رقم البطاقة / الرخصة", "text", <Hash />)}
            {renderInput("principalResidency", "العنوان / مكان الإقامة", "text", <MapPin />)}
          </div>
        </motion.section>

        {/* Section: Agent Information */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-right text-gray-700 dark:text-gray-200">
            بيانات الوكيل (وكلت السيد/السيدة)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {renderInput("agentName", "الاسم الكامل", "text", <User />)}
            {renderInput("agentPassportIdNumber", "رقم جواز السفر / البطاقة", "text", <Hash />)}
            {renderInput("agentIssueDate", "تاريخ الصدور", "date", <Calendar />)}
            {renderInput("agentResidency", "العنوان / مكان الإقامة", "text", <MapPin />)}
          </div>
        </motion.section>

        {/* Section: Proxy Scope */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-4 text-right text-gray-700 dark:text-gray-200">
            نطاق التوكيل
          </h2>
          <div className="mb-4 text-right text-gray-600 dark:text-gray-300 space-y-2">
            <p>
              ليقوم مقامي ونيابة عني في المثول أمام جميع المحاكم بإختلاف أنواعها
              ودرجاتها بخصوص:
            </p>
             <motion.div variants={inputVariants} className="mb-4">
              <label
                htmlFor="proxySubject"
                className="flex justify-end items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                الموضوع المحدد
              </label>
              <textarea
                id="proxySubject"
                name="proxySubject"
                value={formData.proxySubject}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white text-right"
                dir="rtl"
                placeholder="اذكر القضية أو الموضوع المحدد للتوكيل هنا..."
                required
              />
            </motion.div>
            <p>
              وذلك بتمثيلي أمام جميع الجهات القضائية والجهات المختصة في رفع
              الدعاوى المدنية وتوكيل المحامين والمثول أمام مراكز الشرطة
              والجهات ذات العلاقة وجميع الأمور التي تخص الموكل والتوكيل والتوقيع
              على كافة الأوراق والمستندات المتعلقة بهذا التوكيل فقط.
            </p>
          </div>
        </motion.section>

        {/* Section: Grantor Details & Date */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
           <h2 className="text-xl font-semibold mb-4 text-right text-gray-700 dark:text-gray-200">
            تأكيد الموكل ومعلومات إضافية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {renderInput("principalSignedName", "اسم الموكل (كما سيوقع)", "text", <User />)}
            {renderInput("proxyDate", "تاريخ التوكيل", "date", <Calendar />)}
            {renderInput("grantorFullNameEnglish", "Full Name of Grantor (English)", "text", <User />, "Grantor's Name in English")}
            {renderInput("grantorIdNumber", "Grantor ID Number (e.g., US ID)", "text", <Hash />, "Optional ID Number")}
          </div>
           <p className="mt-6 text-sm text-red-600 dark:text-red-400 text-right">
                * ملاحظة: لا يتم اعتماد التوكيل في حال الشطب أو الكشط.
            </p>
        </motion.section>

        {/* Submit Button */}
        <motion.div
          className="flex justify-start pt-6" // Changed to justify-start for button on the left
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800"
          >
            <Send size={20} className="me-2" />
            إصدار التوكيل
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default CourtProxy;