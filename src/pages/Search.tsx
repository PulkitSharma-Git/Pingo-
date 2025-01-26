import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Plane } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Flight } from '../lib/types';

const indianCities = [
  'Mumbai (BOM)',
  'Delhi (DEL)',
  'Bangalore (BLR)',
  'Chennai (MAA)',
  'Kolkata (CCU)',
  'Hyderabad (HYD)',
  'Ahmedabad (AMD)',
  'Pune (PNQ)',
  'Goa (GOI)',
  'Jaipur (JAI)',
];

export default function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [suggestions, setSuggestions] = useState<{
    from: string[];
    to: string[];
  }>({
    from: [],
    to: []
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: 'from' | 'to', value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    
    if (value.length > 0) {
      const filtered = indianCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(prev => ({ ...prev, [field]: filtered }));
    } else {
      setSuggestions(prev => ({ ...prev, [field]: [] }));
    }
  };

  const handleSuggestionClick = (field: 'from' | 'to', value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    setSuggestions(prev => ({ ...prev, [field]: [] }));
  };

  const searchFlights = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('departure_city', searchParams.from)
        .eq('arrival_city', searchParams.to);

      if (error) throw error;

      setFlights(data || []);
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchFlights();
  };

  // Load initial flights
  useEffect(() => {
    const loadInitialFlights = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('flights')
          .select('*')
          .limit(5);

        if (error) throw error;
        setFlights(data || []);
      } catch (err) {
        console.error('Error loading flights:', err);
        setError('Failed to load flights. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialFlights();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Flights in India</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <input
                type="text"
                id="from"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Departure City"
                value={searchParams.from}
                onChange={(e) => handleInputChange('from', e.target.value)}
                autoComplete="off"
              />
              {suggestions.from.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {suggestions.from.map((city) => (
                    <div
                      key={city}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick('from', city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <input
                type="text"
                id="to"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Arrival City"
                value={searchParams.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                autoComplete="off"
              />
              {suggestions.to.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {suggestions.to.map((city) => (
                    <div
                      key={city}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick('to', city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchParams.date}
                onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            disabled={loading}
          >
            <SearchIcon className="h-5 w-5" />
            <span>{loading ? 'Searching...' : 'Search Flights'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Flight Results */}
      <div className="space-y-4">
        {flights.map((flight) => (
          <div key={flight.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Plane className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      Flight {flight.flight_number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">
                    {flight.departure_city} → {flight.arrival_city}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(flight.departure_time).toLocaleTimeString()} - 
                    {new Date(flight.arrival_time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">₹{flight.price}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {flight.available_seats} seats left
                </p>
                <button
                  onClick={() => navigate(`/booking/${flight.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}