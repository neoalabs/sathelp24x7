import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collegeService } from '../services/api';
import Navbar from '../components/Navbar';

export default function CollegeFinder() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('colleges');
  const [searchParams, setSearchParams] = useState({
    query: '',
    minSAT: '',
    maxTuition: '',
    country: ''
  });
  const [colleges, setColleges] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCollegeSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await collegeService.searchColleges({
        q: searchParams.query,
        min_sat: searchParams.minSAT || undefined,
        max_tuition: searchParams.maxTuition || undefined,
        country: searchParams.country || undefined
      });
      
      setColleges(response.data.colleges);
      setSearched(true);
    } catch (error) {
      console.error('Error searching colleges:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleScholarshipSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await collegeService.getScholarships({
        q: searchParams.query,
        country: searchParams.country || undefined
      });
      
      setScholarships(response.data.scholarships);
      setSearched(true);
    } catch (error) {
      console.error('Error searching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">College & Financial Aid Finder</h1>
        
        {/* Tab navigation */}
        <div className="sm:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="colleges">Find Colleges</option>
            <option value="scholarships">Find Scholarships</option>
          </select>
        </div>
        
        <div className="hidden sm:block mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('colleges')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'colleges' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Find Colleges
              </button>
              <button
                onClick={() => setActiveTab('scholarships')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'scholarships' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Find Scholarships
              </button>
            </nav>
          </div>
        </div>
        
        {/* College search */}
        {activeTab === 'colleges' && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Search for Colleges</h2>
              
              <form onSubmit={handleCollegeSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                      College Name or Keywords
                    </label>
                    <input
                      type="text"
                      id="query"
                      name="query"
                      value={searchParams.query}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. MIT, engineering, business"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={searchParams.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. USA, UAE, UK"
                    />
                  </div>
                  <div>
                    <label htmlFor="minSAT" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum SAT Score
                    </label>
                    <input
                      type="number"
                      id="minSAT"
                      name="minSAT"
                      value={searchParams.minSAT}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 1200"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxTuition" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Annual Tuition (USD)
                    </label>
                    <input
                      type="number"
                      id="maxTuition"
                      name="maxTuition"
                      value={searchParams.maxTuition}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 50000"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search Colleges'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* College results */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium">Results</h3>
                {searched && <p className="text-sm text-gray-500">{colleges.length} colleges found</p>}
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : colleges.length > 0 ? (
                <div className="divide-y">
                  {colleges.map((college, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold">{college.name}</h4>
                          <p className="text-sm text-gray-600">{college.location}</p>
                          
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            {college.avg_sat && (
                              <div>
                                <span className="text-gray-500">Avg. SAT:</span> {college.avg_sat}
                              </div>
                            )}
                            {college.tuition && (
                              <div>
                                <span className="text-gray-500">Tuition:</span> ${college.tuition.toLocaleString()}/year
                              </div>
                            )}
                            {college.acceptance_rate && (
                              <div>
                                <span className="text-gray-500">Acceptance:</span> {college.acceptance_rate}%
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searched ? (
                <div className="p-6 text-center text-gray-500">
                  No colleges found matching your criteria. Try adjusting your search parameters.
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Use the search form above to find colleges.
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Scholarship search */}
        {activeTab === 'scholarships' && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Search for Scholarships</h2>
              
              <form onSubmit={handleScholarshipSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
                      Scholarship Name or Keywords
                    </label>
                    <input
                      type="text"
                      id="query"
                      name="query"
                      value={searchParams.query}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Fulbright, STEM, international"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={searchParams.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. USA, UAE, UK"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search Scholarships'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Scholarship results */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium">Results</h3>
                {searched && <p className="text-sm text-gray-500">{scholarships.length} scholarships found</p>}
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : scholarships.length > 0 ? (
                <div className="divide-y">
                  {scholarships.map((scholarship, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold">{scholarship.name}</h4>
                          
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            {scholarship.amount && (
                              <div>
                                <span className="text-gray-500">Amount:</span> ${scholarship.amount.toLocaleString()}
                              </div>
                            )}
                            {scholarship.deadline && (
                              <div>
                                <span className="text-gray-500">Deadline:</span> {scholarship.deadline}
                              </div>
                            )}
                            {scholarship.countries && (
                              <div className="col-span-2">
                                <span className="text-gray-500">Available in:</span> {scholarship.countries.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searched ? (
                <div className="p-6 text-center text-gray-500">
                  No scholarships found matching your criteria. Try adjusting your search parameters.
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Use the search form above to find scholarships.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}