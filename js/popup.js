document.getElementById("start-stop").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "toggleTimer" });
});

document.getElementById("reset").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "resetTimer" });
});

chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "updateTimer") {
        document.getElementById("timer").innerText = message.time;
    }
});
