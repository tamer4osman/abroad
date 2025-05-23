import { memo } from "react";

interface DateFieldProps {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

const DateField = memo(
    ({ label, id, name, value, onChange, required = false }: DateFieldProps) => (
        <div>
            <label htmlFor={id} className="block text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type="date"
                id={id}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border p-1 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                required={required}
            />
        </div>
    )
);

export default DateField;