// test-lead.js - Test script for lead registration and email
const http = require('http');

const testData = {
  fullName: 'John Doe',
  email: 'john.doe@testcollege.com',
  mobilePhone: '+1234567890',
  collegeName: 'Test University',
  consent: true
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/leads/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing lead registration...');
console.log('Data to send:', testData);
console.log('Email should be sent to: arnavpranjal365@gmail.com');
console.log('---');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
    
    if (res.statusCode === 201) {
      console.log('✅ Lead registration successful!');
      console.log('📧 Check your email at arnavpranjal365@gmail.com');
      console.log('📋 Also check the server console for email preview URLs if using test mode');
    } else {
      console.log('❌ Lead registration failed');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
});

req.write(postData);
req.end(); 