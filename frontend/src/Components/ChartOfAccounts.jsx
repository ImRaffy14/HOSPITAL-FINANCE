import React from 'react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import DataTable from 'react-data-table-component';
import { IoReloadCircle } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";

function ChartOfAccounts({ userData }) {
  const [searchText, setSearchText] = useState('')
  const [amounts, setAmounts] = useState({})
  const [description, setDescription] = useState('')

  const urlAPI = import.meta.env.VITE_API_URL

  const getCurrentMonth = () => {
    return new Date().toLocaleString('en-US', { month: 'long' });
  };


  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return `₱0.00`; 
    }
    return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };
  
  const data = [
    { code: "1001", category: "Assets", subCategory: "Total Assets", description: `Total cash of the company`, amount: amounts.assets?.totalAssets || 0 },
    { code: "1002", category: "Assets", subCategory: "Receivables", description: `Outstanding invoices yet to be collected`, amount: amounts.assets?.receivables || 0 },
    { code: "2001", category: "Liabilities", subCategory: "Operating Expenses", description: `Pending payments for business operations`, amount: amounts.liabilites?.operatingExpenses || 0 },
    { code: "2002", category: "Liabilities", subCategory: "Medical Supplies", description: `Outstanding bills for medical supplies`, amount: amounts.liabilites?.medicalSupplies || 0 },
    { code: "2003", category: "Liabilities", subCategory: "Medical Equipments", description: `Pending payments for medical equipment`, amount: amounts.liabilites?.medicalEquipments || 0 },
    { code: "2004", category: "Liabilities", subCategory: "Staff and Wages", description: `Salaries and wages yet to be paid`, amount: amounts.liabilites?.staffAndWages || 0 },
    { code: "3001", category: "Equity", subCategory: "Total Equity", description: `Company's total equity (Assets - Liabilities)`, amount: amounts.equity?.totalEquity || 0 },
    { code: "4001", category: "Revenue", subCategory: "Total Revenue", description: `Total revenue generated for the month of ${getCurrentMonth()}`, amount: amounts.revenue || 0 },
    { code: "5001", category: "Expenses", subCategory: "Operating Expenses", description: `Monthly business operating costs month of ${getCurrentMonth()}`, amount: amounts.expenses?.operatingExpenses || 0 },
    { code: "5002", category: "Expenses", subCategory: "Medical Supplies", description: `Costs related to medical supplies month of ${getCurrentMonth()}`, amount: amounts.expenses?.medicalSupplies || 0 },
    { code: "5003", category: "Expenses", subCategory: "Medical Equipments", description: `Expenses for medical equipment month of ${getCurrentMonth()}`, amount: amounts.expenses?.medicalEquipments || 0 },
    { code: "5004", category: "Expenses", subCategory: "Staff and Wages", description: `Total staff wages paid month of ${getCurrentMonth()}`, amount: amounts.expenses?.staffAndWages || 0 },
    { code: "5005", category: "Expenses", subCategory: "Insurance Claims", description: `Expenses for insurance claims month of ${getCurrentMonth()}`, amount: amounts.expenses?.insuranceClaims || 0 },
  ];
  
  const columns = [
    { name: 'Code', selector: row => row.code, width: '120px' },
    { name: 'Category', selector: row => row.category, width: '150px' },
    { name: 'Subcategory', selector: row => row.subCategory, width: '200px' },
    { name: 'Description', selector: row => row.description },
    { name: 'Amount', selector: row => formatCurrency(row.amount), width: '300px' },
  ];

  
  // FETCH DATA
  useEffect(() => {
    
    const fetchData = async () => {
      const response = await axios.get(`${urlAPI}/financial/chart-of-accounts`)
      setAmounts(response.data)
    }

    fetchData()

  }, [])


  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // HANDLE RELOAD
  const reload = async () => {
    const response = await axios.get(`${urlAPI}/financial/chart-of-accounts`)
    setAmounts(response.data)
    toast.success('Table Reloaded', {
      position: "top-right"
    })
  }

  // HANDLE SUBMIT FINANCIAL REPORTS
  const submitFinancialReport = async (e) => {
    e.preventDefault()
    const data = {
      liabilities: amounts.liabilites,
      revenue: amounts.revenue,
      expenses: amounts.expenses,
      assets: amounts.assets,
      date: new Date(),
      equity: amounts.equity.totalEquity,
      description: description,
      preparedBy: userData.fullName
    }
    try {
      const response = await axios.post(`${urlAPI}/financial-reports/add-financial-reports`, data)
      if(response.data.status === "success"){
        document.getElementById('create-financial-modal').close()
        setDescription('')
        toast.success(response.data.message, {
          position: "top-right"
        })
      }
    } catch (error) {
      document.getElementById('create-financial-modal').close()
      setDescription('')
      toast.error(error.response.data.message, {
        position: "top-right"
      })
    }
  }


  return (
    <>
      <div className='h-screen'>
        <div className='max-w-screen-2xl mx-auto flex flex-col'>
          <h1 className='mb-2 font-bold text-md mt-10'>Chart of Accounts</h1>
          <div>
            <div className='flex justify-between'>
              <button className="btn btn-primary mt-10" onClick={reload}><IoReloadCircle className='text-3xl'/>Refresh Table</button>
            </div>
            <div className="bg-white rounded-lg p-2 mt-3">
              <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  defaultSortField="name"
                  highlightOnHover
                  pointerOnHover
                  subHeader
                  subHeaderComponent={
                    <>
                      <button className="btn btn-info my-5" onClick={() => document.getElementById('create-financial-modal').showModal()}><IoIosCreate className='text-3xl'/>Create financial report</button>
                    </>
                  }
                />
            </div>
          </div>
        </div>

        {/* CREATE FINANCIAL REPORT MODAL */}
        <dialog id="create-financial-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg mb-4">Create Financial Report</h3>
            <form method="dialog" className="space-y-4" onSubmit={submitFinancialReport}>
              {/* Financial Insights & Recommendations Input */}
              <div>
                <label htmlFor="financial-insights" className="block text-sm font-medium">
                  Financial Insights & Recommendations
                </label>
                <textarea
                  id="financial-insights"
                  className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-300"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter financial insights and recommendations..."
                ></textarea>
              </div>

              {/* Modal Actions */}
              <div className="modal-action">
                <button type="submit" className="btn btn-success">Save</button>

                {/* Close Button */}
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={() => document.getElementById('create-financial-modal').close()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </>
  )
}

export default ChartOfAccounts
