import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { customers } from '../api.js';

export default function CustomerListPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [params, setParams] = useSearchParams();

  const page = params.get('page') || 1;
  const limit = params.get('limit') || 10;

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  async function fetchData() {
    try {
      const query = { page, limit };
      const res = await customers.list(query);
      setData(res.data);
      setPagination(res.pagination || {});
      return res.data;
    } catch (e) {
      console.log(e);
      alert(e.error || 'Error fetching customers');
    }
  }

  async function handleDeleteCustomer(id) {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customers.remove(id);
        fetchData();
      } catch (e) {
        console.log(e);
        alert(e.error || 'Error deleting customer');
      }
    }
  }

  async function filteredCustomerData() {
    const searchData = await fetchData();
    const filteredData = searchData.filter(customer => {
      return (
        customer.first_name.toLowerCase().includes(search.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone_number.includes(search) ||
        customer.address_summary.toUpperCase().includes(search.toUpperCase())
      );
    });
    setData(filteredData);
  }

  function goPage(p) {
    setParams({ page: p, limit });
  }

  const handleClear = () => {
    setSearch('');
    setParams({ page: 1, limit: 10 });
    fetchData();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#333', textAlign: "center" }}>Customers</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          placeholder="Search by name / phone / city / state / pin-code"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            flex: '1',
          }}
        />
        <button
          onClick={() => filteredCustomerData()}
          style={{
            padding: '8px 14px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
        <button
          onClick={() => handleClear()}
          style={{
            padding: '8px 14px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#6c757d',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>

      {data.length === 0 ? <div style={{textAlign: "center", marginTop: "10px"}}>No customers found.</div> : <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <thead style={{ backgroundColor: '#f8f9fa' }}>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Phone</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Address</th>
            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(customer => (
            <tr key={customer.id} style={{ textAlign: 'center' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {customer.first_name} {customer.last_name}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {customer.phone_number}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {customer.address_summary}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Link
                  to={`/customers/${customer.id}`}
                  style={{ color: '#007bff', textDecoration: 'none', marginRight: '8px' }}
                >
                  View
                </Link>
                |
                <Link
                  to={`/edit/${customer.id}`}
                  style={{ color: '#28a745', textDecoration: 'none', margin: '0 8px' }}
                >
                  Edit
                </Link>
                |
                <button
                  type="button"
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#dc3545',
                    marginLeft: '8px',
                  }}
                  onClick={async () => {
                    handleDeleteCustomer(customer.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      }

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <button
          disabled={pagination.page <= 1}
          onClick={() => goPage(pagination.page - 1)}
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            backgroundColor: pagination.page <= 1 ? '#e9ecef' : '#007bff',
            color: pagination.page <= 1 ? '#6c757d' : '#fff',
            cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Prev
        </button>
        <span style={{ margin: '0 10px', fontWeight: '500' }}>
          Page {pagination.page} /{' '}
          {Math.ceil((pagination.total || 0) / (pagination.limit || 1) || 1)}
        </span>
        <button
          disabled={pagination.page * pagination.limit >= (pagination.total || 0)}
          onClick={() => goPage((pagination.page || 1) + 1)}
          style={{
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            backgroundColor:
              pagination.page * pagination.limit >= (pagination.total || 0)
                ? '#e9ecef'
                : '#007bff',
            color:
              pagination.page * pagination.limit >= (pagination.total || 0)
                ? '#6c757d'
                : '#fff',
            cursor:
              pagination.page * pagination.limit >= (pagination.total || 0)
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}