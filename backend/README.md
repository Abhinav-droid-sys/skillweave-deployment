# SkillWeave Backend

This is the FastAPI backend for the SkillWeave Semantic Search platform. It provides endpoints for hybrid vector search (dense + sparse), reranking, translations, and an admin dashboard.

## Prerequisites
- Python 3.11+
- Qdrant Vector Database (running locally or via Docker)

## Local Development Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables by adding a `.env` file to this directory and filling in your credentials.

4. Run the server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

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
