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

// 1. Create a union of filterable keys (all are arrays)
const filterableKeys = ["numbers", "alphabets", "highest_alphabet"] as const;
type FilterableKey = typeof filterableKeys[number];

export default function Home() {
  const [input, setInput] = useState("");
  // 2. selectedFilters can only be these keys
  const [selectedFilters, setSelectedFilters] = useState<FilterableKey[]>([]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(input);
      const { data } = await axios.post<ApiResponse>(${API_URL}/bfhl, parsedInput);
      setResponse(data);
      setError("");
    } catch {
      setError("Invalid JSON input");
    }
  };

  const toggleFilter = (filter: FilterableKey) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    // 3. Only copy array fields from the response
    const filteredData = selectedFilters.reduce((acc, key) => {
      acc[key] = response[key];
      return acc;
    }, {} as Partial<Pick<ApiResponse, FilterableKey>>);

    return (
      <div>
        {Object.entries(filteredData).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value?.join(", ")}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">22BCS50158</h1>

      <label htmlFor="jsonInput" className="block text-gray-700 font-medium mb-2">
        API Input
      </label>
      <input
        id="jsonInput"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter JSON input"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full">
        Submit
      </button>
      {error && <p className="text-red-500">{error}</p>}

      {response && (
        <div>
          <label className="block text-sm font-medium mb-2">Multi Filter</label>
          <div className="flex space-x-4 mb-4">
            {filterableKeys.map((filter) => (
              <div key={filter} className="flex items-center">
                <input
                  type="checkbox"
                  id={filter}
                  checked={selectedFilters.includes(filter)}
                  onChange={() => toggleFilter(filter)}
                  className="mr-2"
                />
                <label htmlFor={filter}>{filter.replace("_", " ")}</label>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFilters.map((filter) => (
              <div
                key={filter}
                className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                <span>{filter}</span>
                <button
                  onClick={() => toggleFilter(filter)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-2">Filtered Response</h2>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}
