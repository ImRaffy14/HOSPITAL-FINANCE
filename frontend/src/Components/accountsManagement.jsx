import React from 'react'
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { TiUserAdd } from "react-icons/ti";
import { FaEye, FaEdit } from "react-icons/fa";
import axios from 'axios'
import { toast } from 'react-toastify'


function accountsManagement() {
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState([])
  const [errorRegister, setErrorRegister] = useState('')
  const [errorUpadte, setErrorUpadate] = useState('')
  const [selectedData, setSelectedData] = useState([])
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'Head Finance',
    contactNumber: null,
    address: ''
  })

  const urlAPI = import.meta.env.VITE_API_URL

  const columns = [
    { name: 'Account ID', selector: row => row._id, width: "200px" },
    { name: 'Username', selector: row => row.username, width: "120px" },
    { name: 'Full Name,', selector: row => row.fullName, width: "160px" },
    { name: 'Email,', selector: row => row.email, width: "230px" },
    { name: 'Role', selector: row => row.role, width: "150px" },
    { name: 'Contact Number', selector: row => row.contactNumber, width: "200px" },
    { name: 'Address', selector: row => row.address },
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
    { name: 'Edit', 
    cell: (row) => (
      <div className='flex justify-center text-lg bg-green-500 h-10 w-10 rounded-lg items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer'
      onClick={()=> { document.getElementById('edit-user-modal').showModal(); setSelectedData(row)}}>
        <FaEdit />
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  }
  ];

  // GET USER'S LIST
  useEffect(() => {
    
    const getUsers = async () => {
      const result = await axios.get(`${urlAPI}/accounts/get-accounts`)
      setData(result.data)
    }

    getUsers()
  }, [])


  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    try{
      e.preventDefault()
      const addUser = await axios.post(`${urlAPI}/auth-api/register`, formData)
      if(addUser.data.success){
        toast.success(addUser.data.message,{
          position: "top-right"
        })
        setFormData({
          username: '',
          fullName: '',
          email: '',
          password: '',
          role: 'Head Finance',
          contactNumber: null,
          address: ''
        })
        setData((prevData) => [...prevData, addUser.data.account])
        document.getElementById('add-user-modal').close()
      }
    }
    catch(err){
      if(err.response.status === 500){
        setErrorRegister(err.response.data.error)
      }else if(err.response.status === 400){
        document.getElementById('add-user-modal').close()
        setFormData({
          username: '',
          fullName: '',
          email: '',
          password: '',
          role: 'Head Finance',
          contactNumber: null,
          address: ''
        })
        toast.error(err.response.data.message,{
          position: "top-right"
        })
      }
      else{
        setFormData({
          username: '',
          fullName: '',
          email: '',
          password: '',
          role: 'Head Finance',
          contactNumber: null,
          address: ''
        })
        document.getElementById('add-user-modal').close()
        toast.error("Server Internal Error",{
          position: "top-right"
        })
      }
    }
  }

  // HANDLE SUBMIT CHANGE
  const handleSubmitChange = async (e) => {
    try{
      e.preventDefault()
      const updateUser = await axios.patch(`${urlAPI}/accounts/update-account/${selectedData._id}`, selectedData)
      if(updateUser.data.success){
        toast.success(updateUser.data.message,{
          position: "top-right"
        })
        document.getElementById('edit-user-modal').close()
        setData(data.map((item) => updateUser.data.account._id === item._id ? updateUser.data.account : item))
      }
    }
    catch(err){
      if(err.response.status === 500){
        setErrorUpadate(err.response.data.error)
      }else if(err.response.status === 404){
        document.getElementById('edit-user-modal').close()
        toast.error(err.response.data.message,{
          position: "top-right"
        })
      }
      else{
        document.getElementById('edit-user-modal').close()
        toast.error("Server Internal Error",{
          position: "top-right"
        })
      }
    }
  }

  return (
    <>
        <div className='h-screen w-full'>
          <div className='max-w-screen-2xl mx-auto flex flex-col mt-10'>
            <h1 className='font-bold text-md'>User Management</h1>
            
            <div className="mt-10">
              <button  onClick={()=>document.getElementById('add-user-modal').showModal()} className='btn btn-primary text-md mb-5'><TiUserAdd className="text-2xl"/>Add User</button>
            </div>

            <h1 className='mb-2 font-semibold text-md'>User's List</h1>

            <div className="bg-white shadow-xl rounded-lg p-2">
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
        
        {/* MODAL FOR ADD USER */}
        <dialog id="add-user-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg mb-5">Add New User</h3>
            
            {/* Form to Create a User */}
            <form method="dialog" className="space-y-4" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e)=> setFormData((prevData) => ({...prevData, username: e.target.value}))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullName}
                  onChange={(e)=> setFormData((prevData) => ({...prevData, fullName: e.target.value}))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e)=> setFormData((prevData) => ({...prevData, email: e.target.value}))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e)=> setFormData((prevData) => ({...prevData, password: e.target.value}))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  id="role"
                  name="role"
                  onChange={(e)=> setFormData((prevData) => ({...prevData, role: e.target.value}))}
                  required
                  className="select select-bordered w-full"
                >
                  <option value="Head Finance">Head Finance</option>
                  <option value="Finance Officer">Finance Officer</option>
                </select>
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="number"
                    id="contact"
                    name="contact"
                    value={formData.contactNumber}
                    onChange={(e)=> setFormData((prevData) => ({...prevData, contactNumber: e.target.value}))}
                    required
                    maxLength={11}
                    className="input input-bordered w-full"
                  />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e)=> setFormData((prevData) => ({...prevData, address: e.target.value}))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {errorRegister && <h1 className="text-red-500">{errorRegister}</h1>}

              <div className="modal-action">
                {/* Save Button */}
                <button type="submit" className="btn btn-success">Save</button>
                
                {/* Close Button */}
                <button type="button" className="btn btn-error" onClick={() => document.getElementById('add-user-modal').close()}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </dialog>

        {/* VIEW MODAL */}
        <dialog id="view-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Account Preview</h3>
            
            <div className="py-4">
              <p><strong>Account ID:</strong> {selectedData._id}</p>
              <p><strong>Username:</strong> {selectedData.username}</p>
              <p><strong>Full Name Type:</strong> {selectedData.fullName}</p>
              <p><strong>Email:</strong> {selectedData.email}</p>
              <p><strong>Role:</strong> {selectedData.role}</p>
              <p><strong>Contact Number:</strong> {selectedData.contactNumber}</p>
              <p><strong>Address:</strong> {selectedData.address}</p>
            </div>
            
            <div className="modal-action">
              <button onClick={() => document.getElementById('view-modal').close()} className="btn btn-primary">Close</button>
            </div>
          </div>
        </dialog>

        {/* MODAL FOR EDIT USER */}
        <dialog id="edit-user-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg mb-5">Edit New User</h3>
            
            {/* Form to Create a User */}
            <form method="dialog" className="space-y-4" onSubmit={handleSubmitChange}>
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Edit Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={selectedData.username}
                  onChange={(e)=> setSelectedData((prevData) => ({...prevData, username: e.target.value}))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">Edit Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={selectedData.fullName}
                  onChange={(e)=> setSelectedData((prevData) => ({...prevData, fullName: e.target.value}))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Edit Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={selectedData.email}
                  onChange={(e)=> setSelectedData((prevData) => ({...prevData, email: e.target.value}))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Change Password</label>
                <h1 className="text-red-400 mb-1 text-sm italic">Note: leave this blank if you will not change user's password.</h1>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={(e)=> setSelectedData((prevData) => ({...prevData, password: e.target.value}))}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Change Role</label>
                <select
                  id="role"
                  name="role"
                  value={selectedData.role}
                  onChange={(e)=> setSelectedData((prevData) => ({...prevData, role: e.target.value}))}
                  required
                  className="select select-bordered w-full"
                >
                  <option value="Head Finance">Head Finance</option>
                  <option value="Finance Officer">Finance Officer</option>
                </select>
              </div>

              {/* Contact Number */}
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">Edit Contact Number</label>
                  <input
                    type="number"
                    id="contact"
                    name="contact"
                    value={selectedData.contactNumber}
                    onChange={(e)=> setSelectedData((prevData) => ({...prevData, contactNumber: e.target.value}))}
                    required
                    maxLength={11}
                    className="input input-bordered w-full"
                  />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Edit Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={selectedData.address}
                  onChange={(e)=> setSelectedData((prevData) => ({...prevData, address: e.target.value}))}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {errorUpadte && <h1 className="text-red-500">{errorUpadte}</h1>}

              <div className="modal-action">
                {/* Save Button */}
                <button type="submit" className="btn btn-success">Save</button>
                
                {/* Close Button */}
                <button type="button" className="btn btn-error" onClick={() => document.getElementById('edit-user-modal').close()}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </dialog>
    </>
  )
}

export default accountsManagement
