import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../images/nobackground.png';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = "May 15, 2023";

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Header>
          <LogoImg src={logo} alt="CineNiche Logo" onClick={() => navigate('/home')} />
          <HeaderRight>
            <NavButton onClick={() => navigate('/home')}>Home</NavButton>
            <SmallButton onClick={() => window.open('https://github.com/cineniche', '_blank')}>GitHub</SmallButton>
          </HeaderRight>
        </Header>

        <ContentWrapper>
          <PageTitle>Privacy Policy</PageTitle>
          <LastUpdated>Last updated: {lastUpdated}</LastUpdated>

          <Section>
            <IntroText>
              At CineNiche, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </IntroText>
          </Section>

          <TableOfContents>
            <TOCTitle>Contents</TOCTitle>
            <TOCList>
              <TOCItem><a href="#information-collected">1. Information We Collect</a></TOCItem>
              <TOCItem><a href="#use-of-data">2. Use of Your Data</a></TOCItem>
              <TOCItem><a href="#legal-basis">3. Legal Basis for Processing</a></TOCItem>
              <TOCItem><a href="#cookies">4. Cookies and Web Beacons</a></TOCItem>
              <TOCItem><a href="#third-parties">5. Third-Party Services</a></TOCItem>
              <TOCItem><a href="#retention">6. Data Retention</a></TOCItem>
              <TOCItem><a href="#rights">7. Your Data Protection Rights</a></TOCItem>
              <TOCItem><a href="#children">8. Children's Privacy</a></TOCItem>
              <TOCItem><a href="#changes">9. Changes to This Privacy Policy</a></TOCItem>
              <TOCItem><a href="#contact">10. Contact Us</a></TOCItem>
            </TOCList>
          </TableOfContents>

          <Section id="information-collected">
            <SectionHeading>1. Information We Collect</SectionHeading>
            <Paragraph>
              <strong>Personal Information</strong>: When you register with CineNiche, we collect your name, email address, age, and gender. This information is essential for creating your account and personalizing your movie recommendations.
            </Paragraph>
            <Paragraph>
              <strong>Usage Data</strong>: We automatically collect information about how you interact with our website, including:
            </Paragraph>
            <List>
              <ListItem>Pages visited and content viewed</ListItem>
              <ListItem>Time spent on pages</ListItem>
              <ListItem>Movies you've rated or added to favorites</ListItem>
              <ListItem>Search queries</ListItem>
              <ListItem>Click patterns</ListItem>
            </List>
            <Paragraph>
              <strong>Technical Data</strong>: We gather information about your device and internet connection, including:
            </Paragraph>
            <List>
              <ListItem>IP address</ListItem>
              <ListItem>Browser type and version</ListItem>
              <ListItem>Operating system</ListItem>
              <ListItem>Device information</ListItem>
              <ListItem>Time zone setting</ListItem>
            </List>
          </Section>

          <Section id="use-of-data">
            <SectionHeading>2. Use of Your Data</SectionHeading>
            <Paragraph>
              We use your personal data for the following purposes:
            </Paragraph>
            <List>
              <ListItem><strong>Provide our services</strong>: To deliver personalized movie recommendations based on your preferences and demographic information</ListItem>
              <ListItem><strong>Improve our platform</strong>: To analyze usage patterns and enhance user experience</ListItem>
              <ListItem><strong>Account management</strong>: To create and maintain your account, authenticate logins, and process transactions</ListItem>
              <ListItem><strong>Communications</strong>: To respond to your inquiries and send service-related notifications</ListItem>
              <ListItem><strong>Security</strong>: To detect and prevent fraud, abuse, and security incidents</ListItem>
              <ListItem><strong>Legal compliance</strong>: To comply with applicable laws and regulations</ListItem>
            </List>
          </Section>

          <Section id="legal-basis">
            <SectionHeading>3. Legal Basis for Processing</SectionHeading>
            <Paragraph>
              Under the General Data Protection Regulation (GDPR), we process your data based on the following legal grounds:
            </Paragraph>
            <List>
              <ListItem><strong>Consent</strong>: Where you have given clear consent for us to process your personal data for specific purposes</ListItem>
              <ListItem><strong>Contractual necessity</strong>: Where processing is necessary to fulfill our service agreement with you</ListItem>
              <ListItem><strong>Legitimate interests</strong>: Where processing is necessary for our legitimate interests (such as preventing fraud, improving our services), provided those interests don't override your fundamental rights</ListItem>
              <ListItem><strong>Legal obligation</strong>: Where processing is necessary to comply with a legal obligation</ListItem>
            </List>
          </Section>

          <Section id="cookies">
            <SectionHeading>4. Cookies and Web Beacons</SectionHeading>
            <Paragraph>
              CineNiche uses cookies and similar tracking technologies to enhance your browsing experience and collect information about how you use our site.
            </Paragraph>
            <SubHeading>Types of Cookies We Use:</SubHeading>
            <List>
              <ListItem><strong>Essential cookies</strong>: Necessary for the website's functionality (e.g., authentication, security)</ListItem>
              <ListItem><strong>Preference cookies</strong>: Remember your settings and preferences</ListItem>
              <ListItem><strong>Analytics cookies</strong>: Help us understand how visitors interact with our website</ListItem>
              <ListItem><strong>Marketing cookies</strong>: Track your browsing habits to deliver targeted advertising</ListItem>
            </List>
            <Paragraph>
              You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website.
            </Paragraph>
          </Section>

          <Section id="third-parties">
            <SectionHeading>5. Third-Party Services</SectionHeading>
            <Paragraph>
              We use the following third-party services:
            </Paragraph>
            <List>
              <ListItem><strong>Stytch</strong>: For user authentication. Your login credentials are never stored on our servers—only secure tokens are used to keep you logged in.</ListItem>
              <ListItem><strong>Analytics providers</strong>: To understand user behavior and improve our service</ListItem>
              <ListItem><strong>Movie database APIs</strong>: To fetch movie information and data</ListItem>
            </List>
            <Paragraph>
              These third parties may have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </Paragraph>
          </Section>

          <Section id="retention">
            <SectionHeading>6. Data Retention</SectionHeading>
            <Paragraph>
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this privacy policy, including:
            </Paragraph>
            <List>
              <ListItem>While your account is active</ListItem>
              <ListItem>As needed to provide our services</ListItem>
              <ListItem>As necessary to comply with legal obligations</ListItem>
              <ListItem>As required to resolve disputes</ListItem>
              <ListItem>As needed to enforce our agreements</ListItem>
            </List>
            <Paragraph>
              When we no longer need your personal data, we will either delete it or anonymize it.
            </Paragraph>
          </Section>

          <Section id="rights">
            <SectionHeading>7. Your Data Protection Rights</SectionHeading>
            <Paragraph>
              Under GDPR, you have the following rights:
            </Paragraph>
            <List>
              <ListItem><strong>Access</strong>: Request copies of your personal data</ListItem>
              <ListItem><strong>Rectification</strong>: Request correction of inaccurate or incomplete data</ListItem>
              <ListItem><strong>Erasure</strong>: Request deletion of your personal data</ListItem>
              <ListItem><strong>Restriction</strong>: Request limitation of processing your data</ListItem>
              <ListItem><strong>Portability</strong>: Request transfer of your data to another organization</ListItem>
              <ListItem><strong>Objection</strong>: Object to processing of your data</ListItem>
              <ListItem><strong>Withdrawal of consent</strong>: Withdraw previously given consent</ListItem>
            </List>
            <Paragraph>
              To exercise these rights, please contact us at <a href="mailto:privacy@cineniche.com">privacy@cineniche.com</a>. We will respond to your request within 30 days.
            </Paragraph>
            <Paragraph>
              You also have the right to complain to a data protection authority about our collection and use of your personal data.
            </Paragraph>
          </Section>

          <Section id="children">
            <SectionHeading>8. Children's Privacy</SectionHeading>
            <Paragraph>
              Our service is not intended for users under the age of 16. We do not knowingly collect personal data from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us so we can take necessary actions.
            </Paragraph>
          </Section>

          <Section id="changes">
            <SectionHeading>9. Changes to This Privacy Policy</SectionHeading>
            <Paragraph>
              We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "last updated" date. You are advised to review this privacy policy periodically for any changes.
            </Paragraph>
          </Section>

          <Section id="contact">
            <SectionHeading>10. Contact Us</SectionHeading>
            <Paragraph>
              If you have any questions or concerns about this privacy policy or our data practices, please contact us at:
            </Paragraph>
            <ContactInfo>
              <div>Email: <a href="mailto:privacy@cineniche.com">privacy@cineniche.com</a></div>
              <div>Address: 123 Movie Lane, Hollywood, CA 90210</div>
              <div>Phone: +1 (555) 123-4567</div>
            </ContactInfo>
          </Section>
        </ContentWrapper>

        <Footer>
          <FooterContent>
            <div>&copy; {new Date().getFullYear()} CineNiche. All rights reserved.</div>
            <FooterLinks>
              <FooterLink onClick={() => navigate('/home')}>Home</FooterLink>
              <FooterLink onClick={() => navigate('/privacy')}>Privacy Policy</FooterLink>
              <FooterLink onClick={() => navigate('/terms')}>Terms of Service</FooterLink>
            </FooterLinks>
          </FooterContent>
        </Footer>
      </PageWrapper>
    </>
  );
};

export default PrivacyPage;

// ---------- Styled Components ----------
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Inter', 'Helvetica Neue', sans-serif;
    background-color: #141414;
    color: #f1f1f1;
  }
  ::-webkit-scrollbar { width: 8px; background: #1a1a1a; }
  ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 4px; }
  * { scrollbar-width: thin; scrollbar-color: #3b82f6 #1a1a1a; }
  body { -ms-overflow-style: none; }
  a { color: #3b82f6; text-decoration: none; transition: color 0.2s; }
  a:hover { color: #60a5fa; text-decoration: underline; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled.button`
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  &:hover { 
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const SmallButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #2563eb; }
`;

const LogoImg = styled.img`
  height: 45px;
  width: auto;
  cursor: pointer;
  @media (max-width: 600px) { height: 35px; }
`;

const ContentWrapper = styled.main`
  max-width: 800px;
  margin: 40px auto 80px;
  padding: 0 24px;
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: white;
`;

const LastUpdated = styled.div`
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 30px;
`;

const IntroText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 24px;
  color: #e5e5e5;
  line-height: 1.7;
`;

const TableOfContents = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
  padding: 20px 30px;
  margin: 30px 0;
  border-radius: 0 8px 8px 0;
`;

const TOCTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: white;
`;

const TOCList = styled.ul`
  padding-left: 20px;
  margin: 0;
`;

const TOCItem = styled.li`
  margin-bottom: 8px;
  
  a {
    color: #90caf9;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Section = styled.section`
  margin-bottom: 50px;
  scroll-margin-top: 80px;
`;

const SectionHeading = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SubHeading = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #e0e0e0;
`;

const Paragraph = styled.p`
  font-size: 1.05rem;
  margin-bottom: 20px;
  color: #ccc;
  line-height: 1.7;
  
  a {
    color: #60a5fa;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  strong {
    color: #e0e0e0;
    font-weight: 600;
  }
`;

const List = styled.ul`
  margin-bottom: 24px;
  padding-left: 25px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  color: #ccc;
  line-height: 1.6;
  
  strong {
    color: #e0e0e0;
    font-weight: 600;
  }
`;

const ContactInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  line-height: 1.8;
  color: #ccc;
  
  a {
    color: #60a5fa;
  }
`;

const Footer = styled.footer`
  padding: 30px 40px;
  background-color: #111;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #777;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const FooterLink = styled.span`
  color: #777;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #3b82f6;
  }
`;
