import { API_CONFIG } from "./config";

export const getCoordinates = async (city: string) => {
  try {
    const response = await fetch(
      `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_STACK_API_KEY}&query=${encodeURIComponent(
        city
      )}`
    );

    const result = await response.json();

    const location = result?.data?.[0];

    console.log("POSITIONSTACK:", location);

    return {
      latitude: location?.latitude,
      longitude: location?.longitude,
    };
  } catch (error) {
    console.error("Coordinates Error:", error);

    return null;
  }
};

export const searchHotels = async (
  latitude: string,
  longitude: string
) => {
  try {
    const url =
      `https://api.geoapify.com/v2/places` +
      `?categories=accommodation.hotel` +
      `&filter=circle:${longitude},${latitude},5000` +
      `&limit=10` +
      `&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    console.log("HOTEL URL:", url);

    const response = await fetch(url);

    const result = await response.json();

    console.log("HOTELS:", result);

    return result;
  } catch (error) {
    console.error("Geoapify Hotel Error:", error);

    return null;
  }
};