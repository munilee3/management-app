import React, { useEffect, useState } from 'react';

export default function AddressForm({ initial, onSubmit, onCancel }) {
  const [address_details, setAddressDetails] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [pin_code, setPinCode] = useState('');

  useEffect(() => {
    if (initial) {
      setAddressDetails(initial.address_details || '');
      setCity(initial.city || '');
      setStateVal(initial.state || '');
      setPinCode(initial.pin_code || '');
    }
  }, [initial]);

  function submit(e) {
    e.preventDefault();
    if (!address_details || !city || !stateVal || !pin_code)
      return alert('All fields required');
    onSubmit({ address_details, city, state: stateVal, pin_code });
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        margin: '10px auto',
      }}
    >
      <input
        placeholder="Address details"
        value={address_details}
        onChange={(e) => setAddressDetails(e.target.value)}
        style={{
          padding: '8px 10px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />

      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          padding: '8px 10px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />

      <input
        placeholder="State"
        value={stateVal}
        onChange={(e) => setStateVal(e.target.value)}
        style={{
          padding: '8px 10px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />

      <input
        placeholder="Pin code"
        value={pin_code}
        onChange={(e) => setPinCode(e.target.value)}
        style={{
          padding: '8px 10px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />

      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#28a745',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '8px',
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
