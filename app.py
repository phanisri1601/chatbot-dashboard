from flask import Flask, request, jsonify, send_from_directory
from src.rag import RAGPipeline

app = Flask(__name__, static_url_path="", static_folder="static")
rag = RAGPipeline()

@app.route("/")
def home():
    return send_from_directory("static", "index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    query = data.get("query","").strip()
    if not query:
        return jsonify({"answer":"Please ask a question.", "sources":[]})
    answer, sources = rag.ask(query)
    return jsonify({"answer": answer, "sources": sources})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=True)
