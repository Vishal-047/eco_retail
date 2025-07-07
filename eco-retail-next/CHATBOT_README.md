# 🌱 EcoBot - AI-Powered Sustainability Chatbot

A comprehensive eco-friendly chatbot that provides intelligent advice on sustainability, carbon footprint calculations, delivery impact analysis, and DIY waste projects.

## ✨ Features

### 🤖 Core Chatbot Features
- **AI-Powered Conversations**: Integrated with OpenAI GPT-3.5 for intelligent responses
- **Simple Mode**: Quick FAQ responses for common sustainability questions
- **Advanced Mode**: Full AI-powered conversations with context awareness
- **Real-time Typing Indicator**: Animated dots when the bot is thinking
- **Message Rating System**: Thumbs up/down feedback for bot responses
- **Conversation History**: Maintains context for personalized responses

### 🚚 Emission Calculations
- **Smart Detection**: Automatically detects emission calculation requests
- **Multiple Vehicle Types**: Bike, electric van, petrol van, diesel truck, cars
- **Real-time Calculations**: Instant CO₂ emission estimates
- **Comparison Charts**: Side-by-side vehicle emission comparisons
- **Eco-friendly Alternatives**: Suggests greener transportation options

### 💬 Quick Actions
- 🌱 **Eco Tips**: Daily sustainability advice
- 🚚 **Delivery Impact**: Transportation emission analysis
- ♻️ **DIY Projects**: Waste repurposing ideas
- 📊 **Carbon Footprint**: Product impact calculations

### 🏆 Community Features
- **DIY Project Sharing**: Upload and share creative waste projects
- **Project Categories**: Gardening, Wildlife, Home Decor, Storage
- **Like System**: Community voting on projects
- **Difficulty Levels**: Easy, Medium, Hard project classifications

### 🎯 Green Points System
- **Action Tracking**: Earn points for eco-friendly activities
- **Level System**: Progress through sustainability ranks
- **Leaderboard**: Compete with the community
- **Achievement Titles**: From "Eco Beginner" to "Eco Legend"
- **Recent Actions**: Track your sustainability journey

## 🛠️ Technical Implementation

### Frontend Components
- **ChatbotPage**: Main chat interface with mode switching
- **ChatMessage**: Individual message display with rating
- **TypingIndicator**: Animated loading indicator
- **CommunityDIY**: Project sharing and discovery
- **GreenPoints**: Points system and leaderboard

### Backend API
- **`/api/chat`**: Main chat endpoint with OpenAI integration
- **Emission Detection**: Keyword-based calculation triggers
- **FAQ System**: Simple mode responses
- **Context Management**: Conversation history handling

### Key Technologies
- **Next.js 15**: React framework with App Router
- **Material-UI**: Modern, accessible UI components
- **Gemini API**: Google's Gemini Pro for intelligent responses
- **TypeScript**: Type-safe development
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Gemini API key (optional, for advanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eco-retail-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Gemini API (optional - for advanced AI features)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Next.js Configuration
   NEXT_PUBLIC_APP_NAME=EcoBot
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the chatbot**
   Navigate to `http://localhost:3000/chatbot`

## 📱 Usage Guide

### Basic Chat
1. Type your sustainability question in the chat input
2. Press Enter or click the send button
3. Receive AI-powered eco-friendly advice

### Emission Calculations
Ask questions like:
- "How much CO₂ does a 30 km petrol van delivery emit?"
- "What's the carbon footprint of a 50 km electric car trip?"
- "Compare bike vs electric van for 20 km delivery"

### Quick Actions
Click on the quick action chips to instantly ask common questions:
- 🌱 Eco Tips
- 🚚 Delivery Impact  
- ♻️ DIY Projects
- 📊 Carbon Footprint

### Community Features
1. **Share DIY Projects**: Click "Share Your Project" button
2. **Browse Projects**: Filter by category (Gardening, Wildlife, etc.)
3. **Like Projects**: Give thumbs up to projects you like
4. **Track Points**: View your green points and community ranking

### Mode Switching
- **Simple Mode**: Fast FAQ responses for common questions
- **Advanced Mode**: Full AI conversations with detailed advice

## 🎨 Customization

### Adding New FAQ Responses
Edit the `faqResponses` object in `/src/app/api/chat/route.ts`:
```typescript
const faqResponses: { [key: string]: string } = {
  'your_keyword': 'Your eco-friendly response here...',
  // Add more responses
};
```

### Adding New Action Types
Extend the `actionTypes` object in `/src/components/GreenPoints.tsx`:
```typescript
const actionTypes = {
  'new_action': { 
    points: 10, 
    description: 'Description of action', 
    icon: <YourIcon /> 
  },
  // Add more action types
};
```

### Customizing Emission Data
Update the `emissionData` object in the API route:
```typescript
const emissionData = {
  your_vehicle: 0.5, // kg CO₂ per km
  // Add more vehicles
};
```

## 🔧 API Endpoints

### POST `/api/chat`
Handles chat messages and returns AI responses.

**Request Body:**
```json
{
  "message": "User's question",
  "conversationHistory": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ],
  "isAdvancedMode": true
}
```

**Response:**
```json
{
  "response": "AI-generated eco-friendly advice"
}
```

## 🌟 Advanced Features

### OpenAI Integration
- **System Prompt**: Customized for sustainability expertise
- **Context Management**: Maintains conversation history
- **Error Handling**: Graceful fallback to simple mode
- **Token Management**: Optimized for cost efficiency

### Emission Calculation Engine
- **Keyword Detection**: Smart parsing of distance and vehicle types
- **Real-time Processing**: Instant calculation responses
- **Comparative Analysis**: Multiple vehicle comparisons
- **Educational Content**: Eco-friendly alternatives

### Community Engagement
- **Project Moderation**: Structured project submission
- **Category System**: Organized content discovery
- **Social Features**: Like system and user avatars
- **Gamification**: Points and leaderboard system

## 🎯 Future Enhancements

### Planned Features
- **Image Upload**: Share DIY project photos
- **Voice Chat**: Speech-to-text integration
- **Multi-language Support**: International sustainability advice
- **Personalized Recommendations**: AI-driven eco tips
- **Integration with Climatiq API**: Real-time emission data
- **Firebase Integration**: Persistent user data and projects

### Advanced AI Features
- **Sentiment Analysis**: Emotional response to eco advice
- **Personalized Learning**: Adaptive conversation style
- **Predictive Suggestions**: Proactive eco recommendations
- **Voice Synthesis**: Text-to-speech responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Material-UI for the beautiful component library
- Next.js team for the excellent framework
- The sustainability community for inspiration

---

**Made with 🌱 for a greener future!** 