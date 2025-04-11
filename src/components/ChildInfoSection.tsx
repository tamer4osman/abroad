tsx
import React, { memo } from 'react';
import Section from '../common/Section';
import {
  FormField,
  GENDER_TYPES, CHILD_TYPE, CHILD_CONDITION
} from '../constants/BirthRegistration.constants';
import DateField from '../common/DateField';
interface ChildInfo {
  childName: string;
  dateOfBirth: string;
  placeOfBirthCity: string;
  
  placeOfBirthState: string;
  placeOfBirthCountry: string;
  childGender: "male" | "female" | "";
  childType: "single" | "twin" | "multiple" | "";
  childWeight: string;
  childCondition: "healthy" | "sick" | "critical" | "deceased" | "";
  previousBirths: string;
}

interface ChildInfoSectionProps {
  childInfo: ChildInfo;
  onChange: (name: string, value: string) => void;
}

const ChildInfoSection = memo(({ childInfo, onChange }: ChildInfoSectionProps) => (
  <Section title="أولاً: ( الحالة الطبية للمولود تقدم من الطبيب أوالقابلة أو الجهة الصحية التي تمت بها الولادة ).">
    <div className="grid grid-cols-3 gap-4">
       <DateField
          label="تاريخ الولادة / اليوم"
          id="dateOfBirth"
          name="dateOfBirth"
          value={childInfo.dateOfBirth}
          onChange={value => onChange('dateOfBirth', value)}
          required
      />
       <FormField
        label="مكان الولادة-المدينة"
        id="placeOfBirthCity"
        name="placeOfBirthCity"
        value={childInfo.placeOfBirthCity}
        onChange={value => onChange("placeOfBirthCity", value)}
        required
      />    
      <FormField
        label="مكان الولادة-الولاية"
        id="placeOfBirthState"
        name="placeOfBirthState"
        value={childInfo.placeOfBirthState}
        onChange={value => onChange("placeOfBirthState", value)}
      />
    
    </div>

    <div className="grid grid-cols-3 gap-4 mt-4">
       <FormField
        label="الدولة"
        id="placeOfBirthCountry"
        name="placeOfBirthCountry"
        value={childInfo.placeOfBirthCountry}
        onChange={value => onChange("placeOfBirthCountry", value)}
        type="select"
        options={[{ value: "كندا", label: "كندا" }]}
        required
      />
       <FormField
        label="جنس المولود"
        id="childGender"
        name="childGender"
        value={childInfo.childGender}
        onChange={value => onChange("childGender", value)}
        type="select"
        options={GENDER_TYPES}
        required
      />
       <FormField
        label="نوع الولادة"
        id="childType"
        name="childType"
        value={childInfo.childType}
        onChange={value => onChange("childType", value)}
        type="select"
        options={CHILD_TYPE}
        required
      />
    </div>
    <div className="grid grid-cols-3 gap-4 mt-4">
          <FormField
        label="حالة المولود"
        id="childCondition"
        name="childCondition"
        value={childInfo.childCondition}
        onChange={value => onChange("childCondition", value)}
        options={CHILD_CONDITION}
      />
       <FormField
        label="وزن المولود"
        id="childWeight"
        name="childWeight"
        value={childInfo.childWeight}
        onChange={value => onChange("childWeight", value)}
       />
       <FormField
        label="عدد الولادات السابقة"
        id="previousBirths"
        name="previousBirths"
        value={childInfo.previousBirths}
        onChange={value => onChange("previousBirths", value)}
      />

    </div>
    <div className="grid grid-cols-1 gap-4 mt-4">
          <FormField
        label="اسم المولود"
        type="text"
        id="childName"
        name="childName"
        value={childInfo.childName}
        onChange={value => onChange("childName", value)}
        required
      />
    </div>
  </Section>
));

export default ChildInfoSection;