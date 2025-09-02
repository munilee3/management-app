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
    <form onSubmit={submit}>
      <div><label>First name</label><br /><input value={first_name} onChange={e => setFirstName(e.target.value)} /></div>
      <div><label>Last name</label><br /><input value={last_name} onChange={e => setLastName(e.target.value)} /></div>
      <div><label>Phone</label><br /><input value={phone_number} onChange={e => setPhoneNumber(e.target.value)} /></div>
      <div style={{ marginTop: 10 }}>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}
