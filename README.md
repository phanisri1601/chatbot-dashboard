# IM Solutions AI Chatbot

A sophisticated AI-powered chatbot for IM Solutions, a full-service advertising and digital marketing agency based in Bangalore, India. This chatbot provides dynamic responses based on comprehensive website data and company information.

## 🌟 Features

- **Intelligent Responses**: Powered by advanced RAG (Retrieval-Augmented Generation) technology
- **Comprehensive Knowledge**: Scrapes and indexes all IM Solutions website content
- **Modern UI**: Beautiful, responsive chat interface with professional design
- **Multiple LLM Support**: Works with OpenAI GPT, Google Gemini, or local models
- **Real-time Chat**: Interactive conversation with typing indicators and suggestions
- **Source Attribution**: Shows which pages/sources were used for responses
- **Mobile Responsive**: Works perfectly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the files, navigate to the project directory
   cd imsolutions-chatbot
   ```

2. **Run the automated setup**
   ```bash
   python setup.py
   ```

   This will automatically:
   - Install all required dependencies
   - Scrape the IM Solutions website
   - Build the vector index
   - Test the chatbot

3. **Start the chatbot**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to: `http://localhost:7860`

### ✨ Features
- **Concise Responses**: 1-2 line answers for quick information
- **Contact Information**: Includes phone number (+91-8880564488) and email
- **Modern UI**: Right-positioned chat widget with dark/light theme
- **Interactive Controls**: Minimize, close, refresh, and theme toggle
- **Clean Interface**: No source attribution clutter
- **Professional Design**: Modern chat interface
- **Fast Performance**: Quick response times

## 📁 Project Structure

```
imsolutions-chatbot/
├── app.py                 # Main Flask application
├── setup.py              # Automated setup script
├── requirements.txt      # Python dependencies
├── README.md            # This file
├── .env                 # Configuration file (auto-generated)
├── src/
│   ├── simple_scraper.py # Website scraper
│   ├── rag.py          # RAG pipeline
│   ├── build_index.py  # Vector index builder
│   ├── config.py       # Configuration settings
│   └── utils.py        # Utility functions
├── static/
│   └── index.html      # Chatbot UI
├── data/
│   ├── seed.txt        # Initial company data
│   └── website/        # Scraped website content
└── chroma_db/          # Vector database
```

## 🔧 Configuration

The chatbot can be configured through the `.env` file:

```env
# Optional LLM API Keys (leave empty to use local models)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Embedding model (free & local)
EMBED_MODEL_NAME=all-MiniLM-L6-v2

# Vector store location
CHROMA_DIR=./chroma_db

# Text chunking settings
CHUNK_SIZE=800
CHUNK_OVERLAP=120
```

### LLM Options

1. **Local Models (Default)**: Uses free, local models for text generation
2. **Google Gemini**: Add your `GEMINI_API_KEY` for enhanced responses
3. **OpenAI GPT**: Add your `OPENAI_API_KEY` for premium responses

## 🎯 What the Chatbot Can Do

The IM Solutions AI assistant can help with:

- **Service Information**: Detailed explanations of all IM Solutions services
- **Digital Marketing**: SEO, SEM, social media marketing, PPC campaigns
- **Creative Design**: Branding, graphic design, website development
- **Advertising**: Traditional and digital advertising solutions
- **Contact Information**: Office locations, contact details
- **Company Information**: About IM Solutions, expertise, experience
- **Industry Knowledge**: Marketing trends, best practices
- **Project Examples**: Case studies and success stories

## 💬 Example Conversations

**User**: "What services do you offer?"

**Assistant**: "IM Solutions provides full-service advertising and digital marketing, including mobile and web app development, email marketing, online reputation management, and brand building. We also offer 360° digital strategies encompassing SEO, social media marketing, and paid advertising."

**User**: "Contact information"

**Assistant**: "Phone: +91-8880564488, Email: info@imsolutions.mobi, Office: Bangalore"

**User**: "SEO services"

**Assistant**: "IM Solutions offers comprehensive SEO services including technical SEO, on-page, off-page optimization, and link building. We analyze your website and create strategies to improve organic search traffic and rankings."

## 🔄 Updating the Knowledge Base

To update the chatbot with fresh website content:

1. **Re-scrape the website**
   ```bash
   python src/simple_scraper.py
   ```

2. **Rebuild the index**
   ```bash
   python -m src.build_index
   ```

3. **Restart the application**
   ```bash
   python app.py
   ```

## 🛠️ Manual Setup (Alternative)

If you prefer manual setup:

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Scrape the website**
   ```bash
   python -m src.scraper
   ```

3. **Build the vector index**
   ```bash
   python -m src.build_index
   ```

4. **Start the application**
   ```bash
   python app.py
   ```

## 🎨 Customization

### UI Customization

The chatbot interface can be customized by editing `static/index.html`:
- **Theme Colors**: Modify CSS variables in `:root` for light/dark themes
- **Positioning**: Change `bottom` and `right` values in `.chat-widget`
- **Size**: Adjust `width` and `height` in `.chat-widget`
- **Colors**: Update accent colors and gradients
- **Controls**: Add/remove header buttons and functionality

### Response Customization

Modify the RAG pipeline in `src/rag.py`:
- Adjust the system prompt for different tones
- Change the number of retrieved documents
- Modify the response generation logic

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `app.py` (line 22)
   - Or kill the process using the port

2. **Memory issues with large datasets**
   - Reduce `CHUNK_SIZE` in `.env`
   - Use a smaller embedding model

3. **Slow responses**
   - Consider using API-based LLMs (Gemini/OpenAI)
   - Optimize chunk size and overlap

4. **Scraping errors**
   - Check internet connection
   - Verify the website is accessible
   - Adjust scraping delays in `src/scraper.py`

### Logs and Debugging

Enable debug mode by setting `debug=True` in `app.py` for detailed error messages.

## 📞 Support

For technical support or questions about the IM Solutions chatbot:

- **IM Solutions**: info@imsolutions.mobi
- **Website**: https://www.imsolutions.co/
- **Office**: 921, Laxmi Tower, 4th Floor, 5th Main Rd, Sector 7, HSR Layout, Bengaluru

## 📄 License

This project is developed for IM Solutions. Please contact IM Solutions for usage permissions and licensing information.

## 🤝 Contributing

This is a proprietary project for IM Solutions. For suggestions or improvements, please contact the development team.

---

**Built with ❤️ for IM Solutions** 