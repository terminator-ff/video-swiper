import { fetchVideos, saveLike } from './firebase.js';

const container = document.getElementById("video-container");
let currentIndex = 0;
let videos = [];

function createCard(videoUrl) {
  const card = document.createElement("div");
  card.className = "card";

  const iframe = document.createElement("iframe");
  iframe.src = videoUrl;
  iframe.allow = "autoplay; encrypted-media";
  iframe.allowFullscreen = true;
  card.appendChild(iframe);

  const hammer = new Hammer(card);
  hammer.on("swipeleft swiperight", function (ev) {
    if (ev.type === "swipeleft") {
      console.log("👎 Дизлайк: " + videoUrl);
    } else {
      console.log("❤️ Лайк: " + videoUrl);
      saveLike(videoUrl);
      notifyTelegram(videoUrl);
    }
    card.remove();
    showNextVideo();
  });

  container.appendChild(card);
}

function showNextVideo() {
  if (currentIndex < videos.length) {
    createCard(videos[currentIndex]);
    currentIndex++;
  } else {
    const endMsg = document.createElement("p");
    endMsg.innerText = "Больше видео нет!";
    container.appendChild(endMsg);
  }
}

function notifyTelegram(videoUrl) {
  const botToken = "7571607337:AAH6XN7ZqLKjxKqjgCkCnx81wDD0LNVjugk";
  const chatId = "YOUR_CHAT_ID";
  const message = `❤️ Пользователь лайкнул: ${videoUrl}`;

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });
}

async function init() {
  videos = await fetchVideos();
  showNextVideo();
}

init();
