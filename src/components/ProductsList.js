
import axios from "axios"
import { useEffect,useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify";
import Pagination from "./Pagination";
function ProductList(){
 const[products,setProducts]= useState([])
 const[inventoryProducts,setInventoryProducts]= useState([])
 const[categories, setCategories]= useState([])
 const [activeView, setActiveView] = useState(""); // "" means no active view
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const[ isInventory,setIsInventory]= useState(false)
 const [productsInCategory,setProductsInCategory]= useState({})

 async function fetchProducts(page = 1) {
  try {
      const response = await axios.get(`http://localhost:8080/products/allProducts?page=${page - 1}&size=20`);
      setProducts(response.data.data || []);
      setTotalPages(response.data.totalPages);
  } catch (error) {
      console.error("Error fetching products:", error);
  }
}

const deleteProduct=async(id)=>{
  try {
    const response = await axios.delete(`http://localhost:8080/products/deleteProduct/${id}`)
    toast.success('تم حذف المنتج')
    fetchProducts(currentPage);
  } catch (error) {
console.log(error);
toast.error('خطأ اثناء حذف المنتج')

    
  }
}
const deleteInventoryProduct=async(id)=>{
  try {
    const response = await axios.delete(`http://localhost:8080/inventoryProducts/deleteProduct/${id}`)
    toast.success('تم حذف المنتج')
    fetchInventoryProducts(currentPage);
  } catch (error) {
console.log(error);
toast.error('خطأ اثناء حذف المنتج')

    
  }
}
async function fetchInventoryProducts(page = 1) {
  try {
      const response = await axios.get(`http://localhost:8080/inventoryProducts/allProducts?page=${page - 1}&size=20`);
      setInventoryProducts(response.data.data || []);
      setTotalPages(response.data.totalPages);
  } catch (error) {
      console.error("Error fetching inventory products:", error);
  }
}
const handlePageChange = (page) => {
  setCurrentPage(page);
  activeView === "shop" ? fetchProducts(page) : fetchInventoryProducts(page);
};

 const getCategories= async()=>{
      const response= await axios.get(`http://localhost:8080/getAllCategories`)
      setCategories(response.data.data||[])
      }

      const getProductsInCategory= async(id)=>{

        try {
          const response = await axios.post(`http://localhost:8080/products/getProductInCategory`,{

            "categoriesId":[id]
          })
          setProductsInCategory(response.data.data||[])
          setProducts(response.data.data||[])
       
        } catch (error) {
          toast.error('can not get products in category')
          
        }
      }
      const getInventoryProductsInCategory = async (id) => {
        try {
            const response = await axios.post(
                `http://localhost:8080/inventoryProducts/getProductInCategory`,
                { categoriesId: [id] }
            );
            const inventoryData = response.data.data || {}; // Ensure fallback
            setInventoryProducts(inventoryData.content || []); // Update only inventoryProducts
        } catch (error) {
            toast.error("Cannot fetch inventory products for this category");
            console.error("Error fetching inventory products:", error);
        }
    };
    
    
useEffect(()=>{
    fetchProducts()
    getCategories()
 }, []
)
        return(
            <>
<nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    {/* Button on the left */}
    <div className="d-flex">
      <Link
        to={`/addProduct`}
        type="button"
        className="btn btn-success"
        style={{ marginRight: "10px" }}
      >
        <i className="fa-solid fa-check" style={{ marginLeft: 5 }}></i>
        اضافة المنتج
      </Link>
    </div>

    {/* Navbar toggler for small screens */}
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

    {/* Tabs (links) on the right */}
    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a
            className="nav-link active"
            href="#"
            onClick={() => {
              setActiveView("inventory");
              fetchInventoryProducts();
            }}
          >
            مخزن
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link active"
            href="#"
            onClick={() => setActiveView("shop")}
          >
            محل
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>




{/* 
      <div style={{margin:10}}
dir="rtl"
><Link to={`/addProduct`} type="button" class="btn btn-success " >


<i class="fa-solid fa-check" style={{marginLeft:5}}></i>

اضافة المنتج


</Link></div> */}
{activeView=="shop"&&(

<div>

<div style={{ textAlign: "center", margin: "20px 0" }}>
{categories.map((category) => (
<button
type="button"
className="btn btn-outline-secondary"
dir="rtl"
style={{ margin: 5 }}
key={category.id}
onClick={() =>{
  
  getProductsInCategory(category.id)}}
>
{category.name}
</button>
))}
</div>

{products.length==0?<div class="alert alert-info" style={{textAlign:"center"}} role="alert">
لا توجد منتجات
</div>
:

<table class="table table-hover" dir="rtl">
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
<th scope="col">اجراء</th>
</tr>
</thead>
<tbody>
{    products.map((product,id)=>(

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
          type="button"
          style={{marginLeft:10}}
          className="btn btn-danger"
          onClick={(e) => {deleteProduct(product.id)}}
        >
        <i className="fa fa-trash"></i> حذف

        </button>
        <Link
to={`/updateProduct/${product.id}`}
type="button"
style={{ color: "white" }}
className="btn btn-info"
state={{ product }} // Passing product as state
>
<i className="fa fa-pen" style={{ marginRight: 5 }}></i> تعديل

</Link>
      </td>


</tr>)
)}


</tbody>
</table>}


</div>
)}
{activeView=="inventory"&&(
  

<div>

<div style={{ textAlign: "center", margin: "20px 0" }}>
{categories.map((category) => (
<button
type="button"
className="btn btn-outline-secondary"
dir="rtl"
style={{ margin: 5 }}
key={category.id}
onClick={() =>{
  
  getInventoryProductsInCategory(category.id)}}
>
{category.name}
</button>
))}
</div>
{inventoryProducts.length==0?<div class="alert alert-info" style={{textAlign:"center"}} role="alert">
لا توجد منتجات
</div>
:

<table class="table table-hover" dir="rtl">
<thead>
<tr>
<th scope="col">الاسم</th>
<th scope="col">السعر</th>
{/* <th scope="col">الخصم</th>
<th scope="col">السعر بعد الخصم</th> */}
<th scope="col">وصف</th>
<th scope="col">كمية</th>
<th scope="col">باركود</th>
<th scope="col">كود</th>
<th scope="col">اجراء</th>
</tr>
</thead>
<tbody>
{    inventoryProducts.map((product,id)=>(

<tr key={product.id}>
<td>{product.name}</td>
<td>{product.price}</td>
{/* <td>{product.discount}</td>
<td>{product.price - product.discount}</td> */}
<td>{product.description}</td>
<td>{product.amount}</td>
<td>{product.barcode}</td>
<td>{product.code}</td>
<td>
        <button
          type="button"
          style={{marginLeft:10}}
          className="btn btn-danger"
          onClick={(e) => {deleteInventoryProduct(product.id)}}

      
        >
        <i className="fa fa-trash"></i> حذف

        </button>
        <Link
to={`/updateProduct/${product.id}`}
type="button"
style={{ color: "white" }}
className="btn btn-info"
state={{ product,isInventory:true }} // Passing product as state
>
<i className="fa fa-pen" style={{ marginRight: 5 }}></i> تعديل

</Link>
      </td>


</tr>)
)}


</tbody>
</table>}


</div>
)}

{activeView === "shop" && products.length > 0 && (
    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
    />
)}

{activeView === "inventory" && inventoryProducts.length > 0 && (
    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
    />
)}

<ToastContainer></ToastContainer>
            </>            
        )

}
export default ProductList