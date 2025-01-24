import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-primary, #1a1a1a);
  color: var(--text-primary, #e5e7eb);
  padding: 2rem;
  border-radius: 12px;
  width: 95%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color, #333);
  margin: 0 auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 1.5rem;
    max-height: 80vh;
  }

  h2, h3 {
    color: var(--text-primary, #e5e7eb);
    margin-bottom: 1rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--border-color, #333);
  background: var(--bg-secondary, #2d2d2d);
  color: var(--text-primary, #e5e7eb);
  width: 100%;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
  }

  &::placeholder {
    color: var(--text-secondary, #9ca3af);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--border-color, #333);
  background: var(--bg-secondary, #2d2d2d);
  color: var(--text-primary, #e5e7eb);
  width: 100%;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
  }

  option {
    background: var(--bg-secondary, #2d2d2d);
    color: var(--text-primary, #e5e7eb);
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  background: #2563eb;
  color: white;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  
  &:hover {
    background: #1d4ed8;
  }
`;

const SettingsButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border-color, #333);
  border-radius: 8px;
  color: var(--text-primary, #e5e7eb);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-right: 10px;

  &:hover {
    background: var(--hover-bg, rgba(255, 255, 255, 0.1));
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChildrenSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color, #333);
  border-radius: 8px;
  background: var(--bg-secondary, #2d2d2d);
`;

const ChildRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
`;

const IconButton = styled(motion.button)`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color, #333);
  background: transparent;
  color: var(--text-primary, #e5e7eb);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--hover-bg, rgba(255, 255, 255, 0.1));
  }
`;

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      const parsedProfile = saved ? JSON.parse(saved) : {
        name: '',
        age: '',
        gender: 'male',
        occupation: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        county: '',
        dma: '',
        region: '',
        spouse: '',
        spouseAge: '',
        spouseGender: 'female',
        children: []
      };
      
      if (!Array.isArray(parsedProfile.children)) {
        parsedProfile.children = [];
      }
      
      return parsedProfile;
    } catch (error) {
      return {
        name: '',
        age: '',
        gender: 'male',
        occupation: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        county: '',
        dma: '',
        region: '',
        spouse: '',
        spouseAge: '',
        spouseGender: 'female',
        children: []
      };
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addChild = () => {
    setProfile(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '', gender: 'male' }]
    }));
  };

  const removeChild = (index) => {
    setProfile(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const updateChild = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  return (
    <>
      <SettingsButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <FaCog size={16} />
        <span>Settings</span>
      </SettingsButton>

      <AnimatePresence>
        {isOpen && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <Modal
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <Form onSubmit={handleSubmit}>
                <h2 style={{ color: 'var(--text-primary, #333)' }}>Profile Settings</h2>
                
                <h3 style={{ color: 'var(--text-primary, #333)', marginBottom: '0.5rem' }}>Personal Information</h3>
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={handleChange}
                />
                <Input
                  name="age"
                  placeholder="Age"
                  type="number"
                  value={profile.age}
                  onChange={handleChange}
                />
                <Select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
                <Input
                  name="occupation"
                  placeholder="Occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                />

                <h3 style={{ color: 'var(--text-primary, #333)', marginBottom: '0.5rem', marginTop: '1rem' }}>Address Information</h3>
                <Input
                  name="streetAddress"
                  placeholder="Street Address"
                  value={profile.streetAddress}
                  onChange={handleChange}
                />
                <Input
                  name="city"
                  placeholder="City"
                  value={profile.city}
                  onChange={handleChange}
                />
                <Input
                  name="state"
                  placeholder="State"
                  value={profile.state}
                  onChange={handleChange}
                />
                <Input
                  name="zipCode"
                  placeholder="Zip Code"
                  value={profile.zipCode}
                  onChange={handleChange}
                />
                <Input
                  name="country"
                  placeholder="Country"
                  value={profile.country}
                  onChange={handleChange}
                />
                <Input
                  name="county"
                  placeholder="County"
                  value={profile.county}
                  onChange={handleChange}
                />
                <Input
                  name="dma"
                  placeholder="DMA (Designated Market Area)"
                  value={profile.dma}
                  onChange={handleChange}
                />
                <Input
                  name="region"
                  placeholder="Region"
                  value={profile.region}
                  onChange={handleChange}
                />

                <h3 style={{ color: 'var(--text-primary, #333)', marginBottom: '0.5rem', marginTop: '1rem' }}>Family Information</h3>
                <Input
                  name="spouse"
                  placeholder="Spouse Name"
                  value={profile.spouse}
                  onChange={handleChange}
                />
                <Input
                  name="spouseAge"
                  placeholder="Spouse Age"
                  type="number"
                  value={profile.spouseAge}
                  onChange={handleChange}
                />
                <Select
                  name="spouseGender"
                  value={profile.spouseGender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>

                <ChildrenSection>
                  <h3 style={{ color: 'var(--text-primary, #333)' }}>Children</h3>
                  {profile.children.map((child, index) => (
                    <ChildRow key={index}>
                      <Input
                        placeholder="Child's Name"
                        value={child.name}
                        onChange={(e) => updateChild(index, 'name', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Age"
                        value={child.age}
                        onChange={(e) => updateChild(index, 'age', e.target.value)}
                      />
                      <Select
                        value={child.gender}
                        onChange={(e) => updateChild(index, 'gender', e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Select>
                      <IconButton
                        type="button"
                        onClick={() => removeChild(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✕
                      </IconButton>
                    </ChildRow>
                  ))}
                  <Button
                    type="button"
                    onClick={addChild}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Add Child
                  </Button>
                </ChildrenSection>

                <Button type="submit">Save Profile</Button>
              </Form>
            </Modal>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Settings; 