import { fetchWeather, generateWeatherIcon } from "./weatherApi.js";

class WeatherApp {
  constructor() {
    this.userData = {
      name: "",
      city: "",
      profilePhoto: "",
    };

    this.initializeElements();
    this.attachEventListeners();
    this.checkUserData();
    this.startTimeUpdate();
  }

  initializeElements() {
    // Forms and overlays
    this.onboardingModal = document.getElementById("onboardingModal");
    this.onboardingForm = document.getElementById("onboardingForm");
    this.searchOverlay = document.getElementById("searchOverlay");
    this.searchInput = document.getElementById("searchInput");

    // User interface elements
    this.headerProfile = document.getElementById("headerProfile");
    this.headerName = document.getElementById("headerName");
    this.currentTime = document.getElementById("currentTime");

    // Weather display elements
    this.cityName = document.getElementById("cityName");
    this.weatherCondition = document.getElementById("weatherCondition");
    this.temperature = document.getElementById("temperature");
    this.humidity = document.getElementById("humidity");
    this.windSpeed = document.getElementById("windSpeed");
    this.feelsLike = document.getElementById("feelsLike");
    this.pressure = document.getElementById("pressure");
    this.dayNightIcon = document.getElementById("dayNightIcon");
  }

  attachEventListeners() {
    // Onboarding form submission
    this.onboardingForm.addEventListener("submit", (e) =>
      this.handleOnboarding(e)
    );

    // Profile photo upload
    document
      .getElementById("profilePhoto")
      .addEventListener("change", (e) => this.handleProfileUpload(e));

    // Search functionality
    document
      .getElementById("searchIcon")
      .addEventListener("click", () => this.showSearch());
    document
      .getElementById("closeSearch")
      .addEventListener("click", () => this.hideSearch());
    this.searchInput.addEventListener("keypress", (e) => this.handleSearch(e));
  }

  async handleOnboarding(e) {
    e.preventDefault();

    this.userData.name = document.getElementById("userName").value;
    this.userData.city = document.getElementById("userCity").value;

    localStorage.setItem("weatherAppUser", JSON.stringify(this.userData));
    this.onboardingModal.style.display = "none";

    this.updateUIWithUserData();
    await this.fetchAndDisplayWeather(this.userData.city);
  }

  handleProfileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userData.profilePhoto = e.target.result;
        document.getElementById("profilePreview").src = e.target.result;
        this.headerProfile.src = e.target.result;
        localStorage.setItem("weatherAppUser", JSON.stringify(this.userData));
      };
      reader.readAsDataURL(file);
    }
  }

  showSearch() {
    this.searchOverlay.classList.add("active");
    this.searchInput.focus();
  }

  hideSearch() {
    this.searchOverlay.classList.remove("active");
    this.searchInput.value = "";
  }

  async handleSearch(e) {
    if (e.key === "Enter") {
      const city = this.searchInput.value.trim();
      if (city) {
        await this.fetchAndDisplayWeather(city);
        this.hideSearch();
      }
    }
  }

  checkUserData() {
    const stored = localStorage.getItem("weatherAppUser");
    if (stored) {
      this.userData = JSON.parse(stored);
      this.updateUIWithUserData();
      this.onboardingModal.style.display = "none";
      this.fetchAndDisplayWeather(this.userData.city);
    }
  }

  updateUIWithUserData() {
    this.headerName.textContent = this.userData.name;
    this.headerProfile.src = this.userData.profilePhoto || "assets/user.svg";
    this.updateTime();
  }

  updateTime() {
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
    this.currentTime.textContent = `${dateString} | ${timeString}`;
  }

  startTimeUpdate() {
    setInterval(() => this.updateTime(), 1000);
  }

  async fetchAndDisplayWeather(city) {
    try {
      const weatherData = await fetchWeather(city);
      this.updateWeatherUI(weatherData);
    } catch (error) {
      this.handleWeatherError(error);
    }
  }

  updateWeatherUI(data) {
    this.cityName.textContent = `${data.location.name}, ${data.location.country}`;
    this.temperature.textContent = `${data.current.temp_c}°C`;
    this.weatherCondition.textContent = data.current.condition;
    this.humidity.textContent = `${data.current.humidity}%`;
    this.windSpeed.textContent = `${data.current.wind_kph} km/h`;
    this.feelsLike.textContent = `${data.current.feelslike_c}°C`;
    this.pressure.textContent = `${data.current.pressure_mb} hPa`;

    this.dayNightIcon.innerHTML = generateWeatherIcon(data.current.is_day);
  }

  handleWeatherError(error) {
    console.error("Weather fetch error:", error);
    this.cityName.textContent = "Error loading weather data";
    this.weatherCondition.textContent = "Please try again later";
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WeatherApp();
});
