import json
import math
import os

def haversine(lat1, lon1, lat2, lon2):
    """Calculates the distance in km between two GPS coordinates."""
    R = 6371.0 # Earth radius in kilometers
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def get_nearest_hospitals(user_lat, user_lng, limit=3):
    """Reads hospital_master.json and returns the nearest hospitals sorted by distance."""
    # Build absolute path to shared/hospital_master.json
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    master_file = os.path.join(base_dir, "shared", "hospital_master.json")
    
    try:
        with open(master_file, 'r') as f:
            hospitals = json.load(f)
            
        for h in hospitals:
            loc = h.get('location', {})
            h['distance_km'] = haversine(user_lat, user_lng, loc.get('lat', 0), loc.get('lng', 0))
            
        hospitals.sort(key=lambda x: x['distance_km'])
        return hospitals[:limit]
    except Exception as e:
        print(f"Error loading hospitals: {e}")
        return []
