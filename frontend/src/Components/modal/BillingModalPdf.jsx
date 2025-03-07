import React, { useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import logo from "../../../assets/Nodado.jfif"

function BillingModalPdf({ selectedData, onClose}) {
    const pdfRef = useRef();

    const formatCurrency = (value) => {
        if (value === undefined || value === null) {
            return `₱0.00`; 
        }
        return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const generatePDF = () => {
        const input = pdfRef.current;
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190; // Width of the PDF
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save(`Billing_${selectedData?.patientName}.pdf`);
        });
    };

    useEffect(() => {
        const openModal = () => document.getElementById('generate-billing-pdf-modal').showModal();
        openModal();

    }, []);

    return (
        <dialog id="generate-billing-pdf-modal" className="modal">
            <div className="modal-box max-w-6xl">
                <div ref={pdfRef} className="flex flex-col justify-center w-full p-8 bg-white text-black border">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <img src={logo} className=" w-[150px]" />
                        <div className="text-center mb-5">
                            <h1 className="text-2xl font-bold">Nodado General Hospital</h1>
                            <p className="text-sm text-gray-600">Capt. F. S. Samano, Camarin, Caloocan, 1400 Metro Manila</p>
                            <hr className="mt-2 border-gray-400" />
                        </div>
                    </div>

                    {/* Patient Information */}
                    <div className="mb-10">
                        <h2 className="font-semibold text-lg underline">Patient Information</h2>
                        <p><strong>Name:</strong> {selectedData?.patientName}</p>
                        <p><strong>Age:</strong> {selectedData?.patientAge}</p>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Billing Table */}
                    <h2 className="font-semibold text-lg underline mb-2">Billing Details</h2>
                    <table className="w-full border-collapse border border-gray-400">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-400 p-2">Description</th>
                                <th className="border border-gray-400 p-2">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Services */}
                            {selectedData?.services?.map((item, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border border-gray-400 p-2">{item.name}</td>
                                    <td className="border border-gray-400 p-2">{formatCurrency(item.cost)}</td>
                                </tr>
                            ))}

                            {/* Medications */}
                            {selectedData?.medications?.map((item, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border border-gray-400 p-2">{item.name}</td>
                                    <td className="border border-gray-400 p-2">{formatCurrency(item.cost)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Billing Summary */}
                    <div className="mt-5">
                    <p><strong>Sub Total:</strong> {formatCurrency((selectedData?.totalAmount || 0) + selectedData?.taxAmount )}</p>
                        <p><strong>Discount:</strong> {selectedData?.doctorTax || 0}%</p>
                        <p><strong>Discount Amount:</strong> {formatCurrency(selectedData?.taxAmount || 0)}</p>
                        <hr className="my-2 border-gray-400" />
                        <p className="text-lg font-bold"><strong>Total Amount:</strong> {formatCurrency(selectedData?.totalAmount || 0)}</p>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-5 text-gray-500">
                        <p>Thank you for trusting Nodado General Hospital! 💙</p>
                        <p>Please settle your bill at the hospital cashier or via online banking.</p>
                    </div>
                </div>

                <div className="modal-action">
                    <button onClick={generatePDF} className="btn btn-primary">Download PDF</button>
                    <button type="button" className="btn btn-error" onClick={() => onClose() }>
                        Close
                    </button>
                </div>
            </div>
        </dialog>
    );
}

export default BillingModalPdf;
