// User stats
let userPoints = 1247;
let userLevel = 8;
let userStreak = 12;
let co2Saved = 2.4;

function completeChallenge(button, points) {
  // Add points and update stats
  userPoints += points;
  document.getElementById("totalPoints").textContent =
    userPoints.toLocaleString();

  // Update button to completed state
  button.textContent = "✓ Completed";
  button.classList.add("completed");
  button.onclick = null;

  // Add visual feedback
  button.style.transform = "scale(1.1)";
  setTimeout(() => {
    button.style.transform = "scale(1)";
  }, 200);

  // Check for level up
  const newLevel = Math.floor(userPoints / 200) + 1;
  if (newLevel > userLevel) {
    userLevel = newLevel;
    document.getElementById("level").textContent = userLevel;
    showLevelUpNotification();
  }

  // Update progress bars
  updateProgressBars();

  // Show points gained animation
  showPointsGained(points, button);

  // Check for new achievements
  checkAchievements();
}

function showPointsGained(points, button) {
  const pointsElement = document.createElement("div");
  pointsElement.textContent = `+${points} XP`;
  pointsElement.style.cssText = `
                position: absolute;
                color: #4CAF50;
                font-weight: bold;
                font-size: 1.2rem;
                pointer-events: none;
                animation: pointsFloat 2s ease-out forwards;
                z-index: 1000;
            `;

  // Add floating animation
  const style = document.createElement("style");
  style.textContent = `
                @keyframes pointsFloat {
                    0% { opacity: 1; transform: translateY(0px); }
                    100% { opacity: 0; transform: translateY(-50px); }
                }
            `;
  document.head.appendChild(style);

  const rect = button.getBoundingClientRect();
  pointsElement.style.left = rect.left + "px";
  pointsElement.style.top = rect.top + "px";

  document.body.appendChild(pointsElement);

  setTimeout(() => {
    document.body.removeChild(pointsElement);
  }, 2000);
}

function showLevelUpNotification() {
  const notification = document.createElement("div");
  notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #4CAF50, #8BC34A);
                    color: white;
                    padding: 30px;
                    border-radius: 20px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    z-index: 10000;
                    animation: levelUpPulse 3s ease-out forwards;
                ">
                    <h2 style="margin: 0 0 10px 0; font-size: 2rem;">🎉 Level Up! 🎉</h2>
                    <p style="margin: 0; font-size: 1.2rem;">You've reached Level ${userLevel}!</p>
                </div>
            `;

  const style = document.createElement("style");
  style.textContent = `
                @keyframes levelUpPulse {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                    40% { transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
                }
            `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

function updateProgressBars() {
  // Update level progress (points needed for next level)
  const pointsForNextLevel = userLevel * 200;
  const currentLevelProgress = ((userPoints % 200) / 200) * 100;
  document.querySelector(".stat-card:nth-child(2) .progress-fill").style.width =
    currentLevelProgress + "%";

  // Update other progress bars based on achievements
  const totalPointsProgress = Math.min((userPoints / 5000) * 100, 100);
  document.querySelector(".stat-card:nth-child(1) .progress-fill").style.width =
    totalPointsProgress + "%";
}

function checkAchievements() {
  const achievements = document.querySelectorAll(
    ".achievement-badge:not(.unlocked)"
  );

  // Check Carbon Hero achievement (5 tons CO2 saved)
  if (userPoints > 2000 && achievements.length > 0) {
    const carbonHero = Array.from(achievements).find(
      (badge) => badge.querySelector("h4").textContent === "Carbon Hero"
    );
    if (carbonHero) {
      carbonHero.classList.add("unlocked");
      showAchievementUnlocked("Carbon Hero");
    }
  }
}

function showAchievementUnlocked(achievementName) {
  const notification = document.createElement("div");
  notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #f39c12, #e67e22);
                    color: white;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    z-index: 10000;
                    animation: slideInRight 0.5s ease-out;
                    max-width: 300px;
                ">
                    <h3 style="margin: 0 0 10px 0;">🏆 Achievement Unlocked!</h3>
                    <p style="margin: 0;">${achievementName}</p>
                </div>
            `;

  const style = document.createElement("style");
  style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideInRight 0.5s ease-out reverse";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 4000);
}

// Authentication functions
function showLoginModal() {
  document.getElementById("loginModal").style.display = "flex";
}

function showSignupModal() {
  document.getElementById("signupModal").style.display = "flex";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function switchToSignup() {
  closeModal("loginModal");
  showSignupModal();
}

function switchToLogin() {
  closeModal("signupModal");
  showLoginModal();
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Demo login - in a real app, this would connect to a backend
  if (email && password) {
    isLoggedIn = true;
    showSuccessMessage("Welcome back! You're now logged in.");
    closeModal("loginModal");
    updateAuthButtons(true, email);
  }
}

function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const farmType = document.getElementById("farmType").value;
  const panchayat = document.getElementById("panchayat").value;

  // Demo signup - in a real app, this would connect to a backend
  if (name && email && password && farmType && panchayat) {
    isLoggedIn = true;
    showSuccessMessage(
      `Welcome to Kerala Krishi Quest, ${name}! Your ${farmType.toLowerCase()} farming journey in ${panchayat} begins now. You've earned 500 bonus XP!`
    );
    closeModal("signupModal");
    updateAuthButtons(true, email);

    // Set new user stats with bonus points
    userPoints = 500;
    userLevel = 1;
    userStreak = 0;
    document.getElementById("totalPoints").textContent = "500";
    document.getElementById("level").textContent = "1";
    document.getElementById("streak").textContent = "0";
    document.getElementById("schemePoints").textContent = "25";
    updateProgressBars();
  } else {
    showSuccessMessage("Please fill in all fields to register.");
  }
}

function updateAuthButtons(isLoggedIn, email) {
  const authButtons = document.querySelector(".auth-buttons");
  if (isLoggedIn) {
    authButtons.innerHTML = `
                    <span style="color: #2d5016; font-weight: 600; margin-right: 15px;">Welcome, ${
                      email.split("@")[0]
                    }!</span>
                    <button class="auth-btn" onclick="handleLogout()">Logout</button>
                `;
  } else {
    authButtons.innerHTML = `
                    <button class="auth-btn" onclick="showLoginModal()">Login</button>
                    <button class="auth-btn signup" onclick="showSignupModal()">Sign Up</button>
                `;
  }
}

function handleLogout() {
  isLoggedIn = false;
  autoPopupShown = false; // Reset popup flag for next visit
  showSuccessMessage("You've been logged out successfully.");
  updateAuthButtons(false);
}

function showSuccessMessage(message) {
  const notification = document.createElement("div");
  notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #4CAF50, #8BC34A);
                    color: white;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    z-index: 10000;
                    animation: slideInRight 0.5s ease-out;
                    max-width: 350px;
                ">
                    <p style="margin: 0;">${message}</p>
                </div>
            `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideInRight 0.5s ease-out reverse";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 4000);
}

// Close modals when clicking outside
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal-overlay")) {
    event.target.style.display = "none";
  }
});

// Game functions
function startGame(gameType) {
  const gameContent = document.getElementById("gameContent");

  switch (gameType) {
    case "crop-rotation":
      gameContent.innerHTML = createCropRotationGame();
      break;
    case "pest-defense":
      gameContent.innerHTML = createPestDefenseGame();
      break;
    case "water-manager":
      gameContent.innerHTML = createWaterManagerGame();
      break;
    case "market-trader":
      gameContent.innerHTML = createMarketTraderGame();
      break;
    case "soil-scientist":
      gameContent.innerHTML = createSoilScienceGame();
      break;
    case "weather-predictor":
      gameContent.innerHTML = createWeatherPredictorGame();
      break;
  }

  document.getElementById("gameModal").style.display = "flex";
}

function createCropRotationGame() {
  return `
                <h2 style="color: #2d5016; text-align: center; margin-bottom: 20px;">🔄 Crop Rotation Puzzle</h2>
                <div style="text-align: center; margin-bottom: 20px;">
                    <p>Plan the perfect 4-season rotation for your field!</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                    <div class="season-slot" data-season="1" onclick="selectCrop(this, 1)">
                        <h4>Season 1 (Monsoon)</h4>
                        <div class="crop-display">Click to select crop</div>
                    </div>
                    <div class="season-slot" data-season="2" onclick="selectCrop(this, 2)">
                        <h4>Season 2 (Post-Monsoon)</h4>
                        <div class="crop-display">Click to select crop</div>
                    </div>
                    <div class="season-slot" data-season="3" onclick="selectCrop(this, 3)">
                        <h4>Season 3 (Winter)</h4>
                        <div class="crop-display">Click to select crop</div>
                    </div>
                    <div class="season-slot" data-season="4" onclick="selectCrop(this, 4)">
                        <h4>Season 4 (Summer)</h4>
                        <div class="crop-display">Click to select crop</div>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">
                    <button class="crop-btn" onclick="setCrop('🌾 Rice')">🌾 Rice</button>
                    <button class="crop-btn" onclick="setCrop('🥬 Vegetables')">🥬 Vegetables</button>
                    <button class="crop-btn" onclick="setCrop('🌱 Legumes')">🌱 Legumes</button>
                    <button class="crop-btn" onclick="setCrop('🌿 Fallow')">🌿 Fallow</button>
                </div>
                <button class="modal-btn" onclick="checkRotation()">Check My Rotation</button>
                <style>
                    .season-slot {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 10px;
                        border: 2px dashed #ccc;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .season-slot:hover {
                        border-color: #4CAF50;
                        background: #e8f5e8;
                    }
                    .season-slot.selected {
                        border-color: #4CAF50;
                        background: #e8f5e8;
                        border-style: solid;
                    }
                    .crop-btn {
                        padding: 8px 16px;
                        border: 2px solid #4CAF50;
                        background: white;
                        border-radius: 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .crop-btn:hover {
                        background: #4CAF50;
                        color: white;
                    }
                </style>
            `;
}

function createPestDefenseGame() {
  return `
                <h2 style="color: #2d5016; text-align: center; margin-bottom: 20px;">🐛 Pest Defense</h2>
                <div style="text-align: center; margin-bottom: 20px;">
                    <p>Protect your crops using organic methods!</p>
                    <div style="background: #f0f8ff; padding: 15px; border-radius: 10px; margin: 15px 0;">
                        <div style="font-size: 1.5rem; margin-bottom: 10px;">🌱🌱🌱🌱🌱</div>
                        <div>Your Crop Field</div>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                    <button class="defense-btn" onclick="usePestControl('neem')">
                        🌿 Neem Spray<br><small>Organic pesticide</small>
                    </button>
                    <button class="defense-btn" onclick="usePestControl('companion')">
                        🌻 Companion Plants<br><small>Natural deterrent</small>
                    </button>
                    <button class="defense-btn" onclick="usePestControl('beneficial')">
                        🐞 Beneficial Insects<br><small>Natural predators</small>
                    </button>
                </div>
                <div id="pestResult" style="text-align: center; margin: 20px 0;"></div>
                <button class="modal-btn" onclick="startPestWave()">Start New Wave</button>
                <style>
                    .defense-btn {
                        padding: 20px;
                        border: 2px solid #4CAF50;
                        background: white;
                        border-radius: 15px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-align: center;
                    }
                    .defense-btn:hover {
                        background: #4CAF50;
                        color: white;
                        transform: scale(1.05);
                    }
                </style>
            `;
}

function createWaterManagerGame() {
  return `
                <h2 style="color: #2d5016; text-align: center; margin-bottom: 20px;">💧 Water Manager</h2>
                <div style="text-align: center; margin-bottom: 20px;">
                    <p>Optimize your irrigation schedule!</p>
                </div>
                <div style="background: #f0f8ff; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    <h4>Current Conditions:</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px;">
                        <div>🌡️ Temperature: 28°C</div>
                        <div>💨 Humidity: 65%</div>
                        <div>☀️ Sunny Day</div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <h4>Irrigation Schedule:</h4>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px;">
                        <button class="time-btn" onclick="scheduleWater('6am')">6 AM</button>
                        <button class="time-btn" onclick="scheduleWater('12pm')">12 PM</button>
                        <button class="time-btn" onclick="scheduleWater('6pm')">6 PM</button>
                        <button class="time-btn" onclick="scheduleWater('10pm')">10 PM</button>
                    </div>
                </div>
                <div id="waterResult" style="text-align: center; margin: 20px 0;"></div>
                <button class="modal-btn" onclick="optimizeWater()">Optimize Schedule</button>
                <style>
                    .time-btn {
                        padding: 15px;
                        border: 2px solid #2196F3;
                        background: white;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    .time-btn:hover {
                        background: #2196F3;
                        color: white;
                    }
                    .time-btn.selected {
                        background: #2196F3;
                        color: white;
                    }
                </style>
            `;
}

function createMarketTraderGame() {
  return `
                <h2 style="color: #2d5016; text-align: center; margin-bottom: 20px;">📈 Market Trader</h2>
                <div style="text-align: center; margin-bottom: 20px;">
                    <p>Buy and sell spices at the right time!</p>
                    <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin: 15px 0;">
                        <strong>Your Wallet: ₹5,000</strong>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                    <div class="market-item">
                        <h4>🌶️ Black Pepper</h4>
                        <div>Current Price: ₹450/kg</div>
                        <div style="margin: 10px 0;">
                            <button onclick="tradeSpice('pepper', 'buy')">Buy</button>
                            <button onclick="tradeSpice('pepper', 'sell')">Sell</button>
                        </div>
                    </div>
                    <div class="market-item">
                        <h4>💚 Cardamom</h4>
                        <div>Current Price: ₹1,200/kg</div>
                        <div style="margin: 10px 0;">
                            <button onclick="tradeSpice('cardamom', 'buy')">Buy</button>
                            <button onclick="tradeSpice('cardamom', 'sell')">Sell</button>
                        </div>
                    </div>
                </div>
                <div id="tradeResult" style="text-align: center; margin: 20px 0;"></div>
                <button class="modal-btn" onclick="nextMarketDay()">Next Market Day</button>
                <style>
                    .market-item {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 10px;
                        text-align: center;
                        border: 2px solid #e9ecef;
                    }
                    .market-item button {
                        margin: 0 5px;
                        padding: 8px 16px;
                        border: 1px solid #4CAF50;
                        background: white;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .market-item button:hover {
                        background: #4CAF50;
                        color: white;
                    }
                </style>
            `;
}

function createSoilScienceGame() {
  return `
                <h2 style="color: #2d5016; text-align: center; margin-bottom: 20px;">🧪 Soil Science Lab</h2>
                <div style="text-align: center; margin-bottom: 20px;">
                    <p>Test and improve your soil health!</p>
                </div>
                <div style="background: #f0f8ff; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    <h4>Soil Sample Analysis:</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px;">
                        <div>pH Level: <span id="phLevel">6.5</span></div>
                        <div>Nitrogen: <span id="nitrogen">Medium</span></div>
                        <div>Organic Matter: <span id="organic">Low</span></div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <h4>Soil Treatments:</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
                        <button class="treatment-btn" onclick="applySoilTreatment('compost')">
                            🍂 Add Compost<br><small>Increases organic matter</small>
                        </button>
                        <button class="treatment-btn" onclick="applySoilTreatment('lime')">
                            🪨 Add Lime<br><small>Adjusts pH level</small>
                        </button>
                        <button class="treatment-btn" onclick="applySoilTreatment('manure')">
                            🐄 Organic Manure<br><small>Adds nitrogen</small>
                        </button>
                        <button class="treatment-btn" onclick="applySoilTreatment('mulch')">
                            🌾 Mulching<br><small>Retains moisture</small>
                        </button>
                    </div>
                </div>
                <div id="soilResult" style="text-align: center; margin: 20px 0;"></div>
                <button class="modal-btn" onclick="testSoil()">Run New Test</button>
                <style>
                    .treatment-btn {
                        padding: 15px;
                        border: 2px solid #8BC34A;
                        background: white;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-align: center;
                    }
                    .treatment-btn:hover {
                        background: #8BC34A;
                        color: white;
                        transform: scale(1.05);
                    }
                </style>
            `;
}

function createWeatherPredictorGame() {
  return `
                <h2 style="color: #2d5016; text-align: center; margin-bottom: 20px;">🌦️ Weather Predictor</h2>
                <div style="text-align: center; margin-bottom: 20px;">
                    <p>Predict the weather and plan your farming activities!</p>
                </div>
                <div style="background: #f0f8ff; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                    <h4>Current Weather Indicators:</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px;">
                        <div>🌡️ Temperature: Rising</div>
                        <div>💨 Wind: Southwest</div>
                        <div>☁️ Clouds: Increasing</div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <h4>Your Prediction for Tomorrow:</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
                        <button class="weather-btn" onclick="predictWeather('sunny')">
                            ☀️ Sunny<br><small>Clear skies</small>
                        </button>
                        <button class="weather-btn" onclick="predictWeather('cloudy')">
                            ☁️ Cloudy<br><small>Overcast</small>
                        </button>
                        <button class="weather-btn" onclick="predictWeather('rainy')">
                            🌧️ Rainy<br><small>Monsoon showers</small>
                        </button>
                        <button class="weather-btn" onclick="predictWeather('stormy')">
                            ⛈️ Stormy<br><small>Heavy rain & wind</small>
                        </button>
                    </div>
                </div>
                <div id="weatherResult" style="text-align: center; margin: 20px 0;"></div>
                <button class="modal-btn" onclick="checkWeatherPrediction()">Check Prediction</button>
                <style>
                    .weather-btn {
                        padding: 20px;
                        border: 2px solid #FF9800;
                        background: white;
                        border-radius: 15px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-align: center;
                    }
                    .weather-btn:hover {
                        background: #FF9800;
                        color: white;
                        transform: scale(1.05);
                    }
                    .weather-btn.selected {
                        background: #FF9800;
                        color: white;
                    }
                </style>
            `;
}

// Game interaction functions
let selectedSeason = null;
let selectedCrop = null;
let rotationPlan = {};
let selectedWeather = null;

function selectCrop(element, season) {
  document
    .querySelectorAll(".season-slot")
    .forEach((slot) => slot.classList.remove("selected"));
  element.classList.add("selected");
  selectedSeason = season;
}

function setCrop(crop) {
  if (selectedSeason) {
    rotationPlan[selectedSeason] = crop;
    const seasonSlot = document.querySelector(
      `[data-season="${selectedSeason}"] .crop-display`
    );
    seasonSlot.textContent = crop;
    document
      .querySelector(`[data-season="${selectedSeason}"]`)
      .classList.remove("selected");
    selectedSeason = null;
  }
}

function checkRotation() {
  const seasons = Object.keys(rotationPlan).length;
  if (seasons === 4) {
    const points = 200;
    userPoints += points;
    document.getElementById("totalPoints").textContent =
      userPoints.toLocaleString();
    showSuccessMessage(`Excellent rotation plan! You earned ${points} XP!`);
    closeModal("gameModal");
    updateProgressBars();
    setTimeout(() => showPhotoUploadPrompt(), 1000);
  } else {
    alert("Please plan all 4 seasons before checking!");
  }
}

function usePestControl(method) {
  const methods = {
    neem: { name: "Neem Spray", effectiveness: 85, points: 75 },
    companion: { name: "Companion Plants", effectiveness: 70, points: 60 },
    beneficial: { name: "Beneficial Insects", effectiveness: 90, points: 90 },
  };

  const result = methods[method];
  const resultDiv = document.getElementById("pestResult");
  resultDiv.innerHTML = `
                <div style="background: #d4edda; padding: 15px; border-radius: 10px; color: #155724;">
                    <strong>${result.name}</strong> was ${result.effectiveness}% effective!<br>
                    You earned ${result.points} XP!
                </div>
            `;

  userPoints += result.points;
  document.getElementById("totalPoints").textContent =
    userPoints.toLocaleString();
  updateProgressBars();
}

function scheduleWater(time) {
  document
    .querySelectorAll(".time-btn")
    .forEach((btn) => btn.classList.remove("selected"));
  event.target.classList.add("selected");

  const efficiency = {
    "6am": {
      rate: 95,
      message: "Perfect timing! Cool morning reduces evaporation.",
    },
    "12pm": { rate: 40, message: "Poor timing. Hot sun causes water loss." },
    "6pm": { rate: 85, message: "Good timing. Evening watering is efficient." },
    "10pm": {
      rate: 75,
      message: "Okay timing, but may promote fungal growth.",
    },
  };

  const result = efficiency[time];
  const resultDiv = document.getElementById("waterResult");
  resultDiv.innerHTML = `
                <div style="background: #cce5ff; padding: 15px; border-radius: 10px;">
                    <strong>Efficiency: ${result.rate}%</strong><br>
                    ${result.message}
                </div>
            `;
}

function optimizeWater() {
  const points = 120;
  userPoints += points;
  document.getElementById("totalPoints").textContent =
    userPoints.toLocaleString();
  showSuccessMessage(`Water schedule optimized! You earned ${points} XP!`);
  closeModal("gameModal");
  updateProgressBars();
  setTimeout(() => showPhotoUploadPrompt(), 1000);
}

function tradeSpice(spice, action) {
  const prices = { pepper: 450, cardamom: 1200 };
  const resultDiv = document.getElementById("tradeResult");

  if (action === "buy") {
    resultDiv.innerHTML = `
                    <div style="background: #fff3cd; padding: 15px; border-radius: 10px;">
                        Bought 1kg ${spice} for ₹${prices[spice]}
                    </div>
                `;
  } else {
    const profit = Math.floor(Math.random() * 200) + 50;
    resultDiv.innerHTML = `
                    <div style="background: #d4edda; padding: 15px; border-radius: 10px;">
                        Sold 1kg ${spice} for ₹${
      prices[spice] + profit
    }. Profit: ₹${profit}!
                    </div>
                `;
    userPoints += profit / 5;
    document.getElementById("totalPoints").textContent =
      userPoints.toLocaleString();
    updateProgressBars();
  }
}

function nextMarketDay() {
  const points = 100;
  userPoints += points;
  document.getElementById("totalPoints").textContent =
    userPoints.toLocaleString();
  showSuccessMessage(`Great trading! You earned ${points} XP!`);
  closeModal("gameModal");
  updateProgressBars();
  setTimeout(() => showPhotoUploadPrompt(), 1000);
}

function applySoilTreatment(treatment) {
  const treatments = {
    compost: { effect: "Organic matter increased!", points: 80 },
    lime: { effect: "pH level balanced!", points: 70 },
    manure: { effect: "Nitrogen levels improved!", points: 85 },
    mulch: { effect: "Moisture retention enhanced!", points: 75 },
  };

  const result = treatments[treatment];
  const resultDiv = document.getElementById("soilResult");
  resultDiv.innerHTML = `
                <div style="background: #d4edda; padding: 15px; border-radius: 10px; color: #155724;">
                    <strong>${result.effect}</strong><br>
                    You earned ${result.points} XP!
                </div>
            `;

  userPoints += result.points;
  document.getElementById("totalPoints").textContent =
    userPoints.toLocaleString();
  updateProgressBars();
}

function testSoil() {
  const points = 60;
  userPoints += points;
  document.getElementById("totalPoints").textContent =
    userPoints.toLocaleString();
  showSuccessMessage(`Soil analysis complete! You earned ${points} XP!`);
  closeModal("gameModal");
  updateProgressBars();
  setTimeout(() => showPhotoUploadPrompt(), 1000);
}

function predictWeather(weather) {
  document
    .querySelectorAll(".weather-btn")
    .forEach((btn) => btn.classList.remove("selected"));
  event.target.classList.add("selected");
  selectedWeather = weather;
}

function checkWeatherPrediction() {
  if (!selectedWeather) {
    alert("Please make a weather prediction first!");
    return;
  }

  const actualWeather = ["sunny", "cloudy", "rainy"][
    Math.floor(Math.random() * 3)
  ];
  const isCorrect = selectedWeather === actualWeather;
  const points = isCorrect ? 150 : 50;

  const resultDiv = document.getElementById("weatherResult");
  resultDiv.innerHTML = `
                <div style="background: ${
                  isCorrect ? "#d4edda" : "#f8d7da"
                }; padding: 15px; border-radius: 10px;">
                    <strong>Actual weather: ${actualWeather}</strong><br>
                    ${
                      isCorrect
                        ? "Correct prediction!"
                        : "Better luck next time!"
                    }<br>
                    You earned ${points} XP!
                </div>
            `;

  userPoints += points;
  document.getElementById("totalPoints").textContent =
    userPoints.toLocaleString();
  updateProgressBars();

  setTimeout(() => {
    closeModal("gameModal");
    showPhotoUploadPrompt();
  }, 2000);
}

// Photo sharing functions
function showPhotoUploadPrompt() {
  const notification = document.createElement("div");
  notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #4CAF50, #8BC34A);
                    color: white;
                    padding: 30px;
                    border-radius: 20px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    z-index: 10000;
                    max-width: 400px;
                ">
                    <h3 style="margin: 0 0 15px 0;">🎉 Great Job!</h3>
                    <p style="margin: 0 0 20px 0;">Share a photo of your farming achievement to inspire other farmers!</p>
                    <button onclick="openPhotoModal(); document.body.removeChild(this.closest('div').parentElement);" style="
                        background: white;
                        color: #4CAF50;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 25px;
                        font-weight: bold;
                        cursor: pointer;
                        margin-right: 10px;
                    ">📸 Share Photo</button>
                    <button onclick="document.body.removeChild(this.closest('div').parentElement);" style="
                        background: transparent;
                        color: white;
                        border: 2px solid white;
                        padding: 10px 20px;
                        border-radius: 25px;
                        cursor: pointer;
                    ">Maybe Later</button>
                </div>
            `;

  document.body.appendChild(notification);
}

function openPhotoModal() {
  document.getElementById("photoModal").style.display = "flex";
}

function previewPhoto(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById("photoPreview");
      preview.innerHTML = `
                        <img src="${e.target.result}" class="photo-preview-image" alt="Preview">
                        <p>Photo selected! You can change it by clicking again.</p>
                    `;
      document.querySelector(".photo-upload-area").classList.add("has-image");
    };
    reader.readAsDataURL(file);
  }
}

function submitPhoto(event) {
  event.preventDefault();

  const title = document.getElementById("achievementTitle").value;
  const location = document.getElementById("photoLocation").value;
  const description = document.getElementById("photoDescription").value;
  const game = document.getElementById("gameCompleted").value;
  const photoFile = document.getElementById("photoUpload").files[0];

  if (!photoFile) {
    alert("Please upload a photo first!");
    return;
  }

  // Create new photo post
  const reader = new FileReader();
  reader.onload = function (e) {
    addNewPhotoPost({
      title: title,
      location: location,
      description: description,
      game: game,
      photoUrl: e.target.result,
      timestamp: "Just now",
    });

    // Reset form
    document.getElementById("achievementTitle").value = "";
    document.getElementById("photoLocation").value = "";
    document.getElementById("photoDescription").value = "";
    document.getElementById("gameCompleted").value = "";
    document.getElementById("photoUpload").value = "";
    document.getElementById("photoPreview").innerHTML = `
                    <div style="font-size: 3rem; color: #ccc;">📷</div>
                    <p>Click to upload a photo of your farming achievement</p>
                `;
    document.querySelector(".photo-upload-area").classList.remove("has-image");

    closeModal("photoModal");
    showSuccessMessage(
      "Your achievement has been shared! Other farmers can now rate and comment on it."
    );

    // Award bonus points for sharing
    userPoints += 100;
    document.getElementById("totalPoints").textContent =
      userPoints.toLocaleString();
    updateProgressBars();
  };
  reader.readAsDataURL(photoFile);
}

function addNewPhotoPost(photoData) {
  const photosGrid = document.getElementById("photosGrid");
  const gameIcons = {
    "crop-rotation": "🔄",
    "pest-defense": "🐛",
    "water-manager": "💧",
    "market-trader": "📈",
    "soil-scientist": "🧪",
    "weather-predictor": "🌦️",
  };

  const newPhotoCard = document.createElement("div");
  newPhotoCard.className = "photo-card";
  newPhotoCard.innerHTML = `
                <div class="photo-header">
                    <div class="farmer-info">
                        <div class="farmer-avatar">YU</div>
                        <div>
                            <div class="farmer-name">You</div>
                            <div class="photo-location">📍 ${
                              photoData.location
                            }</div>
                        </div>
                    </div>
                    <div class="photo-time">${photoData.timestamp}</div>
                </div>
                <div class="photo-image">
                    <img src="${
                      photoData.photoUrl
                    }" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px;" alt="Achievement photo">
                </div>
                <div class="photo-description">
                    <strong>${photoData.title}</strong><br>
                    ${photoData.description}
                    ${
                      photoData.game
                        ? `<br><small style="color: #666;">Game: ${
                            gameIcons[photoData.game]
                          } ${
                            document.querySelector(
                              `option[value="${photoData.game}"]`
                            ).textContent
                          }</small>`
                        : ""
                    }
                </div>
                <div class="photo-actions">
                    <button class="rate-btn" onclick="ratePhoto(this, 'like')">
                        <span class="rate-icon">👍</span>
                        <span class="rate-count">0</span>
                    </button>
                    <button class="rate-btn" onclick="ratePhoto(this, 'love')">
                        <span class="rate-icon">❤️</span>
                        <span class="rate-count">0</span>
                    </button>
                    <button class="rate-btn" onclick="ratePhoto(this, 'expert')">
                        <span class="rate-icon">🏆</span>
                        <span class="rate-count">0</span>
                    </button>
                    <button class="comment-btn" onclick="toggleComments(this)">
                        💬 Comments (0)
                    </button>
                </div>
                <div class="comments-section" style="display: none;">
                    <div class="comment-input">
                        <input type="text" placeholder="Add a comment..." onkeypress="addComment(event, this)">
                    </div>
                </div>
            `;

  // Add to the beginning of the grid
  photosGrid.insertBefore(newPhotoCard, photosGrid.firstChild);

  // Animate the new card
  newPhotoCard.style.opacity = "0";
  newPhotoCard.style.transform = "translateY(-20px)";
  setTimeout(() => {
    newPhotoCard.style.transition = "all 0.5s ease";
    newPhotoCard.style.opacity = "1";
    newPhotoCard.style.transform = "translateY(0)";
  }, 100);
}

function ratePhoto(button, rateType) {
  const rateBtn = button;
  const countSpan = rateBtn.querySelector(".rate-count");
  let currentCount = parseInt(countSpan.textContent);

  // Toggle rating
  if (rateBtn.classList.contains(rateType + "d")) {
    rateBtn.classList.remove(rateType + "d");
    countSpan.textContent = currentCount - 1;
  } else {
    // Remove other ratings from this user on this post
    const photoCard = rateBtn.closest(".photo-card");
    photoCard.querySelectorAll(".rate-btn").forEach((btn) => {
      if (
        btn.classList.contains("liked") ||
        btn.classList.contains("loved") ||
        btn.classList.contains("expert")
      ) {
        btn.classList.remove("liked", "loved", "expert");
        const count = btn.querySelector(".rate-count");
        count.textContent = Math.max(0, parseInt(count.textContent) - 1);
      }
    });

    rateBtn.classList.add(rateType + "d");
    countSpan.textContent = currentCount + 1;

    // Add visual feedback
    rateBtn.style.transform = "scale(1.2)";
    setTimeout(() => {
      rateBtn.style.transform = "scale(1)";
    }, 200);
  }
}

function toggleComments(button) {
  const photoCard = button.closest(".photo-card");
  const commentsSection = photoCard.querySelector(".comments-section");

  if (commentsSection.style.display === "none") {
    commentsSection.style.display = "block";
    button.style.background = "#2196F3";
    button.style.color = "white";
  } else {
    commentsSection.style.display = "none";
    button.style.background = "white";
    button.style.color = "#2196F3";
  }
}

function addComment(event, input) {
  if (event.key === "Enter" && input.value.trim()) {
    const comment = input.value.trim();
    const commentsSection = input.closest(".comments-section");
    const commentInput = commentsSection.querySelector(".comment-input");

    // Create new comment element
    const newComment = document.createElement("div");
    newComment.className = "comment";
    newComment.innerHTML = `<strong>You:</strong> ${comment}`;

    // Insert before the input
    commentsSection.insertBefore(newComment, commentInput);

    // Update comment count
    const commentBtn = commentsSection
      .closest(".photo-card")
      .querySelector(".comment-btn");
    const currentCount = parseInt(commentBtn.textContent.match(/\d+/)[0]);
    commentBtn.textContent = `💬 Comments (${currentCount + 1})`;

    // Clear input
    input.value = "";

    // Animate new comment
    newComment.style.opacity = "0";
    setTimeout(() => {
      newComment.style.transition = "opacity 0.3s ease";
      newComment.style.opacity = "1";
    }, 100);
  }
}

// Navigation functions
function showSection(sectionName) {
  // Hide all sections
  const sections = [
    "home",
    "games",
    "challenges",
    "community",
    "schemes",
    "weather",
    "map",
    "help",
  ];
  sections.forEach((section) => {
    if (section === "home") {
      // Home section includes stats, main-content, games-section, photos-section, leaderboard
      document.querySelector(".stats-bar").style.display =
        section === sectionName ? "grid" : "none";
      document.querySelector(".main-content").style.display =
        section === sectionName ? "grid" : "none";
      document.querySelector(".games-section").style.display =
        section === sectionName ? "block" : "none";
      document.querySelector(".photos-section").style.display =
        section === sectionName ? "block" : "none";
      document.querySelector(".leaderboard").style.display =
        section === sectionName ? "block" : "none";
    } else if (section === "games") {
      document.querySelector(".games-section").style.display =
        section === sectionName ? "block" : "none";
    } else if (section === "challenges") {
      document.querySelector(".main-content").style.display =
        section === sectionName ? "grid" : "none";
    } else if (section === "community") {
      document.querySelector(".photos-section").style.display =
        section === sectionName ? "block" : "none";
      document.querySelector(".leaderboard").style.display =
        section === sectionName ? "block" : "none";
    } else {
      const sectionElement = document.getElementById(section + "Section");
      if (sectionElement) {
        sectionElement.style.display =
          section === sectionName ? "block" : "none";
      }
    }
  });

  // Update active nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  document
    .querySelector(`[onclick="showSection('${sectionName}')"]`)
    .classList.add("active");
}

function toggleNavMenu() {
  const navMenu = document.getElementById("navMenu");
  navMenu.classList.toggle("active");
}

// Mobile dropdown toggle functionality
function toggleMobileDropdown(event) {
  event.preventDefault();
  const dropdown = event.target.closest(".nav-dropdown");
  const isActive = dropdown.classList.contains("mobile-active");

  // Close all other dropdowns
  document.querySelectorAll(".nav-dropdown").forEach((d) => {
    d.classList.remove("mobile-active");
  });

  // Toggle current dropdown
  if (!isActive) {
    dropdown.classList.add("mobile-active");
  }
}

// Add click handlers for mobile dropdowns
document.addEventListener("DOMContentLoaded", function () {
  // Add click handlers for dropdown toggles on mobile
  document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
    toggle.addEventListener("click", function (event) {
      if (window.innerWidth <= 768) {
        toggleMobileDropdown(event);
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-dropdown").forEach((d) => {
        d.classList.remove("mobile-active");
      });
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      document.querySelectorAll(".nav-dropdown").forEach((d) => {
        d.classList.remove("mobile-active");
      });
    }
  });
});

// Map functions
function filterMap(cropType) {
  const markers = document.querySelectorAll(".farm-marker");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // Update active filter button
  filterBtns.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  // Show/hide markers based on filter
  markers.forEach((marker) => {
    const markerCrop = marker.getAttribute("data-crop");
    if (cropType === "all" || markerCrop === cropType) {
      marker.style.display = "block";
      marker.style.opacity = "1";
    } else {
      marker.style.opacity = "0.3";
    }
  });
}

function showFarmerInfo(marker) {
  const farmerName = marker.getAttribute("data-farmer");
  const farmerCrop = marker.getAttribute("data-crop");
  const farmerLocation = marker.getAttribute("data-location");

  const farmerDetails = document.getElementById("farmerDetails");
  farmerDetails.innerHTML = `
                <h3>${farmerName}</h3>
                <p><strong>Location:</strong> ${farmerLocation}</p>
                <p><strong>Primary Crop:</strong> ${
                  farmerCrop.charAt(0).toUpperCase() + farmerCrop.slice(1)
                }</p>
                <p><strong>XP Points:</strong> ${
                  Math.floor(Math.random() * 2000) + 1000
                }</p>
                <p><strong>Achievements:</strong> ${
                  Math.floor(Math.random() * 10) + 3
                } badges earned</p>
                <div style="margin-top: 15px;">
                    <button class="modal-btn" onclick="connectFarmer('${farmerName}')">Connect</button>
                </div>
            `;

  document.getElementById("farmerInfoPanel").style.display = "block";
}

function closeFarmerInfo() {
  document.getElementById("farmerInfoPanel").style.display = "none";
}

function connectFarmer(farmerName) {
  showSuccessMessage(`Connection request sent to ${farmerName}!`);
  closeFarmerInfo();
}

function updateLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        showSuccessMessage(
          "Location updated successfully! Your farm location has been saved."
        );
      },
      function (error) {
        showSuccessMessage(
          "Please enable location services or enter your location manually."
        );
      }
    );
  } else {
    showSuccessMessage(
      "Geolocation is not supported by this browser. Please enter your location manually."
    );
  }
}

// Schemes functions
function applyScheme(schemeType) {
  const schemes = {
    coconut: "Coconut Development Board Scheme",
    organic: "Organic Farming Promotion Scheme",
  };

  showSuccessMessage(
    `Application submitted for ${schemes[schemeType]}! You will receive confirmation within 7 working days.`
  );
}

// Help functions
function openChat() {
  showSuccessMessage(
    "Live chat will open shortly. Our support team is available 9 AM - 6 PM."
  );
}

function sendEmail() {
  window.location.href =
    "mailto:support@keralakrishiquest.gov.in?subject=Kerala Krishi Quest Support Request";
}

function requestCallback() {
  showSuccessMessage(
    "Callback request submitted! We will call you back within 2 hours during office hours."
  );
}

function toggleFAQ(faqItem) {
  const isActive = faqItem.classList.contains("active");

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add("active");
  }
}

// Update auth buttons in navbar
function updateAuthButtons(isLoggedIn, email) {
  const navAuth = document.querySelector(".nav-auth");
  if (isLoggedIn) {
    navAuth.innerHTML = `
                    <span style="color: #2d5016; font-weight: 600; margin-right: 15px;">Welcome, ${
                      email.split("@")[0]
                    }!</span>
                    <button class="auth-btn" onclick="handleLogout()">Logout</button>
                `;
  } else {
    navAuth.innerHTML = `
                    <button class="auth-btn" onclick="showLoginModal()">Login</button>
                    <button class="auth-btn signup" onclick="showSignupModal()">Sign Up</button>
                `;
  }
}

// Language translations
const translations = {
  en: {
    home: "Home",
    games: "Games",
    challenges: "Challenges",
    community: "Community",
    schemes: "Schemes",
    weather: "Weather",
    farmMap: "Farm Map",
    help: "Help",
    totalPoints: "Total Points",
    currentLevel: "Current Level",
    dayStreak: "Day Streak",
    schemeEligibility: "Scheme Eligibility Score",
    dailyChallenges: "Daily Challenges",
    achievements: "Achievements",
    leaderboard: "Panchayat Leaderboard - Kottayam",
  },
  ml: {
    home: "ഹോം",
    games: "ഗെയിമുകൾ",
    challenges: "വെല്ലുവിളികൾ",
    community: "കമ്മ്യൂണിറ്റി",
    schemes: "പദ്ധതികൾ",
    weather: "കാലാവസ്ഥ",
    farmMap: "ഫാം മാപ്പ്",
    help: "സഹായം",
    totalPoints: "മൊത്തം പോയിന്റുകൾ",
    currentLevel: "നിലവിലെ ലെവൽ",
    dayStreak: "ദിവസ സ്ട്രീക്ക്",
    schemeEligibility: "പദ്ധതി യോഗ്യത സ്കോർ",
    dailyChallenges: "ദൈനംദിന വെല്ലുവിളികൾ",
    achievements: "നേട്ടങ്ങൾ",
    leaderboard: "പഞ്ചായത്ത് ലീഡർബോർഡ് - കോട്ടയം",
  },
  hi: {
    home: "होम",
    games: "गेम्स",
    challenges: "चुनौतियां",
    community: "समुदाय",
    schemes: "योजनाएं",
    weather: "मौसम",
    farmMap: "फार्म मैप",
    help: "सहायता",
    totalPoints: "कुल अंक",
    currentLevel: "वर्तमान स्तर",
    dayStreak: "दिन की लकीर",
    schemeEligibility: "योजना पात्रता स्कोर",
    dailyChallenges: "दैनिक चुनौतियां",
    achievements: "उपलब्धियां",
    leaderboard: "पंचायत लीडरबोर्ड - कोट्टायम",
  },
  ta: {
    home: "முகப்பு",
    games: "விளையாட்டுகள்",
    challenges: "சவால்கள்",
    community: "சமூகம்",
    schemes: "திட்டங்கள்",
    weather: "வானிலை",
    farmMap: "பண்ணை வரைபடம்",
    help: "உதவி",
    totalPoints: "மொத்த புள்ளிகள்",
    currentLevel: "தற்போதைய நிலை",
    dayStreak: "நாள் தொடர்ச்சி",
    schemeEligibility: "திட்ட தகுதி மதிப்பெண்",
    dailyChallenges: "தினசரி சவால்கள்",
    achievements: "சாதனைகள்",
    leaderboard: "பஞ்சாயத்து லீடர்போர்டு - கோட்டயம்",
  },
  kn: {
    home: "ಮುಖಪುಟ",
    games: "ಆಟಗಳು",
    challenges: "ಸವಾಲುಗಳು",
    community: "ಸಮುದಾಯ",
    schemes: "ಯೋಜನೆಗಳು",
    weather: "ಹವಾಮಾನ",
    farmMap: "ಫಾರ್ಮ್ ನಕ್ಷೆ",
    help: "ಸಹಾಯ",
    totalPoints: "ಒಟ್ಟು ಅಂಕಗಳು",
    currentLevel: "ಪ್ರಸ್ತುತ ಹಂತ",
    dayStreak: "ದಿನದ ಸರಣಿ",
    schemeEligibility: "ಯೋಜನೆ ಅರ್ಹತೆ ಸ್ಕೋರ್",
    dailyChallenges: "ದೈನಂದಿನ ಸವಾಲುಗಳು",
    achievements: "ಸಾಧನೆಗಳು",
    leaderboard: "ಪಂಚಾಯತ್ ಲೀಡರ್‌ಬೋರ್ಡ್ - ಕೋಟ್ಟಯಂ",
  },
};

function changeLanguage(lang) {
  const t = translations[lang];
  if (!t) return;

  // Update navigation text
  document.querySelectorAll(".nav-text").forEach((element, index) => {
    const keys = [
      "home",
      "games",
      "challenges",
      "community",
      "schemes",
      "weather",
      "farmMap",
      "help",
    ];
    if (keys[index]) {
      element.textContent = t[keys[index]];
    }
  });

  // Update stat labels
  const statLabels = document.querySelectorAll(".stat-label");
  if (statLabels[0]) statLabels[0].textContent = t.totalPoints;
  if (statLabels[1]) statLabels[1].textContent = t.currentLevel;
  if (statLabels[2]) statLabels[2].textContent = t.dayStreak;
  if (statLabels[3]) statLabels[3].textContent = t.schemeEligibility;

  // Update section titles
  const sectionTitles = document.querySelectorAll(".section-title");
  sectionTitles.forEach((title) => {
    if (title.textContent.includes("Daily Challenges")) {
      title.innerHTML = `🎯 ${t.dailyChallenges}`;
    } else if (title.textContent.includes("Achievements")) {
      title.innerHTML = `🏆 ${t.achievements}`;
    } else if (title.textContent.includes("Panchayat Leaderboard")) {
      title.innerHTML = `🏆 ${t.leaderboard}`;
    }
  });

  // Show language change notification
  showSuccessMessage(
    `Language changed to ${
      document
        .querySelector(`option[value="${lang}"]`)
        .textContent.split(" ")[1]
    }`
  );
}

// Auto-popup system
let isLoggedIn = false;
let autoPopupShown = false;

function showAutoPopup() {
  if (!isLoggedIn && !autoPopupShown) {
    autoPopupShown = true;

    // Create welcome overlay with options
    const welcomeOverlay = document.createElement("div");
    welcomeOverlay.className = "modal-overlay";
    welcomeOverlay.style.display = "flex";
    welcomeOverlay.innerHTML = `
                    <div class="modal" style="max-width: 450px;">
                        <button class="modal-close" onclick="closeAutoPopup()">&times;</button>
                        <div style="text-align: center; margin-bottom: 25px;">
                            <div style="font-size: 3rem; margin-bottom: 15px;">🌱</div>
                            <h2 style="color: #2d5016; margin-bottom: 15px;">Welcome to Kerala Krishi Quest!</h2>
                            <p style="color: #666; line-height: 1.5;">Join thousands of Kerala farmers in our gamified platform for sustainable agriculture. Earn rewards, learn new techniques, and access government schemes!</p>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <button class="modal-btn" onclick="closeAutoPopup(); showLoginModal();" style="background: #2d5016;">
                                🔑 Login to Your Account
                            </button>
                            <button class="modal-btn" onclick="closeAutoPopup(); showSignupModal();" style="background: #4CAF50;">
                                🚜 Create New Account
                            </button>
                            <button onclick="closeAutoPopup()" style="background: transparent; border: 2px solid #e0e0e0; color: #666; padding: 12px; border-radius: 10px; cursor: pointer; font-size: 0.9rem;">
                                Continue as Guest
                            </button>
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; font-size: 0.9rem; color: #666;">
                            <strong>🎁 New User Benefits:</strong><br>
                            • 500 bonus XP points<br>
                            • Access to exclusive challenges<br>
                            • Government scheme eligibility tracking<br>
                            • Connect with local farmers
                        </div>
                    </div>
                `;

    document.body.appendChild(welcomeOverlay);
    welcomeOverlay.id = "autoPopupModal";

    // Add entrance animation
    const modal = welcomeOverlay.querySelector(".modal");
    modal.style.opacity = "0";
    modal.style.transform = "scale(0.8)";
    setTimeout(() => {
      modal.style.transition = "all 0.3s ease";
      modal.style.opacity = "1";
      modal.style.transform = "scale(1)";
    }, 100);
  }
}

function closeAutoPopup() {
  const autoPopup = document.getElementById("autoPopupModal");
  if (autoPopup) {
    const modal = autoPopup.querySelector(".modal");
    modal.style.transition = "all 0.3s ease";
    modal.style.opacity = "0";
    modal.style.transform = "scale(0.8)";
    setTimeout(() => {
      document.body.removeChild(autoPopup);
    }, 300);
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  // Show home section by default
  showSection("home");

  // Initialize progress bars
  updateProgressBars();

  // Close mobile menu when clicking on links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("navMenu").classList.remove("active");
    });
  });

  // Set up auto-popup after 30 seconds
  setTimeout(showAutoPopup, 30000);
});
(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'98029e5921269a6f',t:'MTc1ODA0OTM1MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
