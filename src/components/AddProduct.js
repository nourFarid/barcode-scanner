import axios from "axios";
import { useEffect, useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function AddProduct() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [barcode, setBarcode] = useState('');
    const [code, setCode] = useState('');
    const [categories, setCategories] = useState([]); // To store all available categories
    const [categoriesId, setCategoriesId] = useState([]); // To store selected category IDs
    const [isScannerActive, setIsScannerActive] = useState(false); // To toggle the barcode scanner
    const [isShop, setIsShopChecked] = useState(false); // State for Shop checkbox
    const [isInventory, setIsInventoryChecked] = useState(false); // State for Inventory checkbox
  

    // Callback function to update the barcode state
    const handleBarcodeScan = (scannedBarcode) => {
        setBarcode(scannedBarcode);
    };

    const getCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/getAllCategories`);
            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/products/addProduct`, {
                name,
                price,
                discount,
                description,
                amount,
                barcode,
                code,
                categoriesId,
                isShop,
                isInventory
            });

            // Show success toast
            toast.success("Product added successfully!");

            setName('');
            setPrice('');
            setDiscount('');
            setDescription('');
            setAmount('');
            setBarcode('');
            setCode('');
            setCategoriesId([]);
        } catch (error) {
            console.error("Error adding product:", error);

            // Show error toast
            toast.error("Failed to add product.");
        }
    };

    const handleCheckboxChange = (categoryId) => {
        setCategoriesId((prevCategoriesId) => {
            return prevCategoriesId.includes(categoryId)
                ? prevCategoriesId.filter((id) => id !== categoryId)
                : [...prevCategoriesId, categoryId];
        });
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <>
            <div className="container" dir="rtl" style={{ margin: 20 }}>
                {/* Barcode Scanner Toggle */}
                <div>
                    {isScannerActive ? (
                        <div>
                            <BarcodeScanner onBarcodeScan={handleBarcodeScan} />
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
                             <i class="fa-solid fa-check"></i>   فتح كاميرا المسح
                            </button>
                        </div>
                    )}
                </div>

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
                    <label htmlFor="barcodeInput" className="form-label">باركود</label>
                    <input
                        type="text"
                        className="form-control"
                        id="barcodeInput"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
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
                <div>
      {/* Styled Container for Checkboxes */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "20px", // Space between checkboxes
          marginBottom: "20px", // Space below the checkbox row
        }}
      >
        {/* Shop Checkbox */}
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="shopCheckbox"
            checked={isShop}
            onChange={() => setIsShopChecked((prev) => !prev)}
          />
          <label className="form-check-label" htmlFor="shopCheckbox">
            محل
          </label>
        </div>

        {/* Inventory Checkbox */}
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="inventoryCheckbox"
            checked={isInventory}
            onChange={() => setIsInventoryChecked((prev) => !prev)}
          />
          <label className="form-check-label" htmlFor="inventoryCheckbox">
            مخزن
          </label>
        </div>
      </div>


    </div>
                <div className="mb-3">
                    <label className="form-label">الأنواع</label>
                    <div>
                        {categories.map((category) => (
                            <div key={category.id} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`category-${category.id}`}
                                    checked={categoriesId.includes(category.id)}
                                    onChange={() => handleCheckboxChange(category.id)}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={`category-${category.id}`}
                                >
                                    {category.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={(e) => addProduct(e)}
                ><i class="fa-solid fa-check" style={{marginLeft:5}}></i>

                    اضافة المنتج
             
                </button>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </>
    );
}

export default AddProduct;
