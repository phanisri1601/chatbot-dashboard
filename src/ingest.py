import os, uuid
from src.utils import read_all_texts, chunk_text
from src.config import CHUNK_SIZE, CHUNK_OVERLAP

def load_and_chunk(data_dir: str):
    raw_docs = read_all_texts(data_dir)
    records = []
    for d in raw_docs:
        chunks = chunk_text(d["text"], CHUNK_SIZE, CHUNK_OVERLAP)
        for i, ch in enumerate(chunks):
            records.append({
                "id": f"{d['id']}::{i}::{uuid.uuid4().hex[:8]}",
                "source": d["id"],
                "text": ch
            })
    return records

if __name__ == "__main__":
    recs = load_and_chunk("./data")
    print(f"Prepared {len(recs)} chunks.")
