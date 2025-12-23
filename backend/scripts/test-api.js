import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const base = process.env.API_URL || 'http://localhost:8080';

const run = async () => {
  try {
    console.log('Checking /health');
    const h = await axios.get(`${base}/health`);
    console.log('/health ->', h.data);

    console.log('Trying login with default user admin:123456');
    const login = await axios.post(`${base}/api/login`, { TenTaiKhoan: 'admin', MatKhau: '123456' });
    console.log('/api/login ->', login.data);

    const token = login.data.token;
    if (token) {
      console.log('Fetching products with token ...');
      const products = await axios.get(`${base}/api/products`, { headers: { Authorization: `Bearer ${token}` } });
      console.log('/api/products -> count:', products.data?.data?.length ?? 'no data');
    }
  } catch (err) {
    console.error('Test failed:', err.response?.data || err.message);
    process.exit(1);
  }
};

run();
