import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function AddTransaction() {
  const [total, setTotal] = useState("");
  const [revenue, setRevenue] = useState(0);
  // const [service, setService] = useState("");
  const [methodId, setMethodId] = useState(null);
  const [isDebit, setIsDebit] = useState(null);
  const [methods, setMethods] = useState([]);

  // Fetch all transaction methods on component mount
  useEffect(() => {
    const getAllMethods = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/transactionMethods/getAll`);
        setMethods(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch methods");
      }
    };
    getAllMethods();
  }, []);

  const addTransaction = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/transactions/add`, {
        total,
        revenue,
        // service,
        methodId,
        isDebit,
      });
      setTotal("");
      setRevenue("");
      // setService("");
      setMethodId(null);
      setIsDebit(null);
      toast.success("Transaction added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add transaction");
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>اضافة عملية</h1>

      <div className="container" dir="rtl" style={{ margin: 20 }}>
        {/* Total Input */}
        <div className="mb-3">
          <label htmlFor="totalInput" className="form-label">الكل</label>
          <input
            type="text"
            className="form-control"
            id="totalInput"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />
        </div>

        {/* Revenue Input */}
        <div className="mb-3">
          <label htmlFor="revenueInput" className="form-label">المكسب</label>
          <input
            type="text"
            className="form-control"
            id="revenueInput"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
          />
        </div>

        {/* Service Price Input */}
        {/* <div className="mb-3">
          <label htmlFor="serviceInput" className="form-label">سعر الخدمة</label>
          <input
            type="text"
            className="form-control"
            id="serviceInput"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
        </div> */}

        {/* Radio Buttons for isDebit */}
        <div className="mb-3">
          <label className="form-label">نوع العملية:</label>
          <div>
            <input
              type="radio"
              id="credit"
              name="transactionType"
              value="false"
              checked={isDebit === false}
              onChange={() => setIsDebit(false)}
            />
            <label htmlFor="credit" style={{ marginRight: 10, marginLeft:10 }}>تحويل</label>

            <input
              type="radio"
              id="debit"
              name="transactionType"
              value="true"
              checked={isDebit === true}
              onChange={() => setIsDebit(true)}
            />
            <label htmlFor="debit" style={{ marginRight: 10 , marginLeft:10}}>استقبال</label>
          </div>
        </div>

        {/* Dropdown for Methods */}
        <div className="mb-3">
          <label htmlFor="methodSelect" className="form-label">اختر الخدمة</label>
          <select
            id="methodSelect"
            className="form-select"
            value={methodId || ""}
            onChange={(e) => setMethodId(e.target.value)}
          >
            <option value="" disabled>اختر الخدمة</option>
            {methods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.methodName}
              </option>
            ))}
          </select>
        </div>

        {/* Add Transaction Button */}
        <button
          type="button"
          className="btn btn-success"
          onClick={addTransaction}
        >
          <i className="fa-solid fa-check" style={{ marginLeft: 5 }}></i>
          اضافة 
        </button>
      </div>

      <ToastContainer />
    </>
  );
}

export default AddTransaction;
