# Customer Service Chatbot with Firebase Integration

A modern, responsive customer service chatbot application that integrates with Firebase Firestore for data storage and provides a comprehensive dashboard for lead management.

## Features

### 🤖 Chatbot Interface
- **AI-Powered Responses**: Intelligent conversation handling with context-aware responses
- **Lead Capture**: Automatic lead generation from customer interactions
- **Real-time Chat**: Instant messaging with smooth user experience
- **Minimizable**: Can be minimized to save screen space
- **Responsive Design**: Works seamlessly on all device sizes

### 📊 Lead Management Dashboard
- **Real-time Updates**: Live data synchronization with Firebase
- **Lead Status Tracking**: Monitor leads through different stages (New, Contacted, Qualified, Converted)
- **Search & Filter**: Find leads quickly with advanced filtering options
- **Export Functionality**: Download leads data in CSV format
- **Edit & Update**: Modify lead information directly from the dashboard

### 🔗 Firebase Integration
- **Cloud Database**: Secure data storage with Firestore
- **Real-time Sync**: Instant updates across all connected devices
- **Scalable**: Handles growing data requirements efficiently

## Technology Stack

- **Frontend**: React 18, React Router, Styled Components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (ready for implementation)
- **Icons**: React Icons
- **Styling**: Modern CSS with responsive design

## Prerequisites

Before running this application, you need:

1. **Node.js** (version 14 or higher)
2. **npm** or **yarn** package manager
3. **Firebase Project** with Firestore enabled

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd customer-service-chatbot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Set up security rules for your database

#### Update Firebase Config
1. Get your Firebase configuration from the project settings
2. Update `src/firebase/config.js` with your actual Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id"
};
```

#### Set Up Firestore Security Rules
In your Firebase console, go to Firestore Database > Rules and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{document} {
      allow read, write: if true; // For development - customize for production
    }
  }
}
```

### 4. Dashboard Website Integration

To send leads to your dashboard website, update the `sendLeadToDashboard` function in `src/components/Chatbot.js`:

```javascript
const sendLeadToDashboard = async (leadData) => {
  try {
    // Replace with your actual dashboard website endpoint
    const dashboardUrl = 'https://your-actual-dashboard-website.com/api/leads';
    
    await fetch(dashboardUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-api-key' // If required
      },
      body: JSON.stringify(leadData)
    });
  } catch (error) {
    console.error('Error sending lead to dashboard:', error);
  }
};
```

### 5. Start the Application
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Chatbot.js          # Main chatbot component
│   └── Dashboard.js        # Lead management dashboard
├── firebase/
│   └── config.js           # Firebase configuration
├── App.js                  # Main application component
├── index.js                # Application entry point
└── index.css               # Global styles
```

## Usage

### For Customers
1. Visit the homepage to see the chatbot
2. Click on the chat widget to start a conversation
3. Ask questions about services, pricing, or support
4. Fill out the lead form when prompted to get more information

### For Administrators
1. Navigate to `/dashboard` to access the lead management system
2. View all captured leads with real-time updates
3. Update lead statuses and information
4. Export lead data for analysis
5. Search and filter leads as needed

## Customization

### Chatbot Responses
Modify the `generateBotResponse` function in `Chatbot.js` to customize bot responses based on your business needs.

### Lead Fields
Update the lead form fields in `Chatbot.js` to capture additional information relevant to your business.

### Dashboard Features
Extend the dashboard with additional features like:
- Email notifications
- Lead assignment to sales representatives
- Integration with CRM systems
- Advanced analytics and reporting

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Deploy to Other Platforms
The built application can be deployed to any static hosting service like:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

## Security Considerations

- **Firebase Rules**: Implement proper Firestore security rules for production
- **API Keys**: Never expose Firebase config in public repositories
- **CORS**: Configure CORS settings for your dashboard website
- **Rate Limiting**: Implement rate limiting for lead submissions

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Verify your Firebase configuration
   - Check if Firestore is enabled
   - Ensure proper security rules

2. **Chatbot Not Appearing**
   - Check browser console for errors
   - Verify all dependencies are installed
   - Ensure React components are properly imported

3. **Leads Not Saving**
   - Check Firebase console for errors
   - Verify Firestore permissions
   - Check network connectivity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the Firebase documentation for database-related issues

## Roadmap

- [ ] User authentication and role-based access
- [ ] Advanced chatbot AI with machine learning
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] CRM integration
- [ ] Email automation
- [ ] Customer satisfaction surveys

