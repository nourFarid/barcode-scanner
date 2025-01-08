import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import GlobalResponse from'../globalResponse.json'

const BarcodeScanner = ({ onBarcodeScan }) => {
    const [barcode, setBarcode] = useState(null);
    const [product, setProduct] = useState(null);
    const webcamRef = useRef(null);

    // Capture image from the webcam
    const captureImage = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const formData = new FormData();
        formData.append("file", dataURLtoFile(imageSrc, "barcode.png"));
        try {
            const response = await axios.post(
                "http://localhost:8080/api/barcode/scan",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const scannedBarcode = response.data;
            setBarcode(scannedBarcode);

            if (onBarcodeScan) {
                onBarcodeScan(scannedBarcode);
            }
        } catch (error) {
            console.error("Error scanning barcode", error);
        }
    };

    const dataURLtoFile = (dataURL, filename) => {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);

        for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
        }

        return new File([u8arr], filename, { type: mime });
    };

    const getProductByBarcode = async () => {
        if (!barcode) return;

        try {
            const response = await axios.get(
                `http://localhost:8080/products/getProductByBarcode`,
                {
                    params: { barcode },
                }
            );

            setProduct(response.data.data);
        } catch (error) {
            console.error("Error retrieving product by barcode", error);
        }
    };

    useEffect(() => {
        if (barcode) {
            getProductByBarcode();
        }
    }, [barcode]);

    // Listen for Enter key press to trigger captureImage
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent default behavior of Enter key
                captureImage(); // Trigger capture image function
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Clean up the event listener
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{ width: "300px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
                />
                <button
                    className="btn btn-success"
                    onClick={captureImage}
                    style={{ margin: "10px" }}
                >
                    
التقاط        

<i class="fa-solid fa-camera" style={{marginRight:5}}></i>
        </button>

                {barcode && (
                    <p
                        style={{
                            marginTop: "10px",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                    >
                        Scanned Barcode: {barcode}
                    </p>
                )}
            </div>

            {product && (
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
                            <tr>
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
                                        className="btn btn-success"
                                        onClick={() => toast.success(GlobalResponse.add)}
                                    >
                                        +
                                    </button>
                                    <button
                                        style={{ margin: 3 }}
                                        className="btn btn-danger"
                                        onClick={() => toast.error(GlobalResponse.add)}
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <ToastContainer />
                </div>
            )}
        </>
    );
};

export default BarcodeScanner;
