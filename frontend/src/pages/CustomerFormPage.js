import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customers } from '../api';
import CustomerForm from '../components/CustomerForm';

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    if (id) {
      customers.get(id).then(r => setInitial(r.data)).catch(e => console.error(e));
    }
  }, [id]);

  async function handleSubmit(values) {
    try {
      if (id) {
        await customers.update(id, values);
        alert('Updated');
      } else {
        await customers.create(values);
        alert('Created');
      }
      navigate('/');
    } catch (e) {
      alert(e.error || 'Error');
    }
  }

  return (
    <div>
      <h2>{id ? 'Edit' : 'Create'} Customer</h2>
      <CustomerForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}
