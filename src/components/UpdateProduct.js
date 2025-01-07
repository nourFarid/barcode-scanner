import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function ProductUpdate() {
  const navigate = useNavigate(); // For programmatic navigation
  const location = useLocation();
  const { product } = location.state || {};
  const { isInventory } = location.state || {};

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setPrice(product.price || '');
      setDiscount(product.discount || '');
      setDescription(product.description || '');
      setAmount(product.amount || '');
      setCode(product.code || '');
    }
  }, [product]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if(!isInventory){
        const response = await axios.put(`http://localhost:8080/products/updateProduct`, {
          id: product.id,
          name,
          price,
          discount,
          description,
          amount,
          code,
        });
        if (response.status === 200) {
          toast.success("تم تحديث المنتج");
          setTimeout(() => {
            navigate("/productList"); // Navigate to product list after success
          }, 1500); // Optional delay for toast message
        }
      }
      
      else{

        const response = await axios.put(`http://localhost:8080/inventoryProducts/updateProduct`, {
          id: product.id,
          name,
          price,
          discount,
          description,
          amount,
          code,
        });
        if (response.status === 200) {
          toast.success("تم تحديث المنتج");
          setTimeout(() => {
            navigate("/productList"); // Navigate to product list after success
          }, 1500); // Optional delay for toast message
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ اثناء تحديث المنتج");
    }
  };

  return (
    <>
      <div>
        <h2 style={{ textAlign: "center" }}>تعديل منتج</h2>
        {product ? (
          <div className="container" dir="rtl" style={{ margin: 20 }}>
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">الاسم</label>
              <input
                type="text"
                className="form-control"
                id="nameInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="priceInput" className="form-label">السعر</label>
              <input
                type="text"
                className="form-control"
                id="priceInput"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="discountInput" className="form-label">تخفيض</label>
              <input
                type="text"
                className="form-control"
                id="discountInput"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descriptionInput" className="form-label">وصف</label>
              <input
                type="text"
                className="form-control"
                id="descriptionInput"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="amountInput" className="form-label">كمية</label>
              <input
                type="text"
                className="form-control"
                id="amountInput"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="codeInput" className="form-label">كود</label>
              <input
                type="text"
                className="form-control"
                id="codeInput"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleUpdate}
            >
  <i class="fa-solid fa-check" style={{marginLeft:5}}></i>
  تعديل المنتج            </button>
          </div>
        ) : (
          <p>No product data available</p>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default ProductUpdate;
