// --- Interfaces ---
import { FormData } from '../types/BirthRegistration.types';
import { FormDataService } from '../services/FormDataService';
import React, { useState } from 'react';


import ChildInfoSection from './ChildInfoSection';
import { FormMessage, FormErrors } from './common/FormComponents';
import SubmitButton from './common/SubmitButton';
import InformantInfoSection from './InformantInfoSection';
import WitnessInfoSection from './WitnessInfoSection';

import ParentsInfoSection from './ParentsInfoSection';

import MedicalInfoSection from './MedicalInfoSection';
import Section from './common/Section';
import { useCallback } from 'react';
// --- Main Component ---
// Improvement: Use memoization for functions not related to state
const BirthRegistration = () => {
  // Improvement: Use useMemo to create services once
  const formDataService = React.useMemo(() => new FormDataService(), []);

  // Improvement: Divide state into logical sections
  const [formData, setFormData] = useState<FormData>(formDataService.getInitialData());
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: string; text: string }>({ type: "", text: "" });

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
    setIsSubmitting(true);
    
    const result = await formDataService.submit(formData);
    if (result.isValid === false) {
      setErrors(result.errors || []);
      setSubmitMessage({
        type: "error",
        text: "يرجى تصحيح الأخطاء قبل الإرسال", 
      });
    } else {
      const { success = false, message = "" } = result.submissionResult || {};
      setSubmitMessage({ type: success ? "success" : "error", text: message });
    }
    setIsSubmitting(false);
  }, [formData, formDataService]);

  return (
    <div
      className="font-sans text-sm p-5 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      dir="rtl"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        نموذج تسجيل واقعة الولادة
      </h1>

      <FormMessage message={submitMessage} />
      <FormErrors errors={errors} />

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

        <SubmitButton isSubmitting={isSubmitting} onClick={() => handleSubmit(new Event('click') as unknown as React.FormEvent)} />
      </form>
    </div>
  );
};

export default BirthRegistration;
