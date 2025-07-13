// Test file for delivery route API
// This is a simple test to verify the API endpoint works

const testDeliveryRoute = async () => {
  const testData = {
    from: "Mumbai Central, Mumbai",
    to: "Bandra West, Mumbai"
  };

  try {
    const response = await fetch('/api/delivery-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return;
    }

    const data = await response.json();
    console.log('Delivery Route API Response:', data);
    
    // Verify response structure
    if (data.route && data.emissions && data.message) {
      console.log('✅ API Response structure is correct');
      console.log('📍 Route:', data.route);
      console.log('🌱 Emissions:', data.emissions);
      console.log('💬 Message:', data.message);
    } else {
      console.log('❌ API Response structure is incorrect');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testDeliveryRoute = testDeliveryRoute;
}

export default testDeliveryRoute; 