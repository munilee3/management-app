import { Routes, Route, Link } from 'react-router-dom';
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import CustomerDetailPage from './pages/CustomerDetailPage';

function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20, textAlign: "end" }}>
        <Link to="/" style={{textDecoration: "none", color: "blue", fontSize: "25px", fontWeight: "bold"}}>Customers</Link> | <Link to="/create" style={{textDecoration: "none", color: "blue", fontSize: "25px", fontWeight: "bold"}}>Create</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CustomerListPage />} />
        <Route path="/create" element={<CustomerFormPage />} />
        <Route path="/edit/:id" element={<CustomerFormPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
