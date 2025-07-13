# 🌱 Green Delivery Options Feature

## Overview

The Green Delivery Options feature helps businesses optimize their delivery routes to minimize CO₂ emissions and reduce their carbon footprint. It uses Google's Distance Matrix API to calculate the most efficient route and Gemini AI to provide accurate CO₂ emission calculations and eco-friendly alternatives.

## 🚀 Features

### Core Functionality
- **Route Optimization**: Calculate the shortest and most efficient delivery route
- **CO₂ Emission Calculation**: Real-time carbon footprint analysis using Gemini AI
- **Eco-Friendly Alternatives**: Compare different transportation modes
- **Route Visualization**: Interactive Google Maps display with markers and polylines
- **Sustainability Tips**: AI-generated recommendations for greener delivery practices

### Technical Features
- Google Distance Matrix API integration
- Google Directions API for route visualization
- Gemini AI for intelligent CO₂ calculations
- Real-time emission comparisons
- Responsive Material-UI interface

## 🛠️ Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Google Maps API Key (Required)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Google Maps API Key for Frontend (Required)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Distance Matrix API**
   - **Directions API**
   - **Maps JavaScript API**
   - **Geocoding API**
4. Create API credentials:
   - Go to "Credentials" in the left sidebar
   - Click "Create Credentials" → "API Key"
   - Copy the API key
5. Restrict the API key (recommended):
   - Click on the created API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:3000/*` for development)
   - Under "API restrictions", select "Restrict key"
   - Select the APIs you enabled above

### 3. Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key to your environment variables

## 📁 File Structure

```
src/
├── app/
│   ├── delivery/
│   │   └── page.tsx                 # Main delivery page
│   └── api/
│       └── delivery-route/
│           └── route.ts             # API endpoint for route calculation
├── components/
│   └── RouteMap.tsx                 # Google Maps component
```

## 🔧 API Endpoints

### POST `/api/delivery-route`

Calculates the optimal delivery route and CO₂ emissions.

**Request Body:**
```json
{
  "from": "Mumbai Central, Mumbai",
  "to": "Bandra West, Mumbai"
}
```

**Response:**
```json
{
  "route": {
    "from": "Mumbai Central, Mumbai",
    "to": "Bandra West, Mumbai",
    "distance": "12.5 km",
    "duration": "25 mins",
    "distanceValue": 12500,
    "routePolyline": "encoded_polyline_string"
  },
  "emissions": {
    "co2_kg": 2.8,
    "emission_breakdown": {
      "fuel_consumption_l_per_100km": 10.5,
      "co2_per_liter": 2.3,
      "total_fuel_used_l": 1.31
    },
    "eco_alternatives": [
      {
        "vehicle": "Electric Van",
        "co2_kg": 0.5,
        "savings_percent": 82
      },
      {
        "vehicle": "Bicycle",
        "co2_kg": 0.1,
        "savings_percent": 96
      }
    ],
    "sustainability_tips": [
      "Consider using electric vehicles for deliveries",
      "Consolidate multiple deliveries into single trips",
      "Use local suppliers to reduce transportation distance"
    ]
  },
  "message": "This route minimizes emissions by reducing travel distance."
}
```

## 🎯 Usage Guide

### For Users

1. **Navigate to Delivery Page**: Go to `/delivery` in your application
2. **Enter Locations**: 
   - Fill in the "From" field with your warehouse/store location
   - Fill in the "To" field with the customer's delivery address
3. **Calculate Route**: Click "Calculate Route" to get the optimal path
4. **Review Results**:
   - View route details (distance, duration)
   - Check CO₂ emissions for the current route
   - Compare with eco-friendly alternatives
   - Explore the interactive map
   - Read sustainability tips

### For Developers

#### Adding the Feature to Navigation

Update your navigation component to include the delivery page:

```tsx
import { LocalShipping } from '@mui/icons-material';

// Add to your navigation items
{
  label: 'Green Delivery',
  href: '/delivery',
  icon: <LocalShipping />
}
```

#### Customizing the UI

The delivery page uses Material-UI components and can be easily customized:

```tsx
// Customize colors and styling
<Button
  variant="contained"
  sx={{
    backgroundColor: 'success.main',
    '&:hover': { backgroundColor: 'success.dark' }
  }}
>
  Calculate Route
</Button>
```

## 🔍 Troubleshooting

### Common Issues

1. **"Google Maps API key not configured"**
   - Ensure `GOOGLE_MAPS_API_KEY` is set in your environment variables
   - Verify the API key has the required APIs enabled

2. **"Gemini API key not configured"**
   - Ensure `GEMINI_API_KEY` is set in your environment variables
   - Check if the API key is valid and has proper permissions

3. **Map not loading**
   - Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
   - Check browser console for JavaScript errors
   - Ensure the Maps JavaScript API is enabled

4. **Route calculation fails**
   - Check if the addresses are valid and geocodable
   - Verify the Distance Matrix API is enabled
   - Check API quotas and billing

### API Quotas and Limits

- **Google Distance Matrix API**: 100,000 requests per day (free tier)
- **Google Directions API**: 2,500 requests per day (free tier)
- **Gemini API**: 15 requests per minute (free tier)

Monitor your usage in the Google Cloud Console to avoid hitting limits.

## 🚀 Future Enhancements

### Planned Features
- **Real-time Traffic Integration**: Consider current traffic conditions
- **Multi-stop Optimization**: Optimize routes with multiple delivery points
- **Weather Impact**: Factor in weather conditions on emissions
- **Carbon Credits**: Integration with carbon offset programs
- **Delivery Scheduling**: Optimize delivery times for minimal emissions

### Advanced Features
- **Machine Learning**: Predict optimal delivery times
- **Fleet Management**: Manage multiple delivery vehicles
- **Customer Preferences**: Allow customers to choose eco-friendly delivery options
- **Analytics Dashboard**: Track emission savings over time

## 📊 Emission Calculation Methodology

The system uses Gemini AI to calculate emissions based on:
- **Distance**: Actual route distance from Google Distance Matrix API
- **Vehicle Type**: Default petrol van with realistic consumption rates
- **Fuel Efficiency**: Industry-standard consumption rates (8-12L/100km)
- **Emission Factors**: Standard CO₂ per liter of fuel (2.3kg/L)

### Alternative Vehicle Emissions
- **Electric Van**: 0.05 kg CO₂/km (based on grid electricity)
- **Bicycle**: 0.01 kg CO₂/km (minimal human energy)
- **Electric Car**: 0.05 kg CO₂/km (grid electricity)

## 🤝 Contributing

To contribute to this feature:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This feature is part of the eco-retail-next project and follows the same license terms.

---

**Note**: This feature requires active internet connection and valid API keys to function properly. Ensure all API keys are properly configured and have sufficient quotas before deployment. 