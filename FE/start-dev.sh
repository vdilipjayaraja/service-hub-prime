
#!/bin/bash
echo "Starting PostgreSQL database..."
docker-compose up -d

echo "Waiting for database to be ready..."
sleep 5

echo "Starting FastAPI backend..."
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py &

echo "Starting React frontend..."
cd ..
npm install
npm run dev

echo "Application is running!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
