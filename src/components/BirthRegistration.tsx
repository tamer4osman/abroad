// --- Interfaces ---
import { FormData, FamilyMember, ChildInfo, ParentsInfo, InformantInfo, MedicalInfo, WitnessInfo } from '../../types/BirthRegistration.types';
import { GENDER_TYPES, CHILD_TYPE, CHILD_CONDITION, INFORMANT_TYPE } from '../../constants/BirthRegistration.constants';
import { FormDataService } from '../../services/FormDataService';


import ChildInfoSection from './ChildInfoSection';
import { FormMessage, FormErrors, SubmitButton } from './common/FormComponents';
import InformantInfoSection from './InformantInfoSection';
import WitnessInfoSection from './WitnessInfoSection';

interface ParentsInfoSectionProps {
  parentsInfo: ParentsInfo;
  onChange: (name: string, value: string) => void;
}

import ParentsInfoSection from './ParentsInfoSection';

interface MedicalInfoSectionProps {
  medicalInfo: MedicalInfo;
  onChange: (name: string, value: string) => void;
}

import MedicalInfoSection from './MedicalInfoSection';
import { Section } from './common/Section';

// --- Main Component ---
// Improvement: Use memoization for functions not related to state
const BirthRegistration = () => {
  // Improvement: Use useMemo to create services once
  const formDataService = useMemo(() => new FormDataService(), []);

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
    setIsSubmitting(true);
    e.preventDefault()
    const result = await formDataService.submit(formData)
    if (result.isValid === false) {
      setErrors(result.errors);
        setSubmitMessage({
          type: "error",
          text: "يرجى تصحيح الأخطاء قبل الإرسال", 
        });
        setIsSubmitting(false);
      
    }else{
      const { success, message } = result
        setSubmitMessage({ type: success ? "success" : "error", text: message })
        setIsSubmitting(false);
        
    }
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

        <Section  title="معلومات طبية">
          <MedicalInfoSection
            medicalInfo={formData}
            onChange={handleChange}
          />
        </Section>

        <WitnessInfoSection
          witnessInfo={formData}
          onChange={handleChange}
        />

        <SubmitButton isSubmitting={isSubmitting} onClick={handleSubmit} />
      </form>
    </div>
  );
};

export default BirthRegistration;