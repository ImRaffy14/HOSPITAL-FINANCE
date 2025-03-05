import React from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaPeopleGroup } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { MdAddToPhotos } from "react-icons/md";

function paymentManagement() {

  const [searchText, setSearchText] = useState('')

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; 
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Payment ID', selector: row => row.paymentId },
    { name: 'Payment Date', selector: row => row.paymentDate },
    { name: 'Payment Amount', selector: row => formatCurrency(row.paymentAmount) },
    { name: 'Payment Method', selector: row => row.paymentMethod },
  ];
  
  const data = [
    {
      paymentId: 'PAY001',
      paymentDate: '2024-11-01',
      paymentAmount: 1500,
      paymentMethod: 'Credit Card',
    },
    {
      paymentId: 'PAY002',
      paymentDate: '2024-11-03',
      paymentAmount: 5000,
      paymentMethod: 'Bank Transfer',
    },
    {
      paymentId: 'PAY003',
      paymentDate: '2024-11-05',
      paymentAmount: 2200,
      paymentMethod: 'Cash',
    },
    {
      paymentId: 'PAY004',
      paymentDate: '2024-11-07',
      paymentAmount: 12000,
      paymentMethod: 'Mobile Payment',
    },
    {
      paymentId: 'PAY005',
      paymentDate: '2024-11-09',
      paymentAmount: 800,
      paymentMethod: 'Check',
    },
  ];

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );


  return (
    <div>
        <div className='h-screen w-full'>
          <div className='max-w-screen-2xl mx-auto flex flex-col  mt-10'>
            <h1 className='font-bold text-md'>Payment Management</h1>

            <div className='flex gap-x-4'>
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Total Payments</p>
                  <GrMoney className='text-2xl text-yellow-500' />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-4xl text-black font-bold">₱ 500,000</p>
                </div>
              </div>

              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Record New Payment</p>
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-4xl text-black font-bold flex"><MdAddToPhotos className='text-4xl text-emerald-500 mr-3' /> Add</p>
                </div>
              </div>

            </div>

            <div className="overflow-x-auto w-full mt-10">
              <h1 className='mb-4'>Payment Records</h1>
              <DataTable
                title="Payment Records"
                columns={columns}
                data={filteredData}
                pagination
                defaultSortField="name"
                highlightOnHover
                pointerOnHover
                subHeader
                subHeaderComponent={
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={handleSearch}
                    className="mb-2 p-2 border border-gray-400 rounded-lg"
                  />
                }
              />
            </div>

          </div>
        </div>
    </div>
  )
}

export default paymentManagement
