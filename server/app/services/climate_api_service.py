# app/services/climate_api_service.py
import os
from openai import OpenAI

# Initialize OpenAI client with new syntax
try:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except Exception as e:
    print(f"Warning: OpenAI initialization failed: {e}")
    client = None

def get_ai_response(message, history=None):
    """Get AI response from OpenAI GPT"""
    
    # Check if OpenAI is configured
    if not client or not os.getenv("OPENAI_API_KEY"):
        print("⚠️  OpenAI not configured - returning mock response")
        return get_mock_response(message)
    
    # Build messages array
    messages = [
        {
            "role": "system", 
            "content": """You are ClimaScan AI, an expert climate risk analysis assistant for properties in Kenya.
            
You help property owners understand:
- Flood risks and water damage
- Heat stress and temperature impacts
- Drainage system adequacy
- Climate change projections
- Actionable recommendations

Provide clear, specific, actionable advice. Be professional but friendly. 
Focus on Nairobi and Kenyan climate patterns when relevant."""
        }
    ]
    
    # Add conversation history if provided
    if history:
        messages.extend(history)
    
    # Add current user message
    messages.append({"role": "user", "content": message})
    
    try:
        # Call OpenAI API with new syntax
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Changed from gpt-4 to save costs
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"❌ OpenAI error: {e}")
        return f"I'm having trouble connecting to the AI service. Error: {str(e)}"

def get_mock_response(message):
    """Fallback mock responses when OpenAI is not configured"""
    
    message_lower = message.lower()
    
    if "flood" in message_lower:
        return """🌊 **Flood Risk Analysis**

Based on the property location:
- Flood Risk Score: 70% (Moderate-High)
- Main concerns: Proximity to water bodies, seasonal rainfall patterns
- Recommendations:
  • Install flood barriers
  • Elevate critical utilities
  • Regular drainage maintenance
  • Consider flood insurance

Historical data shows increased flooding during April-May rainy season in Nairobi."""

    elif "heat" in message_lower or "temperature" in message_lower:
        return """🌡️ **Heat Stress Analysis**

Temperature risk assessment:
- Heat Stress Score: 60% (Moderate)
- Average summer temperatures: 26-30°C
- Recommendations:
  • Install reflective roofing
  • Plant shade trees (Jacaranda, Nandi Flame)
  • Improve cross-ventilation
  • Consider solar-powered cooling

Nairobi's altitude helps, but heat stress is increasing with urbanization."""

    elif "drainage" in message_lower:
        return """💧 **Drainage System Assessment**

Drainage capacity analysis:
- Drainage Score: 55% (Adequate)
- Current system can handle moderate rainfall
- Recommendations:
  • Clear gutters regularly (especially before long rains)
  • Check for blockages
  • Consider system upgrade for extreme weather
  
Regular maintenance recommended every 3-6 months, especially before March-May rains."""

    elif "report" in message_lower:
        return """📊 **Full Climate Report Available**

I can analyze:
✓ Flood risk assessment
✓ Heat stress evaluation
✓ Drainage capacity
✓ Overall climate vulnerability
✓ Location-specific recommendations

Click the "Generate Report" button to create a detailed PDF report with all metrics and recommendations."""

    else:
        return f"""🤖 **ClimaScan AI Assistant**

I can help you analyze climate risks for properties in Nairobi and Kenya. Try asking:

- "What's the flood risk for this property?"
- "How does heat stress affect this location?"
- "Is the drainage system adequate?"
- "Generate a full climate risk report"

You asked: "{message}"

Select a property from the sidebar and I'll provide specific climate risk analysis!

💡 **Note:** I'm running in test mode. Add your OpenAI API key to enable advanced AI analysis."""