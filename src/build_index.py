import os, uuid
from src.utils import read_all_texts, chunk_text
from src.config import CHUNK_SIZE, CHUNK_OVERLAP
from sentence_transformers import SentenceTransformer
import chromadb
from src.config import EMBED_MODEL_NAME, CHROMA_DIR

def load_and_chunk(data_dir: str):
    """Load and chunk all text files from the data directory"""
    raw_docs = read_all_texts(data_dir)
    records = []
    
    for d in raw_docs:
        chunks = chunk_text(d["text"], CHUNK_SIZE, CHUNK_OVERLAP)
        for i, ch in enumerate(chunks):
            # Extract source information
            source = d["id"]
            if "website" in source:
                source_type = "website"
            else:
                source_type = "seed"
            
            records.append({
                "id": f"{d['id']}::{i}::{uuid.uuid4().hex[:8]}",
                "source": source,
                "source_type": source_type,
                "text": ch,
                "chunk_index": i
            })
    
    return records

def build_vector_index(records):
    """Build the vector index using ChromaDB"""
    print(f"Building vector index with {len(records)} chunks...")
    
    # Initialize embedding model
    embedder = SentenceTransformer(EMBED_MODEL_NAME)
    print(f"Using embedding model: {EMBED_MODEL_NAME}")
    
    # Initialize ChromaDB
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    
    # Clear existing collection if it exists
    try:
        client.delete_collection("imsolutions")
        print("Cleared existing collection")
    except:
        pass
    
    # Create new collection
    collection = client.create_collection("imsolutions")
    
    # Prepare data for insertion
    ids = [r["id"] for r in records]
    texts = [r["text"] for r in records]
    metadatas = [
        {
            "source": r["source"],
            "source_type": r["source_type"],
            "chunk_index": r["chunk_index"]
        }
        for r in records
    ]
    
    # Generate embeddings
    print("Generating embeddings...")
    embeddings = embedder.encode(texts, normalize_embeddings=True).tolist()
    
    # Add to collection
    print("Adding to vector database...")
    collection.add(
        embeddings=embeddings,
        documents=texts,
        metadatas=metadatas,
        ids=ids
    )
    
    print(f"Successfully built index with {len(records)} chunks")
    return collection

def main():
    print("Starting IM Solutions chatbot index building...")
    
    # Load and chunk all data
    print("Loading and chunking data...")
    records = load_and_chunk("./data")
    
    # Count by source type
    website_chunks = sum(1 for r in records if r["source_type"] == "website")
    seed_chunks = sum(1 for r in records if r["source_type"] == "seed")
    
    print(f"Total chunks: {len(records)}")
    print(f"Website chunks: {website_chunks}")
    print(f"Seed chunks: {seed_chunks}")
    
    # Build vector index
    collection = build_vector_index(records)
    
    # Print some statistics
    print("\nIndex Statistics:")
    print(f"Collection name: {collection.name}")
    print(f"Total documents: {collection.count()}")
    
    print("\nIndex building completed successfully!")

if __name__ == "__main__":
    main()
