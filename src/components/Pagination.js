import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "./Pagination"; // assuming Pagination is in the same folder

function Outputs() {
  const [methods, setMethods] = useState([]);
  const [value, setValue] = useState("");
  const [output, setOutput] = useState("");
  const [editingMethod, setEditingMethod] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [updatedOutput, setUpdatedOutput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const getMethods = async (page = 0, size = 10) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/outputs/allOutputs?page=${page}&size=${size}`
      );
      setMethods(response.data.data || []);
      setTotalPages(response.data.totalPages); // Adjust this based on your response
    } catch (error) {
      console.error("Error fetching methods:", error);
    }
  };

  const addMethod = async (e) => {
    e.preventDefault();
    if (!output || !value) return;

    try {
      await axios.post(
        `http://localhost:8080/outputs/addOutput=${output}&total=${value}`
      );
      getMethods(currentPage);
      setValue("");
      setOutput("");
    } catch (error) {
      console.error("Error adding method:", error);
    }
  };

  const deleteMethod = async (e, id) => {
    e.preventDefault();

    try {
      await axios.delete(`http://localhost:8080/outputs/deleteOutput/${id}`);
      getMethods(currentPage);
    } catch (error) {
      console.error("Error deleting method:", error);
    }
  };

  const updateMethod = async (e, id) => {
    e.preventDefault();
    if (!updatedOutput || !updatedValue) return;

    try {
      await axios.put(
        `http://localhost:8080/outputs/updateOutput/${id}?value=${updatedValue}&total=${updatedOutput}`
      );
      setEditingMethod(null);
      setUpdatedOutput("");
      setUpdatedValue("");
      getMethods(currentPage);
    } catch (error) {
      console.error("Error updating method:", error);
    }
  };

  useEffect(() => {
    getMethods(currentPage);
  }, [currentPage]);

  return (
    <>
      <div style={{ padding: 15 }}>
        <div className="mb-3 d-flex align-items-center" dir="rtl">
          <button type="button" className="btn btn-success" onClick={addMethod}>
            <i className="fa-solid fa-check" style={{ marginLeft: 5 }}></i>
            اضافة
          </button>
          <input
            style={{ width: 500, margin: 10 }}
            type="text"
            className="form-control"
            placeholder="اضافة سبب"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          />
          <input
            style={{ width: 500, margin: 10 }}
            type="number"
            className="form-control"
            placeholder="اضافة مبلغ"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        {methods.length === 0 ? (
          <div className="alert alert-info" style={{ textAlign: "center" }} role="alert">
            لا توجد عمليات
          </div>
        ) : (
          <table className="table table-hover" dir="rtl">
            <thead>
              <tr>
                <th scope="col">العملية</th>
                <th scope="col">الكل</th>
                <th scope="col">اجراء</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((method) => (
                <tr key={method.id}>
                  <td>
                    {editingMethod === method.id ? (
                      <input
                        type="text"
                        className="form-control"
                        style={{ width: "300px" }}
                        value={updatedOutput}
                        onChange={(e) => setUpdatedOutput(e.target.value)}
                      />
                    ) : (
                      method.methodName
                    )}
                  </td>
                  <td>
                    {editingMethod === method.id ? (
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: "300px" }}
                        value={updatedValue}
                        onChange={(e) => setUpdatedValue(e.target.value)}
                      />
                    ) : (
                      method.total
                    )}
                  </td>
                  <td>
                    {editingMethod === method.id ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ color: "white", marginLeft: 10 }}
                        onClick={(e) => updateMethod(e, method.id)}
                      >
                        <i className="fa-solid fa-check" style={{ marginLeft: 5 }}></i>
                        حفظ
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-info"
                        style={{ color: "white", marginLeft: 10 }}
                        onClick={() => {
                          setEditingMethod(method.id);
                          setUpdatedOutput(method.output);
                          setUpdatedValue(method.value);
                        }}
                      >
                        <i className="fa fa-pen" style={{ marginLeft: 5 }}></i>
                        تعديل
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ marginLeft: "10px" }}
                      onClick={(e) => deleteMethod(e, method.id)}
                    >
                      <i className="fa fa-trash" style={{ marginLeft: 5 }}></i>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Pagination 
          currentPage={currentPage + 1} 
          totalPages={totalPages} 
          onPageChange={(page) => setCurrentPage(page - 1)} 
        />
      </div>
    </>
  );
}

export default Outputs;
