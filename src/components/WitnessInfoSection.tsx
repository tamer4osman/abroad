tsx
import React, { memo } from "react";
import InputField from "../common/InputField";
import Section from "../common/Section";
import { SelectField } from "../common/SelectField";

interface WitnessInfo {
  witness1Name: string;
  witness1IdNumber: string;
  witness2Name: string;
  witness2IdNumber: string;
}

interface WitnessInfoSectionProps {
  witnessInfo: WitnessInfo;
  onChange: (name: string, value: string) => void;
}

const WitnessInfoSection = memo(({ witnessInfo, onChange }: WitnessInfoSectionProps) => (
  <Section title="شهادات الشهود عند الاقتضاء">
    <div className="grid grid-cols-2 gap-4">
      <InputField
        label="الشاهد الأول"
        id="witness1Name"
        name="witness1Name"
        value={witnessInfo.witness1Name || ""}
        onChange={(value) => onChange("witness1Name", value)}
      />
      <InputField
        label="رقم البطاقة الشخصية"
        id="witness1IdNumber"
        name="witness1IdNumber"
        value={witnessInfo.witness1IdNumber}
       onChange={(value) => onChange("witness1IdNumber", value)}
      />
    </div>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <InputField
        label="الشاهد الثاني"
        id="witness2Name"
        name="witness2Name"
        value={witnessInfo.witness2Name || ""}
        onChange={(value) => onChange("witness2Name", value)}
      />
      <InputField
        label="رقم البطاقة الشخصية"
        id="witness2IdNumber"
        name="witness2IdNumber"
        value={witnessInfo.witness2IdNumber}
      onChange={(value) => onChange("witness2IdNumber", value)}
      />
    </div>
  </Section>
));

export default WitnessInfoSection;