import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/App.css';
import BarcodeScanner from './components/BarcodeScanner';
import ProductList from './components/ProductsList';
import Navbar from './components/Navbar';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
  const [isStarted, setIsStarted] = useState(false);
  const navigate = useNavigate();

  const handleStartClick = () => {
    setIsStarted(true);
    navigate('/soldProducts');  // Navigates to the "Total Sold" page
  };

  return (
    <div className="App">
      {isStarted && <Navbar />}  {/* Show the Navbar after clicking start */}
      
      {/* Video Background */}
      {!isStarted && (
        <div className="video-background">
          <video autoPlay muted loop className="background-video">
            <source src="/videos/6914060_Motion Graphics_Motion Graphic_1280x720.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Welcome Message and Start Button */}
          <div className="welcome-message">
            <h1>Welcome to HomeTech</h1>
            <p>Ready to see what you have?</p>
            <button onClick={handleStartClick} className="btn " style={{background:"#005AE3"}}>Start</button>
          </div>
        </div>
      )}

      <main>
        <Routes>
          <Route path="/totalMoney" element={<TotalMoneyPerDay />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/barcode" element={<BarcodeScanner />} />
          <Route path="/productList" element={<ProductList />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/soldProducts" element={<SoldProducts />} />
          <Route path="/search" element={<Search />} />
          <Route path="/updateProduct/:productId" element={<UpdateProduct />} />
          <Route path="/ProductSoldUpdate" element={<ProductSoldUpdate />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/addTransaction" element={<AddTransaction />} />
          <Route path="/transactionsMethods" element={<TransactionsMethods />} />
          <Route path="/addInventoryProduct" element={<AddInventoryProduct />} />
          <Route path="/outputs" element={<Outputs />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
