import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMxIaWJybxqyP3s_-W6pzJC2o26wC1f7s",
  authDomain: "video-swiper-bot.firebaseapp.com",
  databaseURL: "https://video-swiper-bot-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "video-swiper-bot",
  storageBucket: "video-swiper-bot.firebasestorage.app",
  messagingSenderId: "483808328876",
  appId: "1:483808328876:web:a4bf3c2ebf8d9ba910f309"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function fetchVideos() {
  const snapshot = await get(ref(db, 'videos'));
  return snapshot.exists() ? snapshot.val() : [];
}

export function saveLike(videoUrl, userId = "guest") {
  push(ref(db, `likes/${userId}`), {
    video: videoUrl,
    timestamp: Date.now()
  });
}
