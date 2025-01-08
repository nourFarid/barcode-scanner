import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "./Pagination";
import GlobalResponse from'../globalResponse.json'

function Transactions() {
  const [activeView, setActiveView] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // State for date filter
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state
  const itemsPerPage = 31;

  const getAllTransactions = async (page = 0, size = itemsPerPage) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/transactions/getAll`, {
        params: { page, size },
      });
      setTransactions(response.data.data || []);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionsByDate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/transactions/getByDate`, {
        params: { date: selectedDate, page: currentPage, size: itemsPerPage },
      });
      setTransactions(response.data.data || []);
      setCurrentPage(response.data.currentPage || 0);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.log(error);
      toast.error(GlobalResponse.error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/transactions/delete/${id}`);
      toast.success(GlobalResponse.delete);
      getAllTransactions(currentPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getDebit = async (page = 0, size = itemsPerPage) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/transactions/getDebits`, {
        params: { page, size },
      });
      setTransactions(response.data.data || []);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCredit = async (page = 0, size = itemsPerPage) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/transactions/getCredits`, {
        params: { page, size },
      });
      setTransactions(response.data.data || []);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addTotalMoneyPerDay = async (e, totalMoney) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("totalMoney", totalMoney);
    formData.append("source", "المعاملات");
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/totalMoneyPerDay/add`, formData);
      toast.success(GlobalResponse.add);
    } catch (error) {
      console.error("Error adding total money:", error);
      toast.error(GlobalResponse.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      getTransactionsByDate();
    }
  }, [selectedDate]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
        <div className="d-flex">
      <Link
        to={`/addTransaction`}
        type="button"
        className="btn btn-success"
        style={{ marginRight: "10px" }}
      >
        <i className="fa-solid fa-check" style={{ marginLeft: 5 }}></i>
تحويل أو أستقبال      </Link>
    </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#"
                  onClick={() => {
                    setActiveView("credit");
                    getCredit();
                  }}
                >
                  تحويل
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#"
                  onClick={() => {
                    setActiveView("debit");
                    getDebit();
                  }}
                >
                  استقبال
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#"
                  onClick={() => {
                    setActiveView("all");
                    getAllTransactions();
                  }}
                >
                  الكل
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div dir="rtl" className="mb-3 d-flex align-items-center">
        <button
          type="button"
          className="btn btn-success"
          style={{ margin: 10 }}
          onClick={(e) => {
            const totalRevenue = transactions.reduce((sum, tx) => sum + tx.revenue, 0);
            addTotalMoneyPerDay(e, totalRevenue);
          }}
        >
          <i className="fa-solid fa-wallet" style={{ marginLeft: 5 }}></i> إضافة إلى الحصيلة اليومية
        </button>
        <input
          type="date"
          className="form-control"
          style={{ width: 200, margin: "0 10px" }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div
          className="alert alert-info"
          style={{ textAlign: "center" }}
          role="alert"
        >
          لا توجد معاملات
        </div>
      ) : (
        <table className="table table-hover" dir="rtl">
          <thead>
            <tr>
              <th scope="col">تاريخ</th>
              <th scope="col">تحويل أو استقبال</th>
              <th scope="col">الكلي</th>
              <th scope="col">المكسب</th>
              <th scope="col">اسم الخدمة</th>
              <th scope="col">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.isDebit ? "استقبال" : "تحويل"}</td>
                <td>{transaction.total}</td>
                <td>{transaction.revenue}</td>
                <td>{transaction.method.methodName}</td>
                <td>
                  <button
                    type="button"
                    style={{ marginLeft: 10 }}
                    className="btn btn-danger"
                    onClick={() => {
                      deleteTransaction(transaction.id);
                    }}
                  >
                    <i className="fa fa-trash"></i> حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination
        currentPage={currentPage + 1} // Offset by 1 for human-friendly UI
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page - 1); // Adjust for zero-based index
        
          if (activeView === "all") {
            getAllTransactions(page - 1);
          } else if (activeView === "debit") {
            getDebit(page - 1);
          } else if (activeView === "credit") {
            getCredit(page - 1);
          }
        }}
        
      />
      <ToastContainer />
    </>
  );
}

export default Transactions;
