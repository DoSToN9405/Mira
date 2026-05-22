// =========================
// ELEMENTS
// =========================

const balanceDisplay =
  document.getElementById('token-balance');

const walletBalancePage =
  document.getElementById('wallet-balance-page');

const watchAdBtn =
  document.getElementById('watch-ad-btn');

const statusMsg =
  document.getElementById('status-msg');

const cooldownText =
  document.getElementById('cooldown-text');

const timerDisplay =
  document.getElementById('timer');

const navItems =
  document.querySelectorAll('.nav-item');

const pages =
  document.querySelectorAll('.page');


// =========================
// USER DATA
// =========================

let balance =
  parseFloat(
    localStorage.getItem('user_balance')
  ) || 0;

let isCooldown = false;

let cooldownTime = 30;


// =========================
// INITIAL LOAD
// =========================

updateBalance();


// =========================
// PAGE NAVIGATION
// =========================

navItems.forEach(item => {
  
  item.addEventListener('click', () => {
    
    const pageId =
      item.getAttribute('data-page');
    
    // hide all pages
    
    pages.forEach(page => {
      
      page.style.display = 'none';
      
    });
    
    // show selected page
    
    document.getElementById(pageId)
      .style.display = 'block';
    
    // active nav
    
    navItems.forEach(btn => {
      
      btn.classList.remove('active');
      
    });
    
    item.classList.add('active');
    
  });
  
});


// =========================
// WATCH AD BUTTON
// =========================

watchAdBtn.addEventListener(
  'click',
  
  async () => {
    
    if (isCooldown) return;
    
    // vibration effect
    
    if (navigator.vibrate) {
      
      navigator.vibrate(60);
      
    }
    
    // button loading
    
    watchAdBtn.disabled = true;
    
    watchAdBtn.innerHTML =
      'Loading Ad...';
    
    statusMsg.style.color =
      '#38bdf8';
    
    statusMsg.innerText =
      'Loading advertisement...';
    
    try {
      
      // Monetag SDK check
      
      if (typeof show_9027378 !==
        'function') {
        
        throw new Error(
          'SDK not loaded'
        );
        
      }
      
      // show ad
      
      await show_9027378();
      
      // reward
      
      rewardUser();
      
    } catch (error) {
      
      console.log(error);
      
      statusMsg.style.color =
        '#fb7185';
      
      statusMsg.innerText =
        'Ad unavailable right now';
      
      watchAdBtn.disabled = false;
      
      watchAdBtn.innerHTML =
        '▶ Watch Ad +10 MIRA';
      
    }
    
  });


// =========================
// REWARD USER
// =========================

function rewardUser() {
  
  balance += 10;
  
  // save balance
  
  localStorage.setItem(
    'user_balance',
    balance
  );
  
  // animation
  
  animateBalance();
  
  // message
  
  statusMsg.style.color =
    '#22c55e';
  
  statusMsg.innerText =
    '+10 MIRA added successfully';
  
  // reset button
  
  watchAdBtn.innerHTML =
    '▶ Watch Ad +10 MIRA';
  
  // cooldown
  
  startCooldown();
  
}


// =========================
// UPDATE BALANCE
// =========================

function updateBalance() {
  
  balanceDisplay.innerText =
    balance.toFixed(2);
  
  walletBalancePage.innerText =
    balance.toFixed(2);
  
}


// =========================
// BALANCE ANIMATION
// =========================

function animateBalance() {
  
  let start = balance - 10;
  
  let end = balance;
  
  let current = start;
  
  const interval = setInterval(() => {
    
    current += 0.5;
    
    balanceDisplay.innerText =
      current.toFixed(2);
    
    walletBalancePage.innerText =
      current.toFixed(2);
    
    if (current >= end) {
      
      clearInterval(interval);
      
      updateBalance();
      
    }
    
  }, 20);
  
}


// =========================
// COOLDOWN
// =========================

function startCooldown() {
  
  isCooldown = true;
  
  cooldownText.classList
    .remove('hidden');
  
  let currentTime =
    cooldownTime;
  
  timerDisplay.innerText =
    currentTime;
  
  const interval = setInterval(() => {
    
    currentTime--;
    
    timerDisplay.innerText =
      currentTime;
    
    if (currentTime <= 0) {
      
      clearInterval(interval);
      
      isCooldown = false;
      
      cooldownText.classList
        .add('hidden');
      
      watchAdBtn.disabled = false;
      
      watchAdBtn.innerHTML =
        '▶ Watch Ad +10 MIRA';
      
      statusMsg.innerText = '';
      
    }
    
  }, 1000);
  
}