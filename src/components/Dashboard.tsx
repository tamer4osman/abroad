import React from "react";

const Dashboard: React.FC = () => {
  // Create data structure with stable identifiers for cards
  const dashboardCards = [
    { id: 'sales', title: "المبيعات", value: "1,234" },
    { id: 'users', title: "المستخدمون", value: "1,234" },
    { id: 'revenue', title: "الإيرادات", value: "1,234" }
  ];

  return (
    <div className="dashboard">
      <div className="p-4 md:p-6 w-full max-w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 md:p-6 rounded-lg shadow-md text-right w-full ring-2 ring-gray-200 dark:ring-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4">{card.title}</h3>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
