import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { from, to } = await req.json();
  
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  if (!googleMapsApiKey) {
    return NextResponse.json({ error: 'Google Maps API key not configured.' }, { status: 500 });
  }
  
  if (!geminiApiKey) {
    return NextResponse.json({ error: 'Gemini API key not configured.' }, { status: 500 });
  }

  try {
    // Get route information from Google Distance Matrix API
    const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(to)}&key=${googleMapsApiKey}`;
    
    const distanceResponse = await fetch(distanceMatrixUrl);
    if (!distanceResponse.ok) {
      throw new Error(`Google Distance Matrix API error: ${distanceResponse.status}`);
    }
    
    const distanceData = await distanceResponse.json();
    
    if (distanceData.status !== 'OK') {
      throw new Error(`Google Distance Matrix API error: ${distanceData.status}`);
    }
    
    const element = distanceData.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      throw new Error('No route found between the specified locations');
    }
    
    const distance = element.distance.text;
    const duration = element.duration.text;
    const distanceValue = element.distance.value; // in meters
    
    // Calculate CO2 emissions using Gemini API
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
    
    const co2Prompt = `Calculate the CO2 emissions for a delivery route with the following details:
- Distance: ${distanceValue} meters (${(distanceValue / 1000).toFixed(2)} km)
- Duration: ${duration}
- Vehicle type: Delivery van (petrol)

Provide a JSON response with the following structure:
{
  "co2_kg": number,
  "emission_breakdown": {
    "fuel_consumption_l_per_100km": number,
    "co2_per_liter": number,
    "total_fuel_used_l": number
  },
  "eco_alternatives": [
    {
      "vehicle": string,
      "co2_kg": number,
      "savings_percent": number
    }
  ],
  "sustainability_tips": [string]
}

Use realistic values: petrol vans typically consume 8-12L/100km and emit ~2.3kg CO2 per liter. Include electric van, bicycle, and electric car as alternatives. Respond ONLY with the JSON object.`;

    const geminiResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: co2Prompt }
            ]
          }
        ]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    let co2Data = null;
    try {
      co2Data = JSON.parse(text);
    } catch (e) {
      const match = text && text.match(/\{[\s\S]*\}/);
      if (match) {
        co2Data = JSON.parse(match[0]);
      }
    }
    
    if (!co2Data) {
      throw new Error('Failed to parse CO2 calculation response');
    }

    // Get route visualization from Google Directions API
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&key=${googleMapsApiKey}`;
    
    const directionsResponse = await fetch(directionsUrl);
    const directionsData = await directionsResponse.json();
    
    let routePolyline = null;
    if (directionsData.status === 'OK' && directionsData.routes.length > 0) {
      routePolyline = directionsData.routes[0].overview_polyline.points;
    }

    return NextResponse.json({
      route: {
        from,
        to,
        distance,
        duration,
        distanceValue,
        routePolyline
      },
      emissions: co2Data,
      message: "This route minimizes emissions by reducing travel distance."
    });

  } catch (err: any) {
    return NextResponse.json({ 
      error: err.message || 'Failed to calculate delivery route.' 
    }, { status: 500 });
  }
} 