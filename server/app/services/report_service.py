import random

def generate_report_data(property_obj):
    # Mock AI or sensor-based climate risk calculation
    return {
        "flood_score": random.randint(40, 90),
        "heat_score": random.randint(50, 85),
        "drainage_score": random.randint(45, 95)
    }

def generate_ai_summary(property_obj):
    return (
        f"The property '{property_obj.name}' located in {property_obj.location} shows "
        f"moderate to high climate vulnerability. Flood and heat risks are influenced by "
        f"urban density and drainage quality.\n\n"
        f"AI Suggestion: Consider implementing green infrastructure and enhanced stormwater "
        f"management systems to mitigate long-term risks."
    )
