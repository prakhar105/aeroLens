from fastapi import APIRouter, UploadFile, File
from ultralytics import YOLO
import shutil, os, uuid

router = APIRouter(prefix="/segmentation", tags=["Segmentation"])
model = YOLO("yolov8n-seg.pt")
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def segment_image(image: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, file_id + "_" + image.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    results = model(file_path)

    masks = []
    for r in results[0].masks.data.tolist():
        masks.append(r)  # each mask is a polygon/bitmap

    return {"file": image.filename, "masks": masks}
