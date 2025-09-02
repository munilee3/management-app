const express = require('express');
const cors = require('cors');
const { run, all, get, db } = require('./init_db');

const app = express();
app.use(cors({
    origin: 'https://management-app-1-fr9o.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());


function validateCustomerPayload(payload) {
  const { first_name, last_name, phone_number } = payload;
  if (!first_name || !last_name || !phone_number) {
    return 'first_name, last_name and phone_number are required';
  }
  if (!/^\d{10,12}$/.test(String(phone_number))) {
    return 'phone_number must be digits (10-12 chars)';
  }
  return null;
}
function validateAddressPayload(payload) {
  const { address_details, city, state, pin_code } = payload;
  if (!address_details || !city || !state || !pin_code) {
    return 'address_details, city, state and pin_code are required';
  }
  return null;
}

app.post('/api/customers', async (req, res) => {
  try {
    const err = validateCustomerPayload(req.body);
    if (err) return res.status(400).json({ error: err });
    
    const { first_name, last_name, phone_number } = req.body;
    const sql = `INSERT INTO customers (first_name, last_name, phone_number)
                 VALUES (?, ?, ?)`;
    const result = await run(sql, [first_name, last_name, phone_number]);
    const newCustomer = await get('SELECT * FROM customers WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Customer created', data: newCustomer });
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) {
      res.status(409).json({ error: 'phone_number already exists' });
    } else {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});


app.get('/api/customers', async (req, res) => {
  try {
    const {
      search,
      city,
      state,
      pin,
      page = 1,
      limit = 10,
      sort = 'id',
      order = 'asc'
    } = req.query;

    const offset = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);

    let whereClauses = [];
    let params = [];

    if (search) {
      whereClauses.push(`(
        c.first_name LIKE ? OR 
        c.last_name LIKE ? OR 
        c.phone_number LIKE ? OR 
        a.address_details LIKE ? OR 
        a.city LIKE ? OR 
        a.state LIKE ? OR 
        a.pin_code LIKE ?
      )`);
      params.push(
        `${search}`,
        `${search}`,
        `${search}`,
        `${search}`,
        `${search}`,
        `${search}`,
        `${search}`
      );
    }



    if (city) {
      whereClauses.push('a.city = ?');
      params.push(city);
    }
    if (state) {
      whereClauses.push('a.state = ?');
      params.push(state);
    }
    if (pin) {
      whereClauses.push('a.pin_code = ?');
      params.push(pin);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSQL = `
      SELECT COUNT(DISTINCT c.id) as total
      FROM customers c
      LEFT JOIN addresses a ON a.customer_id = c.id
      ${whereSQL}
    `;
    const totalRow = await get(countSQL, params);
    const total = totalRow ? totalRow.total : 0;

    const dataSQL = `
      SELECT 
        c.*,
        COUNT(a.id) as address_count,
        GROUP_CONCAT(a.city || ', ' || a.state || ' - ' || a.pin_code, '; ') as address_list
      FROM customers c
      LEFT JOIN addresses a ON a.customer_id = c.id
      ${whereSQL}
      GROUP BY c.id
      ORDER BY c.${['id','first_name','last_name','phone_number'].includes(sort) ? sort : 'id'} ${order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, parseInt(limit, 10), offset];

    let rows = await all(dataSQL, dataParams);

    rows = rows.map(r => {
      if (r.address_count === 0) {
        r.address_summary = "No address";
      } else if (r.address_count === 1) {
        r.address_summary = r.address_list;
      } else {
        r.address_summary = "Multiple addresses";
      }
      delete r.address_list;
      return r;
    });

    res.json({
      message: 'success',
      data: rows,
      pagination: { total, page: parseInt(page, 10), limit: parseInt(limit, 10) }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/customers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await get('SELECT * FROM customers WHERE id = ?', [id]);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const addresses = await all('SELECT * FROM addresses WHERE customer_id = ?', [id]);
    res.json({ message: 'success', data: { ...customer, addresses } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const err = validateCustomerPayload(req.body);
    if (err) return res.status(400).json({ error: err });

    const { first_name, last_name, phone_number } = req.body;

    const existing = await get('SELECT * FROM customers WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Customer not found' });

    const sql = `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?`;
    await run(sql, [first_name, last_name, phone_number, id]);
    const updated = await get('SELECT * FROM customers WHERE id = ?', [id]);
    res.json({ message: 'Customer updated', data: updated });
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) {
      res.status(409).json({ error: 'phone_number already exists' });
    } else {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await get('SELECT * FROM customers WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ error: 'Customer not found' });

    await run('DELETE FROM customers WHERE id = ?', [id]);
    res.json({ message: 'Customer deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/customers/:id/addresses', async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await get('SELECT * FROM customers WHERE id = ?', [customerId]);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const err = validateAddressPayload(req.body);
    if (err) return res.status(400).json({ error: err });

    const { address_details, city, state, pin_code } = req.body;
    const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`;
    const result = await run(sql, [customerId, address_details, city, state, pin_code]);
    const newAddress = await get('SELECT * FROM addresses WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Address added', data: newAddress });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/customers/:id/addresses', async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await get('SELECT * FROM customers WHERE id = ?', [customerId]);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const addresses = await all('SELECT * FROM addresses WHERE customer_id = ?', [customerId]);
    res.json({ message: 'success', data: addresses });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/addresses/:addressId', async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const err = validateAddressPayload(req.body);
    if (err) return res.status(400).json({ error: err });

    const existing = await get('SELECT * FROM addresses WHERE id = ?', [addressId]);
    if (!existing) return res.status(404).json({ error: 'Address not found' });

    const { address_details, city, state, pin_code } = req.body;
    await run(
      'UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?',
      [address_details, city, state, pin_code, addressId]
    );
    const updated = await get('SELECT * FROM addresses WHERE id = ?', [addressId]);
    res.json({ message: 'Address updated', data: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/addresses/:addressId', async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const existing = await get('SELECT * FROM addresses WHERE id = ?', [addressId]);
    if (!existing) return res.status(404).json({ error: 'Address not found' });

    await run('DELETE FROM addresses WHERE id = ?', [addressId]);
    res.json({ message: 'Address deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/customers-with-multiple-addresses', async (req, res) => {
  try {
    const rows = await all(`
      SELECT c.*, COUNT(a.id) as address_count
      FROM customers c
      LEFT JOIN addresses a ON a.customer_id = c.id
      GROUP BY c.id
      HAVING address_count > 1
    `);
    res.json({ message: 'success', data: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 5000;
app.get('/', (req, res) => {
  res.send('Customer Management API');
});
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
