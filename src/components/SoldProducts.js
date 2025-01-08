import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import GlobalResponse from'../globalResponse.json'

function SoldProducts() {
  const [soldProducts, setSoldProducts] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);  // New state for loading
  const itemsPerPage = 31;

  const navigate = useNavigate();

  const getSoldProducts = async (page = 1) => {
    setLoading(true);  // Start loading
    try {
      const response = await axios.get(
        `http://localhost:8080/getSoldProducts?page=${page - 1}&size=${itemsPerPage}`
      );
      setSoldProducts(response.data.data || []);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.log(error);
      toast.error(GlobalResponse.error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const addTotalMoneyPerDay = async (e, totalMoney) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("totalMoney", totalMoney);
    formData.append("source", "منتاجات مباعة");
    setLoading(true);  // Start loading
    try {
      await axios.post(`http://localhost:8080/totalMoneyPerDay/add`, formData);
      toast.success(GlobalResponse.add);
    } catch (error) {
      console.error("Error adding total money:", error);
      toast.error(GlobalResponse.error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const getSoldProductsByDate = async () => {
    setLoading(true);  // Start loading
    try {
      const response = await axios.get(
        `http://localhost:8080/getSoldProductsByDate?date=${selectedDate}`
      );
      setSoldProducts(response.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error(GlobalResponse.error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);  // Start loading
    try {
      await axios.delete(`http://localhost:8080/delete/${id}`);
      toast.success(GlobalResponse.delete);
      // Refresh the list after deletion
      getSoldProducts(currentPage);
    } catch (error) {
      console.log(error);
      toast.error(GlobalResponse.error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const handleUpdate = (product) => {
    // Navigate to the updateProduct page with the product as state
    navigate("/ProductSoldUpdate", { state: { product } });
  };

  useEffect(() => {
    getSoldProducts();
  }, []);

  useEffect(() => {
    if (selectedDate) getSoldProductsByDate();
  }, [selectedDate]);

  return (
    <>
      <div className="mb-3 d-flex align-items-center" dir="rtl">
        <button
          type="button"
          className="btn btn-success"
          style={{ margin: 10 }}
          onClick={(e) => {
            const totalPriceAfterDiscount = soldProducts.reduce(
              (sum, product) => sum + (product.price - product.discount),
              0
            );
            addTotalMoneyPerDay(e, totalPriceAfterDiscount);
          }}
        >
          <i class="fa-solid fa-wallet" style={{marginLeft:5}}></i>
          اضافة الي حصيلة اليوم
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
      ) : soldProducts.length === 0 ? (
        <div
          className="alert alert-info"
          style={{ textAlign: "center" }}
          role="alert"
        >
          لا توجد منتجات
        </div>
      ) : (
        <table className="table table-hover" dir="rtl">
          <thead>
            <tr>
              <th scope="col">التاريخ</th>
              <th scope="col">الاسم</th>
              <th scope="col">السعر</th>
              <th scope="col">الخصم</th>
              <th scope="col">السعر بعد الخصم</th>
              <th scope="col">وصف</th>
              <th scope="col">كمية</th>
              <th scope="col">باركود</th>
              <th scope="col">كود</th>
              <th scope="col">اجراء</th>
     
            </tr>
          </thead>
          <tbody>
            {soldProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.date}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.discount}</td>
                <td>{product.price - product.discount}</td>
                <td>{product.description}</td>
                <td>{product.amount}</td>
                <td>{product.barcode}</td>
                <td>{product.code}</td>
                <td>
                  <button
                    className="btn btn-info"
                    style={{ color: "white" ,marginLeft:10}}
                    onClick={() => handleUpdate(product)}
                  >
                     <i className="fa fa-pen" style={{ marginLeft: 5 }}></i> تعديل
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteProduct(product.id)}
                  >
                    

                 <i className="fa fa-trash"style={{ marginLeft: 5 }}></i> حذف

                  </button>
              
          
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => getSoldProducts(page)}
      />
      <ToastContainer />
    </>
  );
}

export default SoldProducts;
