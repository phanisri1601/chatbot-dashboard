import os, re, glob, markdown
from bs4 import BeautifulSoup

TEXT_EXT = {".txt", ".md", ".html", ".htm"}

def read_all_texts(data_dir: str):
    docs = []
    for path in glob.glob(os.path.join(data_dir, "**/*"), recursive=True):
        if not os.path.isfile(path):
            continue
        ext = os.path.splitext(path)[1].lower()
        if ext not in TEXT_EXT: 
            continue
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            raw = f.read()
        text = normalize_text(raw, ext)
        if text.strip():
            docs.append({"id": path, "text": text})
    return docs

def normalize_text(raw: str, ext: str):
    if ext in {".html", ".htm"}:
        soup = BeautifulSoup(raw, "lxml")
        return soup.get_text(separator="\n")
    if ext == ".md":
        html = markdown.markdown(raw)
        soup = BeautifulSoup(html, "lxml")
        return soup.get_text(separator="\n")
    return raw

def chunk_text(text: str, chunk_size=800, overlap=120):
    text = re.sub(r"\s+", " ", text).strip()
    chunks = []
    start = 0
    while start < len(text):
        end = min(len(text), start + chunk_size)
        chunk = text[start:end]
        chunks.append(chunk)
        if end == len(text): break
        start = max(0, end - overlap)
    return chunks
