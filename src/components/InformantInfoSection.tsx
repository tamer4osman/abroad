import { memo } from "react";
import InputField from "./common/InputField";
import SelectField from "./common/SelectField";
import Section from "./common/Section";
import { INFORMANT_TYPE } from "../constants/BirthRegistration.constants";


interface InformantInfo {
    informantType: "father" | "mother" | "other" | "";
  informantName: string;
  informantLastName: string;
  informantIdNumber: string;
  informantOccupation: string;
  informantSignature: string;
}

interface InformantInfoSectionProps {
  informantInfo: InformantInfo;
  onChange: (name: string, value: string) => void;
}

const InformantInfoSection = memo(({ informantInfo, onChange }: InformantInfoSectionProps) => (
  <Section title="ثانياً:  بيانات عن المُبلغ">
    <div className="grid grid-cols-4 gap-4">
      <SelectField
        label="اختر"
        id="informantType"
        name="informantType"
        value={informantInfo.informantType}
        onChange={(value) => onChange("informantType", value)}
        options={INFORMANT_TYPE}
        required
      />

      <InputField
        label="الإسم بالكامل"
        id="informantName"
        name="informantName"
        value={informantInfo.informantName}
        onChange={(value) => onChange("informantName", value)}
        required={informantInfo.informantType === "other"}
      />
      <InputField
        label="اللقب"
        id="informantLastName"
        name="informantLastName"
        value={informantInfo.informantLastName}
        onChange={(value) => onChange("informantLastName", value)}
      />

      <InputField
        label="البطاقة الشخصية"
        id="informantIdNumber"
        name="informantIdNumber"
        value={informantInfo.informantIdNumber}
        onChange={(value) => onChange("informantIdNumber", value)}
        required={informantInfo.informantType === "other"}
      />
    </div>

    <div className="grid grid-cols-2 gap-4 mt-4">
      <InputField
        label="المهنة"
        id="informantOccupation"
        name="informantOccupation"
        value={informantInfo.informantOccupation}
        onChange={(value) => onChange("informantOccupation", value)}
      />
    </div>
  </Section>
));

export default InformantInfoSection;