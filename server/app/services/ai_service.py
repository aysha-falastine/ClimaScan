import os
from flask import current_app
from huggingface_hub import InferenceClient

class HuggingFaceService:
    """Generates climate reports and summaries using Hugging Face."""

    def __init__(self):
        # Support multiple env var names: HF_API_KEY or HUGGINGFACE_API_KEY
        api_key = (
            os.getenv('HF_API_KEY')
            or os.getenv('HUGGINGFACE_API_KEY')
            or (current_app.config.get('HF_API_KEY') if current_app else None)
            or (current_app.config.get('HUGGINGFACE_API_KEY') if current_app else None)
        )
        self.client = InferenceClient(token=api_key) if api_key else None

    def generate_climate_report(self, property_data):
        """Generate a climate risk report."""
        if not self.client:
            return self._generate_fallback_report(property_data)

        prompt = self._build_report_prompt(property_data)
        try:
            result = self.client.text_generation(
                prompt,
                model="mistralai/Mistral-7B-Instruct-v0.2",
                max_new_tokens=1500,
                temperature=0.7
            )
            return result
        except Exception as e:
            print(f"Hugging Face error: {e}")
            return self._generate_fallback_report(property_data)

    def _build_report_prompt(self, property_data):
        """Build the report prompt text."""
        return f"""Generate a comprehensive climate risk assessment report for this property in Kenya:

Property Name: {property_data.get('name', 'Unknown Property')}
Location: {property_data.get('location', property_data.get('address', 'Unknown'))}
Coordinates: {property_data.get('latitude', 'N/A')}, {property_data.get('longitude', 'N/A')}

Include:
1. Executive summary
2. Flood risk and water hazards
3. Heat stress and temperature impacts
4. Drainage system adequacy
5. Future climate projections (10–25 years)
6. Adaptation recommendations
7. Estimated cost ranges

Format with clear sections and concise insights for Kenyan property owners."""

    def _generate_fallback_report(self, property_data):
        """Fallback in case Hugging Face is unavailable."""
        return f"""Climate Risk Report (Offline Mode)

Property: {property_data.get('name', 'Unknown Property')}
Location: {property_data.get('location', 'Unknown')}

Summary:
- Flood Risk: Moderate (recommend drainage check)
- Heat Stress: Increasing (suggest reflective roofing)
- Drainage: Needs inspection
- Climate Trend: Warming trend expected
- Recommendation: Improve ventilation, plant trees, monitor rainfall data."""
