// Example API endpoint for receiving leads from the chatbot
// This file shows how to set up an endpoint on your dashboard website

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with your database)
let leads = [];

// API endpoint to receive leads from chatbot
app.post('/api/leads', async (req, res) => {
  try {
    const leadData = req.body;
    
    // Validate required fields
    if (!leadData.name || !leadData.email || !leadData.inquiry) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, inquiry'
      });
    }
    
    // Add timestamp and status
    const newLead = {
      ...leadData,
      id: Date.now().toString(),
      receivedAt: new Date().toISOString(),
      status: 'new'
    };
    
    // Store the lead (replace with your database logic)
    leads.push(newLead);
    
    // Optional: Send notification email
    await sendNotificationEmail(newLead);
    
    // Optional: Create task in your CRM
    await createCRMLead(newLead);
    
    console.log('New lead received:', newLead);
    
    res.status(201).json({
      success: true,
      message: 'Lead received successfully',
      leadId: newLead.id
    });
    
  } catch (error) {
    console.error('Error processing lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all leads
app.get('/api/leads', (req, res) => {
  res.json({
    success: true,
    leads: leads
  });
});

// Update lead status
app.put('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const lead = leads.find(l => l.id === id);
  if (!lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found'
    });
  }
  
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Lead updated successfully',
    lead: lead
  });
});

// Example notification function
async function sendNotificationEmail(lead) {
  // Implement your email notification logic here
  // Example: Send to sales team, create Slack notification, etc.
  console.log(`Notification sent for lead: ${lead.name} (${lead.email})`);
}

// Example CRM integration function
async function createCRMLead(lead) {
  // Implement your CRM integration logic here
  // Example: Create lead in Salesforce, HubSpot, etc.
  console.log(`CRM lead created for: ${lead.name}`);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    leadsCount: leads.length
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Dashboard API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Leads endpoint: http://localhost:${PORT}/api/leads`);
});

module.exports = app;

