import os
from dotenv import load_dotenv
load_dotenv()

# Optional LLMs
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Embedding model (free & local)
EMBED_MODEL_NAME = os.getenv("EMBED_MODEL_NAME", "all-MiniLM-L6-v2")

# Vector store (Chroma path on disk)
CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma_db")

# Chunking
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "800"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "120"))
