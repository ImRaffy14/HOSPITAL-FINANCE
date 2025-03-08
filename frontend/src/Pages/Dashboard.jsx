import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AccountsManagement from '../Components/accountsManagement';
import BudgetManagement from '../Components/budgetManagement';
import FinancialReports from '../Components/FinancialReports';
import ChartOfAccounts from '../Components/ChartOfAccounts';
import InsuranceClaims from '../Components/insuranceClaims';
import Overview from '../Components/Overview';
import PaymentManagement from '../Components/paymentManagement'
import Billing from '../Components/Billing';
import { MdDashboard } from "react-icons/md";
import { FaMoneyBills } from "react-icons/fa6";
import { LuBaggageClaim } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { MdSupervisorAccount } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { TbReportAnalytics } from "react-icons/tb";
import { FaChartBar } from "react-icons/fa";
import axios from 'axios'
import Logo from '../../assets/Nodado.jfif'



function AdminPage() {

    const [isToggled, setIsToggled] = useState(true);
    const [isVerifying, setIsVerifying] = useState(true);
    const [profile, setProfile] = useState('')

    const urlAPI = import.meta.env.VITE_API_URL
    const navigate = useNavigate();

    const handleSideNav = () => {
        setIsToggled(!isToggled);
    };

    const handleLogout = async () => {
        await axios.post(`${urlAPI}/auth-api/logout`, {username: profile.username}, {
            withCredentials: true
        })
        navigate('/')
    };

    useEffect(() => {
        const verify = async () => {
            try{
                const response = await axios.get(`${urlAPI}/auth-api/protected`,{
                    withCredentials: true
                })
    
                if(response){
                    setProfile(response.data)
                    setIsVerifying(false)
                }
            }
            catch(error){
                console.log(error.response)
                toast.error('You are not authorized to view this page', {
                    position: "top-right"
                })
                handleLogout()
            }
        }

        verify()
    }, [])


    if(isVerifying){
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }


    return (
        <>
            <div className="h-screen flex">
                {/* Sidebar */}
                <div className={`sidebar transition-all duration-300 ${isToggled ? 'w-6/12 md:w-3/12 sm:w-3/12 lg:w-3/12 xl:w-2/12' : 'w-0'} overflow-auto`}>
                    <div className="flex flex-col justify-center my-4">
                        <div className='flex flex-col items-center'>
                            <img src={Logo} className='h-[150px] w-[150px] mt-10' />
                            <h1 className='font-semibold text-md mt-3 text-center'>Nodado General Hospital</h1>
                        </div>

                        <ul className="menu menu-vertical mt-10">
                            <li className='border-b border-gray-300 font-semibold'><NavLink to="/Dashboard/overview" activeClassName="bg-gray-700"><MdDashboard />DASHBOARD</NavLink></li>
                            {(profile.role === 'Accountant' || profile.role === 'Billing Officer' ) && (
                                <ul className="menu menu-vertical">
                                    <h1 className='text-center mt-2 border-b border-t border-gray-400 border-dotted text-md bg-slate-100'>BILLING</h1>
                                    <li className='font-semibold'><NavLink to="billing" activeClassName="bg-gray-700"><FaMoneyBills />BILLING & INVOICE</NavLink></li>
                                    <h1 className='text-center border-b border-t border-gray-400 border-dotted text-md bg-slate-100'>FINANCE MANAGEMENT</h1>
                                    <li className='font-semibold'><NavLink to="budgetManagement" activeClassName="bg-gray-700"><FaMoneyBills />BUDGET MANAGEMENT</NavLink></li>
                                    <li className='font-semibold'><NavLink to="insuranceClaims" activeClassName="bg-gray-700"><LuBaggageClaim />INSURANCE CLAIMS</NavLink></li>
                                </ul>
                            )}
                            {(profile.role === 'Medical Director') && (
                                <ul className="menu menu-vertical">
                                    <h1 className='text-center mt-2 border-b border-t border-gray-400 border-dotted text-md bg-slate-100'>BILLING</h1>
                                    <li className='font-semibold'><NavLink to="billing" activeClassName="bg-gray-700"><FaMoneyBills />BILLING & INVOICE</NavLink></li>
                                    <h1 className='text-center border-b border-t border-gray-400 border-dotted text-md bg-slate-100'>FINANCE MANAGEMENT</h1>
                                    <li className='font-semibold'><NavLink to="budgetManagement" activeClassName="bg-gray-700"><FaMoneyBills />BUDGET MANAGEMENT</NavLink></li>
                                    <li className='font-semibold'><NavLink to="insuranceClaims" activeClassName="bg-gray-700"><LuBaggageClaim />INSURANCE CLAIMS</NavLink></li>
                                    <li className='font-semibold'><NavLink to="paymentManagement" activeClassName="bg-gray-700"><MdOutlinePayment />PAYMENT MANAGEMENT</NavLink></li>
                                    <h1 className='text-center border-b border-t border-gray-400 border-dotted text-md bg-slate-100'>GENERAL LEDGER</h1>
                                    <li className='font-semibold'><NavLink to="financialReports" activeClassName="bg-gray-700"><TbReportAnalytics />FINANCIAL REPORTS</NavLink></li>
                                    <li className='font-semibold'><NavLink to="chartOfAccounts" activeClassName="bg-gray-700"><FaChartBar />CHART OF ACCOUNTS</NavLink></li>
                                    <h1 className='text-center border-b border-t border-gray-400 border-dotted text-md bg-slate-100'>USER MANAGEMENT</h1>
                                    <li className='font-semibold'><NavLink to="accountsManagement" activeClassName="bg-gray-700"><MdSupervisorAccount />USER MANAGEMENT</NavLink></li>
                                </ul>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Main content */}
                <div className={`flex-grow transition-all duration-300 bg-gray-200 ${isToggled ? 'w-6/12 lg:w-2/12 md:w-8/12 sm:w-8/12' : 'w-full'} overflow-auto`}>
                    <div className="mx-2 my-1">
                        {/* NAVBAR */}
                        <div className="navbar bg-base-100 rounded-xl">
                            <div className="navbar-start">
                                <button className="btn btn-ghost btn-circle" onClick={handleSideNav}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                                </button>
                            </div>
                            <div className="navbar-center">
                                <a className="btn btn-ghost text-xl">FINANCIAL MANAGEMENT SYSTEM</a>
                            </div>
                            <div className="navbar-end"> 
                                <h1 className="text-red-500 font-bold text-3xl mr-4" onClick={handleLogout}><IoIosLogOut /></h1> 
                            </div>
                        </div>
                        {/* DATA */}
                        <Routes>
                            <Route path="accountsManagement" element={<AccountsManagement/>} />
                            <Route path="/" element={<Navigate to="/Dashboard/overview" />} />
                            <Route path="overview" element={<Overview userData={profile}/>} />
                            <Route path="budgetManagement" element={<BudgetManagement/>} />
                            <Route path="insuranceClaims" element={<InsuranceClaims/>} />
                            <Route path="paymentManagement" element={<PaymentManagement/>} />
                            <Route path="financialReports" element={<FinancialReports/>} />
                            <Route path="chartOfAccounts" element={<ChartOfAccounts/>} />
                            <Route path="billing" element={<Billing />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPage;
