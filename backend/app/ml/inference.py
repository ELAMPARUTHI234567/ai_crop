import os
import json
from PIL import Image

try:
    import torch
    import torchvision.transforms as transforms
    HAS_TORCH = True
except ImportError:
    HAS_TORCH = False

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "model.pth")
LABELS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "class_labels.json")

class CropDiseaseModel:
    def __init__(self):
        self.is_loaded = False
        self.model = None
        self.labels = []
        if HAS_TORCH:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self.transform = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])
        else:
            self.device = None
            self.transform = None
        
        self.load_model()

        
    def load_model(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(LABELS_PATH):
            try:
                # Load custom model structure here, assume trained MobileNetV2 / ResNet
                # self.model = torch.load(MODEL_PATH, map_location=self.device)
                # self.model.eval()
                with open(LABELS_PATH, "r") as f:
                    self.labels = json.load(f)
                self.is_loaded = True
            except Exception as e:
                print(f"Error loading model: {e}")
                self.is_loaded = False
        else:
            self.is_loaded = False

    def predict(self, image_path: str):
        if not self.is_loaded:
            return {
                "demo_mode": True,
                "error": "Model weights missing. Please run the training script. Returning explicitly labeled DEMO data.",
                "prediction": "Plant Disease (DEMO)",
                "confidence": 0.0,
                "top_3": []
            }
            
        try:
            image = Image.open(image_path).convert('RGB')
            tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                outputs = self.model(tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                
            top3_prob, top3_catid = torch.topk(probabilities, 3)
            
            top_3 = [
                {"class": self.labels[catid.item()], "confidence": float(prob.item())}
                for prob, catid in zip(top3_prob, top3_catid)
            ]
            
            return {
                "demo_mode": False,
                "prediction": top_3[0]["class"],
                "confidence": top_3[0]["confidence"],
                "top_3": top_3
            }
        except Exception as e:
            raise RuntimeError(f"Inference failed: {str(e)}")

model_instance = CropDiseaseModel()
