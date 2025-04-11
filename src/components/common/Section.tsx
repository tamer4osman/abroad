tsx
import React, {memo} from 'react';
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = memo(({ title, children }: SectionProps) => (
  <div className="border p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

export default Section;