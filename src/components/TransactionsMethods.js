import axios from "axios";
import { useEffect, useState } from "react";

function TransactionsMethods() {
  const [methods, setMethods] = useState([]);
  const [addedMethod, setAddedMethod] = useState("");
  const [addedTotal, setAddedTotal] = useState("");
  const [editingMethod, setEditingMethod] = useState(null);
  const [updatedMethodName, setUpdatedMethodName] = useState("");
  const [updatedTotal, setUpdatedTotal] = useState("");

  const getMethods = async () => {
    try {
      const response = await axios.get("http://localhost:8080/transactionMethods/getAll");
      setMethods(response.data);
    } catch (error) {
      console.error("Error fetching methods:", error);
    }
  };

  const addMethod = async (e) => {
    e.preventDefault();
    if (!addedMethod || !addedTotal) return;

    try {
      await axios.post(
        `http://localhost:8080/transactionMethods/add?methodName=${addedMethod}&total=${addedTotal}`
      );
      getMethods();
      setAddedMethod("");
      setAddedTotal("");
    } catch (error) {
      console.error("Error adding method:", error);
    }
  };

  const deleteMethod = async (e, id) => {
    e.preventDefault();

    try {
      await axios.delete(`http://localhost:8080/transactionMethods/delete/${id}`);
      getMethods();
    } catch (error) {
      console.error("Error deleting method:", error);
    }
  };

  const updateMethod = async (e, id) => {
    e.preventDefault();
    if (!updatedMethodName || !updatedTotal) return;

    try {
      await axios.put(
        `http://localhost:8080/transactionMethods/update/${id}?methodName=${updatedMethodName}&total=${updatedTotal}`
      );
      setEditingMethod(null);
      setUpdatedMethodName("");
      setUpdatedTotal("");
      getMethods();
    } catch (error) {
      console.error("Error updating method:", error);
    }
  };

  useEffect(() => {
    getMethods();
  }, []);

  return (
    <div style={{ padding: 15 }}>
      <div className="mb-3 d-flex align-items-center" dir="rtl">
        <button
          type="button"
          className="btn btn-success"
          onClick={addMethod}
        >
          <i className="fa-solid fa-check" style={{ marginLeft: 5 }}></i>
          اضافة
        </button>
        <input
          style={{ width: 500, margin: 10 }}
          type="text"
          className="form-control"
          placeholder="اضافة عملية"
          value={addedMethod}
          onChange={(e) => setAddedMethod(e.target.value)}
        />
        <input
          style={{ width: 500, margin: 10 }}
          type="number"
          className="form-control"
          placeholder="اضافة مبلغ"
          value={addedTotal}
          onChange={(e) => setAddedTotal(e.target.value)}
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
                      value={updatedMethodName}
                      onChange={(e) => setUpdatedMethodName(e.target.value)}
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
                      value={updatedTotal}
                      onChange={(e) => setUpdatedTotal(e.target.value)}
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
                        setUpdatedMethodName(method.methodName);
                        setUpdatedTotal(method.total);
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
    </div>
  );
}

export default TransactionsMethods;
