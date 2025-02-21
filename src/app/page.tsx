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
      <div className="p-4 bg-gray-50 border rounded-lg shadow-md animate-fadeIn">
        {Object.entries(filteredData).map(([key, value]) => (
          <div key={key} className="mb-3">
            <strong className="text-indigo-600">{key.replace("_", " ")}:</strong>
            <span className="ml-2 text-gray-800">{value?.join(", ")}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">22BCS50158</h1>
      
      <label htmlFor="jsonInput" className="block font-medium text-gray-700 mb-2">
        API Input
      </label>
      <textarea
        id="jsonInput"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"key": "value"}'
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3 resize-none"
        rows={4}
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
      >
        Submit
      </button>
      {error && <p className="text-red-600 mt-2 text-center font-medium">{error}</p>}

      {response && (
        <div className="mt-6">
          <label className="block font-medium text-gray-700 mb-2">Multi Filter</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {filterableKeys.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium shadow-md transition transform hover:scale-105 ${
                  selectedFilters.includes(filter)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {filter.replace("_", " ")}
              </button>
            ))}
          </div>

          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedFilters.map((filter) => (
                <div
                  key={filter}
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  <span>{filter.replace("_", " ")}</span>
                  <button
                    onClick={() => toggleFilter(filter)}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-xl font-semibold mb-2 text-indigo-700">Filtered Response</h2>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}
