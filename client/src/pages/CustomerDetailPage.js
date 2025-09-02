import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { customers } from '../api';
import AddressList from '../components/AddressList';
import AddressForm from '../components/AddressForm';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  async function load() {
    try {
      const res = await customers.get(id);
      setCustomer(res.data);
    } catch (e) {
      console.error(e);
      alert(e.error || 'Error loading customer');
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleAddAddress(payload) {
    try {
      await customers.addresses.create(id, payload);
      setShowAdd(false);
      await load();
    } catch (e) {
      alert(e.error || 'Error');
    }
  }

  async function handleDeleteAddress(addressId) {
    if (!window.confirm('Delete address?')) return;
    try {
      await customers.addresses.remove(addressId);
      await load();
    } catch (e) {
      alert(e.error || 'Error');
    }
  }

  async function handleUpdateAddress(addressId, payload) {
    try {
      await customers.addresses.update(addressId, payload);
      await load();
    } catch (e) {
      alert(e.error || 'Error');
    }
  }

  if (!customer) return <div>Loading...</div>;

  return (
    <div>
      <h2>Customer {customer.id}</h2>
      <div><strong>Name:</strong> {customer.first_name} {customer.last_name}</div>
      <div><strong>Phone:</strong> {customer.phone_number}</div>

      <h3>Addresses</h3>
      <AddressList addresses={customer.addresses} onDelete={handleDeleteAddress} onUpdate={handleUpdateAddress} />
      <div style={{ marginTop: 10 }}>
        {showAdd ? (
          <div>
            <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAdd(false)} />
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)}>Add Address</button>
        )}
      </div>
    </div>
  );
}
