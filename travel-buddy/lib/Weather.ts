export const getWeather = async (city: string) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const data = await res.json();

    if (!data || data.cod !== 200) {
      return { error: "Weather not found" };
    }

    return {
      city: data.name,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
    };
  } catch (error) {
    console.error("Weather API error:", error);
    return { error: "Failed to fetch weather" };
  }
};