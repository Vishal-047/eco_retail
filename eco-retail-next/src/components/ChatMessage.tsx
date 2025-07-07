import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Paper, 
  Rating,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Grow
} from '@mui/material';
import {
  Park as EcoIcon,
  Person as PersonIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  AutoAwesome as SparkleIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  rating?: number;
}

interface ChatMessageProps {
  message: Message;
  onRating: (messageId: string, rating: number) => void;
  minimal?: boolean;
}

export default function ChatMessage({ message, onRating, minimal = false }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  const formattedTime = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleRating = (rating: number) => {
    onRating(message.id, rating);
  };

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: isBot ? 'flex-start' : 'flex-end',
          mb: 2,
          gap: 1,
          animation: isBot ? 'slideInLeft 0.5s ease-out' : 'slideInRight 0.5s ease-out'
        }}
      >
        {isBot && (
          <Zoom in={true} timeout={800}>
            <Avatar 
              sx={{ 
                bgcolor: 'success.main', 
                width: 32, 
                height: 32,
                boxShadow: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                  boxShadow: 4
                }
              }}
            >
              <EcoIcon sx={{ fontSize: 18 }} />
            </Avatar>
          </Zoom>
        )}
        
        <Box sx={{ maxWidth: '90%' }}>
          <Grow in={true} timeout={600}>
            <Paper
              elevation={2}
              sx={{
                p: 1,
                bgcolor: isBot ? 'white' : 'success.main',
                color: isBot ? 'text.primary' : 'white',
                borderRadius: 3,
                borderTopLeftRadius: isBot ? 1 : 3,
                borderTopRightRadius: isBot ? 3 : 1,
                position: 'relative',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: isBot ? 'success.light' : 'success.dark',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                  borderColor: isBot ? 'success.main' : 'success.light'
                },
                '&::before': isBot ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.05), transparent)',
                  animation: 'shimmer 3s infinite',
                  pointerEvents: 'none'
                } : {}
              }}
            >
              {isBot && (
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 1,
                }}>
                  <SparkleIcon sx={{ fontSize: 12, color: 'warning.main' }} />
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    EcoBot
                  </Typography>
                </Box>
              )}
              
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  mt: 0,
                  animation: 'fadeInText 0.8s ease-out',
                  fontSize: '0.95rem'
                }}
              >
                {message.text}
              </Typography>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 1, 
                  opacity: 0.7,
                  textAlign: isBot ? 'left' : 'right',
                  fontStyle: 'italic'
                }}
              >
                {formattedTime}
              </Typography>
            </Paper>
          </Grow>

          {/* Rating Section for Bot Messages (hide if minimal) */}
          {isBot && !minimal && (
            <Fade in={true} timeout={1000}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mt: 1,
                justifyContent: 'flex-start'
              }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Was this helpful?
                </Typography>
                <Tooltip title="Helpful" arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleRating(1)}
                    sx={{ 
                      color: message.rating === 1 ? 'success.main' : 'grey.400',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        color: 'success.main',
                        transform: 'scale(1.2)',
                        bgcolor: 'success.light'
                      }
                    }}
                  >
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Not helpful" arrow>
                  <IconButton
                    size="small"
                    onClick={() => handleRating(0)}
                    sx={{ 
                      color: message.rating === 0 ? 'error.main' : 'grey.400',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        color: 'error.main',
                        transform: 'scale(1.2)',
                        bgcolor: 'error.light'
                      }
                    }}
                  >
                    <ThumbDownIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {message.rating !== undefined && (
                  <Zoom in={true} timeout={500}>
                    <HeartIcon 
                      sx={{ 
                        fontSize: 16, 
                        color: message.rating === 1 ? 'success.main' : 'error.main',
                        animation: 'heartBeat 0.6s ease-in-out'
                      }} 
                    />
                  </Zoom>
                )}
              </Box>
            </Fade>
          )}
        </Box>

        {!isBot && (
          <Zoom in={true} timeout={800}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                width: 32, 
                height: 32,
                boxShadow: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1) rotate(-5deg)',
                  boxShadow: 4
                }
              }}
            >
              <PersonIcon sx={{ fontSize: 18 }} />
            </Avatar>
          </Zoom>
        )}
        
        <style jsx>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
          
          @keyframes fadeInText {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes heartBeat {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.3);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
      </Box>
    </Fade>
  );
} 