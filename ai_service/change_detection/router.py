from fastapi import APIRouter, UploadFile, File
import shutil, os, uuid

router = APIRouter(prefix="/change", tags=["Change Detection"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def change_detection(image1: UploadFile = File(...), image2: UploadFile = File(...)):
    id1 = str(uuid.uuid4())
    id2 = str(uuid.uuid4())
    path1 = os.path.join(UPLOAD_DIR, id1 + "_" + image1.filename)
    path2 = os.path.join(UPLOAD_DIR, id2 + "_" + image2.filename)

    with open(path1, "wb") as buffer1, open(path2, "wb") as buffer2:
        shutil.copyfileobj(image1.file, buffer1)
        shutil.copyfileobj(image2.file, buffer2)

    # TODO: Replace with actual model inference
    return {
        "message": "✅ Change detection placeholder",
        "image1": image1.filename,
        "image2": image2.filename,
        "changes": []
    }
