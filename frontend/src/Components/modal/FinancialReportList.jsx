import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSocket } from '../../context/socketContext';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas-pro";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";


function FinancialReportList() {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openModal, setOpenModal] = useState(false)

    const urlAPI = import.meta.env.VITE_API_URL;
    const socket = useSocket();

    const formatCurrency = (value) => {
        if (value === undefined || value === null) {
            return `₱0.00`;
        }
        return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const formatISODateToReadableString = (isoDate) => {
        const date = new Date(isoDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const columns = [
        { name: 'ID', selector: row => row._id },
        { name: 'Date', selector: row => formatISODateToReadableString(row.date) },
        { name: 'Prepared By', selector: row => row.preparedBy },
        { name: 'Description', selector: row => row.description },
    ];

    // FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${urlAPI}/financial-reports/get-financial-reports`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching financial reports:', error);
            }
        };

        fetchData();

        socket.on('financial-report', (response) => {
            setData((prevData) => [response, ...prevData])
        })

        return () => {
            socket.off('financial-report')
        }

    }, [urlAPI]);

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const handleRowClicked = (row) => {
        setSelectedRow(row);
        setOpenModal(true)
    };

    const filteredData = data.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    console.log(selectedRow)

    const totalExpenses = Object.values(selectedRow?.expenses || 0).reduce((acc, val) => acc + val, 0);
    const totalLiabilities = Object.values(selectedRow?.liabilities || 0).reduce((acc, val) => acc + val, 0);
    const netIncome = selectedRow?.revenue - totalExpenses;
    const reportRef = useRef();

    const chartData = [
        { category: "Revenue", amount: selectedRow?.revenue || 0},
        { category: "Total Expenses", amount: totalExpenses },
        { category: "Net Income", amount: netIncome },
    ];

    const downloadPDF = async () => {
        const doc = new jsPDF();
    
        const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
    
        doc.addImage(imgData, "PNG", 10, 20, 190, 0);
        doc.save("Financial_Reports.pdf");
    };

    if (openModal && selectedRow) {
        return (
            <div className="p-4">
            <div className="flex justify-between">
            <button onClick={() => setOpenModal(false)} className="btn btn-primary mb-4">
                <IoMdArrowRoundBack className="text-2xl"/>  Back
            </button>
            <button onClick={downloadPDF} className="btn btn-primary mb-4">
                Download PDF
            </button>
            </div>
        
            <div ref={reportRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Financial Recommendations */}
                <div className="card bg-base-100 shadow-md p-4 rounded-lg md:col-span-2">
                <div className="card-body">
                    <h2 className="font-semibold text-xl">
                    {formatISODateToReadableString(selectedRow?.date || "")}
                    </h2>
                    <h2 className="font-semibold text-lg mb-10">
                    Prepared By: {selectedRow?.preparedBy || ""}
                    </h2>
                    <h2 className="font-semibold text-lg">Financial Insights & Recommendations</h2>
                    <p>{selectedRow?.description || "No insights available."}</p>
                </div>
                </div>
        
                {/* Balance Sheet */}
                <div className="card bg-base-100 shadow-md p-4 rounded-lg">
                <div className="card-body">
                    <h2 className="card-title">Balance Sheet</h2>
                    <p><strong>Total Assets:</strong> ₱{selectedRow?.assets?.totalAssets?.toLocaleString() || "0"}</p>
                    <p><strong>Receivables:</strong> ₱{selectedRow?.assets?.receivables?.toLocaleString() || "0"}</p>
                    <p><strong>Total Liabilities:</strong> ₱{totalLiabilities?.toLocaleString() || "0"}</p>
                    <p><strong>Total Equity:</strong> ₱{selectedRow?.equity?.toLocaleString() || "0"}</p>
                </div>
                </div>
        
                {/* Income Statement */}
                <div className="card bg-base-100 shadow-md p-4 rounded-lg">
                <div className="card-body">
                    <h2 className="card-title">Income Statement</h2>
                    <p><strong>Revenue:</strong> ₱{selectedRow?.revenue?.toLocaleString() || "0"}</p>
                    <p><strong>Total Expenses:</strong> ₱{totalExpenses?.toLocaleString() || "0"}</p>
                    <p><strong>Net Income:</strong> ₱{netIncome?.toLocaleString() || "0"}</p>
                </div>
                </div>
        
                {/* Cash Flow Statement */}
                <div className="card bg-base-100 shadow-md p-4 rounded-lg md:col-span-2">
                <div className="card-body">
                    <h2 className="card-title">Cash Flow Statement</h2>
                    <ResponsiveContainer width="100%" height={350}>
                    <AreaChart
                        data={chartData || []}
                        margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis tickFormatter={(value) => `₱${value.toLocaleString()}`} />
                        <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                        <Legend />
                        <Area type="monotone" dataKey="amount" stroke="#6366F1" fill="#4F46E5" />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>
            </div>
        );
    }



    return (
        <div className='h-screen w-full'>
            <div className='max-w-screen-2xl mx-auto flex flex-col mt-10'>
                <h1 className='font-bold text-md'>Financial Report List</h1>
                <div className="overflow-x-auto w-full mt-8">
                    <div className="bg-white rounded-lg p-2">
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            defaultSortField="name"
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={handleRowClicked} // Assign the row click handler
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
    );
}

export default FinancialReportList;
