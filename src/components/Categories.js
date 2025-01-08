import axios from "axios";
import { useEffect, useState } from "react";
import GlobalResponse from'../globalResponse.json'
import { ToastContainer, toast } from "react-toastify";
function Categories() {
  const [categories, setCategories] = useState([]);
  const [addedCategory, setAddedCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  const getCategories = async () => {
    const response = await axios.get(`http://localhost:8080/getAllCategories`);
    setCategories(response.data.data);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:8080/addCategory`, { name: addedCategory });
    toast.success(GlobalResponse.add)
    getCategories();
    setAddedCategory("");
  };

  const deleteCategory = async (e, id) => {
    e.preventDefault();
    await axios.delete(`http://localhost:8080/deleteCategory/${id}`);
    toast.success(GlobalResponse.delete)
    getCategories();
  };

  const updateCategory = async (e, id) => {
    e.preventDefault();
    await axios.put(`http://localhost:8080/updateCategory/${id}`, { name: updatedCategoryName });
    toast.success(GlobalResponse.update)
    setEditingCategory(null);
    setUpdatedCategoryName("");
    getCategories();
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <div style={{ padding: 15 }}>
        <div className="mb-3 d-flex align-items-center" dir="rtl">
          <button
            type="button"
            className="btn btn-success"
            onClick={(e) => addCategory(e)}
          >
            <i class="fa-solid fa-check" style={{marginLeft:5}}></i>

            اضافة
          </button>

          <input
            style={{ width: 500, margin: 10 }}
            type="text"
            className="form-control"
            placeholder="اضافة نوع"
            value={addedCategory}
            onChange={(e) => setAddedCategory(e.target.value)}
          />
        </div>
      </div>

      {categories.length === 0 ? (
        <div
          className="alert alert-info"
          style={{ textAlign: "center" }}
          role="alert"
        >
          لا توجد انواع
        </div>
      ) : (
        <div>
          <table className="table table-hover" dir="rtl">
            <thead>
              <tr>
                <th scope="col">النوع</th>
                <th scope="col">اجراء</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {editingCategory === category.id ? (
                      <input
                        type="text"
                        className="form-control"
                        style={{ width: "300px" }}
                        value={updatedCategoryName}
                        onChange={(e) => setUpdatedCategoryName(e.target.value)}
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td>
                    {editingCategory === category.id ? (
                      <button
                        type="button"
                        style={{color:"white" , marginLeft:10}}
                        className="btn btn-primary"
                        onClick={(e) => updateCategory(e, category.id)}
                      >
                         <i class="fa-solid fa-check" style={{marginLeft:5}}></i>
                        حفظ
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-info"
                        style={{color:"white" , marginLeft:10}}
                        onClick={() => {
                          setEditingCategory(category.id);
                          setUpdatedCategoryName(category.name);
                        }}
                      >
                              <i className="fa fa-pen" style={{ marginLeft: 5 }}></i> تعديل

                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ marginLeft: "10px" }}
                      onClick={(e) => deleteCategory(e, category.id)}
                    >
                      <i className="fa fa-trash"  style={{ marginLeft: 5 }}></i> 
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                    <ToastContainer />
        </div>
      )}
    </>
  );
}

export default Categories;
