import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_title": "CropDoc AI",
      "diagnose": "Diagnose",
      "history": "History",
      "dashboard": "Dashboard",
      "hero_title": "Smart Plant Disease Diagnosis & Recovery",
      "hero_subtitle": "Upload a photo of your crop. Get an AI-driven diagnosis with evidence-backed treatment plans.",
      "start_diagnosis": "Start Diagnosis",
      "ai_detection": "AI-Powered Detection",
      "trusted_evidence": "Trusted Evidence",
      "track_recovery": "Track Recovery",
    }
  },
  ta: {
    translation: {
      "app_title": "க்ராப்டாக் ஏஐ",
      "diagnose": "கண்டறிதல்",
      "history": "வரலாறு",
      "dashboard": "கட்டுப்பாட்டகம்",
      "hero_title": "திறன்மிக்க தாவர நோய் கண்டறிதல் மற்றும் மீட்பு",
      "hero_subtitle": "உங்கள் பயிரின் புகைப்படத்தை பதிவேற்றவும். AI மூலம் நோய் கண்டறிந்து சான்றுகளுடன் சிகிச்சை பெறவும்.",
      "start_diagnosis": "பரிசோதனையைத் தொடங்கு",
      "ai_detection": "AI-மூலம் நேரடி கண்டறிதல்",
      "trusted_evidence": "நம்பகமான சான்றுகள்",
      "track_recovery": "மீட்பைக் கண்காணிக்கவும்",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
