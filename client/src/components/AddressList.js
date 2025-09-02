import React, { useState } from 'react';
import AddressForm from './AddressForm';

export default function AddressList({ addresses = [], onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div style={{ marginTop: '15px' }}>
      {addresses.length === 0 && (
        <div style={{ color: '#666', fontStyle: 'italic', marginBottom: '10px', textAlign: "center" }}>
          No addresses found.
        </div>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {addresses.map(a => (
          <li
            key={a.id}
            style={{
              marginBottom: '12px',
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            {editingId === a.id ? (
              <AddressForm
                initial={a}
                onSubmit={(payload) => {
                  onUpdate(a.id, payload);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '14px', color: '#333' }}>
                  <div style={{ fontWeight: '500' }}>{a.address_details}</div>
                  <div style={{ color: '#555' }}>
                    {a.city}, {a.state} - {a.pin_code}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditingId(a.id)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}