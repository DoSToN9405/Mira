// =========================
// FIREBASE IMPORT
// =========================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =========================
// FIREBASE CONFIG
// =========================

const firebaseConfig = {

  apiKey:
  "AIzaSyAYrt_QwlzVqacTP8m3YwXRWe3a3I-OX_s",

  authDomain:
  "mira-network-309e5.firebaseapp.com",

  projectId:
  "mira-network-309e5",

  storageBucket:
  "mira-network-309e5.firebasestorage.app",

  messagingSenderId:
  "1010813141447",

  appId:
  "1:1010813141447:web:bf94bc8cedbb443915d9e2",

  measurementId:
  "G-61EQRHKHTP"

};


// =========================
// INIT FIREBASE
// =========================

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);


// =========================
// USER ID
// =========================

let userId =
localStorage.getItem('mira_user_id');

if(!userId){

  userId =
  'user_' +
  Math.random()
  .toString(36)
  .substring(2,12);

  localStorage.setItem(
    'mira_user_id',
    userId
  );

}


// =========================
// ELEMENTS
// =========================

const balanceDisplay =
document.getElementById('token-balance');

const walletBalancePage =
document.getElementById(
'wallet-balance-page'
);

const watchAdBtn =
document.getElementById(
'watch-ad-btn'
);

const statusMsg =
document.getElementById(
'status-msg'
);

const cooldownText =
document.getElementById(
'cooldown-text'
);

const timerDisplay =
document.getElementById(
'timer'
);

const navItems =
document.querySelectorAll(
'.nav-item'
);

const pages =
document.querySelectorAll(
'.page'
);

const clickSound =
document.getElementById(
'click-sound'
);


// =========================
// USER DATA
// =========================

let balance = 0;

let isCooldown = false;

let cooldownTime = 30;


// =========================
// LOAD USER
// =========================

loadUser();

async function loadUser(){

  const userRef =
  doc(db,'users',userId);

  const userSnap =
  await getDoc(userRef);

  if(userSnap.exists()){

    balance =
    userSnap.data().balance || 0;

  }else{

    await setDoc(userRef,{
      balance:0
    });

  }

  updateBalance();

}


// =========================
// NAVIGATION
// =========================

navItems.forEach(item => {

  item.addEventListener('click',() => {

    const pageId =
    item.getAttribute(
      'data-page'
    );

    pages.forEach(page => {

      page.style.display =
      'none';

    });

    document.getElementById(
      pageId
    ).style.display = 'block';

    navItems.forEach(btn => {

      btn.classList.remove(
        'active'
      );

    });

    item.classList.add(
      'active'
    );

    clickSound.play();

  });

});


// =========================
// WATCH AD
// =========================

watchAdBtn.addEventListener(
'click',

async () => {

  if(isCooldown) return;

  clickSound.play();

  watchAdBtn.disabled = true;

  watchAdBtn.innerHTML =
  'Loading Ad...';

  statusMsg.innerText =
  'Loading advertisement...';

  try{

    if(typeof show_9027378
      !== 'function'){

      throw new Error(
        'SDK not loaded'
      );

    }

    await show_9027378();

    rewardUser();

  }catch(error){

    statusMsg.innerText =
    'Ad unavailable';

    watchAdBtn.disabled =
    false;

    watchAdBtn.innerHTML =
    '▶ Watch Ad +10 MIRA';

  }

});


// =========================
// REWARD
// =========================

async function rewardUser(){

  balance += 10;

  updateBalance();

  const userRef =
  doc(db,'users',userId);

  await updateDoc(userRef,{
    balance: increment(10)
  });

  statusMsg.innerText =
  '+10 MIRA added';

  watchAdBtn.innerHTML =
  '▶ Watch Ad +10 MIRA';

  startCooldown();

}


// =========================
// UPDATE BALANCE
// =========================

function updateBalance(){

  balanceDisplay.innerText =
  balance.toFixed(2);

  walletBalancePage.innerText =
  balance.toFixed(2);

}


// =========================
// COOLDOWN
// =========================

function startCooldown(){

  isCooldown = true;

  cooldownText.classList
  .remove('hidden');

  let currentTime =
  cooldownTime;

  timerDisplay.innerText =
  currentTime;

  const interval =
  setInterval(() => {

    currentTime--;

    timerDisplay.innerText =
    currentTime;

    if(currentTime <= 0){

      clearInterval(interval);

      isCooldown = false;

      cooldownText.classList
      .add('hidden');

      watchAdBtn.disabled =
      false;

      watchAdBtn.innerHTML =
      '▶ Watch Ad +10 MIRA';

      statusMsg.innerText = '';

    }

  },1000);

}
