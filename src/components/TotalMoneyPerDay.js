import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import GlobalResponse from'../globalResponse.json'
import { toast, ToastContainer } from "react-toastify";

function TotalMoneyPerDay() {
  const [totalMoney, setTotalMoney] = useState([]);
  const [totalMoneyByDay, setTotalMoneyByDay] = useState([]);
  const [addMoney, setAddMoney] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isDay, setIsDay] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    currentPageAll: 0,
    totalPages: 0,
    totalPagesAll: 0,
  });
  const [loading, setLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [updatedMoney, setUpdatedMoney] = useState("");
  const pageSize = 31;

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page - 1 }));
  };

  const handlePageChangeAll = (page) => {
    setPagination((prev) => ({ ...prev, currentPageAll: page - 1 }));
  };

  const fetchData = async (endpoint, params, setData, updateTotalPages) => {
    setLoading(true);
    try {
      const response = await axios.get(endpoint, { params });
      setData(response.data.data || []);
      updateTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalMoneyPerDay = () => {
    fetchData(
      "http://localhost:8080/totalMoneyPerDay/getAllTotalMoney",
      { page: pagination.currentPageAll, size: pageSize },
      setTotalMoney,
      (pages) => setPagination((prev) => ({ ...prev, totalPagesAll: pages }))
    );
  };

  const totalMoneyPerDayByDate = () => {
    if (selectedDate) {
      fetchData(
        "http://localhost:8080/totalMoneyPerDay/getByDate",
        { date: selectedDate, page: pagination.currentPage, size: pageSize },
        setTotalMoneyByDay,
        (pages) => setPagination((prev) => ({ ...prev, totalPages: pages }))
      );
      setIsDay(true);
    }
  };

  const addTotalMoneyPerDay = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("totalMoney", addMoney);
    try {
      await axios.post("http://localhost:8080/totalMoneyPerDay/add", formData);
      setAddMoney("");
      isDay ? totalMoneyPerDayByDate() : getTotalMoneyPerDay();
      toast.success(GlobalResponse.add)
    } catch (error) {
      console.error("Error adding total money:", error);
    }
  };

  const deleteTotalMoneyPerDay = async (e, id) => {
    e.preventDefault();
    try {
      await axios.delete(`http://localhost:8080/totalMoneyPerDay/delete/${id}`);
      isDay ? totalMoneyPerDayByDate() : getTotalMoneyPerDay();
      toast.success(GlobalResponse.delete)
    } catch (error) {
      console.error("Error deleting total money:", error);
    }
  };

  const updateTotalMoney = async (e, id) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/totalMoneyPerDay/update/${id}?totalMoney=${updatedMoney}`);
      setEditingRow(null);
      setUpdatedMoney("");
      isDay ? totalMoneyPerDayByDate() : getTotalMoneyPerDay();
      toast.success(GlobalResponse.update)
    } catch (error) {
      console.error("Error updating total money:", error);
    }
  };

  useEffect(() => {
    getTotalMoneyPerDay();
  }, [pagination.currentPageAll]);

  useEffect(() => {
    if (selectedDate) {
      totalMoneyPerDayByDate();
    }
  }, [selectedDate, pagination.currentPage]);

  const renderTable = (data) => (
    <table dir="rtl" className="table table-hover">
      <thead>
        <tr>
          <th>التاريخ</th>
          <th>المصدر</th>
          <th>الكل</th>
          <th>إجراء</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.date}</td>
            <td>{item.source}</td>
            <td>
              {editingRow === item.id ? (
                <input
                  type="text"
                  className="form-control"
                  value={updatedMoney}
                  onChange={(e) => setUpdatedMoney(e.target.value)}
                  style={{ width: "100px" }}
                />
              ) : (
                item.totalMoney
              )}
            </td>
            <td>
              {editingRow === item.id ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{color:'white', marginLeft:10}}
                  onClick={(e) => updateTotalMoney(e, item.id)}
                >
                   <i class="fa-solid fa-check" style={{marginLeft:5}}></i>
                  حفظ
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-info"
style={{color:'white', marginLeft:10}}
                  onClick={() => {
                    setEditingRow(item.id);
                    setUpdatedMoney(item.totalMoney);
                  }}
                > 
                <i class="fa-solid fa-pen" style={{marginLeft:5}}></i>
                  تعديل
                </button>
              )}
              <button
                type="button"
                className="btn btn-danger"
                style={{ marginLeft: "10px" }}
                onClick={(e) => deleteTotalMoneyPerDay(e, item.id)}
              >
                             <i class="fa-solid fa-trash" style={{marginLeft:5}}></i>
   
                حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <div style={{ padding: 15 }}>
        <div className="mb-3 d-flex align-items-center" dir="rtl">
          <button
            type="button"
            className="btn btn-success"
            onClick={(e) => addTotalMoneyPerDay(e)}
          >
                            <i class="fa-solid fa-check" style={{marginLeft:5}}></i>

            اضافة
          </button>
          <input
            style={{ width: 500, margin: 10 }}
            type="text"
            className="form-control"
            placeholder="اضافة مبلغ"
            value={addMoney}
            onChange={(e) => setAddMoney(e.target.value)}
          />
          <input
            type="date"
            className="form-control"
            style={{ width: 200, margin: "0 10px" }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        {loading ? (
          <div className="text-center mt-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">جار التحميل...</span>
            </div>
            <div>جار التحميل...</div>
          </div>
        ) : isDay ? (
          totalMoneyByDay.length > 0 ? (
            <>
              {renderTable(totalMoneyByDay)}
              <Pagination
                currentPage={pagination.currentPage + 1}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div
              className="alert alert-info"
              style={{ textAlign: "center" }}
              role="alert"
            >
              لا توجد بيانات
            </div>
          )
        ) : totalMoney.length > 0 ? (
          <>
            {renderTable(totalMoney)}
            <Pagination
              currentPage={pagination.currentPageAll + 1}
              totalPages={pagination.totalPagesAll}
              onPageChange={handlePageChangeAll}
            />
          </>
        ) : (
          <div
            className="alert alert-info"
            style={{ textAlign: "center" }}
            role="alert"
          >
            لا توجد بيانات
          </div>
        )}
        <ToastContainer></ToastContainer>
      </div>
    </>
  );
}

export default TotalMoneyPerDay;
