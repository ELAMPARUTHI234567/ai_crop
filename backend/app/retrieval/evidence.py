def get_evidence(disease_name: str, crop: str = None):
    # In a real app, this would use FAISS/SentenceTransformers to search local agricultural references.
    # We will use a rule-based mock for common diseases unless model is heavily populated.
    
    # Feature C: Treatment Evidence Engine
    evidence_db = {
        "Tomato Early Blight": [
            {
                "title": "Managing Early Blight in Tomatoes",
                "publisher": "Agricultural Extension org",
                "url": "https://example.org/tomato-blight",
                "excerpt": "Remove infected bottom leaves. Apply copper-based fungicide every 7-10 days."
            }
        ],
        "Plant Disease (DEMO)": [
            {
                "title": "General Plant Health Guidelines",
                "publisher": "National Agriculture Institute",
                "url": "https://example.org/general-health",
                "excerpt": "Ensure proper watering, sunlight, and avoid crowding. Consult a local expert if symptoms persist."
            }
        ]
    }
    
    results = evidence_db.get(disease_name, [])
    if not results:
        results = [
            {
                "title": "Insufficient Supporting Evidence",
                "publisher": "CropDoc System",
                "url": "#",
                "excerpt": f"Our database does not have strongly verified treatments for '{disease_name}'. Please consult a qualified agricultural expert."
            }
        ]
    return results
