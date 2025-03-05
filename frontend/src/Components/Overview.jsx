import React from 'react'
import { useSocket } from "../context/socketContext"
import { CiUser } from "react-icons/ci";


function Overview({userData}) {


  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; 
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };



  return (
    <div>
        <div className='h-screen w-full'>
          <div className='max-w-screen-2xl mx-auto flex flex-col  mt-10'>
            <h1 className='font-bold text-md'>Dashboard</h1>
              <div className='flex justify-start'>
                <div className='p-8 rounded-lg bg-white w-[450px] mt-5 shadow-xl'>
                  <h1 className="flex items-center text-xl"><CiUser className='mr-2 text-3xl'/><a className="font-semibold">{userData.fullName}</a></h1>
                  <h1 className="flex items-center text-md mt-3"><a className="font-semibold mr-2">Account ID:</a> {userData._id}</h1>
                  <h1 className="flex items-center text-md"><a className="font-semibold mr-2">Role:</a> {userData.role}</h1>
                  <h1 className="flex items-center text-md"><a className="font-semibold mr-2">Email:</a> {userData.email}</h1>
                  <h1 className="flex items-center text-md"><a className="font-semibold mr-2">Address:</a> {userData.address}</h1>
                  <h1 className="flex items-center text-md"><a className="font-semibold mr-2">Contact No.:</a> {userData.contactNumber}</h1>
                </div>
              </div>

          </div>
        </div>
    </div>
  )
}

export default Overview
