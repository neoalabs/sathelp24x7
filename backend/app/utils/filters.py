"""
Filter utilities for database queries and search operations.
"""

from typing import Dict, List, Optional, Any, Union
from datetime import datetime

def filter_colleges(
    colleges: List[Dict], 
    filters: Dict[str, Any]
) -> List[Dict]:
    """
    Filter college data based on specified filters.
    
    Args:
        colleges: List of college dictionaries
        filters: Dictionary of filter parameters
        
    Returns:
        Filtered list of colleges
    """
    result = []
    
    for college in colleges:
        matches = True
        
        # Apply filters
        if filters.get('name') and filters['name'].lower() not in college['name'].lower():
            matches = False
        
        if filters.get('location') and filters['location'].lower() not in college['location'].lower():
            matches = False
            
        if filters.get('min_sat') and college.get('avg_sat', 0) < filters['min_sat']:
            matches = False
            
        if filters.get('max_tuition') and college.get('tuition', 0) > filters['max_tuition']:
            matches = False
            
        if filters.get('min_acceptance') and college.get('acceptance_rate', 0) < filters['min_acceptance']:
            matches = False
            
        if filters.get('max_acceptance') and college.get('acceptance_rate', 0) > filters['max_acceptance']:
            matches = False
        
        if matches:
            result.append(college)
            
    return result

def filter_scholarships(
    scholarships: List[Dict],
    filters: Dict[str, Any]
) -> List[Dict]:
    """
    Filter scholarship data based on specified filters.
    
    Args:
        scholarships: List of scholarship dictionaries
        filters: Dictionary of filter parameters
        
    Returns:
        Filtered list of scholarships
    """
    result = []
    
    for scholarship in scholarships:
        matches = True
        
        # Apply filters
        if filters.get('name') and filters['name'].lower() not in scholarship['name'].lower():
            matches = False
            
        if filters.get('min_amount') and scholarship.get('amount', 0) < filters['min_amount']:
            matches = False
            
        if filters.get('country') and filters['country'] not in scholarship.get('countries', []):
            matches = False
            
        if filters.get('deadline_after'):
            deadline = datetime.strptime(scholarship.get('deadline', '2099-12-31'), '%Y-%m-%d')
            filter_date = datetime.strptime(filters['deadline_after'], '%Y-%m-%d')
            if deadline < filter_date:
                matches = False
        
        if matches:
            result.append(scholarship)
            
    return result

def sort_results(
    items: List[Dict],
    sort_by: str,
    ascending: bool = True
) -> List[Dict]:
    """
    Sort a list of dictionaries by a specific key.
    
    Args:
        items: List of dictionaries to sort
        sort_by: Key to sort by
        ascending: Sort in ascending order if True, descending if False
        
    Returns:
        Sorted list of dictionaries
    """
    reverse = not ascending
    
    # Handle nested keys (e.g., "stats.ranking")
    if '.' in sort_by:
        parts = sort_by.split('.')
        
        def get_nested_value(item):
            value = item
            for part in parts:
                value = value.get(part, {})
            return value if value != {} else None
            
        return sorted(items, key=get_nested_value, reverse=reverse)
    
    # Handle special case for sorting by relevance (already pre-sorted)
    if sort_by == 'relevance':
        return items
    
    # Standard sorting
    return sorted(
        items, 
        key=lambda x: x.get(sort_by, 0) if isinstance(x.get(sort_by), (int, float)) else str(x.get(sort_by, "")),
        reverse=reverse
    )