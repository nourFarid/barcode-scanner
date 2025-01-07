import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import BarcodeScanner from './components/BarcodeScanner';
import ProductList from './components/ProductsList';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import TotalMoneyPerDay from './components/TotalMoneyPerDay';
import Categories from './components/Categories';
import AddProduct from './components/AddProduct';
import SoldProducts from './components/SoldProducts';
import Search from './components/Search';
import UpdateProduct from './components/UpdateProduct';
import ProductSoldUpdate from './components/UpdateSoldProduct';
import Transactions from './components/Transactions';
import AddTransaction from './components/AddTransaction';
import TransactionsMethods from './components/TransactionsMethods';
import AddInventoryProduct from './components/AddInventoryProduct';
import Outputs from './components/Outputs';


function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>


<Route
path='/'
element={<TotalMoneyPerDay></TotalMoneyPerDay>}
></Route>

<Route
path='/categories'
element={<Categories></Categories>}
></Route>
<Route
path='/barcode'
element={<BarcodeScanner></BarcodeScanner>}
></Route>
<Route
path='/productList'
element={<ProductList></ProductList>}
></Route>
<Route
path='/addProduct'
element={<AddProduct></AddProduct>}
></Route>

<Route
path='/soldProducts'
element={<SoldProducts></SoldProducts>}
></Route>

<Route
path='/search'
element={<Search></Search>}
></Route>

<Route
path='/updateProduct/:productId'
element={<UpdateProduct></UpdateProduct>}
>

</Route>

<Route
path='/ProductSoldUpdate'
element={<ProductSoldUpdate></ProductSoldUpdate>}
>

</Route>
<Route
path='/transactions'
element={<Transactions></Transactions>}
>

</Route>

<Route
path='/addTransaction'
element={<AddTransaction></AddTransaction>}
></Route>
<Route
path='/transactionsMethods'
element={<TransactionsMethods></TransactionsMethods>}
></Route>
<Route
path='/addInventoryProduct'
element={<AddInventoryProduct></AddInventoryProduct>}
></Route>

<Route
path='/outputs'
element={<Outputs></Outputs>}
></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
