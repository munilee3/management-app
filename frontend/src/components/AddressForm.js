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
    if (!address_details || !city || !stateVal || !pin_code) return alert('All fields required');
    onSubmit({ address_details, city, state: stateVal, pin_code });
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 8 }}>
      <div><input placeholder="Address details" value={address_details} onChange={e => setAddressDetails(e.target.value)} /></div>
      <div><input placeholder="City" value={city} onChange={e => setCity(e.target.value)} /></div>
      <div><input placeholder="State" value={stateVal} onChange={e => setStateVal(e.target.value)} /></div>
      <div><input placeholder="Pin code" value={pin_code} onChange={e => setPinCode(e.target.value)} /></div>
      <div style={{ marginTop: 6 }}>
        <button type="submit">Save</button> <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
