import React from 'react'
import { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import { FaFileInvoice } from "react-icons/fa";
import { IoMdClose, IoMdDownload  } from "react-icons/io";
import { toast } from "react-toastify"
import { useSocket } from "../context/socketContext";
import axios from "axios";
import { FaEye, FaEdit } from "react-icons/fa";
import BillingModalPdf from "../Components/modal/BillingModalPdf"
import ConfirmationModal from "../Components/modal/confirmationModal"


function Billing() {
    const [searchText, setSearchText] = useState('')
    const [data, setData] = useState([])
    const [selectedData, setSelectedData] = useState(null)
    const [isDownload, setIsDownload] = useState(false)
    const [billingData, setBillingData] = useState({
      services: [{ name: "", cost: "" }],
      medications: [{ name: "", cost: "" }],
      paymentStatus: "Pending",
      discount: "",
      doctorTax: 0,
    });
    const [showSummary, setShowSummary] = useState(false);

    const urlAPI = import.meta.env.VITE_API_URL
    const socket = useSocket()

    const formatCurrency = (value) => {
      if (value === undefined || value === null) {
        return `₱0.00`; 
      }
      return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };
  
    const columns = [
      { name: 'Billing ID', selector: row => row._id, width: '200px' },
      { name: 'Patient Name', selector: row => row.patientName, width: '130px' },
      { name: 'Patient Age', selector: row => row.patientAge, width: '100px' },
      { name: 'Services', selector: row => (
        <ul>
          {row.services.map((items, index) => (
            <li key={index}>{items.name} - {formatCurrency(items.cost)}</li>
          ))}
        </ul>
      )},
      { name: 'Medications', selector: row => (
        <ul>
          {row.services.map((items, index) => (
            <li key={index}>{items.name} - {formatCurrency(items.cost)}</li>
          ))}
        </ul>
      )},
      { name: 'Doctor Tax', selector: row => `${row.doctorTax}%`, width: '100px' },
      { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount), width: '120px' },
      { name: 'Payment Status', selector: row => row.paymentStatus, width: '130px' },
      { name: 'Date Created', selector: row => row.createdAt },
      { name: 'View', 
      cell: (row) => (
        <div className='flex justify-center text-lg bg-cyan-600 h-10 w-10 rounded-lg items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer'
          onClick={() => {document.getElementById('view-modal').showModal(); setSelectedData(row)} }>
          <FaEye/>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '60px'
    },
    { name: 'Edit', 
    cell: (row) => (
      <div className='flex justify-center text-lg bg-green-500 h-10 w-10 rounded-lg items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer'
      onClick={()=> { document.getElementById('edit-billing-modal').showModal(); setSelectedData(row)}}>
        <FaEdit />
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: '60px'
    },
    { name: 'PDF', 
      cell: (row) => (
        <div className='flex justify-center text-lg bg-red-500 h-10 w-10 rounded-lg items-center transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer'
        onClick={()=> { setSelectedData(row); setIsDownload(true) }}>
          <IoMdDownload />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '60px'
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

    // fetch billings records
    useEffect(() => {
      // fetch handler
      const fetchData = async () => {
        const response = await axios.get(`${urlAPI}/billing/get-billings`)
        if(response.data.status === 'success'){
          setData(response.data.billings)
        }
      }

      fetchData()

      socket.on('new-billing', (response) => {
        setData((prevData) => [response, ...prevData]);
      })

      socket.on('update-billing', (response) => {
        setData((prevData) => prevData.map((items) => items._id === response._id ? response : items))
      })

      return () => {
        socket.off('new-billing')
        socket.off('update-billing')
      }
    }, [])
  
    // Handle input changes
    const handleInputChange = (type, index, event) => {
      const { name, value } = event.target;
      if (type === "patient") {
        setBillingData({ ...billingData, [name]: value });
      } else {
        const updatedItems = [...billingData[type]];
        updatedItems[index][name] = value;
        setBillingData({ ...billingData, [type]: updatedItems });
      }
    };

    // Add service or medication
    const addItem = (type) => {
      setBillingData({
        ...billingData,
        [type]: [...billingData[type], { name: "", cost: "" }],
      });
    };

    // Remove service or medication
    const removeItem = (type, index) => {
      const updatedItems = billingData[type].filter((_, i) => i !== index);
      setBillingData({ ...billingData, [type]: updatedItems });
    };

    // Handle input changes edit
    const editHandleInputChange = (type, index, event) => {
      const { name, value } = event.target;
      if (type === "patient") {
        setSelectedData({ ...selectedData, [name]: value });
      } else {
        const updatedItems = [...selectedData[type]];
        updatedItems[index][name] = value;
        setSelectedData({ ...selectedData, [type]: updatedItems });
      }
    };

    // Add service or medication edit
    const editAddItem = (type) => {
      setSelectedData({
        ...selectedData,
        [type]: [...selectedData[type], { name: "", cost: "" }],
      });
    };

    // Remove service or medication edit
    const editRemoveItem = (type, index) => {
      const updatedItems = selectedData[type].filter((_, i) => i !== index);
      setSelectedData({ ...selectedData, [type]: updatedItems });
    };

    // Calculate subtotal
    const calculateSubtotal = () => {
      return (
        billingData.services.reduce((acc, item) => acc + Number(item.cost || 0), 0) +
        billingData.medications.reduce((acc, item) => acc + Number(item.cost || 0), 0)
      );
    };

    // Calculate tax
    const calculateTax = () => 
      (calculateSubtotal() * 
    (billingData.discount === "senior" || billingData.discount === "pwd" || billingData.discount === "Stake Holder Dependent" ? 
      20 : billingData.discount === "Stake Holder" ? 35 : 0 )) / 100;
    
    // Calculate total with tax
    const calculateTotal = () => calculateSubtotal() - calculateTax() - billingData.doctorTax;


    // Calculate subtotal edit
    const editCalculateSubtotal = () => {
      return (
        selectedData.services.reduce((acc, item) => acc + Number(item.cost || 0), 0) +
        selectedData.medications.reduce((acc, item) => acc + Number(item.cost || 0), 0)
      );
    };

    const editCalculateTax = () => 
      (calculateSubtotal() * 
    (selectedData.discount === "senior" || selectedData.discount === "pwd" || selectedData.discount === "Stake Holder Dependent" ? 
      20 : selectedData.discount === "Stake Holder" ? 35 : 0 )) / 100;
    
    
    // Calculate total with tax
    const editCalculateTotal = () => editCalculateSubtotal() - editCalculateTax() - selectedData.doctorTax;

    // Review billing before submitting
    const handleReviewBilling = (event) => {
      event.preventDefault();
      setShowSummary(true);
    };

    // HandleSubmitBilling
    const handleSubmitBilling = async (e) => {
      e.preventDefault()
      const finalBillingData = {
        ...billingData,
        totalAmount: calculateTotal(),
        taxAmount: calculateTax(),
      };

      try {
        const result = await axios.post(`${urlAPI}/billing/new-billing`, finalBillingData)
        if(result.data.status === 'success'){
          toast.success('Billing record added successfully', {
            position: 'top-right'
          })
          setShowSummary(false)
          setBillingData({
            services: [{ name: "", cost: "" }],
            medications: [{ name: "", cost: "" }],
            paymentStatus: "Pending",
            doctorTax: 0,
          })
          document.getElementById('generate-billing-modal').close()
        }
      } catch (error) {
        if(error.response){
          setShowSummary(false)
          toast.error(error.response.data.message, {
            position: 'top-right'
          })
          setBillingData({
            services: [{ name: "", cost: "" }],
            medications: [{ name: "", cost: "" }],
            paymentStatus: "Pending",
            doctorTax: 0,
          })
        }
        else{
          setShowSummary(false)
          toast.error('An error occurred. Please try again later.', {
            position: 'top-right'
          })
          setBillingData({
            services: [{ name: "", cost: "" }],
            medications: [{ name: "", cost: "" }],
            paymentStatus: "Pending",
            doctorTax: 0,
          })
        }
      }
    }

    // SUBMIT EDIT
    const onSubmitEdit = async () => {
      try {
        const data = {
          ...selectedData,
          totalAmount: editCalculateTotal(),
        }
        const result = await axios.patch(`${urlAPI}/billing/update-billing/${selectedData._id}`, data)
        if(result.data.status === 'success'){
          toast.success('Billing record updated successfully', {
            position: 'top-right'
          })
        }
      } catch (error) {
        if(error.response.data.status === "error"){
          toast.error(error.response.data.message, {
            position: 'top-right'
          })
          
        }else{
          toast.error('An error occurred. Please try again later.', {
            position: 'top-right'
          })
        }
      }
    }

  return (
    <div>
        <div className='h-screen w-full'>
          <div className='max-w-screen-2xl mx-auto flex flex-col  mt-10'>
            <h1 className='font-bold text-md'>Billing and Invoice</h1>
            <div className='mt-10'>
                <button className="btn btn-primary text-md mb-5" onClick={() => document.getElementById('generate-billing-modal').showModal()} ><FaFileInvoice className="text-xl"/> Generate Invoice</button>

                <h1 className="text-md font-semibold mb-2">Patient Bills</h1>
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
        </div>

        {/* GENERATE BILLING */}
        <dialog id="generate-billing-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg mb-4">Generate Billing</h3>

            {!showSummary ? (
              <form method="dialog" className="space-y-4" onSubmit={handleReviewBilling}>
                {/* Patient Info */}
                <div>
                  <label className="block font-medium">Patient Name</label>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Enter patient name"
                    value={billingData.patientName}
                    onChange={(e) => handleInputChange("patient", null, e)}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium">Patient Age</label>
                  <input
                    type="number"
                    name="patientAge"
                    placeholder="Enter patient age"
                    value={billingData.patientAge}
                    onChange={(e) => handleInputChange("patient", null, e)}
                    className="input input-bordered w-full"
                    max={100}
                    min={1}
                    required
                  />
                </div>

                {/* Discount Radio Buttons */}
                <div>
                  <label className="block font-medium">Discounts</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="discount"
                        value="senior"
                        checked={billingData.discount === "senior"}
                        onChange={(e) => setBillingData({ ...billingData, discount: e.target.value })}
                        className="radio radio-primary"
                      />
                      <span>Senior 20%</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="discount"
                        value="pwd"
                        checked={billingData.discount === "pwd"}
                        onChange={(e) => setBillingData({ ...billingData, discount: e.target.value })}
                        className="radio radio-primary"
                      />
                      <span>PWD 20%</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="discount"
                        value="Stake Holder"
                        checked={billingData?.discount === "Stake Holder"}
                        onChange={(e) => setBillingData({ ...billingData, discount: e.target.value })}
                        className="radio radio-primary"
                      />
                      <span>Stake Holder 35%</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="discount"
                        value="Stake Holder Dependent"
                        checked={billingData?.discount === "Stake Holder Dependent"}
                        onChange={(e) => setBillingData({ ...billingData, discount: e.target.value })}
                        className="radio radio-primary"
                      />
                      <span>Stake Holder Dependent 20%</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="discount"
                        value="none"
                        checked={billingData.discount === "none" || !billingData.discount}
                        onChange={(e) => setBillingData({ ...billingData, discount: e.target.value })}
                        className="radio radio-primary"
                      />
                      <span>None</span>
                    </label>
                  </div>
                </div>

                {/* Services Section */}
                <div>
                  <label className="block font-medium">Services Provided</label>
                  {billingData.services.map((service, index) => (
                    <div key={index} className="flex gap-2 mt-2 items-center">
                      <input
                        type="text"
                        name="name"
                        placeholder="Service Name"
                        value={service.name}
                        onChange={(e) => handleInputChange("services", index, e)}
                        className="input input-bordered w-1/2"
                        required
                      />
                      <input
                        type="number"
                        name="cost"
                        placeholder="Cost"
                        value={service.cost}
                        onChange={(e) => handleInputChange("services", index, e)}
                        className="input input-bordered w-1/2"
                        required
                      />
                      <button type="button" className="btn btn-sm btn-error" onClick={() => removeItem("services", index)}>
                        <IoMdClose />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline btn-primary mt-2" onClick={() => addItem("services")}>
                    + Add Service
                  </button>
                </div>

                {/* Medications Section */}
                <div>
                  <label className="block font-medium">Medications</label>
                  {billingData.medications.map((medication, index) => (
                    <div key={index} className="flex gap-2 mt-2 items-center">
                      <input
                        type="text"
                        name="name"
                        placeholder="Medication Name"
                        value={medication.name}
                        onChange={(e) => handleInputChange("medications", index, e)}
                        className="input input-bordered w-1/2"
                        required
                      />
                      <input
                        type="number"
                        name="cost"
                        placeholder="Cost"
                        value={medication.cost}
                        onChange={(e) => handleInputChange("medications", index, e)}
                        className="input input-bordered w-1/2"
                        required
                      />
                      <button type="button" className="btn btn-sm btn-error" onClick={() => removeItem("medications", index)}>
                        <IoMdClose />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline btn-primary mt-2" onClick={() => addItem("medications")}>
                    + Add Medication
                  </button>
                </div>

                {/* Doctor's Tax */}
                <div>
                  <label className="block font-medium">PHIC</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={billingData.doctorTax}
                    onChange={(e) => setBillingData({ ...billingData, doctorTax: e.target.value })}
                    required
                  />
                </div>

                {/* Review & Submit Buttons */}
                <div className="modal-action">
                  <button type="submit" className="btn btn-info">Review Billing</button>
                  <button type="button" className="btn btn-error" onClick={() => document.getElementById('generate-billing-modal').close()}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* Final Billing Summary */
              <div>
                <h3 className="font-semibold text-lg mb-4">Final Billing Summary</h3>
                <p><b>Patient:</b> {billingData.patientName} (Age: {billingData.patientAge})</p>
                <p><b>Total Amount:</b> {formatCurrency(calculateTotal())}</p>

                <div className="modal-action">
                  <button type="button" className="btn btn-success" onClick={handleSubmitBilling}>
                    Confirm & Submit
                  </button>
                  <button type="button" className="btn btn-warning" onClick={() => setShowSummary(false)}>
                    Edit Billing
                  </button>
                </div>
              </div>
            )}
          </div>
        </dialog>

        {/* EDIT BILLING */}
        <dialog id="edit-billing-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-semibold text-lg mb-4">Edit Billing</h3>

        
            <form method="dialog" className="space-y-4" onSubmit={ () => document.getElementById('confirm-modal').showModal()}>
              {/* Patient Info */}
              <div>
                <label className="block font-medium">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  placeholder="Enter patient name"
                  value={selectedData?.patientName}
                  onChange={(e) => editHandleInputChange("patient", null, e)}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Patient Age</label>
                <input
                  type="number"
                  name="patientAge"
                  placeholder="Enter patient age"
                  value={selectedData?.patientAge}
                  onChange={(e) => editHandleInputChange("patient", null, e)}
                  className="input input-bordered w-full"
                  max={100}
                  min={1}
                  required
                />
              </div>

              {/* Discount Radio Buttons */}
              <div>
              <label className="block font-medium">Discounts</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discount"
                    value="senior"
                    checked={selectedData?.discount === "senior"}
                    onChange={(e) => setSelectedData({ ...selectedData, discount: e.target.value })}
                    className="radio radio-primary"
                  />
                  <span>Senior 20%</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discount"
                    value="pwd"
                    checked={selectedData?.discount === "pwd"}
                    onChange={(e) => setSelectedData({ ...selectedData, discount: e.target.value })}
                    className="radio radio-primary"
                  />
                  <span>PWD 20%</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discount"
                    value="Stake Holder"
                    checked={selectedData?.discount === "Stake Holder"}
                    onChange={(e) => setSelectedData({ ...selectedData, discount: e.target.value })}
                    className="radio radio-primary"
                  />
                  <span>Stake Holder 35%</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discount"
                    value="Stake Holder Dependent"
                    checked={selectedData?.discount === "Stake Holder Dependent"}
                    onChange={(e) => setSelectedData({ ...selectedData, discount: e.target.value })}
                    className="radio radio-primary"
                  />
                  <span>Stake Holder Indepdent 20%</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="discount"
                    value="none"
                    checked={selectedData?.discount === "none" || !selectedData?.discount}
                    onChange={(e) => setSelectedData({ ...selectedData, discount: e.target.value })}
                    className="radio radio-primary"
                  />
                  <span>None</span>
                </label>
              </div>
            </div>

              {/* Services Section */}
              <div>
                <label className="block font-medium">Services Provided</label>
                {selectedData?.services.map((service, index) => (
                  <div key={index} className="flex gap-2 mt-2 items-center">
                    <input
                      type="text"
                      name="name"
                      placeholder="Service Name"
                      value={service.name}
                      onChange={(e) => editHandleInputChange("services", index, e)}
                      className="input input-bordered w-1/2"
                      required
                    />
                    <input
                      type="number"
                      name="cost"
                      placeholder="Cost"
                      value={service.cost}
                      onChange={(e) => editHandleInputChange("services", index, e)}
                      className="input input-bordered w-1/2"
                      required
                    />
                    <button type="button" className="btn btn-sm btn-error" onClick={() => editRemoveItem("services", index)}>
                      <IoMdClose />
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline btn-primary mt-2" onClick={() => editAddItem("services")}>
                  + Add Service
                </button>
              </div>

              {/* Medications Section */}
              <div>
                <label className="block font-medium">Medications</label>
                {selectedData?.medications.map((medication, index) => (
                  <div key={index} className="flex gap-2 mt-2 items-center">
                    <input
                      type="text"
                      name="name"
                      placeholder="Medication Name"
                      value={medication.name}
                      onChange={(e) => editHandleInputChange("medications", index, e)}
                      className="input input-bordered w-1/2"
                      required
                    />
                    <input
                      type="number"
                      name="cost"
                      placeholder="Cost"
                      value={medication.cost}
                      onChange={(e) => editHandleInputChange("medications", index, e)}
                      className="input input-bordered w-1/2"
                      required
                    />
                    <button type="button" className="btn btn-sm btn-error" onClick={() => editRemoveItem("medications", index)}>
                      <IoMdClose />
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline btn-primary mt-2" onClick={() => editAddItem("medications")}>
                  + Add Medication
                </button>
              </div>

             {/* STATUS */}
              <label className="block font-semibold mb-2">Payment Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="Pending"
                    checked={selectedData?.paymentStatus === "Pending"}
                    onChange={(e) => editHandleInputChange("patient", null, e)}
                    className="radio"
                  />
                  Pending
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="Paid"
                    checked={selectedData?.paymentStatus === "Paid"}
                    onChange={(e) => editHandleInputChange("patient", null, e)}
                    className="radio"
                  />
                  Paid
                </label>
              </div>

              {/* Doctor's Tax */}
              <div>
                <label className="block font-medium">PHIC</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={selectedData?.doctorTax}
                  onChange={(e) => setSelectedData({ ...selectedData, doctorTax: e.target.value })}
                  required
                />
              </div>

              {/* Review & Submit Buttons */}
              <div className="modal-action">
                <button type="submit" className="btn btn-success">Save</button>
                <button type="button" className="btn btn-error" onClick={() => document.getElementById('edit-billing-modal').close()}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>

        {/* VIEW MODAL */}
        <dialog id="view-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Account Preview</h3>
            {selectedData && 
                <div className="py-4">
                <p><strong>Billing ID:</strong> {selectedData._id}</p>
                <p><strong>Patient Name:</strong> {selectedData.patientName}</p>
                <p><strong>Patient Age:</strong> {selectedData.patientAge}</p>
                <p><strong>Discount:</strong>
                { selectedData.discount === "senior" || selectedData.discount === "pwd" || selectedData.discount === "Stake Holder Dependent" ? ` ${selectedData.discount} (20%)` : selectedData.discount === "Stake Holder" ? ` ${selectedData.discount} (35%)` : selectedData.discount}</p>
                <p><strong>Services:</strong> { selectedData.services.map((items, index) => 
                  <span className="text-black" key={index}>[{items.name} ({formatCurrency(items.cost)})]</span>
                )}</p>
                <p><strong>Medication:</strong> { selectedData.medications.map((items, index) => 
                  <span className="text-black" key={index}>[{items.name} ({formatCurrency(items.cost)})]</span>
                )}</p>
                <p><strong>Doctor Tax:</strong> {selectedData.doctorTax}%</p>
                <p><strong>Tax Amount:</strong> {selectedData.taxAmount}%</p>
                <p><strong>Total Amount:</strong> {formatCurrency(selectedData.totalAmount)}</p>
                <p><strong>Payment Status:</strong> {selectedData.paymentStatus}</p>
                <p><strong>Created At:</strong> {selectedData.createdAt}</p>
              </div>
            }
            <div className="modal-action">
              <button onClick={() => document.getElementById('view-modal').close()} className="btn btn-primary">Close</button>
            </div>
          </div>
        </dialog>

        {isDownload && 
        <BillingModalPdf selectedData={selectedData} onClose={() => setIsDownload(false) } />
        }

        <ConfirmationModal onConfirm={onSubmitEdit} header={`Update Changes`} text={'Are you sure you want to update this record?'} />
    </div>
    
  )
}

export default Billing
