import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import CampaignForm from "./components/CampaignForm";
import CampaignHistory from "./components/CampaignHistory";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthContext";
import Layout from "./components/Layout";
import CustomerUpload from "./components/CustomerUpload";
import Landing from './components/Landing'
import Customers from "./components/Customers";
import Settings from "./components/Settings";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route element={<PrivateRoute element={<Layout />} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CampaignForm />} />
            <Route path="/history" element={<CampaignHistory />} />
            <Route path="/upload" element={<CustomerUpload />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
