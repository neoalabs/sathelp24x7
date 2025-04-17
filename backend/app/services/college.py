from typing import List, Dict, Optional

# In a real app, these would come from a database
COLLEGES = [
    {
        "id": 1,
        "name": "Massachusetts Institute of Technology",
        "location": "Cambridge, USA",
        "avg_sat": 1550,
        "tuition": 55000,
        "acceptance_rate": 4.1
    },
    {
        "id": 2,
        "name": "New York University Abu Dhabi",
        "location": "Abu Dhabi, UAE",
        "avg_sat": 1480,
        "tuition": 53000,
        "acceptance_rate": 4.4
    },
    {
        "id": 3,
        "name": "Harvard University",
        "location": "Cambridge, USA",
        "avg_sat": 1520,
        "tuition": 54000,
        "acceptance_rate": 3.4
    },
    {
        "id": 4,
        "name": "Stanford University",
        "location": "Stanford, USA",
        "avg_sat": 1505,
        "tuition": 56000,
        "acceptance_rate": 3.9
    }
]

SCHOLARSHIPS = [
    {
        "id": 1,
        "name": "Fulbright Scholarship",
        "amount": 20000,
        "deadline": "2025-11-15",
        "countries": ["USA"],
    },
    {
        "id": 2,
        "name": "UAE Government Scholarship",
        "amount": 30000,
        "deadline": "2025-10-30",
        "countries": ["UAE"],
    },
    {
        "id": 3,
        "name": "Global Excellence Award",
        "amount": 15000,
        "deadline": "2025-12-01",
        "countries": ["USA", "UK", "UAE", "Canada"],
    }
]

async def search_colleges(
    query: Optional[str] = None, 
    min_sat: Optional[int] = None,
    max_tuition: Optional[int] = None,
    country: Optional[str] = None
) -> List[Dict]:
    """
    Search colleges based on various criteria
    
    Args:
        query: Search term for name
        min_sat: Minimum SAT score
        max_tuition: Maximum tuition in USD
        country: Country filter
        
    Returns:
        List of matching colleges
    """
    results = []
    
    for college in COLLEGES:
        # Apply filters
        if query and query.lower() not in college["name"].lower():
            continue
            
        if min_sat and college["avg_sat"] < min_sat:
            continue
            
        if max_tuition and college["tuition"] > max_tuition:
            continue
            
        if country and country not in college["location"]:
            continue
            
        results.append(college)
        
    return results

async def search_scholarships(
    query: Optional[str] = None,
    min_amount: Optional[int] = None,
    country: Optional[str] = None
) -> List[Dict]:
    """
    Search scholarships based on various criteria
    
    Args:
        query: Search term for name
        min_amount: Minimum scholarship amount
        country: Country eligibility filter
        
    Returns:
        List of matching scholarships
    """
    results = []
    
    for scholarship in SCHOLARSHIPS:
        # Apply filters
        if query and query.lower() not in scholarship["name"].lower():
            continue
            
        if min_amount and scholarship["amount"] < min_amount:
            continue
            
        if country and country not in scholarship["countries"]:
            continue
            
        results.append(scholarship)
        
    return results