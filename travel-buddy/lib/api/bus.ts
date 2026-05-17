import { API_CONFIG } from "./config";

export const searchBusCities = async (query: string) => {
  try {
    // flixbus2 often uses /autocomplete for location search
    const url = `https://${API_CONFIG.FLIXBUS_HOST}/autocomplete?query=${encodeURIComponent(query)}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_CONFIG.RAPID_API_KEY,
        "x-rapidapi-host": API_CONFIG.FLIXBUS_HOST,
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();
    
    // Result is usually an array, each item has an 'id'
    return result;
  } catch (error) {
    console.error("FlixBus Autocomplete Error:", error);
    return null;
  }
};

export const searchBuses = async (fromId: string, toId: string, date: string) => {
  try {
    // date must be DD.MM.YYYY for flixbus2
const url = `https://${API_CONFIG.FLIXBUS_HOST}/trips?dep_ident=${fromId}&arr_ident=${toId}&date=${date}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_CONFIG.RAPID_API_KEY,
        "x-rapidapi-host": API_CONFIG.FLIXBUS_HOST,
      },
    };

    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("FlixBus API Error:", error);
    return null;
  }
};
