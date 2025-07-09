"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Fade,
  CircularProgress,
  Rating,
  Button,
  Slide,
  Zoom,
  Grow,
  Fab,
  Tooltip,
  Badge,
  Divider,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Park as EcoIcon,
  Lightbulb as LightbulbIcon,
  LocalShipping as DeliveryIcon,
  Recycling as RecyclingIcon,
  TrendingUp as TrendingIcon,
  AutoAwesome as SparkleIcon,
  Psychology as BrainIcon,
  Favorite as HeartIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Celebration as CelebrationIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  EmojiNature as EmojiNatureIcon
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ChatMessage from '../../components/ChatMessage';
import TypingIndicator from '../../components/TypingIndicator';
import CommunityDIY from '../../components/CommunityDIY';
import GreenPoints from '../../components/GreenPoints';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  rating?: number;
}

const quickActions = [
  { 
    label: '🌱 Eco Tips', 
    icon: <LightbulbIcon />, 
    query: 'Give me some eco-friendly tips for daily life',
    color: 'success',
    description: 'Daily sustainability advice'
  },
  { 
    label: '🚚 Delivery Impact', 
    icon: <DeliveryIcon />, 
    query: 'How much CO₂ does a 30 km petrol van delivery emit?',
    color: 'primary',
    description: 'Calculate transportation emissions'
  },
  { 
    label: '♻️ DIY Projects', 
    icon: <RecyclingIcon />, 
    query: 'What can I build from cardboard and plastic waste?',
    color: 'secondary',
    description: 'Creative waste repurposing'
  },
  { 
    label: '📊 Carbon Footprint', 
    icon: <TrendingIcon />, 
    query: 'How can I calculate my product carbon footprint?',
    color: 'warning',
    description: 'Environmental impact analysis'
  }
];

const SUSTAINABILITY_GOALS = [
  'Reduce waste',
  'Lower carbon emissions',
  'Eco-friendly products',
  'Sustainable packaging',
  'Green delivery',
  'Save energy',
  'Educate others',
  'Other',
];

const PRODUCT_TYPES = [
  'Clothing',
  'Electronics',
  'Food & Beverage',
  'Home Goods',
  'Services',
  'Other',
];

function getOnboarding() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('ecoAdvisorOnboarding') || 'null');
  } catch {
    return null;
  }
}
function setOnboarding(data: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ecoAdvisorOnboarding', JSON.stringify(data));
}
function clearOnboarding() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ecoAdvisorOnboarding');
  localStorage.removeItem('ecoAdvisorRoadmap');
}
function getRoadmap() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('ecoAdvisorRoadmap') || 'null');
  } catch {
    return null;
  }
}
function setRoadmap(data: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ecoAdvisorRoadmap', JSON.stringify(data));
}

// Helper to split roadmap steps into individual actions
function splitRoadmapSteps(roadmap: any[]) {
  if (!roadmap) return [];
  const actions: { text: string, done: boolean }[] = [];
  roadmap.forEach((step: any) => {
    // Split on numbered sub-steps (e.g., '1. ...; 2. ...;')
    const parts = step.text
      ? step.text.split(/\d+\.\s?/).filter(Boolean).flatMap(s => s.split(';'))
      : [];
    parts.forEach((p: string) => {
      let text = p.trim().replace(/^[-–•]+\s*/, '');
      // Remove leading/trailing asterisks and markdown bold/italic
      text = text.replace(/^\*+|\*+$/g, '').replace(/^_+|_+$/g, '');
      text = text.replace(/\*\*/g, '').replace(/__/g, '');
      if (text) actions.push({ text, done: step.done });
    });
  });
  return actions;
}

export default function ChatbotPage() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Eco Advisor 🌱. I can help you with eco-friendly tips, carbon footprint calculations, delivery impact analysis, and DIY waste projects. What would you like to know?",
      sender: 'bot',
      timestamp: new Date('2024-01-01T00:00:00Z') // Static timestamp to prevent hydration mismatch
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showGreenPoints, setShowGreenPoints] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [onboarding, setOnboardingState] = useState<any>(getOnboarding());
  const [onboardingOpen, setOnboardingOpen] = useState(!getOnboarding());
  const [userType, setUserType] = useState('individual');
  const [productType, setProductType] = useState('Clothing');
  const [goals, setGoals] = useState<string[]>([]);
  const [roadmap, setRoadmapState] = useState<any>(getRoadmap());
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const roadmapActions = roadmap ? splitRoadmapSteps(roadmap) : [];
  const roadmapProgress = roadmapActions.length > 0 ? Math.round(100 * roadmapActions.filter((s: any) => s.done).length / roadmapActions.length) : 0;
  const allDone = roadmapActions.length > 0 && roadmapActions.every((s: any) => s.done);
  const handleToggleAction = (idx: number) => {
    // Map back to original roadmap structure
    let count = 0;
    const updated = roadmap.map((step: any) => {
      // Split as above
      const parts = step.text ? step.text.split(/\d+\.\s?/).filter(Boolean).flatMap(s => s.split(';')) : [];
      const newDone = parts.map((p: string) => {
        const text = p.trim().replace(/^[-–•]+\s*/, '');
        if (!text) return false;
        return count++ === idx ? !roadmapActions[idx].done : roadmapActions[count - 1].done;
      });
      // If any sub-action is done, mark the step as done
      return { ...step, done: newDone.every(Boolean) };
    });
    setRoadmap(updated);
  };
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(!onboarding);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll to show/hide scroll to top button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setShowScrollTop(target.scrollTop > 200);
  };

  const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          isAdvancedMode: true
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
      console.error('Error sending message:', error);
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

  const handleQuickAction = (query: string, label: string) => {
    handleSendMessage(query);
    showSnackbar(`Selected: ${label}`, 'info');
  };

  const handleRating = (messageId: string, rating: number) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );
  };

  // Onboarding handlers
  const handleGoalChange = (goal: string) => {
    setGoals(g => g.includes(goal) ? g.filter(x => x !== goal) : [...g, goal]);
  };
  const handleOnboardingSubmit = () => {
    const data = { userType, productType, goals };
    setOnboarding(data);
    setOnboardingState(data);
    setOnboardingOpen(false);
  };
  const handleRestartOnboarding = () => {
    clearOnboarding();
    setOnboardingState(null);
    setRoadmapState(null);
    setOnboardingOpen(true);
  };
  const handleCancelOnboarding = () => {
    setOnboardingOpen(false);
  };

  // Roadmap fetch
  const handleGetRoadmap = async () => {
    setRoadmapLoading(true);
    try {
      const res = await fetch('/api/eco-advisor-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType: onboarding.userType, productType: onboarding.productType, goals: onboarding.goals })
      });
      const data = await res.json();
      if (data.roadmap) {
        const steps = data.roadmap.map((step: string) => ({ text: step, done: false }));
        setRoadmap(steps);
        setRoadmapState(steps);
      }
    } catch {
      showSnackbar('Failed to fetch roadmap', 'error');
    } finally {
      setRoadmapLoading(false);
    }
  };
  const handleToggleStep = (idx: number) => {
    const updated = roadmap.map((s: any, i: number) => i === idx ? { ...s, done: !s.done } : s);
    setRoadmap(updated);
  };

  if (!mounted) {
    return (
      <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Loading EcoBot...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Onboarding Dialog */}
      <Dialog open={onboardingOpen} disableEscapeKeyDown fullWidth maxWidth="xs" TransitionProps={{ appear: true }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmojiNatureIcon color="success" sx={{ fontSize: 32 }} />
          Welcome to Eco Advisor!
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          <Typography sx={{ mb: 2, fontSize: 18, fontWeight: 500 }}>Let’s personalize your sustainability journey.</Typography>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>I am a...</Typography>
          <Select
            value={userType}
            onChange={e => setUserType(e.target.value as string)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </Select>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>What type of products do you focus on?</Typography>
          <Select
            value={productType}
            onChange={e => setProductType(e.target.value as string)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {PRODUCT_TYPES.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>My main sustainability goals:</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Select all that apply
          </Typography>
          <FormGroup sx={{ mb: 2 }}>
            {SUSTAINABILITY_GOALS.map(goal => (
              <FormControlLabel
                key={goal}
                control={<Checkbox checked={goals.includes(goal)} onChange={() => handleGoalChange(goal)} />}
                label={goal}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button onClick={handleCancelOnboarding} color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleOnboardingSubmit} variant="contained" color="success" size="large" disabled={goals.length === 0} sx={{ px: 4, fontWeight: 600 }}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Onboarding Banner */}
      {!onboarding && showOnboardingBanner && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'warning.50', display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'warning.light' }}>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            Want tailored sustainability advice? <b>Personalize your Eco Advisor experience.</b>
          </Typography>
          <Button variant="contained" color="success" size="small" onClick={() => { setOnboardingOpen(true); setShowOnboardingBanner(false); }}>
            Personalize Now
          </Button>
          <IconButton size="small" onClick={() => setShowOnboardingBanner(false)}><CloseIcon /></IconButton>
        </Paper>
      )}

      {/* Personalized Greeting & Plan */}
      {onboarding && (
        <Box sx={{ mb: 3, mt: 1 }}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: 'success.50', display: 'flex', alignItems: 'center', gap: 3, borderRadius: 3, boxShadow: 4, transition: 'box-shadow 0.3s' }}>
            <CelebrationIcon color="warning" sx={{ fontSize: 40, mr: 1 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                Welcome, {onboarding.userType === 'business' ? 'Eco-Minded Business' : 'Eco Hero'}!
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <b>Your goals:</b> {onboarding.goals.join(', ')}
              </Typography>
              <Button onClick={handleRestartOnboarding} size="small" color="info" sx={{ mt: 1, textTransform: 'none', fontWeight: 400, px: 0, minWidth: 0 }}>
                Restart Onboarding
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              color="success"
              onClick={handleGetRoadmap}
              disabled={roadmapLoading}
              size="large"
              sx={{ fontWeight: 600, px: 4, boxShadow: 2 }}
            >
              {roadmapLoading ? 'Loading...' : 'Get Personalized Plan'}
            </Button>
          </Paper>
        </Box>
      )}

      {/* Roadmap Checklist */}
      {roadmap && (
        <Paper elevation={4} sx={{ p: 3, mb: 3, bgcolor: 'success.100', borderRadius: 3, boxShadow: 6, transition: 'box-shadow 0.3s' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SparkleIcon color="warning" /> Your Sustainability Roadmap
          </Typography>
          <LinearProgress variant="determinate" value={roadmapProgress} sx={{ height: 10, borderRadius: 5, mb: 2, bgcolor: 'success.200' }} />
          <FormGroup>
            {roadmapActions.map((action: any, idx: number) => (
              <FormControlLabel
                key={idx}
                control={action.done ? <CheckCircleIcon color="success" sx={{ transition: 'all 0.2s', fontSize: 28 }} /> : <RadioButtonUncheckedIcon color="disabled" sx={{ fontSize: 28 }} />}
                label={<span style={{ textDecoration: action.done ? 'line-through' : 'none', color: action.done ? '#388e3c' : undefined, fontWeight: action.done ? 500 : 400, transition: 'color 0.2s' }}>{action.text}</span>}
                onClick={() => handleToggleAction(idx)}
                sx={{ mb: 1.5, transition: 'background 0.2s', borderRadius: 2, alignItems: 'flex-start', '&:hover': { bgcolor: 'success.50' } }}
              />
            ))}
          </FormGroup>
          {allDone && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <CelebrationIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="success.main">Congratulations! You’ve completed your roadmap! 🎉</Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Header */}
      <Grow in={true} timeout={500}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', mb: 2, flexDirection: 'row' }}>
          <Avatar 
            sx={{ 
              bgcolor: 'success.main', 
              mr: 3, 
              width: 56, 
              height: 56,
              boxShadow: 3,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'scale(1.1) rotate(5deg)',
                boxShadow: 6
              }
            }}
          >
            <EcoIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <Typography variant="h4" component="h1" sx={{ color: 'success.main', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Eco Advisor
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ whiteSpace: 'nowrap', fontSize: 20, fontWeight: 400 }}>
                Your intelligent advisor for eco-friendly living and carbon footprint insights
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <SparkleIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                AI-Powered Sustainability
              </Typography>
              <SparkleIcon sx={{ fontSize: 16, color: 'warning.main', ml: 0.5 }} />
            </Box>
          </Box>
        </Box>
      </Grow>

      {/* Quick Actions */}
      <Fade in={true} timeout={1500}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LightbulbIcon sx={{ color: 'success.main', mr: 1 }} />
            <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              Quick Actions
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {quickActions.map((action, index) => (
              <Grow in={true} timeout={500 + index * 100} key={index}>
                <Tooltip title={action.description} arrow>
                  <Chip
                    icon={action.icon}
                    label={action.label}
                    onClick={() => handleQuickAction(action.query, action.label)}
                    color={action.color as any}
                    variant="filled"
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: 'medium',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                        '& .MuiChip-icon': {
                          transform: 'scale(1.1)'
                        }
                      },
                      '& .MuiChip-icon': {
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  />
                </Tooltip>
              </Grow>
            ))}
          </Box>
        </Box>
      </Fade>

      {/* Chat Container */}
      <Grow in={true} timeout={1800}>
        <Paper 
          elevation={6} 
          sx={{ 
            height: '80vh',
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: 'grey.50',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid',
            borderColor: 'success.light',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 12,
              borderColor: 'success.main'
            },
            maxWidth: 900,
            ml: 0
          }}
        >
        {/* Messages Area */}
        <Box 
          data-messages-area
          onScroll={handleScroll}
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {messages.map((message, index) => (
            <Slide direction="up" in={true} timeout={300 + index * 100} key={message.id}>
              <Box>
                <ChatMessage
                  message={message}
                  onRating={handleRating}
                />
              </Box>
            </Slide>
          ))}
          
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'grey.200',
          bgcolor: 'white',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12
        }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask me about sustainability, carbon footprint, delivery impact, or DIY projects..."
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
                  borderRadius: 3,
                  bgcolor: 'grey.50',
                  transition: 'all 0.3s ease',
                  '&:focus-within': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)'
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
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: 'success.dark',
                    transform: 'scale(1.1)'
                  },
                  '&:disabled': { bgcolor: 'grey.300' }
                }}
              >
                <SendIcon />
              </IconButton>
            </Zoom>
          </Box>
        </Box>
        </Paper>
      </Grow>

      {/* Footer Info */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <LightbulbIcon sx={{ mr: 1 }} />
              <Typography variant="h6">💡 Pro Tips</Typography>
            </Box>
            <Typography variant="body2">
              Try asking about delivery emissions, product carbon footprint, or DIY waste projects!
            </Typography>
          </CardContent>
        </Card>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Grow in={true} timeout={800}>
            <Button
              variant="contained"
              startIcon={<RecyclingIcon />}
              onClick={() => setShowCommunity(!showCommunity)}
              sx={{ 
                bgcolor: 'secondary.main',
                '&:hover': { bgcolor: 'secondary.dark' },
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              {showCommunity ? 'Hide' : 'Show'} Community DIY Projects
            </Button>
          </Grow>
          
          <Grow in={true} timeout={1000}>
            <Button
              variant="contained"
              startIcon={<TrendingIcon />}
              onClick={() => setShowGreenPoints(!showGreenPoints)}
              sx={{ 
                bgcolor: 'warning.main',
                '&:hover': { bgcolor: 'warning.dark' },
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              {showGreenPoints ? 'Hide' : 'Show'} Green Points
            </Button>
          </Grow>
        </Box>
      </Box>

      {/* Community DIY Section */}
      {showCommunity && (
        <Box sx={{ mt: 4 }}>
          <CommunityDIY />
        </Box>
      )}

      {/* Green Points Section */}
      {showGreenPoints && (
        <Box sx={{ mt: 4 }}>
          <GreenPoints />
        </Box>
      )}

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="success"
          size="medium"
          onClick={() => {
            const messagesArea = document.querySelector('[data-messages-area]') as HTMLElement;
            messagesArea?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'scale(1.1)' }
          }}
        >
          <ArrowUpIcon />
        </Fab>
      </Zoom>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
} 