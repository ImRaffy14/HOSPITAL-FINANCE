import React from 'react'
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { MdAddToPhotos } from "react-icons/md";
import { PiMoneyFill } from "react-icons/pi";
import { useSocket } from '../context/socketContext'

function insuranceClaims() {

  const [searchText, setSearchText] = useState('')
  const [claimDate, setClaimDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimType, setClaimType] = useState('');
  const [description, setDescription] = useState('');
  const [data, setData] = useState([])

  const socket = useSocket()

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; 
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const columns = [
    { name: 'Claim ID', selector: row => row._id },
    { name: 'Claim Date', selector: row => row.claimDate },
    { name: 'Claim Amount', selector: row => formatCurrency(row.claimAmount) },
    { name: 'Claim Type', selector: row => row.claimType },
    { name: 'Description', selector: row => row.description },
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
    if(!socket) return;

    socket.emit('get-insurance-record', {msg: 'get insurance records'})

    const handlesNewInsurance = (response) => {
      alert(response.msg)
    }

    const handlesInsuranceRecords = (response) => {
      setData(response)
    }

    socket.on('received-new-insurance', handlesNewInsurance)
    socket.on('received-insurance-records', handlesInsuranceRecords)
    return () => {
      socket.off('received-new-insurance')
      socket.off('received-insurance-records')
    }
  }, [socket])

  const handleClaimSubmit = (e) => {
    e.preventDefault();

    // Create a new claim object
    const newClaim = {
      claimDate,
      claimAmount,
      claimType,
      description,
    };

    socket.emit('add-new-insurance', newClaim)

    // Clear form fields after submission
    setClaimDate('');
    setClaimAmount('');
    setClaimType('');
    setDescription('');

    // Close the modal (if necessary)
    document.getElementById('insurance_claim_modal').close();
  };

  return (
    <div>
        <div className='h-screen w-full'>
          <div className='max-w-screen-2xl mx-auto flex flex-col  mt-10'>
            <h1 className='font-bold text-md'>Insurance Claims</h1>

            <div className='flex gap-x-4'>
              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Insurance Claims Budget</p>
                  <PiMoneyFill className='text-2xl text-blue-500' />
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-4xl text-black font-bold">₱ 50,000</p>
                </div>
              </div>

              <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer" onClick={()=>document.getElementById('insurance_claim_modal').showModal()}>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 font-semibold text-md">Add Insurance Claim</p>
                </div>
                <div className="flex gap-3 my-3">
                  <p className="text-4xl text-black font-bold flex"><MdAddToPhotos className='text-4xl text-emerald-500 mr-3' /> Add</p>
                </div>
              </div>

            </div>

            <div className="overflow-x-auto w-full mt-10">
              <h1 className='mb-4'>Insurance Claims Records</h1>
              <DataTable
                title="Insurance Claims Records"
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

            <dialog id="insurance_claim_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-5">Record New Insurance Claim</h3>
                <form method="dialog" className="space-y-4" onSubmit={handleClaimSubmit}>
                  {/* Claim Date Field */}
                  <div>
                    <label htmlFor="claimDate" className="block text-sm font-medium">
                      Claim Date
                    </label>
                    <input
                      type="date"
                      id="claimDate"
                      name="claimDate"
                      className="input input-bordered w-full mt-1"
                      value={claimDate}
                      onChange={(e) => setClaimDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Claim Amount Field */}
                  <div>
                    <label htmlFor="claimAmount" className="block text-sm font-medium">
                      Claim Amount
                    </label>
                    <input
                      type="number"
                      id="claimAmount"
                      name="claimAmount"
                      placeholder="Enter claim amount"
                      className="input input-bordered w-full mt-1"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      required
                    />
                  </div>

                  {/* Claim Type Field */}
                  <div>
                    <label htmlFor="claimType" className="block text-sm font-medium">
                      Claim Type
                    </label>
                    <select
                      id="claimType"
                      name="claimType"
                      className="select select-bordered w-full mt-1"
                      onChange={(e) => setClaimType(e.target.value)}
                      required
                    >
                      <option value="" disabled selected>
                        Select claim type
                      </option>
                      <option value="Health">Health</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Home">Home</option>
                      <option value="Life">Life</option>
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
                      placeholder="Enter description of the claim"
                      className="textarea textarea-bordered w-full mt-1"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="modal-action">
                    <button type="submit" className="btn btn-primary">
                      Save Claim
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
    </div>
  )
}

export default insuranceClaims
