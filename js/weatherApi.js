// API configuration
const API_KEY = "35e1b737845d46a4a42162457251703";
const BASE_URL = "http://api.weatherapi.com/v1";

// Weather API functions
export async function fetchWeather(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`
    );

    if (!response.ok) {
      throw new Error("Weather data fetch failed");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      location: {
        name: data.location.name,
        country: data.location.country,
        localtime: data.location.localtime,
      },
      current: {
        temp_c: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph,
        feelslike_c: Math.round(data.current.feelslike_c),
        pressure_mb: data.current.pressure_mb,
        is_day: data.current.is_day,
      },
    };
  } catch (error) {
    console.error("Error in fetchWeather:", error);
    throw error;
  }
}

export function generateWeatherIcon(isDay) {
  return isDay ? getDayIcon() : getNightIcon();
}

function getDayIcon() {
  return `<svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="20" fill="#FFD700"/>
        <g transform="translate(50,50)">
            ${Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              return `<line 
                    x1="${25 * Math.cos(angle)}"
                    y1="${25 * Math.sin(angle)}"
                    x2="${35 * Math.cos(angle)}"
                    y2="${35 * Math.sin(angle)}"
                    stroke="#FFD700"
                    stroke-width="4"
                    stroke-linecap="round"
                />`;
            }).join("")}
        </g>
    </svg>`;
}

function getNightIcon() {
  return `<svg viewBox="0 0 100 100">
        <path d="M50 75
                C25 75 25 25 50 25
                C45 25 25 35 25 50
                C25 65 45 75 50 75
                Z" fill="#7986CB"/>
        ${Array.from({ length: 5 }, (_, i) => {
          const x = 30 + Math.random() * 40;
          const y = 30 + Math.random() * 40;
          return `<circle cx="${x}" cy="${y}" r="1" fill="white"/>`;
        }).join("")}
    </svg>`;
}
