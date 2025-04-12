import { memo } from 'react';
import InputField from './common/InputField';

interface MedicalInfo {
  doctorName: string;
}

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
            onChange={(value) => onChange("doctorName", value)}
        />
    </div>
));

export default MedicalInfoSection