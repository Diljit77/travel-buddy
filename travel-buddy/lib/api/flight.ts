import { API_CONFIG } from "./config";

const cityIataMap: Record<string, string> = {
  "delhi": "DEL",
  "new delhi": "DEL",
  "mumbai": "BOM",
  "bombay": "BOM",
  "bangalore": "BLR",
  "bengaluru": "BLR",
  "chennai": "MAA",
  "madras": "MAA",
  "kolkata": "CCU",
  "calcutta": "CCU",
  "hyderabad": "HYD",
  "pune": "PNQ",
  "ahmedabad": "AMD",
  "jaipur": "JAI",
  "lucknow": "LKO",
  "kochi": "COK",
  "chandigarh": "IXC",
  "goa": "GOI",
  "guwahati": "GAU",
  "amritsar": "ATQ",
  "shimla": "SLV",
  "srinagar": "SXR",
  "leh": "IXL",
  "rishikesh": "DED",
  "dehradun": "DED",
  "manali": "KUU",
  "kullu": "KUU",
  "dharamshala": "DHM",
};

export const getIataCode = async (cityName: string) => {
  const mainCity = cityName.split(',')[0].toLowerCase().trim();
  
  if (cityIataMap[mainCity]) {
    console.log(`Found IATA from fallback mapping: ${cityIataMap[mainCity]} for ${mainCity}`);
    return cityIataMap[mainCity];
  }

  try {
    const url = `http://api.aviationstack.com/v1/airports?access_key=${API_CONFIG.AVIATION_STACK_KEY}&search=${cityName}`;
    console.log(`Searching IATA for ${cityName}...`);
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.data && result.data.length > 0) {
      console.log(`Found IATA: ${result.data[0].iata_code} for ${cityName}`);
      return result.data[0].iata_code;
    }
    console.warn(`No IATA found for ${cityName}`);
    return null;
  } catch (error) {
    console.error("IATA Lookup Error:", error);
    return null;
  }
};

export const searchFlightsAeroDataBox = async (fromIata: string, toIata: string, date?: string) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const searchDate = date || tomorrow.toISOString().split('T')[0];
    
    // Use FIDS endpoint. Note: The time range must not exceed 12 hours.
    const fromLocal = `${searchDate}T08:00`;
    const toLocal = `${searchDate}T20:00`;
    const url = `https://${API_CONFIG.AERODATABOX_HOST}/api/v1/aedbx/aerodatabox/flights/airports/iata/${fromIata}/${fromLocal}/${toLocal}`;
    
    console.log(`AeroDataBox FIDS Request: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        "x-magicapi-key": API_CONFIG.AERODATABOX_KEY || API_CONFIG.RAPID_API_KEY,
        "Accept": "application/json"
      }
    });
    
    console.log(`AeroDataBox Status: ${response.status}`);
    
    if (!response.ok) {
        const errText = await response.text();
        console.error(`AeroDataBox API Error: ${response.status} ${errText}`);
        return null;
    }

    const result = await response.json();
    // FIDS endpoint returns departures and arrivals
    console.log(`AeroDataBox Result: Departures: ${result.departures?.length || 0}`);
    return result;
  } catch (error) {
    console.error("AeroDataBox API Error:", error);
    return null;
  }
};

export const searchFlights = async (depIata: string, arrIata: string) => {
  try {
    const url = `http://api.aviationstack.com/v1/flights?access_key=${API_CONFIG.AVIATION_STACK_KEY}&dep_iata=${depIata}&arr_iata=${arrIata}`;
    
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("AviationStack API Error:", error);
    return null;
  }
};
