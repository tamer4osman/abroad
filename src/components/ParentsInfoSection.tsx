import React from "react";
import Section from "./common/Section";
import DateField from "./common/DateField";
import { EmailField } from "./common/EmailField";
import { ParentsInfo } from "../types/BirthRegistration.types";
import FormField from "./common/FormField";

interface ParentsInfoSectionProps {
  parentsInfo: ParentsInfo; 
  onChange: (name: string, value: string) => void;
}

const ParentsInfoSection: React.FC<ParentsInfoSectionProps> = ({ parentsInfo, onChange }): JSX.Element => (
  <Section title="معلومات الوالدين">
     <div className="grid grid-cols-3 gap-4">
      <FormField
        label="اسم الأم بالكامل"
        id="motherName"
        name="motherName"
        value={parentsInfo.motherName}
        onChange={value => onChange("motherName", value)}
        required
        type="text"
      />
      <FormField
        label="لقب الأم"
        id="motherLastName"
        name="motherLastName"
        value={parentsInfo.motherLastName}
        onChange={value => onChange("motherLastName", value)}
        type="text"
      />
      <FormField
        label="جنسيتها"
        id="motherNationality"
        name="motherNationality"
        value={parentsInfo.motherNationality}
        onChange={value => onChange("motherNationality", value)}
        type="text"
      />
    </div>

    <div className="grid grid-cols-3 gap-4 mt-4">
      <FormField
        label="عنوان إقامتها - المدينة"
        id="motherAddressCity"
        name="motherAddressCity"
        value={parentsInfo.motherAddressCity}
        onChange={value => onChange("motherAddressCity", value)}
        type="text"
      />
        <EmailField 
          label="عنوان البريد الإلكتروني" 
          id="motherEmail" 
          name="motherEmail" 
          value={parentsInfo.motherEmail}
          onChange={value => onChange("motherEmail", value)}
        />
       <FormField
        label="رقم الهاتف"
        id="motherPhoneNumber"
        name="motherPhoneNumber"
        value={parentsInfo.motherPhoneNumber}
        onChange={value => onChange("motherPhoneNumber", value)}
      />
    </div>

    <div className="grid grid-cols-4 gap-4 mt-4">     
       <FormField
        label="اسم الأب"
        id="fatherName"
        name="fatherName"
        value={parentsInfo.fatherName}
        onChange={value => onChange("fatherName", value)}
        required
        type="text"
      />
       <FormField
        label="لقب الأب"
        id="fatherLastName"
        name="fatherLastName"
        value={parentsInfo.fatherLastName}
        onChange={value => onChange("fatherLastName", value)}
        required
        type="text"
      />
      <FormField
        label="رقم كتيب العائلة"
        id="familyBookNumber"
        name="familyBookNumber"
        value={parentsInfo.familyBookNumber}
        onChange={value => onChange("familyBookNumber", value)}
        type="text"
      />

      <FormField
        label="البطاقة الشخصية"
        id="fatherIdNumber"
        name="fatherIdNumber"
        value={parentsInfo.fatherIdNumber}
        onChange={value => onChange("fatherIdNumber", value)}
        type="text"
      />
    </div>

    <div className="grid grid-cols-3 gap-4 mt-4">
      <FormField
        label="المهنة"
        id="fatherOccupation"
        name="fatherOccupation"
        value={parentsInfo.fatherOccupation}
        onChange={value => onChange("fatherOccupation", value)}
        type="text"
      />
      <FormField
        label="الديانة"
        id="fatherReligion"
        name="fatherReligion"
        value={parentsInfo.fatherReligion}
        onChange={value => onChange("fatherReligion", value)}
      />
      <DateField
        label="تاريخ الزواج"
        id="marriageDate"
        name="marriageDate"
        value={parentsInfo.marriageDate}
         onChange={value => onChange("marriageDate", value)}
      />
    </div>
  </Section>
);

export default ParentsInfoSection;
