import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "./Pagination";

function Outputs() {
  const [allOutputs, setAllOutputs] = useState([]);
  const [value, setValue] = useState("");
  const [output, setOutput] = useState("");
  const [editedOutput, setEditedOutput] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [updatedOutput, setUpdatedOutput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const getAllOutputs = async (page = 0, size = itemsPerPage) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/outputs/allOutputs", {
        params: { page, size },
      });
      setAllOutputs(response.data.data || []);
      setCurrentPage(response.data.currentPage || 0);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      toast.error("Error fetching outputs");
    } finally {
      setLoading(false);
    }
  };

  const addOutput = async (e) => {
    e.preventDefault();
    if (!output || !value) return;
    try {
      await axios.post(`http://localhost:8080/outputs/addOutput`, null, {
        params: { output, value },
      });
      toast.success("Output added successfully");
      getAllOutputs(currentPage);
      setValue("");
      setOutput("");
    } catch (error) {
      toast.error("Error adding output");
    }
  };

  const deleteOutput = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/outputs/deleteOutput/${id}`);
      toast.success("Output deleted successfully");
      getAllOutputs(currentPage);
    } catch (error) {
      toast.error("Error deleting output");
    } finally {
      setLoading(false);
    }
  };

  const updateOutput = async (e, id) => {
    e.preventDefault();
    if (!updatedOutput || !updatedValue) return;
    try {
      await axios.put(
        `http://localhost:8080/outputs/updateOutput/${id}`,
        null,
        { params: { value: updatedValue, output: updatedOutput } }
      );
      toast.success("Output updated successfully");
      setEditedOutput(null);
      setUpdatedOutput("");
      setUpdatedValue("");
      getAllOutputs(currentPage);
    } catch (error) {
      toast.error("Error updating output");
    }
  };

  useEffect(() => {
    getAllOutputs();
  }, []);

  return (
    <>
      <div style={{ padding: 15 }}>
        <div className="mb-3 d-flex align-items-center" dir="rtl">
          <button
            type="button"
            className="btn btn-success"
            onClick={addOutput}
          >
            <i className="fa-solid fa-check" style={{ marginLeft: 5 }}></i>
            إضافة
          </button>
          <input
            style={{ width: 300, margin: 10 }}
            type="text"
            className="form-control"
            placeholder="إضافة السبب"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          />
          <input
            style={{ width: 200, margin: 10 }}
            type="number"
            className="form-control"
            placeholder="إضافة القيمة"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : allOutputs.length === 0 ? (
          <div
            className="alert alert-info"
            style={{ textAlign: "center" }}
            role="alert"
          >
            لا توجد عمليات
          </div>
        ) : (
          <table className="table table-hover" dir="rtl">
            <thead>
              <tr>
                <th scope="col">العملية</th>
                <th scope="col">القيمة</th>
                <th scope="col">التاريخ</th>
                <th scope="col">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {allOutputs.map((output) => (
                <tr key={output.id}>
                  <td>
                    {editedOutput === output.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={updatedOutput}
                        onChange={(e) => setUpdatedOutput(e.target.value)}
                      />
                    ) : (
                      output.output
                    )}
                  </td>
                  <td>
                    {editedOutput === output.id ? (
                      <input
                        type="number"
                        className="form-control"
                        value={updatedValue}
                        onChange={(e) => setUpdatedValue(e.target.value)}
                      />
                    ) : (
                      output.value
                    )}
                  </td>
                  <td>{output.date}</td>
                  <td>
                    {editedOutput === output.id ? (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => updateOutput(e, output.id)}
                      >
                        <i className="fa fa-check" style={{ marginLeft: 5 }}></i>
                        حفظ
                      </button>
                    ) : (
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          setEditedOutput(output.id);
                          setUpdatedOutput(output.output);
                          setUpdatedValue(output.value);
                        }}
                      >
                        <i className="fa fa-pen" style={{ marginLeft: 5 }}></i>
                        تعديل
                      </button>
                    )}
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteOutput(output.id)}
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
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page - 1);
            getAllOutputs(page - 1);
          }}
        />
      </div>
      <ToastContainer />
    </>
  );
}

export default Outputs;
