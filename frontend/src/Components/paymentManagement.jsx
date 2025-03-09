import React from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaPeopleGroup } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { MdAddToPhotos } from "react-icons/md";

function paymentManagement({userData}) {

  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState([])

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
          <h1 className='font-bold text-md'>Cash Management</h1>

          <div className='flex gap-x-4'>
            <div className="bg-white shadow-xl w-[300px] h-[140px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 font-semibold text-md">Total Cash</p>
                <GrMoney className='text-2xl text-yellow-500' />
              </div>
              <div className="flex gap-3 my-3">
                <p className="text-3xl text-black font-bold">₱ 500,000</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto w-full mt-10">
            <button className="btn btn-primary mb-3" onClick={()=> document.getElementById('add-modal').showModal() }><MdAddToPhotos className="text-2xl"/> Create Budget</button>
            <h1 className='mb-2 font-semibold text-md'>Budgeting History</h1>
            <div className="bg-white rounded-lg p-2">
                <DataTable
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
                      className="mb-2 p-2 border border-gray-400 rounded-lg mt-5"
                      />
                    }
                  />
              </div>
          </div>
        </div>
      </div>
      
      {/* ADD BUDGET MODAL */}
      <dialog id="add-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-semibold text-lg mb-4">Add Budget</h3>
          <form method="dialog" className="space-y-4">
            {/* Budget Type (Dropdown) */}
            <div>
              <label className="block text-sm font-medium mb-1">Budget Type</label>
              <select className="select select-bordered w-full" required>
                <option value="" disabled selected>Select Budget Type</option>
                <option value="Operating Expenses">Operating Expenses</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Medical Equipments">Medical Equipments</option>
                <option value="Staff and Wages">Staff and Wages</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button type="submit" className="btn btn-success">Save</button>

              {/* Close Button */}
              <button
                type="button"
                className="btn btn-error"
                onClick={() => document.getElementById('add-modal').close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}

export default paymentManagement
