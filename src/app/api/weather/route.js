import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Bali';

    const apiKey = process.env.OPENWEATHER_API_KEY;

    // If no API key, return mock data (graceful fallback)
    if (!apiKey) {
      return NextResponse.json({
        location: city,
        temp: '28°C',
        condition: 'Partly Cloudy',
        emoji: '⛅',
        humidity: '72%',
        wind: '12 km/h',
        visibility: '10 km',
        forecast: [
          { day: 'Mon', temp: '29°', emoji: '☀️' },
          { day: 'Tue', temp: '27°', emoji: '🌤️' },
          { day: 'Wed', temp: '26°', emoji: '🌧️' },
          { day: 'Thu', temp: '28°', emoji: '⛅' },
          { day: 'Fri', temp: '30°', emoji: '☀️' },
        ],
        source: 'mock',
      });
    }

    // Fetch current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    if (!currentRes.ok) {
      throw new Error('Weather API error');
    }

    const current = await currentRes.json();

    // Fetch 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    const forecastData = forecastRes.ok ? await forecastRes.json() : null;

    // Map weather conditions to emojis
    const getEmoji = (condition) => {
      const map = {
        'Clear': '☀️',
        'Clouds': '⛅',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '🌨️',
        'Mist': '🌫️',
        'Fog': '🌫️',
        'Haze': '🌫️',
      };
      return map[condition] || '🌤️';
    };

    // Get daily forecasts (one per day, noon readings)
    const dailyForecast = forecastData?.list
      ?.filter((item) => item.dt_txt.includes('12:00:00'))
      ?.slice(0, 5)
      ?.map((item) => ({
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: `${Math.round(item.main.temp)}°`,
        emoji: getEmoji(item.weather[0].main),
      })) || [];

    return NextResponse.json({
      location: current.name,
      temp: `${Math.round(current.main.temp)}°C`,
      condition: current.weather[0].description,
      emoji: getEmoji(current.weather[0].main),
      humidity: `${current.main.humidity}%`,
      wind: `${Math.round(current.wind.speed * 3.6)} km/h`,
      visibility: `${Math.round((current.visibility || 10000) / 1000)} km`,
      forecast: dailyForecast,
      source: 'live',
    });
  } catch (error) {
    console.error('Weather API error:', error);
    // Return mock data on error
    return NextResponse.json({
      location: 'Bali',
      temp: '28°C',
      condition: 'Partly Cloudy',
      emoji: '⛅',
      humidity: '72%',
      wind: '12 km/h',
      visibility: '10 km',
      forecast: [
        { day: 'Mon', temp: '29°', emoji: '☀️' },
        { day: 'Tue', temp: '27°', emoji: '🌤️' },
        { day: 'Wed', temp: '26°', emoji: '🌧️' },
        { day: 'Thu', temp: '28°', emoji: '⛅' },
        { day: 'Fri', temp: '30°', emoji: '☀️' },
      ],
      source: 'fallback',
    });
  }
}
