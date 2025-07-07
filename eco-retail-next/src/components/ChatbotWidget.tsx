import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Fade,
  Snackbar,
  Alert,
  Grow,
  Zoom,
  Slide,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Send as SendIcon,
  Park as EcoIcon,
  AutoAwesome as SparkleIcon,
  Psychology as BrainIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

// Add Message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Add ChatbotWidgetProps type
interface ChatbotWidgetProps {
  minimal?: boolean;
  onClose?: () => void;
}

const ChatbotWidget = ({ minimal = false, onClose }: ChatbotWidgetProps) => {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm EcoBot 🌱, your sustainability advisor. I can help you with eco-friendly tips, carbon footprint calculations, delivery impact analysis, and DIY waste projects. What would you like to know?",
      sender: 'bot',
      timestamp: new Date('2024-01-01T00:00:00Z')
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          language,
        }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!mounted) {
    return (
      <Box sx={{ py: 4, minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 400 }}>
        <Typography>Loading EcoBot...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      maxWidth: { xs: '100%', sm: 420 },
      width: { xs: '100%', sm: '100%' },
      minWidth: 320,
      height: { xs: 'calc(100dvh - 32px)', sm: 'calc(100dvh - 48px)' }, // Add gap at bottom
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: minimal ? 'transparent' : 'background.default',
      borderRadius: minimal ? 0 : 4,
      boxShadow: minimal ? 0 : 6,
      p: 0,
      overflow: 'hidden',
      boxSizing: 'border-box',
      position: 'relative',
    }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, background: 'linear-gradient(90deg, #43a047 0%, #66bb6a 100%)', color: 'white' }}>
        <Avatar sx={{ bgcolor: 'white', color: 'success.main', width: 44, height: 44, mr: 2 }}>
          <EcoIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>EcoBot</Typography>
          <Typography variant="body2">Your eco-friendly assistant</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 100, ml: 2 }}>
          <Typography variant="caption" sx={{ color: 'grey.900', fontSize: 12, mb: 0.5, fontWeight: 500, lineHeight: 1 }}>
            Language
          </Typography>
          <FormControl size="small" sx={{ minWidth: 100, bgcolor: 'white', borderRadius: 1 }}>
            <Select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
              displayEmpty
              sx={{ fontWeight: 600 }}
            >
              <MenuItem value={'en'}>English</MenuItem>
              <MenuItem value={'hi'}>हिन्दी</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {onClose && (
          <IconButton onClick={onClose} sx={{ color: 'white', marginLeft: 1 }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Chat Messages */}
      <Paper elevation={0} sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: 'grey.50' }}>
        {messages.map((message, index) => (
          <Slide direction="up" in={true} timeout={300 + index * 100} key={message.id}>
            <Box>
              <ChatMessage message={message} minimal={minimal} onRating={() => {}} />
            </Box>
          </Slide>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input Bar */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.300', bgcolor: 'white', position: 'relative' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me anything eco-friendly..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                bgcolor: 'grey.50',
                '&:focus-within': {
                  bgcolor: 'white'
                }
              }
            }}
          />
          <Zoom in={!!inputValue.trim()}>
            <IconButton
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim()}
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                '&:hover': { bgcolor: 'success.dark' },
                '&:disabled': { bgcolor: 'grey.300' }
              }}
            >
              <SendIcon />
            </IconButton>
          </Zoom>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity as 'success' | 'info' | 'warning' | 'error'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatbotWidget;
