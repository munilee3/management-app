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

  useEffect(() => {
    load();
  }, [id]);

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
    <div
      style={{
        maxWidth: '700px',
        margin: '40px auto',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fdfdfd',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#333',
        }}
      >
        Customer {customer.id}
      </h2>

      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <strong>Name:</strong> {customer.first_name} {customer.last_name}
        </div>
        <div>
          <strong>Phone:</strong> {customer.phone_number}
        </div>
      </div>

      <h3 style={{ marginBottom: '15px', color: '#444' }}>Addresses</h3>

      <AddressList
        addresses={customer.addresses}
        onDelete={handleDeleteAddress}
        onUpdate={handleUpdateAddress}
      />

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {showAdd ? (
          <div
            style={{
              padding: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              marginTop: '10px',
            }}
          >
            <AddressForm
              onSubmit={handleAddAddress}
              onCancel={() => setShowAdd(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#007bff',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Add Address
          </button>
        )}
      </div>
    </div>
  );
}