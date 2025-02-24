import React, { useState } from 'react';
import { 
    Container, 
    Typography, 
    Paper, 
    TextField, 
    Button, 
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Alert,
    IconButton
} from '@mui/material';
import { generateRandomPerson } from '../services/dataService';
import { motion } from 'framer-motion';
import FloatingSphere from '../components/FloatingSphere';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ElectricBackground from '../components/ElectricBackground';

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px; // Space between buttons
  margin-bottom: 20px;
  align-items: center; // Align buttons vertically
`;

const StyledButton = styled.button`
  background: linear-gradient(45deg, #FF6B6B, #FF8E53);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const formatDate = (dateString) => {
  const match = dateString.match(/\((.*?)\)/);
  if (!match) return dateString;
  
  const date = new Date(match[1]);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).replace(/(\d+)/, '$1th'); // Add 'th' suffix to the day
};

// Update the PricingContainer styled component
const PricingContainer = styled(Paper)`
  padding: 24px;
  background: #000000 !important; // Added !important to override Paper's default background
  border-radius: 20px;
  margin-top: 32px;
  color: #E6E6FA;
  transition: all 0.3s ease; // Smooth transition for hover effect
  
  &:hover {
    background: #ffffff !important; // Added !important here as well
    color: #000000; // Change text color to black for better visibility
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

    // Update heading colors on hover
    h4, h5, h6 {
      color: #000000 !important;
    }
  }
`;

const Home = () => {
    const [formData, setFormData] = useState({
        age: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const person = await generateRandomPerson(parseInt(formData.age), formData.country);
            setResult(person);
            setOpenDialog(true);
        } catch (err) {
            setError(err.message);
            alert(`Failed to generate person: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setResult(null);
    };

    return (
        <Container>
            <Box sx={{ minHeight: '100vh', pt: 10, pb: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Typography variant="h2" component="h1" gutterBottom>
                        As-Salamu Alaikum
                    </Typography>
                </motion.div>

                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '32px',
                        position: 'relative',
                        '& .MuiDialog-paper': {
                            width: '90vw',
                            height: '90vh',
                            maxWidth: '90vw',
                            maxHeight: '90vh'
                        }
                    }}
                >
                    {/* Random Person Generator Container */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ flex: '1', maxWidth: '600px' }}
                    >
                        <Paper
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                p: 4,
                                mt: 4,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                                borderRadius: '20px',
                                '&:hover': {
                                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
                                    background: 'rgba(255, 255, 255, 0.15)',
                                },
                                '& .MuiTextField-root': {
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.3)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.7)',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: 'rgba(255, 255, 255, 0.9)',
                                    },
                                },
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Age"
                                type="number"
                                margin="normal"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'rgba(147, 112, 219, 0.5)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(147, 112, 219, 0.8)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#9370DB',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(147, 112, 219, 0.8)',
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                select
                                label="Country"
                                margin="normal"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                required
                                SelectProps={{
                                    native: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'rgba(147, 112, 219, 0.5)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(147, 112, 219, 0.8)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#9370DB',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(147, 112, 219, 0.8)',
                                    },
                                }}
                            >
                                <option value="">Select a country</option>
                                <option value="us">USA</option>
                                <option value="ca">Canada</option>
                                <option value="gb">UK</option>
                            </TextField>
                            <ButtonContainer>
                                <Button 
                                    component="a" // Change to anchor tag
                                    href="https://www.facebook.com/rahi.bhai.809794"
                                    target="_blank"
                                    sx={{ 
                                        background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                                        color: 'white',
                                        padding: '12px 24px',
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        borderRadius: '10px',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #FF8E53, #FF6B6B)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 20px rgba(255, 107, 107, 0.4)',
                                        },
                                    }}
                                >
                                    Dollar Exchange
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    fullWidth 
                                    sx={{ 
                                        mt: 3,
                                        background: 'linear-gradient(45deg, #9370DB 30%, #8A2BE2 90%)',
                                        color: 'white',
                                        padding: '12px',
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        borderRadius: '10px',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #8A2BE2 30%, #9370DB 90%)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 32px rgba(147, 112, 219, 0.4)',
                                        },
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Generate Random Person'}
                                </Button>
                            </ButtonContainer>
                            
                            {loading && (
                                <Typography 
                                    sx={{ 
                                        mt: 2, 
                                        textAlign: 'center', 
                                        color: '#E6E6FA',
                                        fontStyle: 'italic',
                                        opacity: 0.8
                                    }}
                                >
                                    Hold on you Human! Ghost is coming with the best result for you...
                                </Typography>
                            )}
                        </Paper>

                        {/* New Premium AI Tool Container */}
                        <Paper
                            sx={{
                                p: 4,
                                mt: 4,
                                position: 'relative',
                                overflow: 'hidden',
                                background: 'transparent',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                minHeight: '300px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&:hover': {
                                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
                                    transform: 'translateY(-5px)',
                                },
                            }}
                            onClick={() => window.open('https://jarvisaipro.github.io/', '_blank')}
                        >
                            <ElectricBackground />
                            <Box 
                                sx={{ 
                                    position: 'relative', 
                                    zIndex: 1,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        animation: 'colorChange 7s infinite',
                                        '@keyframes colorChange': {
                                            '0%': { color: '#FF0000' },    // Red
                                            '14%': { color: '#FFFF00' },   // Yellow
                                            '28%': { color: '#00FF00' },   // Green
                                            '42%': { color: '#FFA500' },   // Orange
                                            '56%': { color: '#FF69B4' },   // Pink
                                            '70%': { color: '#0000FF' },   // Blue
                                            '84%': { color: '#8A2BE2' },   // Violet
                                            '100%': { color: '#FF0000' }   // Back to Red
                                        }
                                    }}
                                >
                                    Premium AI Tool for Survey
                                </Typography>
                                <Typography 
                                    sx={{ 
                                        opacity: 0.9,
                                        textAlign: 'center',
                                        mt: 1,
                                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
                                        animation: 'colorChange 7s infinite',
                                        '@keyframes colorChange': {
                                            '0%': { color: '#FF0000' },    // Red
                                            '14%': { color: '#FFFF00' },   // Yellow
                                            '28%': { color: '#00FF00' },   // Green
                                            '42%': { color: '#FFA500' },   // Orange
                                            '56%': { color: '#FF69B4' },   // Pink
                                            '70%': { color: '#0000FF' },   // Blue
                                            '84%': { color: '#8A2BE2' },   // Violet
                                            '100%': { color: '#FF0000' }   // Back to Red
                                        }
                                    }}
                                >
                                    Click to access our advanced survey tools
                                </Typography>
                            </Box>
                        </Paper>
                    </motion.div>

                    {/* New Pricing Container */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ flex: '1', maxWidth: '540px' }}
                    >
                        <PricingContainer sx={{ transform: 'scale(0.9)' }}>
                            <Typography variant="h4" gutterBottom sx={{ color: '#9370DB', fontWeight: 'bold' }}>
                                প্যাকেজ সমূহ
                            </Typography>
                            
                            <Typography variant="h5" sx={{ color: '#FF8E53', mt: 3, mb: 2 }}>
                                ১২৫০০ / ১৭৫০০ / ১৯৫০০ প্যাকেজ
                            </Typography>

                            <Typography variant="h6" sx={{ color: '#9370DB', mt: 4, mb: 2 }}>
                                রিনিউয়েবল ফিস:
                            </Typography>

                            <Typography variant="body1" gutterBottom>
                                এডমিন প্যানেল আইপি: ১০০ টি / ২০০ টি
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                (৩০x১০০) ৩০০০/- অথবা (২৫x২০০) ৫০০০/-
                            </Typography>

                            <Typography variant="h6" sx={{ color: '#9370DB', mt: 4, mb: 2 }}>
                                মাসিক আইপি:
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                ইউকে ১ টি ১০০০/-
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                ইউএস ১ টি ১০০০/-
                            </Typography>

                            <Typography variant="h6" sx={{ color: '#9370DB', mt: 4, mb: 2 }}>
                                এক কালীন ফিস:
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Premium AI Toolset ১৫০০/-
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                ৮০০০ submail ২৫০০/-
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                কাজ শেখানোর ফি ৫০০০/-
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                অনলাইন ভার্চুয়াল সাপোর্ট ৩০০০/-
                            </Typography>
                        </PricingContainer>
                    </motion.div>
                </Box>

                <Dialog 
                    open={openDialog} 
                    onClose={handleCloseDialog}
                    PaperProps={{
                        sx: {
                            background: 'rgba(75, 0, 130, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(147, 112, 219, 0.3)',
                            borderRadius: '20px',
                            padding: '20px',
                        }
                    }}
                >
                    <DialogTitle sx={{ color: '#E6E6FA' }}>Generated Person</DialogTitle>
                    <DialogContent>
                        {result && (
                            <DialogContentText component="div" sx={{ color: '#E6E6FA' }}>
                                <Typography sx={{ mb: 1 }}><strong>Name:</strong> {result.name}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Age:</strong> {result.age.split(' ')[0]} ({formatDate(result.age)})</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Country:</strong> {result.country}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>Address:</strong> {result.address}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>City:</strong> {result.city}</Typography>
                                <Typography sx={{ mb: 1 }}><strong>State:</strong> {result.state}</Typography>
                                <Typography><strong>ZIP Code:</strong> {result.zip}</Typography>
                            </DialogContentText>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleCloseDialog}
                            sx={{
                                color: '#E6E6FA',
                                '&:hover': {
                                    background: 'rgba(147, 112, 219, 0.2)',
                                }
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default Home; 