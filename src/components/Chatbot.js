import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ref, push, set, serverTimestamp } from 'firebase/database';
import { database } from '../firebase/config';
import { FiSend, FiUser, FiMessageCircle, FiCalendar, FiClock } from 'react-icons/fi';

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8f9fa;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
  ${props => props.isUser ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.isUser ? '#007bff' : 'white'};
  color: ${props => props.isUser ? 'white' : '#333'};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
`;

const MessageIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.isUser ? '#007bff' : '#e9ecef'};
  color: ${props => props.isUser ? 'white' : '#6c757d'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  flex-shrink: 0;
`;

const ChatInput = styled.div`
  padding: 20px;
  background: white;
  border-top: 1px solid #e9ecef;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
  font-size: 14px;
  
  &:focus {
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #0056b3;
    transform: scale(1.05);
  }
`;

const LeadForm = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin: 10px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
`;

const FormButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background: #218838;
  }
`;

const AppointmentFormHeader = styled.h4`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #007bff;
  margin-bottom: 15px;
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your customer service assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiry: ''
  });
  const [appointmentData, setAppointmentData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    notes: ''
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('pricing') || lowerInput.includes('cost') || lowerInput.includes('price')) {
      return {
        id: Date.now(),
        text: "I'd be happy to help you with pricing information. To provide you with the most accurate quote, I'll need to capture some details. Would you like me to create a lead for our sales team?",
        isUser: false,
        timestamp: new Date()
      };
    } else if (lowerInput.includes('contact') || lowerInput.includes('speak') || lowerInput.includes('call')) {
      return {
        id: Date.now(),
        text: "I can connect you with our team. Let me capture your information so we can get back to you promptly.",
        isUser: false,
        timestamp: new Date()
      };
    } else if (lowerInput.includes('lead') || lowerInput.includes('quote') || lowerInput.includes('sales')) {
      setShowLeadForm(true);
      return {
        id: Date.now(),
        text: "Great! I'll help you create a lead. Please fill out the form below with your details.",
        isUser: false,
        timestamp: new Date()
      };
    } else if (lowerInput.includes('appointment') || lowerInput.includes('schedule') || lowerInput.includes('book') || lowerInput.includes('meeting')) {
      console.log('Showing appointment form');
      setShowAppointmentForm(true);
      return {
        id: Date.now(),
        text: "Perfect! I can help you schedule an appointment. Please fill out the appointment form below with your preferred date and time.",
        isUser: false,
        timestamp: new Date()
      };
    } else {
      return {
        id: Date.now(),
        text: "Thank you for your message. I'm here to help! If you need specific information about our services, pricing, want to speak with our team, or schedule an appointment, just let me know.",
        isUser: false,
        timestamp: new Date()
      };
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const leadDoc = {
        ...leadData,
        timestamp: serverTimestamp(),
        status: 'new',
        source: 'chatbot'
      };

      const leadsRef = ref(database, 'leads');
      const newLeadRef = push(leadsRef);
      await set(newLeadRef, leadDoc);
      
      // Optional: try to sync to external dashboard without blocking success
      // This will not affect Firestore save even if it fails
      try {
        // Fire-and-forget, do not await
        sendLeadToDashboard(leadDoc).catch((err) => {
          console.error('External dashboard sync failed:', err);
        });
      } catch (syncError) {
        console.error('External dashboard sync scheduling error:', syncError);
      }
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Thank you! Your details have been received. Our team will contact you within 24 hours.",
        isUser: false,
        timestamp: new Date()
      }]);
      
      setShowLeadForm(false);
      setLeadData({ name: '', email: '', phone: '', company: '', inquiry: '' });
      
    } catch (error) {
      console.error('Error saving lead:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I'm sorry, there was an error submitting your information. Please try again or contact us directly.",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    console.log('Appointment form submitted:', appointmentData);
    
    try {
      const appointmentDoc = {
        ...appointmentData,
        timestamp: serverTimestamp(),
        status: 'pending',
        source: 'chatbot'
      };

      console.log('Saving appointment to Firebase:', appointmentDoc);
      const appointmentsRef = ref(database, 'appointments');
      const newAppointmentRef = push(appointmentsRef);
      await set(newAppointmentRef, appointmentDoc);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Great! I've scheduled your appointment. You'll receive a confirmation email shortly.",
        isUser: false,
        timestamp: new Date()
      }]);
      
      setShowAppointmentForm(false);
      setAppointmentData({ name: '', email: '', phone: '', date: '', time: '', service: '', notes: '' });
      
    } catch (error) {
      console.error('Error saving appointment:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I'm sorry, there was an error scheduling your appointment. Please try again or contact us directly.",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  };

  const sendLeadToDashboard = async (leadData) => {
    try {
      // Replace with your dashboard website endpoint
      const dashboardUrl = 'https://your-dashboard-website.com/api/leads';
      
      await fetch(dashboardUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      });
    } catch (error) {
      console.error('Error sending lead to dashboard:', error);
    }
  };

  const handleInputChange = (e) => {
    setLeadData({
      ...leadData,
      [e.target.name]: e.target.value
    });
  };

  const handleAppointmentInputChange = (e) => {
    console.log('Appointment input changed:', e.target.name, e.target.value);
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value
    });
  };

  if (isMinimized) {
    return (
      <ChatbotContainer style={{ height: '60px' }}>
        <ChatHeader 
          onClick={() => setIsMinimized(false)}
          style={{ cursor: 'pointer' }}
        >
          Chat with us
        </ChatHeader>
      </ChatbotContainer>
    );
  }

  return (
    <ChatbotContainer>
      <ChatHeader onClick={() => setIsMinimized(true)} style={{ cursor: 'pointer' }}>
        Customer Service Chat
      </ChatHeader>
      
      <ChatMessages>
        {messages.map((message) => (
          <Message key={message.id} isUser={message.isUser}>
            <MessageIcon isUser={message.isUser}>
              {message.isUser ? <FiUser /> : <FiMessageCircle />}
            </MessageIcon>
            <MessageBubble isUser={message.isUser}>
              {message.text}
            </MessageBubble>
          </Message>
        ))}
        
        {showLeadForm && (
          <LeadForm>
            <h4>Please provide your details:</h4>
            <form onSubmit={handleLeadSubmit}>
              <FormInput
                type="text"
                name="name"
                placeholder="Full Name *"
                value={leadData.name}
                onChange={handleInputChange}
                required
              />
              <FormInput
                type="email"
                name="email"
                placeholder="Email Address *"
                value={leadData.email}
                onChange={handleInputChange}
                required
              />
              <FormInput
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={leadData.phone}
                onChange={handleInputChange}
              />
              <FormInput
                type="text"
                name="company"
                placeholder="Company Name"
                value={leadData.company}
                onChange={handleInputChange}
              />
              <FormInput
                type="text"
                name="inquiry"
                placeholder="What are you looking for? *"
                value={leadData.inquiry}
                onChange={handleInputChange}
                required
              />
              <FormButton type="submit">Submit Lead</FormButton>
            </form>
          </LeadForm>
        )}

        {showAppointmentForm && (
          <LeadForm>
            <AppointmentFormHeader><FiCalendar /> Schedule Your Appointment</AppointmentFormHeader>
            <form onSubmit={handleAppointmentSubmit}>
              <FormInput
                type="text"
                name="name"
                placeholder="Full Name *"
                value={appointmentData.name}
                onChange={handleAppointmentInputChange}
                required
              />
              <FormInput
                type="email"
                name="email"
                placeholder="Email Address *"
                value={appointmentData.email}
                onChange={handleAppointmentInputChange}
                required
              />
              <FormInput
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={appointmentData.phone}
                onChange={handleAppointmentInputChange}
                required
              />
              <FormInput
                type="date"
                name="date"
                placeholder="Preferred Date *"
                value={appointmentData.date}
                onChange={handleAppointmentInputChange}
                required
              />
              <FormInput
                type="time"
                name="time"
                placeholder="Preferred Time *"
                value={appointmentData.time}
                onChange={handleAppointmentInputChange}
                required
              />
              <FormInput
                type="text"
                name="service"
                placeholder="Service Required *"
                value={appointmentData.service}
                onChange={handleAppointmentInputChange}
                required
              />
              <FormInput
                type="text"
                name="notes"
                placeholder="Additional Notes"
                value={appointmentData.notes}
                onChange={handleAppointmentInputChange}
              />
              <FormButton type="submit">Schedule Appointment</FormButton>
            </form>
          </LeadForm>
        )}
        
        <div ref={messagesEndRef} />
      </ChatMessages>
      
      <ChatInput>
        <InputGroup>
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <SendButton onClick={handleSendMessage}>
            <FiSend />
          </SendButton>
        </InputGroup>
      </ChatInput>
    </ChatbotContainer>
  );
};

export default Chatbot;

