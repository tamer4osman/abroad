import React from "react";
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { increment, decrement } from '../store/slices/counterSlice';

const Dashboard: React.FC = () => {
  // Create data structure with stable identifiers for cards
  const dashboardCards = [
    { id: 'sales', title: "المبيعات", value: "1,234" },
    { id: 'users', title: "المستخدمون", value: "1,234" },
    { id: 'revenue', title: "الإيرادات", value: "1,234" }
  ];

  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

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
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Counter</h2>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => dispatch(increment())}
            >
              Increment
            </button>
            <span className="text-2xl mx-4">{count}</span>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => dispatch(decrement())}
            >
              Decrement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
