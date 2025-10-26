import openai
from flask import current_app

class OpenAIService:
    
    @staticmethod
    def _get_client():
        """Initialize OpenAI client"""
        openai.api_key = current_app.config['OPENAI_API_KEY']
        return openai
    
    @staticmethod
    def generate_climate_summary(property_data):
        """Generate climate risk summary using OpenAI"""
        client = OpenAIService._get_client()
        
        scores = property_data.get('scores', {})
        prompt = f"""
        You are a climate risk analysis expert for ClimaScan in Kenya.
        
        Property: {property_data.get('name')}
        Location: {property_data.get('address')}
        Coordinates: {property_data.get('latitude')}, {property_data.get('longitude')}
        
        Climate Risk Scores:
        - Flood Risk: {scores.get('flood_score', 0):.1f}%
        - Heat Stress: {scores.get('heat_score', 0):.1f}%
        - Drainage Issues: {scores.get('drainage_score', 0):.1f}%
        - Coastal Erosion: {scores.get('erosion_score', 0):.1f}%
        - Overall Risk: {scores.get('overall_score', 0):.1f}%
        
        Generate a comprehensive climate risk summary for this property in Kenya.
        Include:
        1. Overall risk assessment
        2. Key risk factors (flood, heat, drainage)
        3. Specific vulnerabilities
        4. Brief actionable recommendations
        
        Keep the response professional and concise (200-300 words).
        """
        
        try:
            response = client.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are ClimaScan AI, a climate risk analysis expert specializing in Kenyan properties."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI API Error: {e}")
            # Fallback response
            flood_score = scores.get('flood_score', 0)
            heat_score = scores.get('heat_score', 0)
            drainage_score = scores.get('drainage_score', 0)
            
            return f"""The property lies within an urban area experiencing moderate climate risks.

- Flood Risk: {'High' if flood_score > 70 else 'Medium' if flood_score > 40 else 'Low'} - Urban flash flooding possible during heavy rains
- Heat Risk: {'High' if heat_score > 70 else 'Medium'} - Temperature extremes projected to rise 1.8°C by 2050
- Drainage: {'Poor' if drainage_score > 70 else 'Moderate'} - Stormwater management systems need improvement

AI Insight:
Climate adaptation should focus on green roofing and permeable paving to mitigate heat and waterlogging impacts."""
    
    @staticmethod
    def chat_with_ai(message, property_data=None, history=None):
        """Chat with OpenAI about climate risks"""
        client = OpenAIService._get_client()
        
        if history is None:
            history = []
        
        messages = [
            {"role": "system", "content": """You are ClimaScan AI, an expert climate risk assistant for properties in Kenya. 
            You help users understand flood risks, heat stress, drainage issues, and provide actionable recommendations.
            Be concise, professional, and provide specific insights about Kenyan climate patterns."""}
        ]
        
        # Add conversation history (last 5 messages)
        for h in history[-5:]:
            messages.append({
                "role": h.get("role", "user"),
                "content": h.get("content", "")
            })
        
        # Add property context if available
        if property_data:
            context = f"Current property: {property_data.get('name')} at {property_data.get('address')}"
            messages.append({"role": "system", "content": context})
        
        # Add user message
        messages.append({"role": "user", "content": message})
        
        try:
            response = client.ChatCompletion.create(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=400
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI Chat Error: {e}")
            return "I apologize, but I'm having trouble processing your request. Please try again or rephrase your question."

