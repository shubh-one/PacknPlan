import { NextResponse } from 'next/server';

const getEmoji = (code) => {
  const c = parseInt(code);
  if (c === 113) return '☀️';
  if (c === 116) return '⛅';
  if (c === 119 || c === 122) return '☁️';
  if ([176, 263, 266, 293, 296].includes(c)) return '🌦️';
  if ([299, 302, 305, 308, 356, 359].includes(c)) return '🌧️';
  if ([200, 386, 389, 392, 395].includes(c)) return '⛈️';
  if ([179, 182, 185, 227, 230, 323, 326, 329, 332, 335, 338, 368, 371, 374, 377].includes(c)) return '🌨️';
  if ([143, 248, 260].includes(c)) return '🌫️';
  return '🌤️';
};

const getConditionFromCode = (code) => {
  const c = parseInt(code);
  if (c === 113) return 'Clear';
  if ([116, 119, 122].includes(c)) return 'Clouds';
  if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 356, 359].includes(c)) return 'Rain';
  if ([200, 386, 389, 392, 395].includes(c)) return 'Thunderstorm';
  if ([179, 182, 185, 227, 230, 323, 326, 329, 332, 335, 338, 368, 371, 374, 377].includes(c)) return 'Snow';
  if ([143, 248, 260].includes(c)) return 'Fog';
  return 'Clear';
};

const generateAlerts = (temp, conditionMain, humidity, windSpeed) => {
  const alerts = [];
  const t = parseFloat(temp);
  if (t >= 40) alerts.push({ type: 'warn', title: '🔥 Extreme Heat Warning', desc: `Temperature is ${t}°C. Stay hydrated, avoid outdoor activities between 12-4 PM, use sunscreen SPF 50+.` });
  else if (t >= 35) alerts.push({ type: 'warn', title: '☀️ Heat Advisory', desc: `Temperature is ${t}°C. Carry water, wear light clothing, and take breaks in shade.` });
  else if (t <= 5) alerts.push({ type: 'warn', title: '❄️ Cold Weather Alert', desc: `Temperature is ${t}°C. Wear layers, carry warm clothing, and watch for frost.` });
  if (['Rain', 'Thunderstorm'].includes(conditionMain)) alerts.push({ type: 'info', title: '🌧️ Rain Expected', desc: 'Carry an umbrella and waterproof bags. Roads may be slippery. Check local flood advisories.' });
  if (parseFloat(humidity) > 80) alerts.push({ type: 'info', title: '💧 High Humidity', desc: `Humidity is ${humidity}%. Expect muggy conditions. Wear breathable fabrics and stay cool.` });
  if (parseFloat(windSpeed) > 30) alerts.push({ type: 'warn', title: '💨 Strong Winds', desc: `Wind speed is ${windSpeed} km/h. Secure loose items, avoid high bridges and open areas.` });
  if (alerts.length === 0) alerts.push({ type: 'good', title: '✅ Good Travel Weather', desc: 'Conditions are favorable for outdoor activities. Enjoy your trip!' });
  return alerts;
};

const generateTips = (temp, conditionMain, humidity) => {
  const tips = [];
  const t = parseFloat(temp);
  if (t >= 30) {
    tips.push({ emoji: '🧴', title: 'Sunscreen Required', text: 'Apply SPF 50+ every 2 hours when outdoors.' });
    tips.push({ emoji: '💧', title: 'Stay Hydrated', text: 'Drink 3-4 litres of water daily. Carry a reusable bottle.' });
    tips.push({ emoji: '👕', title: 'Light Clothing', text: 'Wear cotton or linen. Light colors reflect heat.' });
    tips.push({ emoji: '🕐', title: 'Best Timing', text: 'Plan outdoor activities for early morning or evening.' });
  } else if (t >= 15) {
    tips.push({ emoji: '🧥', title: 'Layer Up', text: 'Mornings and evenings can be cool. Carry a light jacket.' });
    tips.push({ emoji: '👟', title: 'Walking Weather', text: 'Great conditions for sightseeing and walks.' });
    tips.push({ emoji: '📸', title: 'Photography', text: 'Soft lighting makes for excellent photos.' });
    tips.push({ emoji: '🍵', title: 'Hot Beverages', text: 'Enjoy local chai and warm street food.' });
  } else {
    tips.push({ emoji: '🧤', title: 'Warm Layers', text: 'Thermals, wool, and windproof jackets recommended.' });
    tips.push({ emoji: '🧣', title: 'Accessories', text: 'Don\'t forget a scarf, gloves, and warm socks.' });
    tips.push({ emoji: '☕', title: 'Warm Up', text: 'Start the day with hot drinks before heading out.' });
    tips.push({ emoji: '🏠', title: 'Indoor Plans', text: 'Have backup indoor activities for extreme cold.' });
  }
  if (['Rain', 'Thunderstorm'].includes(conditionMain)) {
    tips.push({ emoji: '☂️', title: 'Rain Gear', text: 'Pack a compact umbrella and waterproof bags for electronics.' });
  }
  return tips;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Delhi';

    // Use wttr.in — FREE, no API key required, returns JSON
    const res = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      {
        headers: { 'User-Agent': 'PACKnPLAN/1.0' },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error(`wttr.in returned ${res.status}`);
    }

    const data = await res.json();
    const current = data.current_condition?.[0];
    const weather3Day = data.weather;

    if (!current) {
      throw new Error('No current condition data');
    }

    const temp = parseInt(current.temp_C);
    const feelsLike = parseInt(current.FeelsLikeC);
    const humidity = parseInt(current.humidity);
    const windSpeed = parseInt(current.windspeedKmph);
    const visibility = parseInt(current.visibility);
    const pressure = parseInt(current.pressure);
    const uvIndex = parseInt(current.uvIndex);
    const weatherCode = current.weatherCode;
    const conditionMain = getConditionFromCode(weatherCode);
    const conditionDesc = current.weatherDesc?.[0]?.value?.trim() || conditionMain;

    // Get location name from nearest_area
    const area = data.nearest_area?.[0];
    const locationName = area?.areaName?.[0]?.value || city;
    const region = area?.region?.[0]?.value || '';

    // Get astronomy (sunrise/sunset) from first day
    const astronomy = weather3Day?.[0]?.astronomy?.[0];
    const sunrise = astronomy?.sunrise || '';
    const sunset = astronomy?.sunset || '';

    // Build 3-day forecast
    const forecast = (weather3Day || []).map((day) => {
      const dayDate = new Date(day.date + 'T00:00:00');
      // Get noon weather for the day
      const noonHour = day.hourly?.find((h) => h.time === '1200') || day.hourly?.[4];
      const dayCode = noonHour?.weatherCode || '113';
      return {
        day: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
        tempHigh: `${day.maxtempC}°`,
        tempLow: `${day.mintempC}°`,
        emoji: getEmoji(dayCode),
        condition: noonHour?.weatherDesc?.[0]?.value?.trim() || 'Clear',
      };
    });

    const alerts = generateAlerts(temp, conditionMain, humidity, windSpeed);
    const tips = generateTips(temp, conditionMain, humidity);

    return NextResponse.json({
      location: locationName,
      region,
      temp: `${temp}°C`,
      tempNum: temp,
      feelsLike: `${feelsLike}°C`,
      condition: conditionDesc,
      conditionMain,
      emoji: getEmoji(weatherCode),
      humidity: `${humidity}%`,
      wind: `${windSpeed} km/h`,
      windDir: current.winddir16Point,
      visibility: `${visibility} km`,
      pressure: `${pressure} hPa`,
      uvIndex,
      sunrise,
      sunset,
      cloudCover: `${current.cloudcover}%`,
      observedAt: current.localObsDateTime,
      forecast,
      alerts,
      tips,
      source: 'live',
    });
  } catch (error) {
    console.error('Weather API error:', error.message);

    // Return error-state to frontend
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Delhi';
    return NextResponse.json({
      location: city,
      temp: '--',
      tempNum: 0,
      feelsLike: '--',
      condition: 'Unable to fetch',
      conditionMain: 'Clear',
      emoji: '⚠️',
      humidity: '--',
      wind: '--',
      visibility: '--',
      pressure: '--',
      uvIndex: null,
      sunrise: '',
      sunset: '',
      forecast: [],
      alerts: [{ type: 'warn', title: '⚠️ Weather Unavailable', desc: `Could not fetch live weather for ${city}. Please try again later.` }],
      tips: [],
      source: 'error',
    }, { status: 200 }); // Return 200 so frontend can still render
  }
}
