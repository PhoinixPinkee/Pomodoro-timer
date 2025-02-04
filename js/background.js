let seconds = 25 * 60;
let timerIsRunning = false;
let alarmName = "pomodoro-timer";

// Create context menus when installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({ id: "start-timer", title: "Start Timer", contexts: ["all"] });
    chrome.contextMenus.create({ id: "reset-timer", title: "Reset Timer", contexts: ["all"] });
});

// Handle alarms
chrome.alarms.onAlarm.addListener(() => {
    if (seconds > 0) {
        seconds--;
        updatePopupTimer();
    }

    if (seconds === 0) {
        clearAlarm();
        createNotification("Time's up! Take a break.");
    }
});

// Create and start an alarm
function createAlarm() {
    chrome.alarms.create(alarmName, { periodInMinutes: 1 / 60 });
}

// Show notifications
function createNotification(message) {
    let iconPath = chrome.runtime.getURL("icons/timer-48.png"); // Ensure correct path

    chrome.notifications.create({
        type: "basic",
        title: "Pomodoro Timer",
        message: message,
        iconUrl: iconPath // Use chrome.runtime.getURL()
    }, function(notificationId) {
        if (chrome.runtime.lastError) {
            console.error("Notification Error:", chrome.runtime.lastError.message);
        } else {
            console.log("Notification created:", notificationId);
        }
    });
}

// Clear the timer alarm
function clearAlarm() {
    chrome.alarms.clear(alarmName);
    timerIsRunning = false;
}

// Update the popup timer display
function updatePopupTimer() {
    let minutes = Math.floor(seconds / 60);
    let sec = seconds % 60;
    let time = `${minutes}:${sec < 10 ? "0" : ""}${sec}`;

    chrome.runtime.sendMessage({ action: "updateTimer", time: time });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "start-timer") {
        toggleTimer();
    } else if (info.menuItemId === "reset-timer") {
        resetTimer();
    }
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);

    if (message.action === "toggleTimer") {
        createAlarm();
        sendResponse({ status: "Timer started" });
    } else if (message.action === "resetTimer") {
        clearAlarm();
        sendResponse({ status: "Timer reset" });
    }
});


// Toggle timer start/stop
function toggleTimer() {
    if (timerIsRunning) {
        clearAlarm();
        createNotification("Timer stopped.");
        chrome.contextMenus.update("start-timer", { title: "Start Timer" });
        timerIsRunning = false;
    } else {
        createNotification("Timer started.");
        timerIsRunning = true;
        createAlarm();
        chrome.contextMenus.update("start-timer", { title: "Stop Timer" });
    }
}

// Reset the timer
function resetTimer() {
    seconds = 25 * 60;
    clearAlarm();
    timerIsRunning = false;
    updatePopupTimer();
    chrome.contextMenus.update("start-timer", { title: "Start Timer" });
}
