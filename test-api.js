// Simple test script to verify the API endpoint
const testData = {
  fullName: "Test User",
  email: "test@example.com",
  mobilePhone: "+919876543210"
};

console.log('Testing API with data:', testData);

fetch('http://localhost:3000/leads/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => {
  console.log('Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Error:', error);
}); 