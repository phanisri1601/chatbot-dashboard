from sentence_transformers import SentenceTransformer
import chromadb
from src.config import EMBED_MODEL_NAME, CHROMA_DIR, GEMINI_API_KEY, OPENAI_API_KEY

# Optional LLMs
def generate_answer(prompt: str) -> str:
    # Try Gemini
    if GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            resp = model.generate_content(prompt)
            return resp.text.strip()
        except Exception:
            pass
    # Try OpenAI
    if OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_API_KEY)
            chat = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role":"user","content":prompt}],
                temperature=0.2,
            )
            return chat.choices[0].message.content.strip()
        except Exception:
            pass
    # Local fallback (tiny, CPU)
    try:
        from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
        import torch
        name = "google/flan-t5-base"
        tok = AutoTokenizer.from_pretrained(name)
        mdl = AutoModelForSeq2SeqLM.from_pretrained(name)
        input_ids = tok(prompt, return_tensors="pt", truncation=True, max_length=1024).input_ids
        out = mdl.generate(input_ids, max_new_tokens=256, temperature=0.2)
        return tok.decode(out[0], skip_special_tokens=True)
    except Exception:
        return "Sorry, I couldn't generate an answer right now."

class RAGPipeline:
    def __init__(self):
        self.embedder = SentenceTransformer(EMBED_MODEL_NAME)
        self.client = chromadb.PersistentClient(path=CHROMA_DIR)
        self.col = self.client.get_or_create_collection("imsolutions")

    def retrieve(self, query: str, k=5):
        qemb = self.embedder.encode([query], normalize_embeddings=True).tolist()[0]
        res = self.col.query(query_embeddings=[qemb], n_results=k, include=["documents","metadatas","distances"])
        docs = res["documents"][0]
        metas = res["metadatas"][0]
        return list(zip(docs, metas))

    def build_prompt(self, query: str, docs):
        context = ""
        for i, (d,m) in enumerate(docs, start=1):
            source_info = m.get('source', '')
            if 'website' in source_info:
                source_type = "Website Page"
            else:
                source_type = "Company Information"
            context += f"[{source_type} | {source_info}] {d}\n"
        
        system = (
            "You are an AI assistant for IM Solutions, a full-service advertising and digital marketing agency "
            "based in Bangalore, India. You help potential clients and visitors understand IM Solutions' services.\n\n"
            "Guidelines:\n"
            "- Use ONLY the provided context to answer questions\n"
            "- Be professional, helpful, and very concise\n"
            "- Keep responses to 1-2 lines maximum\n"
            "- Focus on key points only\n"
            "- If asked about contact information, mention: Phone: +91-8880564488, Email: info@imsolutions.mobi, Office: Bangalore\n"
            "- If the answer isn't in the context, politely say you don't have that information and suggest "
            "contacting IM Solutions directly at +91-8880564488\n"
            "- Always maintain a professional and friendly tone"
        )
        return f"{system}\n\nContext:\n{context}\n\nUser Question: {query}\n\nAssistant:"

    def ask(self, query: str):
        docs = self.retrieve(query, k=6)
        prompt = self.build_prompt(query, docs)
        answer = generate_answer(prompt)
        # Return empty sources list to hide source attribution
        return answer, []
