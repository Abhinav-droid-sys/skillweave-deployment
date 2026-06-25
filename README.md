# SkillWeave — AI Occupation Intelligence

SkillWeave is an advanced, AI-powered semantic search and classification engine designed to seamlessly map messy, real-world, and multilingual job titles to standard **NCO 2015 (National Classification of Occupations)** codes. 

By leveraging cutting-edge Vector Databases, cloud-based LLM reranking (Qwen API), and multilingual translation models, SkillWeave transforms how occupational data is standardized across India and beyond, seamlessly integrating advanced AI intelligence into your workflow.

---

##  Core Functionality

### 1. Multilingual Semantic Search
- **Language Agnostic**: Search using natural language in English, Hindi, Bengali, Tamil, and more. 
- **Auto-Response Matching**: The backend automatically detects your input language and dynamically translates the resulting standard occupation titles back into your native language.
- **Global UI Translation**: A built-in Google Translate module in the Navbar allows the entire dashboard UI to be instantly translated into any language.

### 2. High-Speed Batch Processing
- **CSV Uploads**: Upload massive datasets of unstandardized occupational strings.
- **Optimized Concurrency**: Processes batches at blazing speeds using chunk-based dispatching on the frontend and highly optimized `ThreadPoolExecutor` parallelization on the FastAPI backend.

### 3. Cloud LLM Intelligence & Reranking (Qwen API)
- **High Performance**: Connects to scalable cloud LLM APIs to process data swiftly without requiring expensive local hardware.
- **Query Normalization**: Cleans up typos, slang, and phonetic Hinglish (e.g., "kheti karne wala" → "farmer") before searching.
- **Smart Reranking**: Uses cloud-hosted Qwen models to analyze the top vector search results and re-order them based on deep contextual understanding, providing human-level accuracy.

### 4. Interactive Analytics Dashboard
- **Real-Time Metrics**: Visualizes system performance, search accuracy, and LLM vs. Baseline comparisons using beautiful Recharts.
- **Language Radar**: Tracks the distribution of languages being processed.
- **Latency Tracking**: Monitors API performance to ensure sub-second response times.

---

## 🛠 Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- React & TypeScript
- Tailwind CSS (Custom themes & Glassmorphism UI)
- Zustand (State Management)
- Recharts (Data Visualization)

**Backend:**
- Python & FastAPI
- Qdrant (Vector Database)
- FastEmbed (Local sentence-transformers)
- Cloud LLM API (Qwen)
- Deep-Translator (Multilingual support)

---

##  Full Installation Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Git**
- **Ollama**: Download and install from [ollama.com](https://ollama.com)

### 1. Clone the Repository
```bash
git clone https://github.com/Abhinav-droid-sys/skillweave-deployment.git
cd skillweave-final-project
```

### 2. Setup Cloud LLM (Qwen API)
SkillWeave uses the Qwen model for high-accuracy semantic normalization and reranking. You will need an API key from an OpenAI-compatible cloud provider (such as DashScope, Together AI, DeepInfra, etc.) that hosts the Qwen model.

### 3. Backend Setup
The backend runs on FastAPI and requires Python dependencies.

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` directory. Configure it to point to your chosen cloud API provider:
```env
OLLAMA_BASE_URL="http://localhost:11434/v1"
LOCAL_MODEL_NAME="qwen3.6:35b"
```

**Start the Backend Server:**
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The backend API will now be running at `http://127.0.0.1:8000`*

### 4. Frontend Setup
The frontend is built with Next.js. Open a **new terminal window** and navigate to the frontend directory.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will now be running at `http://localhost:3000`*

---

## Docker Instructions
You can run this backend independently using Docker, or as part of the full stack using Docker Compose.
### Running via Docker Compose (Recommended)
To run the entire application stack (Frontend, Backend, and Qdrant) at once, go to the root of the repository and use the provided `Skillweave-containerized.yml` compose file:
```bash
cd ..
docker-compose -f Skillweave-containerized.yml up --build -d
```
The backend API will be available at `http://localhost:8000`.
### Running the Backend Individually
If you only want to containerize the backend:
1. Build the Docker image:
   ```bash
   docker build -t nco-backend .
   ```
2. Run the container:
   ```bash
   docker run -d -p 8000:8000 --env-file .env --name nco-backend nco-backend
   ```
   *(Note: This requires a `.env` file present in the `backend/` directory, and Qdrant needs to be accessible from this container.)*
## API Documentation
Once the backend is running, you can explore the interactive API documentation:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 💻 Usage Instructions

1. **Access the App**: Open your browser and navigate to `http://localhost:3000`.
2. **Search Manually**: Use the main dashboard to test single queries in any language.
3. **Batch Process**: Navigate to the "Batch Coding" tab, upload a CSV containing a column of occupation texts, and watch the system classify them concurrently.
4. **View Metrics**: Click the "Metrics" tab in the navigation bar to see real-time performance analytics, language distribution, and Qwen model impact charts.
5. **Change UI Language**: Use the dropdown widget in the top-right navigation bar to translate the entire application interface into your preferred language.
