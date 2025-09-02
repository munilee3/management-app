import React, { useState } from 'react';
import AddressForm from './AddressForm';

export default function AddressList({ addresses = [], onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div>
      {addresses.length === 0 && <div>No addresses found.</div>}
      <ul>
        {addresses.map(a => (
          <li key={a.id} style={{ marginBottom: 8 }}>
            {editingId === a.id ? (
              <AddressForm
                initial={a}
                onSubmit={(payload) => { onUpdate(a.id, payload); setEditingId(null); }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div>
                <div>{a.address_details}, {a.city}, {a.state} - {a.pin_code}</div>
                <div>
                  <button onClick={() => setEditingId(a.id)}>Edit</button>
                  <button onClick={() => onDelete(a.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
