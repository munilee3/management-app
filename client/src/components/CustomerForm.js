import React, { useEffect, useState } from 'react';

export default function CustomerForm({ initial, onSubmit }) {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone_number, setPhoneNumber] = useState('');

  useEffect(() => {
    if (initial) {
      setFirstName(initial.first_name || '');
      setLastName(initial.last_name || '');
      setPhoneNumber(initial.phone_number || '');
    }
  }, [initial]);

  function validate() {
    if (!first_name || !last_name || !phone_number) {
      return 'All fields required';
    }
    if (!/^\d{7,15}$/.test(phone_number)) return 'Phone must be digits (7-15)';
    return null;
  }

  function submit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);
    onSubmit({ first_name, last_name, phone_number });
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
          First Name
        </label>
        <input
          value={first_name}
          onChange={e => setFirstName(e.target.value)}
          placeholder="Enter first name"
          style={{
            padding: '8px 10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
          Last Name
        </label>
        <input
          value={last_name}
          onChange={e => setLastName(e.target.value)}
          placeholder="Enter last name"
          style={{
            padding: '8px 10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '5px', fontWeight: '500', color: '#333' }}>
          Phone
        </label>
        <input
          value={phone_number}
          onChange={e => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
          style={{
            padding: '8px 10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button
          type="submit"
          style={{
            padding: '10px 18px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '500',
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
}
