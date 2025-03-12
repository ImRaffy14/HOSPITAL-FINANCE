import { useRef } from "react";
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

const FinancialReports = ({ data }) => {
  const totalExpenses = Object.values(data.expenses).reduce((acc, val) => acc + val, 0);
  const totalLiabilities = Object.values(data.liabilites).reduce((acc, val) => acc + val, 0);
  const netIncome = data.revenue - totalExpenses;
  const reportRef = useRef(); // For capturing the component as an image

  const chartData = [
    { category: "Revenue", amount: data.revenue },
    { category: "Total Expenses", amount: totalExpenses },
    { category: "Net Income", amount: netIncome },
  ];

  const downloadPDF = async () => {
    const doc = new jsPDF();
    doc.text("Financial Reports", 20, 10);

    // Capture the report as an image
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    doc.addImage(imgData, "PNG", 10, 20, 190, 0);
    doc.save("Financial_Reports.pdf");
  };

  return (
    <div className="p-4">
      <button onClick={downloadPDF} className="btn btn-primary mb-4">
        Download PDF
      </button>

      <div ref={reportRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Balance Sheet */}
        <div className="card bg-base-100 shadow-md p-4 rounded-lg">
          <div className="card-body">
            <h2 className="card-title">Balance Sheet</h2>
            <p><strong>Total Assets:</strong> ₱{data.assets.totalAssets.toLocaleString()}</p>
            <p><strong>Receivables:</strong> ₱{data.assets.receivables.toLocaleString()}</p>
            <p><strong>Total Liabilities:</strong> ₱{totalLiabilities.toLocaleString()}</p>
            <p><strong>Total Equity:</strong> ₱{data.equity.totalEquity.toLocaleString()}</p>
          </div>
        </div>

        {/* Income Statement */}
        <div className="card bg-base-100 shadow-md p-4 rounded-lg">
          <div className="card-body">
            <h2 className="card-title">Income Statement</h2>
            <p><strong>Revenue:</strong> ₱{data.revenue.toLocaleString()}</p>
            <p><strong>Total Expenses:</strong> ₱{totalExpenses.toLocaleString()}</p>
            <p><strong>Net Income:</strong> ₱{netIncome.toLocaleString()}</p>
          </div>
        </div>

        {/* Cash Flow Statement */}
        <div className="card bg-base-100 shadow-md p-4 rounded-lg md:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Cash Flow Statement</h2>
            <ResponsiveContainer width="100%" height={350}> {/* Increased height for better spacing */}
              <AreaChart 
                data={chartData} 
                margin={{ top: 20, right: 40, left: 20, bottom: 20 }} // Add margin
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis 
                  tickFormatter={(value) => `₱${value.toLocaleString()}`} 
                />
                <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                <Legend />
                <Area type="monotone" dataKey="amount" stroke="#6366F1" fill="#4F46E5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Recommendations */}
        <div className="card bg-base-100 shadow-md p-4 rounded-lg md:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Financial Insights & Recommendations</h2>
            <ul className="list-disc pl-5">
              <li>Expand revenue streams by investing in new medical services.</li>
              <li>Reduce operating expenses to improve profitability.</li>
              <li>Monitor accounts receivable for timely collections.</li>
              <li>Consider reinvesting profits for long-term sustainability.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
