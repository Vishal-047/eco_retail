import { NextRequest, NextResponse } from 'next/server';
import { products as sharedProducts } from '../../../data/products';

// Keywords for detecting emission calculation requests
const emissionKeywords = ['km', 'kilometer', 'delivery', 'emit', 'co2', 'carbon', 'petrol', 'diesel', 'electric', 'bike', 'van', 'truck'];

// Simple emission data (in kg CO₂ per km)
const emissionData = {
  bike: 0.01,
  electric_van: 0.1,
  petrol_van: 0.3,
  diesel_truck: 0.8,
  electric_car: 0.05,
  petrol_car: 0.2
};

function detectEmissionRequest(message: string): { detected: boolean; distance?: number; vehicle?: string } {
  const lowerMessage = message.toLowerCase();
  
  // Check for emission-related keywords
  const hasEmissionKeywords = emissionKeywords.some(keyword => lowerMessage.includes(keyword));
  if (!hasEmissionKeywords) return { detected: false };
  
  // Extract distance
  const distanceMatch = lowerMessage.match(/(\d+)\s*(km|kilometer)/i);
  const distance = distanceMatch ? parseInt(distanceMatch[1]) : undefined;
  
  // Detect vehicle type
  let vehicle = 'petrol_van'; // default
  if (lowerMessage.includes('bike') || lowerMessage.includes('bicycle')) vehicle = 'bike';
  else if (lowerMessage.includes('electric') || lowerMessage.includes('ev')) vehicle = 'electric_van';
  else if (lowerMessage.includes('diesel')) vehicle = 'diesel_truck';
  else if (lowerMessage.includes('car')) vehicle = lowerMessage.includes('electric') ? 'electric_car' : 'petrol_car';
  
  return { detected: true, distance, vehicle };
}

function calculateEmission(distance: number, vehicle: string): string {
  const emissionPerKm = emissionData[vehicle as keyof typeof emissionData] || emissionData.petrol_van;
  const totalEmission = distance * emissionPerKm;
  
  const vehicleNames = {
    bike: 'bicycle',
    electric_van: 'electric van',
    petrol_van: 'petrol van',
    diesel_truck: 'diesel truck',
    electric_car: 'electric car',
    petrol_car: 'petrol car'
  };
  
  return `🚚 **Emission Calculation:**\n\nFor a ${distance} km ${vehicleNames[vehicle as keyof typeof vehicleNames]} delivery:\n• **${totalEmission.toFixed(1)} kg CO₂**\n\n💡 **Comparison:**\n${Object.entries(emissionData).map(([v, e]) => 
    `• ${vehicleNames[v as keyof typeof vehicleNames]}: ${(distance * e).toFixed(1)} kg CO₂`
  ).join('\n')}\n\n🌱 **Eco-friendly alternatives:**\n• Choose electric vehicles when possible\n• Consolidate deliveries\n• Use local suppliers\n• Consider bike delivery for short distances`;
}

async function getGeminiResponse(message: string, conversationHistory: any[], isAdvancedMode: boolean, languageInstruction = ''): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return "I'm sorry, but I'm not configured to use advanced AI features right now. Please try Simple Mode for basic eco-friendly advice!";
  }

  console.log('Gemini API Key configured:', !!process.env.GEMINI_API_KEY);
  console.log('API Key length:', process.env.GEMINI_API_KEY?.length);
  console.log('API Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10));
  console.log('API URL:', `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY?.substring(0, 10)}...`);

  try {
    const systemPrompt = `You are EcoBot, a friendly and knowledgeable sustainability advisor. Your role is to help users make eco-friendly choices and understand environmental impact.

Key areas of expertise:
- Product carbon footprint analysis
- Delivery and transportation emissions
- DIY waste reduction projects
- Sustainable living tips
- Eco-friendly product recommendations
- Packaging and waste management

Guidelines:
- Be encouraging and positive
- Provide practical, actionable advice
- Use emojis to make responses engaging
- Include specific examples when possible
- Suggest alternatives and improvements
- Keep responses concise but informative
- Focus on real-world applicability

Current conversation context: ${conversationHistory.length} previous messages${languageInstruction}`;

    // Prepare the request for Gemini
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nUser: ${message}\n\nPlease respond as EcoBot, providing helpful, eco-friendly advice.`
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    console.log('Making request to Gemini API...');
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later or use Simple Mode for instant responses.');
      } else if (response.status === 400) {
        throw new Error('Invalid request. Please check your Gemini API key configuration.');
      } else if (response.status === 404) {
        throw new Error('API endpoint not found. Please check your Gemini API key and ensure it has the correct permissions.');
      } else {
        throw new Error(`Gemini API error: ${response.status}. Please try Simple Mode for instant responses.`);
      }
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message || 'Unknown error'}`);
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return "I'm having trouble connecting to my advanced features right now. Please try Simple Mode for immediate help!";
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], language = 'en' } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Product-aware response logic
    const lowerMsg = message.toLowerCase();
    const foundProduct = sharedProducts.find(p => lowerMsg.includes(p.name.toLowerCase()));
    if (foundProduct) {
      // Find greener alternative
      const alternatives = sharedProducts.filter(
        (alt) => alt.category === foundProduct.category && alt.emissionLevel !== 'High' && alt.id !== foundProduct.id
      );
      let altText = '';
      if (alternatives.length > 0) {
        const bestAlt = alternatives.reduce((prev, curr) => (curr.emissions < prev.emissions ? curr : prev), alternatives[0]);
        const savings = Math.round(100 * (1 - bestAlt.emissions / foundProduct.emissions));
        altText = `\n\n🌿 Greener alternative: ${bestAlt.name} (${bestAlt.emissions} kg CO₂, ${savings}% fewer emissions)`;
      }
      const breakdown = foundProduct.breakdown
        ? `\n\nBreakdown:\n🏭 Manufacturing: ${foundProduct.breakdown.manufacturing} kg\n🚛 Transport: ${foundProduct.breakdown.transport} kg\n📦 Packaging: ${foundProduct.breakdown.packaging} kg`
        : '';
      const response = `Product: ${foundProduct.name}\nBrand: ${foundProduct.brand}\nCategory: ${foundProduct.category}\n\n🔥 Emissions: ${foundProduct.emissions} kg CO₂ (${foundProduct.emissionLevel})${breakdown}${altText}`;
      return NextResponse.json({ response });
    }

    // Add language instruction to the system prompt
    let languageInstruction = '';
    if (language === 'hi') {
      languageInstruction = '\n\nRespond ONLY in Hindi.';
    } else if (language === 'en') {
      languageInstruction = '\n\nRespond ONLY in English.';
    }

    // Patch getGeminiResponse to accept languageInstruction
    const response = await getGeminiResponse(
      message,
      conversationHistory,
      true,
      languageInstruction
    );

    return NextResponse.json({response: response.replace(/\*\*/g, '').replace(/\*/g, '')});
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 