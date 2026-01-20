import fetch from 'node-fetch';

const testLogin = async () => {
  try {
    const response = await fetch('https://hybridx-uhj9.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin2@hybridx.com',
        password: 'admin123'
      })
    });

    const result = await response.json();
    console.log('🔍 Status:', response.status);
    console.log('📄 Response:', result);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testLogin();
