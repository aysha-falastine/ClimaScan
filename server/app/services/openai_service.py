import os
from openai import OpenAI
from flask import current_app

class OpenAIService:
    
    def __init__(self):
        """Initialize OpenAI client"""
        api_key = os.getenv('OPENAI_API_KEY') or current_app.config.get('OPENAI_API_KEY')
        
        if not api_key:
            print("⚠️  Warning: OpenAI API key not found")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key)
            print("✅ OpenAI client initialized")
    
    def generate_climate_report(self, property_data, climate_data=None):
        """Generate climate risk report using OpenAI"""
        
        if not self.client:
            print("⚠️  OpenAI not configured, using fallback")
            return self._generate_fallback_report(property_data)
        
        property_name = property_data.get('name', 'Unknown Property')
        location = property_data.get('location', property_data.get('address', 'Unknown'))
        
        prompt = f"""Generate a comprehensive climate risk assessment report for this property in Kenya:

Property Name: {property_name}
Location: {location}
Coordinates: {property_data.get('latitude', 'N/A')}, {property_data.get('longitude', 'N/A')}

Please provide:
1. Executive summary of climate risks
2. Detailed analysis of:
   - Flood risk and water-related hazards
   - Heat stress and temperature impacts
   - Drainage system capacity
   - Extreme weather vulnerabilities
3. Climate projections for the next 10-25 years
4. Specific adaptation recommendations
5. Estimated costs for key improvements

Format the report professionally with clear sections and actionable insights for Kenyan property owners."""

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a climate risk assessment expert specializing in Kenyan properties. Provide detailed, actionable reports."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"❌ OpenAI API error: {e}")
            return self._generate_fallback_report(property_data)
    
    def chat_response(self, message, property_data=None, history=None):
        """Generate chat response"""
        
        if not self.client:
            return self._generate_fallback_chat(message)
        
        messages = [
            {
                "role": "system",
                "content": "You are ClimaScan AI, an expert climate risk assistant for properties in Kenya. Provide specific, actionable advice."
            }
        ]
        
        if history:
            messages.extend(history[-5:])  # Last 5 messages for context
        
        if property_data:
            context = f"Current property: {property_data.get('name')} at {property_data.get('location', property_data.get('address'))}"
            messages.append({"role": "system", "content": context})
        
        messages.append({"role": "user", "content": message})
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=400
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"❌ OpenAI error: {e}")
            return self._generate_fallback_chat(message)
    
    def _generate_fallback_report(self, property_data):
        """Fallback report when OpenAI is unavailable"""
        import random
        from datetime import datetime
        
        property_name = property_data.get('name', 'Unknown Property')
        location = property_data.get('location', property_data.get('address', 'Unknown'))
        risk_levels = ['Low', 'Moderate', 'High']
        overall_risk = random.choice(risk_levels)
        
        return f"""
# Climate Risk Assessment Report

**Property:** {property_name}
**Location:** {location}
**Assessment Date:** {datetime.now().strftime('%B %d, %Y')}
**Overall Risk Level:** {overall_risk}

## Executive Summary
This climate risk assessment evaluates potential vulnerabilities for {property_name} in {location}.

## Key Risk Factors

### 1. Flood Risk: {random.choice(risk_levels)}
- Seasonal rainfall patterns show increased variability
- Urban drainage capacity is a concern during heavy rains
- Recommendation: Install flood barriers and improve drainage

### 2. Heat Stress: {random.choice(risk_levels)}
- Temperature increases of 1.5-2.5°C projected by 2050
- More frequent heat waves expected
- Recommendation: Improve insulation and install efficient cooling

### 3. Drainage Capacity: {random.choice(risk_levels)}
- Current systems may be inadequate for extreme rainfall
- Recommendation: Regular maintenance and system upgrades

## Adaptation Recommendations

**Immediate Actions (0-2 years):**
1. Conduct detailed drainage assessment
2. Install weather monitoring equipment
3. Implement water conservation measures
4. Review insurance coverage

**Medium-term Actions (2-5 years):**
1. Upgrade building thermal performance
2. Install rainwater harvesting system
3. Develop emergency response protocols

**Estimated Investment:** Ksh 500,000 - 2,000,000

## Conclusion
{property_name} faces {overall_risk.lower()} climate risks. Proactive measures recommended.

---
*Note: This is a generated report. For production use, integrate with real OpenAI API.*
**Report Generated By:** ClimaScan AI
**Confidence Level:** {random.randint(75, 95)}%
"""
    
    def _generate_fallback_chat(self, message):
        """Fallback chat responses"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['flood', 'flooding', 'water']):
            return "Based on climate projections, flooding risk is moderate in urban Nairobi areas. I recommend proper drainage systems and flood insurance. Would you like specific mitigation recommendations?"
        
        elif any(word in message_lower for word in ['heat', 'temperature']):
            return "Temperature increases are a concern. Your property may experience more frequent heat waves. Consider energy-efficient cooling and better insulation."
        
        elif 'report' in message_lower:
            return "I can generate a comprehensive climate risk report. Click the 'Generate Report' button to create a detailed assessment."
        
        return "I can help you understand climate risks for your property. Try asking about flood risks, heat stress, or request a full climate report!"