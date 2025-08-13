#!/usr/bin/env python3
"""
IM Solutions Chatbot Setup Script
This script will:
1. Scrape the IM Solutions website
2. Build the vector index
3. Set up the chatbot
"""

import os
import sys
import subprocess
import time

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{'='*60}")
    print(f"🔄 {description}")
    print(f"{'='*60}")
    print(f"Running: {command}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print("✅ Success!")
        if result.stdout:
            print("Output:", result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stdout:
            print("Stdout:", e.stdout)
        if e.stderr:
            print("Stderr:", e.stderr)
        return False

def check_dependencies():
    """Check if required packages are installed"""
    print("🔍 Checking dependencies...")
    
    required_packages = [
        'flask', 'python-dotenv', 'sentence-transformers', 
        'chromadb', 'beautifulsoup4', 'markdown', 'lxml', 
        'transformers', 'torch', 'requests', 'openai'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        install_command = f"pip install {' '.join(missing_packages)}"
        if not run_command(install_command, "Installing missing packages"):
            return False
    else:
        print("✅ All dependencies are installed!")
    
    return True

def scrape_website():
    """Scrape the IM Solutions website"""
    print("\n🌐 Starting website scraping...")
    
    # Check if website data already exists
    if os.path.exists("data/website") and os.listdir("data/website"):
        print("📁 Website data already exists. Skipping scraping...")
        return True
    
    # Run the scraper
    scraper_command = "python src/simple_scraper.py"
    return run_command(scraper_command, "Scraping IM Solutions website")

def build_index():
    """Build the vector index"""
    print("\n🔍 Building vector index...")
    
    # Check if index already exists
    if os.path.exists("chroma_db") and os.listdir("chroma_db"):
        print("📁 Vector index already exists. Rebuilding...")
    
    build_command = "python -m src.build_index"
    return run_command(build_command, "Building vector index")

def create_env_file():
    """Create .env file with default settings"""
    env_file = ".env"
    if os.path.exists(env_file):
        print("📁 .env file already exists. Skipping...")
        return True
    
    print("📝 Creating .env file...")
    
    env_content = """# IM Solutions Chatbot Configuration

# Optional LLM API Keys (leave empty to use local models)
GEMINI_API_KEY=
OPENAI_API_KEY=

# Embedding model (free & local)
EMBED_MODEL_NAME=all-MiniLM-L6-v2

# Vector store (Chroma path on disk)
CHROMA_DIR=./chroma_db

# Chunking settings
CHUNK_SIZE=800
CHUNK_OVERLAP=120
"""
    
    try:
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("✅ .env file created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def test_chatbot():
    """Test the chatbot"""
    print("\n🧪 Testing chatbot...")
    
    # Start the Flask app in background
    print("🚀 Starting Flask app...")
    try:
        # Import and test the RAG pipeline
        from src.rag import RAGPipeline
        
        rag = RAGPipeline()
        test_query = "What services does IM Solutions offer?"
        
        print(f"Testing query: '{test_query}'")
        answer, sources = rag.ask(test_query)
        
        print("✅ Chatbot test successful!")
        print(f"Answer: {answer[:200]}...")
        print(f"Sources: {sources}")
        
        return True
        
    except Exception as e:
        print(f"❌ Chatbot test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 IM Solutions Chatbot Setup")
    print("=" * 50)
    
    # Step 1: Check dependencies
    if not check_dependencies():
        print("❌ Failed to install dependencies. Exiting...")
        sys.exit(1)
    
    # Step 2: Create .env file
    if not create_env_file():
        print("❌ Failed to create .env file. Exiting...")
        sys.exit(1)
    
    # Step 3: Scrape website
    if not scrape_website():
        print("❌ Failed to scrape website. Exiting...")
        sys.exit(1)
    
    # Step 4: Build index
    if not build_index():
        print("❌ Failed to build index. Exiting...")
        sys.exit(1)
    
    # Step 5: Test chatbot
    if not test_chatbot():
        print("❌ Failed to test chatbot. Exiting...")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("🎉 Setup completed successfully!")
    print("="*60)
    print("\n📋 Next steps:")
    print("1. Run the chatbot: python app.py")
    print("2. Open your browser to: http://localhost:7860")
    print("3. Start chatting with the IM Solutions AI assistant!")
    print("\n💡 Optional: Add your API keys to .env file for better responses")
    print("   - GEMINI_API_KEY for Google Gemini")
    print("   - OPENAI_API_KEY for OpenAI GPT")
    print("\n✨ The chatbot now gives concise, 2-3 line responses without source attribution.")

if __name__ == "__main__":
    main() 