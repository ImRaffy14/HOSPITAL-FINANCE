import React from 'react'
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { MdAddToPhotos } from "react-icons/md";
import { PiMoneyFill } from "react-icons/pi";
import { useSocket } from '../context/socketContext'
import { MdAddComment } from "react-icons/md";
import axios from "axios"
import { toast } from "react-toastify"

function insuranceClaims() {
  const [searchText, setSearchText] = useState('')
  const [insuranceBudget, setInsuranceBudget] = useState(0)
  const [claimAmount, setClaimAmount] = useState('');
  const [claimType, setClaimType] = useState('');
  const [description, setDescription] = useState('');
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

    //FETCH DATA
    const fetchData = async () => {
      const response = await axios.get(`${urlAPI}/insurance/claims-history`)
      setData(response.data)
      const insurance = await axios.get(`${urlAPI}/cash/get-allocations`)
      setInsuranceBudget(insurance.data.allocations.insuranceClaims)
    }

    fetchData()

    socket.on('insurance-budget', (response) => {
      setInsuranceBudget(response)
    })

    socket.on('new-claim', (response) => {
      setData((prevData) => [response, ...prevData])
    })
    return () => {
      socket.off('insurance-budget')
      socket.off('new-claim')
    }
  }, [])

  const handleClaimSubmit = async (e) => {
    e.preventDefault();

    // Create a new claim object
    const newClaim = {
      claimDate: Date.now(),
      claimAmount,
      claimType,
      description,
    };

    try {
      const response = await axios.post(`${urlAPI}/insurance/add-claims`, newClaim);
      if(response.data.status === 'success'){
        toast.success(response.data.message, {
          position: 'top-right'
        })

      setClaimAmount('');
      setClaimType('');
      setDescription('');

      document.getElementById('insurance_claim_modal').close();
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: 'top-right'
      })
      setClaimAmount('');
      setClaimType('Machine');
      setDescription('');

      document.getElementById('insurance_claim_modal').close();
    }
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
                  <p className="text-3xl text-black font-bold">{formatCurrency(insuranceBudget)}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto w-full mt-10">
              <button className='btn btn-primary text-md mb-5' onClick={() => document.getElementById('insurance_claim_modal').showModal()}>
                <MdAddComment className="text-2xl"/> 
                Add claims
              </button>
              <h1 className='mb-2 font-semibold text-md'>Insurance Claims History</h1>
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

            <dialog id="insurance_claim_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-5">Record New Insurance Claim</h3>
                <form method="dialog" className="space-y-4" onSubmit={handleClaimSubmit}>
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
                      <option value="Machine">Machine</option>
                      <option value="Ambulance">Ambulance</option>
                      <option value="Equipments">Equipments</option>
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
