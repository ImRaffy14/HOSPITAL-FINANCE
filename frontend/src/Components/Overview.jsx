import React, { useState } from 'react';
import { CiUser } from "react-icons/ci";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

function Overview({ userData }) {
  const [financialData] = useState({
    totalCash: 500000,
    totalRevenues: 1500000,
    totalExpenses: 1000000
  });

  const formatCurrency = (value) => {
    return `₱${(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  // Simulated Cash Flow Data (Example: Last 6 months)
  const chartData = [
    { month: "Oct", cashFlow: 450000 },
    { month: "Nov", cashFlow: 480000 },
    { month: "Dec", cashFlow: 510000 },
    { month: "Jan", cashFlow: 530000 },
    { month: "Feb", cashFlow: 500000 },
    { month: "Mar", cashFlow: 550000 }
  ];

  return (
    <div className='h-screen w-full p-8'>
      <div className='max-w-screen-4xl mx-auto'>

        {/* Header */}
        <h1 className='font-bold text-2xl text-gray-800'>Financial Management Dashboard</h1>

        {/* User Profile Card */}
        <div className='mt-8 p-6 rounded-xl bg-white shadow-xl flex items-center gap-4 w-[400px]'>
          <CiUser className='text-5xl text-blue-500' />
          <div>
            <h1 className="text-xl font-semibold">{userData.fullName}</h1>
            <p className="text-gray-500 text-sm">{userData.role}</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>

          {/* Total Cash */}
          <div className='p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition duration-300'>
            <h2 className="font-semibold text-lg text-gray-700">Total Cash</h2>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(financialData.totalCash)}</p>
          </div>

          {/* Total Revenues */}
          <div className='p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition duration-300'>
            <h2 className="font-semibold text-lg text-gray-700">Accounts Receivable</h2>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(financialData.totalRevenues)}</p>
          </div>

          {/* Total Expenses */}
          <div className='p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition duration-300'>
            <h2 className="font-semibold text-lg text-gray-700">Accounts Payable</h2>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(financialData.totalExpenses)}</p>
          </div>
        </div>

        {/* Financial Analytics Area Chart */}
        <div className='mt-10 bg-white p-8 rounded-xl shadow-xl'>
          <h2 className="font-semibold text-lg text-gray-700 mb-4">Cash Flow Overview</h2>
          <ResponsiveContainer width='100%' height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₱${value.toLocaleString('en-US')}`} tickMargin={10} width={80} />
              <Tooltip Tooltip formatter={(value) => `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}/>
              <Legend />
              <defs>
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="cashFlow" 
                stroke="#6366F1" 
                strokeWidth={3} 
                fill="url(#fillGradient)" 
                dot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Overview;
