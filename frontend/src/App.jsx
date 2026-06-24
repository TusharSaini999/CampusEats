import "./App.css";
import Header from "./component/Header";
import Navbar from "./component/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cart from "./pages/Cart";
import LoginSignup from "./pages/LoginSignup";
import Menu from "./pages/Menu";
import CustomerProfile from "./pages/CustomerProfile";
import DeliveryTrackingPage from "./pages/delivery";
import Castmertracking from "./pages/custmer";
import RestaurantDashboard from "./pages/RestaurantDashbaord";
import Chatbot from "./pages/Chatbot";
import DeliveryboyDashboard from "./pages/DeliveryboyDashboard";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import SearchResults from "./pages/SearchResults";
import OrderHistory from "./pages/order-histery";
import Owermenu from "./pages/vendor_menu";
import Orderaction from "./pages/order_dilivery";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/dashboard" element={<RestaurantDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/profile" element={<CustomerProfile />} />

          <Route path="/delivery/:customerId" element={<DeliveryTrackingPage />} />
          <Route path="/custmer/:deliveryid" element={<Castmertracking />} />
          <Route path="/delivery-boy-dashboard" element={<DeliveryboyDashboard />} />
          <Route path="/confirm-order" element={<PaymentConfirmation />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/menuvendoer" element={<Owermenu />} />
          <Route path="/order-dilivery/:orderId" element={<Orderaction />} />
        </Routes>
        <Chatbot />
      </Router>
    </>
  );
}

export default App;
