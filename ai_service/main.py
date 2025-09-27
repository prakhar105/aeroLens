from fastapi import FastAPI
from detection.router import router as detection_router
from segmentation.router import router as segmentation_router
from change_detection.router import router as change_router

app = FastAPI(title="AI Microservice for Aerial Images")

app.include_router(detection_router)
app.include_router(segmentation_router)
app.include_router(change_router)
