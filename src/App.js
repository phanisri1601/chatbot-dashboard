import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import Chatbot from './components/Chatbot';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Navigation = styled.nav`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ExternalLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const MainContent = styled.main`
  padding: 40px 20px;
`;

const WelcomeSection = styled.div`
  text-align: center;
  color: white;
  margin-bottom: 40px;
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.9;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  opacity: 0.8;
  line-height: 1.6;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Navigation>
          <NavContainer>
            <Logo>Customer Service Bot</Logo>
            <NavLinks>
              <NavLink to="/" end>Home</NavLink>
              <ExternalLink href="http://localhost:3001" target="_blank" rel="noopener noreferrer">Dashboard</ExternalLink>
            </NavLinks>
          </NavContainer>
        </Navigation>

        <MainContent>
          <Routes>
            <Route path="/" element={
              <>
                <WelcomeSection>
                  <WelcomeTitle>Welcome to Customer Service Bot</WelcomeTitle>
                  <WelcomeSubtitle>
                    Experience intelligent customer support with our AI-powered chatbot. 
                    Get instant responses, capture leads, and manage customer inquiries efficiently.
                  </WelcomeSubtitle>
                </WelcomeSection>

                <FeatureGrid>
                  <FeatureCard>
                    <FeatureIcon>🤖</FeatureIcon>
                    <FeatureTitle>AI-Powered Chat</FeatureTitle>
                    <FeatureDescription>
                      Intelligent responses that understand customer needs and provide 
                      relevant information instantly.
                    </FeatureDescription>
                  </FeatureCard>

                  <FeatureCard>
                    <FeatureIcon>📊</FeatureIcon>
                    <FeatureTitle>Lead Management</FeatureTitle>
                    <FeatureDescription>
                      Automatically capture and organize leads from customer interactions 
                      for your sales team.
                    </FeatureDescription>
                  </FeatureCard>

                  <FeatureCard>
                    <FeatureIcon>📱</FeatureIcon>
                    <FeatureTitle>Always Available</FeatureTitle>
                    <FeatureDescription>
                      24/7 customer support that never sleeps, ensuring your customers 
                      get help whenever they need it.
                    </FeatureDescription>
                  </FeatureCard>

                  <FeatureCard>
                    <FeatureIcon>🔗</FeatureIcon>
                    <FeatureTitle>Seamless Integration</FeatureTitle>
                    <FeatureDescription>
                      Connect with your existing systems and send leads directly to 
                      your dashboard or CRM.
                    </FeatureDescription>
                  </FeatureCard>
                </FeatureGrid>
              </>
            } />
          </Routes>
        </MainContent>

        <Routes>
          <Route path="/" element={<Chatbot />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;

