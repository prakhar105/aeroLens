from fastapi import APIRouter, UploadFile, File
from ultralytics import YOLO
import shutil, os, uuid, requests

router = APIRouter(prefix="/detection", tags=["Detection"])

# Load YOLOv8 nano model (fast for dev)
model = YOLO("yolov8x.pt")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Backend API endpoint (Node.js server)
BACKEND_URL = "http://localhost:5000/detections"

@router.post("/")
async def detect_image(image: UploadFile = File(...)):
    # Generate unique ID for this upload
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, file_id + "_" + image.filename)

    # Save uploaded file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Run YOLO inference
    results = model(file_path)

    detections = []
    for r in results[0].boxes.data.tolist():
        x1, y1, x2, y2, conf, cls = r
        detection = {
            "uploadId": file_id,  # link with backend
            "label": model.names[int(cls)],
            "confidence": float(conf),
            "bbox": [x1, y1, x2, y2]
        }
        detections.append(detection)

        # Send detection to backend API
        try:
            requests.post(BACKEND_URL, json=detection)
        except Exception as e:
            print("❌ Could not send detection to backend:", e)

    # Return results to client too
    return {
        "file": image.filename,
        "uploadId": file_id,
        "detections": detections
    }
