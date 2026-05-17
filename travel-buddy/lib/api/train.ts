import { API_CONFIG } from "./config";

export const searchTrains = async (fromCode: string, toCode: string, date: string) => {
  try {
    // Note: Indian Railway APIs usually require Station Codes (e.g., NDLS, BCT)
    const url = `https://${API_CONFIG.INDIAN_RAILWAY_HOST}/api/v2/trainBetweenStations?fromStnCode=${fromCode}&toStnCode=${toCode}&date=${date}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_CONFIG.RAPID_API_KEY,
        "x-rapidapi-host": API_CONFIG.INDIAN_RAILWAY_HOST,
      },
    };

    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Indian Railway API Error:", error);
    return null;
  }
};
