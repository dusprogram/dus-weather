let userData = {
  name: "",
  city: "",
  profilePhoto: "",
};


function checkUserData() {
  const stored = localStorage.getItem("weatherAppUser");

  if (stored) {
    userData = JSON.parse(stored);
    updateUIWithUserData();
    document.getElementById("onboardingModal").style.display = "none";
    fetchWeather(userData.city);
  }
}


function updateUIWithUserData() {
  document.getElementById("headerName").textContent = userData.name;
  document.getElementById("headerProfile").src =
    userData.profilePhoto || "assets/user.svg";
  updateTime();
}


document
  .getElementById("onboardingForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    userData.name = document.getElementById("userName").value;
    userData.city = document.getElementById("userCity").value;
    localStorage.setItem("weatherAppUser", JSON.stringify(userData));
    document.getElementById("onboardingModal").style.display = "none";
    updateUIWithUserData();
    fetchWeather(userData.city);
  });


document
  .getElementById("profilePhoto")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        userData.profilePhoto = e.target.result;
        document.getElementById("profilePreview").src = e.target.result;
        document.getElementById("headerProfile").src = e.target.result;
        localStorage.setItem("weatherAppUser", JSON.stringify(userData));
      };

      reader.readAsDataURL(file);
    }
  });


const searchIcon = document.getElementById("searchIcon");
const searchOverlay = document.getElementById("searchOverlay");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

searchIcon.addEventListener("click", () => {
  searchOverlay.classList.add("active");
  searchInput.focus();
});

closeSearch.addEventListener("click", () => {
  searchOverlay.classList.remove("active");
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) {
      fetchWeather(city);
      searchOverlay.classList.remove("active");
      searchInput.value = "";
    }
  }
});


function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  document.getElementById(
    "currentTime"
  ).textContent = `${dateString} | ${timeString}`;
}

setInterval(updateTime, 1000);

// SVG Icons for day/night
const dayIcon = `<svg viewBox="0 0 100 100">
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

const nightIcon = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <!-- Crescent Moon -->
    <circle cx="50" cy="50" r="20" fill="#F0E68C"/>
    <circle cx="60" cy="50" r="20" fill="black"/>

    <!-- Stars -->
    <circle cx="20" cy="20" r="2" fill="#F0E68C"/>
    <circle cx="80" cy="30" r="1.5" fill="#F0E68C"/>
    <circle cx="25" cy="75" r="2.5" fill="#F0E68C"/>
    <circle cx="70" cy="80" r="1.8" fill="#F0E68C"/>
    <circle cx="85" cy="60" r="1.5" fill="#F0E68C"/>
</svg>
`;

// Weather API integration
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=35e1b737845d46a4a42162457251703&q=${city}&aqi=yes`
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Update weather information
    document.getElementById(
      "cityName"
    ).textContent = `${data.location.name}, ${data.location.country}`;

    document.getElementById("temperature").textContent = `${Math.round(
      data.current.temp_c
    )}°C`;

    document.getElementById("weatherCondition").textContent =
      data.current.condition.text;

    document.getElementById(
      "humidity"
    ).textContent = `${data.current.humidity}%`;

    document.getElementById(
      "windSpeed"
    ).textContent = `${data.current.wind_kph} km/h`;

    document.getElementById("feelsLike").textContent = `${Math.round(
      data.current.feelslike_c
    )}°C`;

    document.getElementById(
      "pressure"
    ).textContent = `${data.current.pressure_mb} hPa`;

    // Update day/night icon
    const hours = new Date().getHours();
    document.getElementById("dayNightIcon").innerHTML =
      hours >= 6 && hours < 18 ? dayIcon : nightIcon;
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// Initialize app
checkUserData();
