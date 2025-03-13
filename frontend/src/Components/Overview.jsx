import React, { useState, useEffect } from 'react';
import { CiUser } from "react-icons/ci";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import axios from "axios"


function Overview({ userData }) {
  const [data , setData] = useState([])

  const urlAPI = import.meta.env.VITE_API_URL

  const getCurrentMonth = () => {
    return new Date().toLocaleString('en-US', { month: 'long' });
  };

  const formatCurrency = (value) => {
    return `₱${(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const chartData = data.cashFlow && data.cashFlow.length > 0 
  ? data.cashFlow.map(entry => ({
      month: new Date(entry.updatedAt).toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: '2-digit' 
      }),
      cashFlow: entry.totalAmount
    }))
  : [{ month: '', cashFlow: 0 }]; 


  console.log(data.cashFlow)
  // FETCH DATA
  useEffect(() => {
    
    const fetchData = async () => {
      const response = await axios.get(`${urlAPI}/financial/analytics`)
      setData(response.data)
    }

    fetchData()

  }, [])

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
            <p className="text-3xl font-bold text-green-600">{formatCurrency(data.totalCash)}</p>
          </div>

          {/* Total Revenues */}
          <div className='p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition duration-300'>
            <h2 className="font-semibold text-lg text-gray-700">Accounts Receivable</h2>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(data.receivables)}</p>
          </div>

          {/* Total Expenses */}
          <div className='p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition duration-300'>
            <h2 className="font-semibold text-lg text-gray-700">Accounts Payable</h2>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(data.payables)}</p>
          </div>
        </div>

        {/* Financial Analytics Area Chart */}
        <div className='mt-10 bg-white p-8 rounded-xl shadow-xl'>
          <h2 className="font-semibold text-lg text-gray-700">Cash Flow Overview</h2>
          <h2 className="font-semibold text-lg text-gray-700 mb-8">Month of {getCurrentMonth()}</h2>
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
