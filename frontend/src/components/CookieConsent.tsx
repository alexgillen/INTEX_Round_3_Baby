import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show cookie banner if no consent found
      setVisible(true);
    }
  }, []);

  const acceptAllCookies = () => {
    // Save consent in localStorage
    localStorage.setItem('cookieConsent', 'all');
    setVisible(false);
  };

  const acceptEssentialCookies = () => {
    // Save limited consent in localStorage
    localStorage.setItem('cookieConsent', 'essential');
    setVisible(false);
  };

  const viewPrivacyPolicy = () => {
    navigate('/privacy');
  };

  if (!visible) return null;

  return (
    <ConsentBanner>
      <ConsentContent>
        <ConsentTitle>Cookie Consent</ConsentTitle>
        <ConsentText>
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences by selecting "Essential Only" or view our <ConsentLink onClick={viewPrivacyPolicy}>Privacy Policy</ConsentLink> for more information.
        </ConsentText>
        <ButtonGroup>
          <SecondaryButton onClick={acceptEssentialCookies}>
            Essential Only
          </SecondaryButton>
          <PrimaryButton onClick={acceptAllCookies}>
            Accept All
          </PrimaryButton>
        </ButtonGroup>
      </ConsentContent>
    </ConsentBanner>
  );
};

export default CookieConsent;

// Styled Components
const ConsentBanner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ConsentContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (max-width: 768px) {
    padding: 12px 0;
  }
`;

const ConsentTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
`;

const ConsentText = styled.p`
  font-size: 0.95rem;
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const ConsentLink = styled.span`
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #60a5fa;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.05);
  }
`; 