# PoC Around LangChain

# Setup

This is required to run the scripts.
```bash
export OPENAI_API_KEY=xxxxx
export GOOGLE_API_KEY=xxxxx
```

# Files

| File | Status | Description |
|------|--------|-------------|
| openAI.01.llm.js | ✅ | Basic LLM using OpenAI |
| ollama.01.llm.js | ✅ | Basic LLM using Ollama |
| ollama.02.RAG.js | ✅ | RAG using Ollama |
| ollama.03.embedding.js | ✅ | Embedding using Ollama |
| gemini.01.llm.js | ✅ | Basic LLM using Gemini |
| gemini.02.RAG.js | ⛔️ | RAG using Gemini |

The `gemini.02.RAG.js` is not complete and won't work.