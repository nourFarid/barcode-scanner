import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BarcodeScanner from "./BarcodeScanner";
import GlobalResponse from'../globalResponse.json'


function Search() {
  const [activeView, setActiveView] = useState(""); // "" means no active view
  const [searchProduct, setSearchProduct] = useState([]);
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const getProductByName = async () => {
    setIsLoading(true); // Show the loader
    try {
      const response = await axios.get(
        "http://localhost:8080/products/getProductByName",
        {
          params: { name: productName },
        }
      );
      setSearchProduct(response.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error(GlobalResponse.error);
    } finally {
      setIsLoading(false); // Hide the loader
    }
  };

  const getProductByCode = async () => {
    setIsLoading(true); // Show the loader
    try {
      const response = await axios.get(
        `http://localhost:8080/products/getProductByCode?code=${productCode}`
      );
      setSearchProduct(response.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error(GlobalResponse.error);
    } finally {
      setIsLoading(false); // Hide the loader
    }
  };

  const getProductByBarcode = async () => {
    setIsLoading(true); // Show the loader
    try {
      const response = await axios.get(
        "http://localhost:8080/products/getProductByBarcode",
        {
          params: { barcode: barcode },
        }
      );
      setSearchProduct(response.data.data ? [response.data.data] : []);
    } catch (error) {
      console.log(error);
      toast.error(GlobalResponse.error);
    } finally {
      setIsLoading(false); // Hide the loader
    }
  };

  const increaseAmount = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/products/increaseAmount/${id}`
      );
      setSearchProduct((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? { ...product, amount: response.data.data.amount }
            : product
        )
      );
      toast.success(GlobalResponse.add);
    } catch (error) {
      toast.error(GlobalResponse.error);
    }
  };

  const decreaseAmount = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/products/decreaseAmount/${id}`
      );
      setSearchProduct((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id
            ? { ...product, amount: response.data.data.amount }
            : product
        )
      );
      toast.success(GlobalResponse.add);
    } catch (error) {
      toast.error(GlobalResponse.error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/products/deleteProduct/${id}`);
      setSearchProduct((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      toast.success(GlobalResponse.delete);
    } catch (error) {
      toast.error(GlobalResponse.error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
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
                  onClick={() => setActiveView("scanner")}
                >
                  بحث باركود
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#"
                  onClick={() => setActiveView("search")}
                >
                  بحث اسم
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#"
                  onClick={() => setActiveView("code")}
                >
                  بحث كود
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {activeView === "scanner" && (
        <div>
          <nav dir="rtl" className="navbar bg-body-tertiary">
            <div className="container-fluid">
              <form
                className="d-flex"
                role="search"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="form-control me-2"
                  type="text"
                  placeholder="أو ادخل الباركود"
                  aria-label="Barcode"
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      getProductByBarcode();
                    }
                  }}
                />
                <button
                  className="btn btn-outline-success"
                  type="button"
                  style={{ margin: 5 }}
                  onClick={() => getProductByBarcode()}
                >
                  بحث
                </button>
              </form>
            </div>
          </nav>

          {isScannerActive ? (
            <div>
              <BarcodeScanner />
              <button
                className="btn btn-warning"
                onClick={() => setIsScannerActive(false)}
                style={{ margin: 10 }}
              >
                إيقاف المسح الضوئي
              </button>
            </div>
          ) : (
            <div>
              <button
                className="btn btn-success"
                onClick={() => setIsScannerActive(true)}
                style={{ margin: 10 }}
              >
                فتح كاميرا المسح
              </button>
            </div>
          )}
        </div>
      )}

      {activeView === "search" && (
        <nav dir="rtl" className="navbar bg-body-tertiary">
          <div className="container-fluid">
            <form
              className="d-flex"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="اسم المنتج"
                aria-label="Search"
                onChange={(e) => setProductName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    getProductByName();
                  }
                }}
              />
              <button
                className="btn btn-outline-success"
                type="button"
                style={{ margin: 5 }}
                onClick={() => getProductByName()}
              >
                بحث
              </button>
            </form>
          </div>
        </nav>
      )}

      {activeView === "code" && (
        <nav dir="rtl" className="navbar bg-body-tertiary">
          <div className="container-fluid">
            <form
              className="d-flex"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="كود المنتج"
                aria-label="Search"
                onChange={(e) => setProductCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    getProductByCode();
                  }
                }}
              />
              <button
                className="btn btn-outline-success"
                type="button"
                style={{ margin: 5 }}
                onClick={() => getProductByCode()}
              >
                بحث
              </button>
            </form>
          </div>
        </nav>
      )}

      {isLoading ? (
        <div className="text-center" style={{ marginTop: "20px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        searchProduct.length > 0 && (
          <div style={{ marginTop: "20px", width: "100%" }}>
            <table className="table table-hover" dir="rtl">
              <thead>
                <tr>
                  <th scope="col">الاسم</th>
                  <th scope="col">السعر</th>
                  <th scope="col">الخصم</th>
                  <th scope="col">السعر بعد الخصم</th>
                  <th scope="col">وصف</th>
                  <th scope="col">كمية</th>
                  <th scope="col">باركود</th>
                  <th scope="col">كود</th>
                  <th scope="col">التحكم</th>
                </tr>
              </thead>
              <tbody>
                {searchProduct.map((product) => (
                  <tr key={product.id}>
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
                        style={{ margin: 3 }}
                        type="button"
                        className="btn btn-success"
                        onClick={() => increaseAmount(product.id)}
                      >
                        زيادة الكمية
                      </button>

                      <button
                        style={{ margin: 3 }}
                        type="button"
                        className="btn btn-danger"
                        onClick={() => decreaseAmount(product.id)}
                      >
                        نقص الكمية
                      </button>

                      <Link
                        to={`/updateProduct/${product.id}`}
                        className="btn btn-info"
                        style={{ margin: 3, color: "white" }}
                        state={{ product }} 
                      >
                        تعديل
                      </Link>

                      <button
                        className="btn btn-danger"
                        style={{ margin: 3 }}
                        onClick={() => deleteProduct(product.id)}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <ToastContainer />
    </>
  );
}

export default Search;
