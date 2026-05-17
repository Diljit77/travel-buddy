import { API_CONFIG } from "./config";

export const searchCarRentals = async (params: {
  pick_up_lat: string;
  pick_up_lon: string;
  drop_off_lat: string;
  drop_off_lon: string;
  pick_up_date: string; // Added this
  drop_off_date: string; // Added this
  pick_up_time: string;
  drop_off_time: string;
  driver_age: string;
  currency?: string;
}) => {
  try {
    const url = new URL(`https://${API_CONFIG.BOOKING_HOST}/api/v1/cars/searchCarRentals`);
    
    url.searchParams.append("pick_up_latitude", params.pick_up_lat);
    url.searchParams.append("pick_up_longitude", params.pick_up_lon);
    url.searchParams.append("drop_off_latitude", params.drop_off_lat);
    url.searchParams.append("drop_off_longitude", params.drop_off_lon);
    url.searchParams.append("pick_up_date", params.pick_up_date);
    url.searchParams.append("drop_off_date", params.drop_off_date);
    url.searchParams.append("pick_up_time", params.pick_up_time);
    url.searchParams.append("drop_off_time", params.drop_off_time);
    url.searchParams.append("driver_age", params.driver_age);
    url.searchParams.append("currency_code", params.currency || "INR");
    url.searchParams.append("search_type", "CITY"); 
    url.searchParams.append("location", "IN");

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_CONFIG.RAPID_API_KEY,
        "x-rapidapi-host": API_CONFIG.BOOKING_HOST,
      },
    };

    const response = await fetch(url.toString(), options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Car Rental API Error:", error);
    return null;
  }
};
