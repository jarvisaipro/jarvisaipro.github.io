import React from 'react';
import { Container, Typography, Box, IconButton, Stack, Tooltip } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GroupsIcon from '@mui/icons-material/Groups';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import styled from 'styled-components';
import { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const SocialIcon = styled.a`
  font-size: 8rem;
  margin: 0 100px;
  color: #f00;
  transition: all 0.3s ease;
  position: relative;
  animation: ${bounce} 2s ease-in-out infinite;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(5, 22, 80, 0.2), transparent 70%);
    top: -10%;
    left: -10%;
    z-index: -1;
    transition: all 0.3s ease;
  }

  &:hover {
    color: #0B2885;
    transform: scale(1.6) rotate(30deg) !important;

    .MuiIconButton-root {
      transform: scale(1.6) rotate(30deg);
    }

    &::after {
      transform: scale(1.8);
      background: radial-gradient(circle at center, rgba(11, 40, 133, 0.3), transparent 70%);
    }
  }
`;

const DeveloperIconContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  
  /* Glass effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.2);
  }
`;

const StyledIconButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 2rem;
  
  &:hover {
    color: rgba(255, 255, 255, 1);
  }
`;

const Contact = () => {
  const socialLinks = [
    { 
      icon: <GroupsIcon sx={{ fontSize: '7rem' }} />, 
      url: 'https://www.facebook.com/rahi.bhai.809794',
      label: 'Facebook Group',
      isGroup: true
    },
    { 
      icon: <FacebookIcon sx={{ fontSize: '7rem' }} />, 
      url: 'https://www.facebook.com/Erah3ra',
      label: 'Facebook Profile',
      isGroup: false
    }
  ];

  const DeveloperContact = () => {
    return (
      <DeveloperIconContainer>
        <Tooltip 
          title="Click here to contact for personal customized AI chat bot" 
          placement="left"
          arrow
        >
          <StyledIconButton
            onClick={() => window.open('https://www.facebook.com/professorrehan', '_blank')}
            aria-label="Contact Developer"
          >
            <DeveloperModeIcon sx={{ fontSize: 35 }} />
          </StyledIconButton>
        </Tooltip>
      </DeveloperIconContainer>
    );
  };

  return (
    <Container>
      <Box sx={{ minHeight: '100vh', pt: 10, pb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h5" gutterBottom>
          on social media
        </Typography>
        <Stack 
          direction="row" 
          spacing={24} 
          justifyContent="center" 
          sx={{ mt: 16 }}
        >
          {socialLinks.map((social, index) => (
            <SocialIcon
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: social.isGroup ? 'rgba(5, 22, 80, 0.15)' : 'transparent',
                padding: social.isGroup ? '50px' : '0',
                borderRadius: social.isGroup ? '50%' : '0',
                boxShadow: social.isGroup ? '0 0 40px rgba(5, 22, 80, 0.3)' : 'none',
                animationDelay: index % 2 === 0 ? '0s' : '1s'
              }}
            >
              <IconButton
                color="primary"
                component="span"
                aria-label={social.label}
                size="large"
                sx={{
                  transition: 'all 0.3s ease',
                  '& .MuiSvgIcon-root': {
                    fontSize: '7rem',
                    color: '#f00',
                    filter: 'drop-shadow(0 0 20px rgba(5, 22, 80, 0.6))'
                  }
                }}
              >
                {social.icon}
              </IconButton>
            </SocialIcon>
          ))}
        </Stack>
        <DeveloperContact />
      </Box>
    </Container>
  );
};

export default Contact; 