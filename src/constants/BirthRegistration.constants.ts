// Define type for the select options
type SelectOption = {
  value: string;
  label: string;
};

// --- Constants ---

export const GENDER_TYPES: SelectOption[] = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
];

export const CHILD_TYPE: SelectOption[] = [
  { value: "single", label: "فردية" },
  { value: "twin", label: "توأم" },
  { value: "multiple", label: "اكثر من توائم" },
];

export const CHILD_CONDITION: SelectOption[] = [
  { value: "healthy", label: "سليم" },
  { value: "sick", label: "مريض" },
  { value: "critical", label: "حالة حرجة" },
  { value: "deceased", label: "متوفى" },
];

export const INFORMANT_TYPE: SelectOption[] = [
  { value: "father", label: "الأب" },
  { value: "mother", label: "الأم" },
  { value: "other", label: "آخر" },
];