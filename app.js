import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  getDocs,
  query,
  orderBy,
  limit
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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
// INIT
// =========================

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

const provider =
new GoogleAuthProvider();


// =========================
// TON CONNECT
// =========================

const tonConnectUI =
new TON_CONNECT_UI.TonConnectUI({

  manifestUrl:
  'https://miranetwok.vercel.app/tonconnect-manifest.json',

  buttonRootId:
  'ton-connect'

});


// =========================
// ELEMENTS
// =========================

const balanceDisplay =
document.getElementById(
'token-balance'
);

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

const withdrawBtn =
document.getElementById(
'withdraw-btn'
);

const userName =
document.getElementById(
'user-name'
);

const leaderboardList =
document.getElementById(
'leaderboard-list'
);

const referralCode =
document.getElementById(
'referral-code'
);


// =========================
// USER DATA
// =========================

let currentUser = null;

let balance = 0;

let isCooldown = false;

let cooldownTime = 30;

let loginBtn = null;

let lastAdWatch = 0;


// =========================
// GOOGLE LOGIN
// =========================

createLoginButton();

function createLoginButton(){

  loginBtn =
  document.createElement('button');

  loginBtn.innerText =
  'Login with Google';

  loginBtn.className =
  'earn-btn';

  loginBtn.style.marginBottom =
  '15px';

  document.getElementById(
    'home-page'
  ).prepend(loginBtn);

  loginBtn.addEventListener(
  'click',

  async () => {

    try{

      await signInWithPopup(
        auth,
        provider
      );

    }catch(error){

      alert(
      'Login failed'
      );

    }

  });

}


// =========================
// AUTH
// =========================

onAuthStateChanged(

auth,

async (user) => {

  if(user){

    currentUser = user;

    if(loginBtn){

      loginBtn.remove();

    }

    userName.innerText =
    user.displayName;

    referralCode.innerText =
    user.uid.substring(0,6);

    await loadUser();

    loadLeaderboard();

    loadWithdrawRequests();

  }

});


// =========================
// LOAD USER
// =========================

async function loadUser(){

  const userRef =
  doc(
    db,
    'users',
    currentUser.uid
  );

  const userSnap =
  await getDoc(userRef);

  if(userSnap.exists()){

    balance =
    userSnap.data().balance || 0;

  }else{

    await setDoc(userRef,{

      name:
      currentUser.displayName,

      email:
      currentUser.email,

      balance:0,

      photo:
      currentUser.photoURL,

      created:
      Date.now(),

      referrals:0,

      referralCode:
      currentUser.uid.substring(0,6)

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

  if(!currentUser){

    alert(
    'Login first'
    );

    return;
  }

  const now = Date.now();

  if(now - lastAdWatch < 25000){

    alert(
    'Wait before next ad'
    );

    return;
  }

  lastAdWatch = now;

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
  doc(
    db,
    'users',
    currentUser.uid
  );

  await updateDoc(userRef,{
    balance: increment(10)
  });

  statusMsg.innerText =
  '+10 MIRA added';

  watchAdBtn.innerHTML =
  '▶ Watch Ad +10 MIRA';

  startCooldown();

  loadLeaderboard();

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


// =========================
// DAILY REWARD
// =========================

checkDailyReward();

function checkDailyReward(){

  let lastClaim =
  localStorage.getItem(
    'daily_reward'
  );

  let now = Date.now();

  if(!lastClaim){

    giveDailyReward();

    return;
  }

  let diff =
  now - parseInt(lastClaim);

  if(diff >= 86400000){

    giveDailyReward();

  }

}

function giveDailyReward(){

  balance += 50;

  updateBalance();

  statusMsg.innerText =
  '🎁 Daily Reward +50 MIRA';

  localStorage.setItem(
    'daily_reward',
    Date.now()
  );

}


// =========================
// LEADERBOARD
// =========================

async function loadLeaderboard(){

  leaderboardList.innerHTML =
  '';

  const q =
  query(

    collection(db,'users'),

    orderBy('balance','desc'),

    limit(10)

  );

  const querySnapshot =
  await getDocs(q);

  let rank = 1;

  querySnapshot.forEach(docu => {

    const user =
    docu.data();

    const item =
    document.createElement(
      'div'
    );

    item.className =
    'stat-box';

    item.innerHTML =

    `
    <p>
    #${rank}
    ${user.name || 'User'}
    </p>

    <strong>
    ${user.balance || 0} MIRA
    </strong>
    `;

    leaderboardList
    .appendChild(item);

    rank++;

  });

}


// =========================
// WITHDRAW SYSTEM
// =========================

if(withdrawBtn){

  withdrawBtn.addEventListener(

  'click',

  async () => {

    if(!currentUser){

      alert(
      'Login first'
      );

      return;
    }

    const wallet =

    document.getElementById(
      'wallet-address'
    ).value;

    if(wallet.length < 10){

      alert(
      'Enter valid TON wallet'
      );

      return;
    }

    if(balance < 100){

      alert(
      'Minimum withdraw is 100 MIRA'
      );

      return;
    }

    const withdrawRef =

    doc(
      db,
      'withdraws',
      Date.now().toString()
    );

    await setDoc(withdrawRef,{

      uid:
      currentUser.uid,

      email:
      currentUser.email,

      wallet:
      wallet,

      amount:
      balance,

      status:
      'pending',

      created:
      Date.now()

    });

    alert(
    'Withdraw request sent!'
    );

    loadWithdrawRequests();

  });

}


// =========================
// ADMIN PANEL
// =========================

async function loadWithdrawRequests(){

  const withdrawList =

  document.getElementById(
    'withdraw-list'
  );

  if(!withdrawList) return;

  withdrawList.innerHTML = '';

  const querySnapshot =
  await getDocs(
    collection(db,'withdraws')
  );

  querySnapshot.forEach(docu => {

    const data =
    docu.data();

    const item =
    document.createElement(
      'div'
    );

    item.className =
    'admin-request';

    item.innerHTML =

    `
    <h3>
    Withdraw Request
    </h3>

    <p>
    Email:
    ${data.email}
    </p>

    <p>
    Wallet:
    ${data.wallet}
    </p>

    <p>
    Amount:
    ${data.amount} MIRA
    </p>

    <p id="status-${docu.id}">
    Status:
    ${data.status}
    </p>

    <div class="admin-actions">

      <button
      class="approve-btn"
      id="approve-${docu.id}">

      Approve

      </button>

      <button
      class="reject-btn"
      id="reject-${docu.id}">

      Reject

      </button>

    </div>
    `;

    withdrawList.appendChild(
      item
    );

    // APPROVE

    document.getElementById(

    `approve-${docu.id}`

    ).addEventListener(

    'click',

    async () => {

      await updateDoc(

        doc(
          db,
          'withdraws',
          docu.id
        ),

        {
          status:'approved'
        }

      );

      document.getElementById(

      `status-${docu.id}`

      ).innerText =

      'Status: approved';

    });


    // REJECT

    document.getElementById(

    `reject-${docu.id}`

    ).addEventListener(

    'click',

    async () => {

      await updateDoc(

        doc(
          db,
          'withdraws',
          docu.id
        ),

        {
          status:'rejected'
        }

      );

      document.getElementById(

      `status-${docu.id}`

      ).innerText =

      'Status: rejected';

    });

  });

}


// =========================
// TELEGRAM TEST CARD
// =========================

const tgContainer =
document.getElementById(
'telegram-user'
);

if(tgContainer){

  tgContainer.innerHTML =

  `
  <div class="telegram-card">

  <img
  src="https://i.pravatar.cc/150"
  class="telegram-avatar">

  <div>

  <div class="telegram-name">
  Telegram User
  </div>

  <div class="telegram-username">
  @TestUser
  </div>

  </div>

  </div>
  `;

}
