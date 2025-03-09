import React from 'react'
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { GiMedicalDrip } from "react-icons/gi";
import { FaEye, FaEdit } from "react-icons/fa";
import { useSocket } from "../context/socketContext"
import { MdAddComment } from "react-icons/md";
import { LuUtilityPole } from "react-icons/lu";
import axios from "axios"
import { toast } from 'react-toastify'

function budgetManagement() {

  const [searchText, setSearchText] = useState('')
  const [department, setDepartment] = useState("");
  const [amount, setAmount] = useState(0);
  const [budgetType, setBudgetType] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("")
  const [selectedData, setSelectedData] = useState([])
  const [data, setData] = useState([])

  const socket = useSocket()
  const urlAPI = import.meta.env.VITE_API_URL

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; 
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Report ID', selector: row => row._id, width: '200px' },
    { name: 'Report Date', selector: row => row.date, width: '200px'},
    { name: 'Budget Type', selector: row => row.budgetType, width: '170px' },
    { name: 'Department', selector: row => row.department, width: '140px' },
    { name: 'Budget Amount', selector: row => formatCurrency(row.amount), width: '150px' },
    { name: 'Description', selector: row => row.description },
    { name: 'Status', selector: row => row.status },
      { name: 'View', 
        cell: (row) => (
          <div className='flex justify-center text-lg bg-cyan-600 h-10 w-10 rounded-lg items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer'
            onClick={()=> { document.getElementById('view-modal').showModal(); setSelectedData(row)}}>
            <FaEye/>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: '40px'
      },
      { name: 'Update', 
      cell: (row) => (
        <div className='flex justify-center text-lg bg-green-500 h-10 w-10 rounded-lg items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer'
        onClick={()=> { document.getElementById('edit-modal').showModal(); setSelectedData(row)}}>
          <FaEdit />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '90px'
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


  // FETCH DATA
  useEffect(() => {
    
    const getBudgetRequests = async () => {
      const response = await axios.get(`${urlAPI}/budget/get-requests`)
        if(response.data.status === 'success'){
          setData(response.data.requests)
        }
      }

    getBudgetRequests()

    socket.on('added-request', (response) => {
      setData((prevData) => [response, ...prevData])
    })

    socket.on('update-request', (response) => {
      setData((prevData) => prevData.map((item) => 
        item._id === response._id ? response : item))
    })

    return () => {
      socket.off('added-request')
      socket.off('update-request')
    }
  }, [])

  // HANDLES SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      date: Date.now(),
      department: department,
      amount: amount,
      budgetType: budgetType,
      description: description,
      status: 'Pending'
    }

    try {
      const response = await axios.post(`${urlAPI}/budget/add-request`, data)
      if(response.data.status === 'success'){
        document.getElementById("budget_modal").close()
        setAmount(0)
        setDepartment('')
        setBudgetType('')
        setDescription('')
        toast.success(response.data.message, {
          position: "top-right",
        })
      }
    } catch (error) {
      if(error.response.status === 'error'){
        document.getElementById("budget_modal").close()
        setAmount(0)
        setDepartment('')
        setBudgetType('')
        setDescription('')
        toast.error(error.response.data.message, {
          position: "top-right",
        })
      }else{
        document.getElementById("budget_modal").close()
        setAmount(0)
        setDepartment('')
        setBudgetType('')
        setDescription('')
        toast.error('An error occurred', {
          position: "top-right",
        })
      }
    }
  }

  // HANDLE UPDATE SUBMIT
  const updateSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.patch(`${urlAPI}/budget/update-request/${selectedData._id}`,
        selectedData
      )
      if(response.data.status === 'success'){
        document.getElementById("edit-modal").close()
        toast.success(response.data.message, {
          position: "top-right",
        })
      }
    } catch (error) {
      if(error.response.data.status){
        document.getElementById("edit-modal").close()
        toast.error(error.response.data.message, {
          position: "top-right",
        })
      }else{
        document.getElementById("edit-modal").close()
        toast.error('An error occurred', {
          position: "top-right",
        })
      }
    }
  }

  return (
    <div>
        <div className='h-screen w-full'>
          <div className='max-w-screen-2xl mx-auto flex flex-col  mt-10'>
            <h1 className='font-bold text-md'>Budget Management</h1>

            <h1 className='mt-10 font-semibold text-md'>Budget Allocation</h1>
            
            <div className='flex flex-wrap gap-x-4'>

              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Operating Expenses</p>
                  <LuUtilityPole className='text-2xl text-yellow-500' />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl text-black font-bold">₱ 50,000</p>
                </div>
              </div>

              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Staff and Wages</p>
                  <FaPeopleGroup className='text-2xl text-blue-500' />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl text-black font-bold">₱ 50,000</p>
                </div>
              </div>

              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Medical supplies</p>
                  <FaBriefcaseMedical className='text-2xl text-red-500' />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl text-black font-bold">₱ 100,000</p>
                </div>
              </div>

              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Medical Equipments</p>
                  <GiMedicalDrip className='text-2xl text-emerald-500' />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-3xl text-black font-bold">₱ 100,520</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto w-full mt-10">
              <button
              onClick={() => document.getElementById('budget_modal').showModal()}
              className='btn btn-primary text-md mb-5'>
                <MdAddComment className="text-2xl"/> 
                Add Budget Request
              </button>
              <h1 className='mb-2 font-semibold text-md'>Budget Records</h1>
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

          {/* VIEW MODAL */}
          <dialog id="view-modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Budget Request Preview</h3>
              
              <div className="py-4">
                <p><strong>Report ID:</strong> {selectedData._id}</p>
                <p><strong>Report Date:</strong> {selectedData.date}</p>
                <p><strong>Budget Type:</strong> {selectedData.budgetType}</p>
                <p><strong>Department:</strong> {selectedData.department}</p>
                <p><strong>Budget Amount:</strong> {formatCurrency(selectedData.amount)}</p>
                <p><strong>Status:</strong> {selectedData.status}</p>
                <p><strong>Description:</strong></p>
                <p>{selectedData.description}</p>
              </div>
              
              <div className="modal-action">
                <button onClick={() => document.getElementById('view-modal').close()} className="btn btn-primary">Close</button>
              </div>
            </div>
          </dialog>

          {/* EDIT MODAL */}
          <dialog id="edit-modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-5">Record New Budget</h3>
              <form onSubmit={updateSubmit} className="space-y-4">
                {/* Department Field */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    className="select select-bordered w-full mt-1"
                    value={selectedData?.department}
                    onChange={(e) => setSelectedData((prevData) => ({
                      ...prevData,
                      department: e.target.value
                    }))}
                    required
                  >
                    <option value="" disabled>Select department</option>
                    <option value="Logistics">Logistics</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                {/* Amount Field */}
                <div>
                  <label htmlFor="budgetAmount" className="block text-sm font-medium">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="budgetAmount"
                    name="amount"
                    placeholder="Enter amount"
                    className="input input-bordered w-full mt-1"
                    value={selectedData?.amount}
                    max={500000}
                    min={1}
                    onChange={(e) => setSelectedData((prevData) => ({
                      ...prevData,
                      amount: e.target.value
                    }))}
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
                    value={selectedData?.budgetType}
                    onChange={(e) => setSelectedData((prevData) => ({
                      ...prevData,
                      budgetType: e.target.value
                    }))}
                    required
                  >
                    <option value="" disabled>Select budget type</option>
                    <option value="Operating Expenses">Operating Expenses</option>
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Medical Equipments">Medical Equipments</option>
                    <option value="Staff and Wages">Staff and Wages</option>
                  </select>
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    className="textarea textarea-bordered w-full mt-1"
                    value={selectedData?.description}
                    onChange={(e) => setSelectedData((prevData) => ({
                      ...prevData,
                      description: e.target.value
                    }))}
                    required
                  />
                </div>

                {/* STATUS */}
                <label className="block font-semibold mb-2">Request Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Pending"
                      checked={selectedData?.status === "Pending"}
                      onChange={(e) => setSelectedData((prevData) => ({
                        ...prevData,
                        status: e.target.value
                      }))}
                      className="radio"
                    />
                    Pending
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Approved"
                      checked={selectedData?.status === "Approved"}
                      onChange={(e) => setSelectedData((prevData) => ({
                        ...prevData,
                        status: e.target.value
                      }))}
                      className="radio"
                    />
                    Approved
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Rejected"
                      checked={selectedData?.status === "Rejected"}
                      onChange={(e) => setSelectedData((prevData) => ({
                        ...prevData,
                        status: e.target.value
                      }))}
                      className="radio"
                    />
                    Rejected
                  </label>
                </div>

                {/* Submit Button */}
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Save Budget
                  </button>
                  <button type="button" className="btn btn-error" onClick={() => document.getElementById("edit-modal").close()}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </dialog>

          {/* MODALS */}
          <dialog id="budget_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-5">Record New Budget</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Department Field */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    className="select select-bordered w-full mt-1"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select department</option>
                    <option value="Logistics">Logistics</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                {/* Amount Field */}
                <div>
                  <label htmlFor="budgetAmount" className="block text-sm font-medium">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="budgetAmount"
                    name="amount"
                    placeholder="Enter amount"
                    className="input input-bordered w-full mt-1"
                    value={amount}
                    max={500000}
                    min={1}
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
                    value={budgetType}
                    onChange={(e) => setBudgetType(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select budget type</option>
                    <option value="Operating Expenses">Operating Expenses</option>
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Medical Equipments">Medical Equipments</option>
                    <option value="Staff and Wages">Staff and Wages</option>
                  </select>
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    className="textarea textarea-bordered w-full mt-1"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Save Budget
                  </button>
                  <button type="button" className="btn btn-error" onClick={() => document.getElementById("budget_modal").close()}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </dialog>

        </div>
    </div>
  )
}

export default budgetManagement
