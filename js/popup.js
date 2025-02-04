// Listen for the start/stop button click
document.getElementById("start-stop").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "toggleTimer" });
});

// Listen for the reset button click
document.getElementById("reset").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "resetTimer" });
});

// Listen for the message from the background script to update the timer
chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "updateTimer") {
        document.getElementById("timer").innerText = message.time;
    }
});
