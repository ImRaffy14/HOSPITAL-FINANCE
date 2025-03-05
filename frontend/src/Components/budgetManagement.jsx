import React from 'react'
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { GiMedicalDrip } from "react-icons/gi";
import { MdAddToPhotos } from "react-icons/md";
import { useSocket } from "../context/socketContext"

function budgetManagement() {

  const [searchText, setSearchText] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState(0)
  const [budgetType, setBudgetType] = useState('')
  const [data, setData] = useState([])
  const socket = useSocket()

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; 
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Report ID', selector: row => row._id },
    { name: 'Report Date', selector: row => row.date },
    { name: 'Budget Amount', selector: row => formatCurrency(row.amount) },
    { name: 'Budget Type', selector: row => row.budgetType },
  ];
  

  useEffect(() => {
    if (!socket){
      console.log('error')
      return
    };

    socket.emit('get-budget-records', {msg: 'get budget records'})



    const handlesNewBudget = (response) => {
      alert(response.msg)
    }

    const handlesBudgetRecords = (response) => {
      setData(response)
    }

    const handlesErrorBudget = (response) => {
      alert(response.msg)
    }


    socket.on('error-budget-record', handlesErrorBudget)
    socket.on('received-new-budget', handlesNewBudget)
    socket.on('received-budget-records', handlesBudgetRecords)

    return () => {
      socket.off('received-new-budget')
      socket.off('error-budget-record')
      socket.off('received-budget-records')
    }
  }, [socket])
  

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

const filteredData = data.filter(row =>
  Object.values(row).some(value =>
    value.toString().toLowerCase().includes(searchText.toLowerCase())
  )
);

// HANDLES SUBMIT
const handleSubmit = () => {
  console.log({
    date,
    amount,
    budgetType
  })

  socket.emit('add-budget', {    date,
    amount,
    budgetType})
}

  return (
    <div>
        <div className='h-screen w-full'>
          <div className='max-w-screen-2xl mx-auto flex flex-col  mt-10'>
            <h1 className='font-bold text-md'>Budget Management</h1>

            <h1 className='mt-10'>Budget Allocation</h1>

            <div className='flex gap-x-4'>
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Staff and Wages</p>
                  <FaPeopleGroup className='text-2xl text-blue-500' />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-4xl text-black font-bold">₱ 50,000</p>
                </div>
              </div>

              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Medical supplies</p>
                  <FaBriefcaseMedical className='text-2xl text-red-500' />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-4xl text-black font-bold">₱ 100,000</p>
                </div>
              </div>

              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Medical Equipments</p>
                  <GiMedicalDrip className='text-2xl text-emerald-500' />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-4xl text-black font-bold">₱ 100,520</p>
                </div>
              </div>

              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer" onClick={()=>document.getElementById('my_modal_2').showModal()}>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Record New Budget</p>
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-4xl text-black font-bold flex"><MdAddToPhotos className='text-4xl text-emerald-500 mr-3' /> Add</p>
                </div>
              </div>

            </div>

            <div className="overflow-x-auto w-full mt-10">
              <h1 className='mb-4'>Budget Records</h1>
              <DataTable
                title="Budget Records"
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

          {/* MODALS */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-5">Record New Budget</h3>
            <form method="dialog" className="space-y-4" onSubmit={handleSubmit}>
              {/* Date Field */}
              <div>
                <label htmlFor="budgetDate" className="block text-sm font-medium">
                  Date
                </label>
                <input
                  type="date"
                  id="budgetDate"
                  name="budgetDate"
                  className="input input-bordered w-full mt-1"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Amount Field */}
              <div>
                <label htmlFor="budgetAmount" className="block text-sm font-medium">
                  Amount
                </label>
                <input
                  type="number"
                  id="budgetAmount"
                  name="budgetAmount"
                  placeholder="Enter amount"
                  className="input input-bordered w-full mt-1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {/* Budget Type Field */}
              <div>
                <label htmlFor="budgetType" className="block text-sm font-medium">
                  Budget Type
                </label>
                <select
                  id="budgetType"
                  name="budgetType"
                  className="select select-bordered w-full mt-1"
                  onChange={(e) => setBudgetType(e.target.value)}
                  required
                >
                  <option value="" disabled selected>
                    Select budget type
                  </option>
                  <option value="Operating">Operating</option>
                  <option value="Capital Expenditure">Capital Expenditure</option>
                  <option value="Emergency Reserve">Emergency Reserve</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  Save Budget
                </button>
              </div>
            </form>
          </div>

          {/* Modal Backdrop */}
          <form method="dialog" className="modal-backdrop">
            <button>Close</button>
          </form>
        </dialog>

        </div>
    </div>
  )
}

export default budgetManagement
