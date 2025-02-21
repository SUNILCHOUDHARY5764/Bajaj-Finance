"use client";
import { useState } from "react";
import axios from "axios";

interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_alphabet: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const filterableKeys = ["numbers", "alphabets", "highest_alphabet"] as const;
type FilterableKey = typeof filterableKeys[number];

export default function Home() {
  const [input, setInput] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<FilterableKey[]>([]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(input);
      const { data } = await axios.post<ApiResponse>(`${API_URL}/bfhl`, parsedInput);
      setResponse(data);
      setError("");
    } catch {
      setError("Invalid JSON input. Please enter a valid JSON object.");
    }
  };

  const toggleFilter = (filter: FilterableKey) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const renderFilteredResponse = () => {
    if (!response) return null;
    const filteredData = selectedFilters.reduce((acc, key) => {
      acc[key] = response[key];
      return acc;
    }, {} as Partial<Pick<ApiResponse, FilterableKey>>);

    return (
      <div className="p-3 bg-gray-100 rounded-md">
        {Object.entries(filteredData).map(([key, value]) => (
          <div key={key} className="mb-2">
            <strong className="text-blue-600">{key.replace("_", " ")}:</strong>
            <span className="ml-2">{value?.join(", ")}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">22BCS50158</h1>
      
      <label htmlFor="jsonInput" className="block font-medium mb-2">
        API Input
      </label>
      <textarea
        id="jsonInput"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        rows={4}
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
      >
        Submit
      </button>
      {error && <p className="text-red-600 mt-2 text-center">{error}</p>}

      {response && (
        <div className="mt-6">
          <label className="block font-medium mb-2">Multi Filter</label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {filterableKeys.map((filter) => (
              <label key={filter} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter)}
                  onChange={() => toggleFilter(filter)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{filter.replace("_", " ")}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFilters.map((filter) => (
              <div key={filter} className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm">
                <span>{filter.replace("_", " ")}</span>
                <button
                  onClick={() => toggleFilter(filter)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-2">Filtered Response</h2>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}
