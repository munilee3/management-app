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
      if (search.trim()) query.search = search.trim();
      const res = await customers.list(query);
      setData(res.data);
      setPagination(res.pagination || {});
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

  function goPage(p) {
    setParams({ page: p, limit });
  }


  return (
    <div>
      <h2>Customers</h2>
      <div style={{ marginBottom: 10 }}>
        <input placeholder="Search by name / phone" value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => fetchData()}>Search</button>
        <button onClick={() => { setSearch(''); setParams({ page: 1, limit }); }}>Clear</button>
      </div>
      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Phone</th><th>Address</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.first_name} {c.last_name}</td>
              <td>{c.phone_number}</td>
              <td>{c.address_summary}</td>
              <td>
                <Link to={`/customers/${c.id}`} style={{color: 'blue', textDecoration: "none"}}>View</Link> | <Link to={`/edit/${c.id}`} style={{color: 'blue', textDecoration: "none"}}>Edit</Link> | 
                <button type="button" style={{border: 'none', backgroundColor: "transparent", cursor: "pointer", color: "blue"}} onClick={async () => {handleDeleteCustomer(c.id)}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        <button disabled={pagination.page <= 1} onClick={() => goPage(pagination.page - 1)}>Prev</button>
        <span style={{ margin: '0 10px' }}>Page {pagination.page} / {Math.ceil((pagination.total || 0) / (pagination.limit || 1) || 1)}</span>
        <button disabled={(pagination.page * pagination.limit) >= (pagination.total || 0)} onClick={() => goPage((pagination.page || 1) + 1)}>Next</button>
      </div>
    </div>
  );
}
