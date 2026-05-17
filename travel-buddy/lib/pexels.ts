export const getPexelsImage = async (query: string) => {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY!,
        },
      }
    );
  console.log(process.env.PEXELS_API_KEY);
    const data = await res.json();
    console.log("PEXELS data:", data);

    console.log("PEXELS QUERY:", query);
    console.log("PEXELS RESULT:", data.photos?.length);

    return data.photos?.[0]?.src?.large || null;
  } catch (err) {
    console.error("Pexels error:", err);
    return null;
  }
};