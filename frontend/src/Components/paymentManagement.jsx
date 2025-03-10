import React from 'react'
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaPeopleGroup } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { MdAddToPhotos } from "react-icons/md";
import { useSocket } from "../context/socketContext"
import { toast } from 'react-toastify';
import axios from "axios"

function paymentManagement({userData}) {

  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState([])
  const [totalCash, setTotalCash] = useState(0)
  const [amount, setAmount] = useState(0)
  const [budgetType, setBudgetType] = useState('')

  const socket = useSocket()
  const urlAPI = import.meta.env.VITE_API_URL
  
  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; 
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Officer ID', selector: row => row.officerId },
    { name: 'Officer', selector: row => row.officer },
    { name: 'Budget Type', selector: row => row.budgetType },
    { name: 'Amount', selector: row => formatCurrency(row.amount) },
  ];
  

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  useEffect(() => {
    
    // FETCH DATA
    const fetchData = async () => {
      const response = await axios.get(`${urlAPI}/cash/get-total-cash`)
      if(response.data.status === "success"){
        setTotalCash(response.data.totalCash)
        const history = await axios.get(`${urlAPI}/cash/get-budget-history`)
        setData(history.data)
      }
    }

    fetchData()

    socket.on('total-cash', (response) => {
      setTotalCash(response)
    })

    socket.on('budgeting', (response) => {
      setData((prevData) => [response, ...prevData])
    })

    return () => {
      socket.off('total-cash')
    }
  }, [])

  // SUBMIT NEW ALLOCATION
  const submitAllocation = async (e) => {
    e.preventDefault();
    const data = {
      officerId: userData._id,
      officer: userData.username,
      budgetType,
      amount
    }
    
    try {
        const response = await axios.post(`${urlAPI}/cash/add-allocation`, data)
        if(response.data.status === 'success'){
          document.getElementById('add-modal').close()
          setBudgetType('')
          setAmount(0)
          toast.success(response.data.message, {
            position: "top-right",
          })
        }
    } catch (error) {
      if(error.response.data.status === 'error'){
        document.getElementById('add-modal').close()
        setBudgetType('')
        setAmount(0)
        toast.error(error.response.data.message, {
          position: "top-right",
        })
      }else{
        document.getElementById('add-modal').close()
        setBudgetType('')
        setAmount(0)
        toast.error('An Internal Error', {
          position: "top-right",
        })
      }
    }
  }

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
                <p className="text-3xl text-black font-bold">{formatCurrency(totalCash)}</p>
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
          <form method="dialog" className="space-y-4" onSubmit={submitAllocation}>
            {/* Budget Type (Dropdown) */}
            <div>
              <label className="block text-sm font-medium mb-1">Budget Type</label>
              <select
              className="select select-bordered w-full"
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value)}
              required
              >
                <option value="" disabled selected>Select Budget Type</option>
                <option value="Operating Expenses">Operating Expenses</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Medical Equipments">Medical Equipments</option>
                <option value="Staff and Wages">Staff and Wages</option>
                <option value="Insurance Claims">Insurance Claims</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                max={500000}
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
