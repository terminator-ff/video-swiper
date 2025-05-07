// Конфигурация Firebase (замените на свою)
//const firebaseConfig = {
  //apiKey: "AIzaSyDMxIaWJybxqyP3s_-W6pzJC2o26wC1f7s",
 // authDomain: "video-swiper-bot.firebaseapp.com",
//  databaseURL: "https://video-swiper-bot-default-rtdb.europe-west1.firebasedatabase.app",
//  projectId: "video-swiper-bot",
//  storageBucket: "video-swiper-bot.firebasestorage.app",
//  messagingSenderId: "483808328876",
//  appId: "1:483808328876:web:a4bf3c2ebf8d9ba910f309"
//};

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDMxIaWJybxqyP3s_-W6pzJC2o26wC1f7s",
  authDomain: "video-swiper-bot.firebaseapp.com",
  databaseURL: "https://video-swiper-bot-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "video-swiper-bot",
  storageBucket: "video-swiper-bot.firebasestorage.app",
  messagingSenderId: "В483808328876",
  appId: "1:483808328876:web:a4bf3c2ebf8d9ba910f309"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
//const database = firebase.database();

// Элементы интерфейса
const videoCard = document.getElementById('video-card');
const videoFrame = document.getElementById('video-frame');
const videoTitle = document.getElementById('video-title');
const videoSource = document.getElementById('video-source');
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const noVideos = document.getElementById('no-videos');

let currentVideoIndex = 0;
let videos = [];
const userId = 'user_' + Math.random().toString(36).substr(2, 9);

// Загрузка видео из Firebase
import { database } from './firebase.js';
import { ref, onValue } from "firebase/database";

const videoFrame = document.getElementById('video-frame');
const videoTitle = document.getElementById('video-title');
const noVideos = document.getElementById('no-videos');

// Проверка подключения
const fetchVideos = () => {
  const videosRef = ref(database, 'videos');
  
  onValue(videosRef, (snapshot) => {
    const data = snapshot.val();
    
    if (!data) {
      noVideos.style.display = 'block';
      console.error("Нет данных в БД");
      return;
    }
    
    const videos = Object.values(data);
    displayVideo(videos[0]); // Показываем первое видео
  }, (error) => {
    console.error("Ошибка чтения:", error);
  });
};

const displayVideo = (video) => {
  if (!video) {
    noVideos.style.display = 'block';
    return;
  }
  
  videoTitle.textContent = video.title;
  videoFrame.src = getEmbedUrl(video.url, video.source);
  videoFrame.onerror = () => {
    console.error("Ошибка загрузки видео");
    videoFrame.src = '';
  };
};

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', fetchVideos);

function loadCurrentVideo() {
  if (currentVideoIndex < videos.length) {
    const video = videos[currentVideoIndex];
    videoFrame.src = getEmbedUrl(video.url, video.source);
    videoTitle.textContent = video.title;
    videoSource.textContent = `Источник: ${video.source}`;
    noVideos.classList.add('d-none');
    videoCard.style.opacity = 1;
    videoCard.style.transform = 'none';
  } else {
    noVideos.classList.remove('d-none');
    videoFrame.src = '';
  }
}

function getEmbedUrl(url, source) {
  try {
    switch(source) {
      case 'youtube':
        const ytId = url.includes('shorts/') 
          ? url.split('shorts/')[1].split('?')[0]
          : url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
      
      case 'tiktok':
        const ttUrl = new URL(url);
        return `https://www.tiktok.com/embed/v2${ttUrl.pathname}`;
      
      case 'instagram':
        const igPath = url.includes('/reel/') 
          ? url.split('/reel/')[1].split('/')[0]
          : url.split('/p/')[1].split('/')[0];
        return `https://www.instagram.com/p/${igPath}/embed`;
      
      default:
        return url;
    }
  } catch (e) {
    console.error('Error parsing URL:', e);
    return url;
  }
}

// Обработчики свайпа
likeBtn.addEventListener('click', () => handleSwipe('right'));
dislikeBtn.addEventListener('click', () => handleSwipe('left'));

function handleSwipe(direction) {
  if (currentVideoIndex >= videos.length) return;
  
  const videoId = videos[currentVideoIndex].id;
  const action = direction === 'right' ? 'like' : 'dislike';
  
  // Сохраняем действие
  database.ref(`userActions/${userId}/${videoId}`).set({ action });
  
  // Анимация свайпа
  videoCard.style.transform = direction === 'right' 
    ? 'translateX(100px) rotate(15deg)' 
    : 'translateX(-100px) rotate(-15deg)';
  videoCard.style.opacity = 0;
  
  // Переход к следующему видео
  setTimeout(() => {
    currentVideoIndex++;
    loadCurrentVideo();
  }, 300);
}
