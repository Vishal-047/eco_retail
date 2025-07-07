import React from 'react';
import { Box, Avatar, Typography, Fade, Zoom } from '@mui/material';
import { Park as EcoIcon, AutoAwesome as SparkleIcon } from '@mui/icons-material';

export default function TypingIndicator() {
  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mb: 2,
          gap: 1,
          animation: 'slideIn 0.5s ease-out'
        }}
      >
        <Zoom in={true} timeout={800}>
          <Avatar 
            sx={{ 
              bgcolor: 'success.main', 
              width: 32, 
              height: 32,
              boxShadow: 2,
              animation: 'pulse 2s infinite'
            }}
          >
            <EcoIcon sx={{ fontSize: 18 }} />
          </Avatar>
        </Zoom>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            p: 2,
            bgcolor: 'white',
            borderRadius: 3,
            borderTopLeftRadius: 1,
            boxShadow: 2,
            border: '1px solid',
            borderColor: 'success.light',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.1), transparent)',
              animation: 'shimmer 2s infinite'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {[0, 1, 2].map((index) => (
              <Zoom in={true} timeout={1000 + index * 200} key={index}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    animation: 'typing 1.4s infinite ease-in-out',
                    animationDelay: `${index * 0.2}s`,
                    boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)',
                    '@keyframes typing': {
                      '0%, 60%, 100%': {
                        transform: 'translateY(0) scale(1)',
                        opacity: 0.4
                      },
                      '30%': {
                        transform: 'translateY(-10px) scale(1.2)',
                        opacity: 1
                      }
                    }
                  }}
                />
              </Zoom>
            ))}
          </Box>
          
          <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
            <SparkleIcon 
              sx={{ 
                fontSize: 12, 
                color: 'warning.main',
                animation: 'sparkle 1.5s infinite ease-in-out',
                '@keyframes sparkle': {
                  '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                  '50%': { opacity: 1, transform: 'scale(1.2)' }
                }
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                ml: 0.5, 
                color: 'text.secondary',
                fontStyle: 'italic',
                animation: 'fadeInOut 2s infinite'
              }}
            >
              thinking...
            </Typography>
          </Box>
        </Box>
        
        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
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
          
          @keyframes fadeInOut {
            0%, 100% {
              opacity: 0.5;
            }
            50% {
              opacity: 1;
            }
          }
        `}</style>
      </Box>
    </Fade>
  );
} 