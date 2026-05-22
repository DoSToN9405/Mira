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

const clickSound =
document.getElementById('click-sound');

let balance =
parseFloat(
localStorage.getItem('user_balance')
) || 0;

let isCooldown = false;

let cooldownTime = 30;

updateBalance();

navItems.forEach(item => {

  item.addEventListener('click', () => {

    const pageId =
    item.getAttribute('data-page');

    pages.forEach(page => {

      page.style.display = 'none';

    });

    document.getElementById(pageId)
    .style.display = 'block';

    navItems.forEach(btn => {

      btn.classList.remove('active');

    });

    item.classList.add('active');

    clickSound.play();

  });

});

watchAdBtn.addEventListener(
'click',

async () => {

  if(isCooldown) return;

  if(navigator.vibrate){

    navigator.vibrate(60);

  }

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

    watchAdBtn.disabled = false;

    watchAdBtn.innerHTML =
    '▶ Watch Ad +10 MIRA';

  }

});

function rewardUser(){

  balance += 10;

  localStorage.setItem(
    'user_balance',
    balance
  );

  animateBalance();

  statusMsg.innerText =
  '+10 MIRA added';

  watchAdBtn.innerHTML =
  '▶ Watch Ad +10 MIRA';

  startCooldown();

}

function updateBalance(){

  balanceDisplay.innerText =
  balance.toFixed(2);

  walletBalancePage.innerText =
  balance.toFixed(2);

}

function animateBalance(){

  let start = balance - 10;

  let end = balance;

  let current = start;

  const interval = setInterval(() => {

    current += 0.5;

    balanceDisplay.innerText =
    current.toFixed(2);

    walletBalancePage.innerText =
    current.toFixed(2);

    if(current >= end){

      clearInterval(interval);

      updateBalance();

    }

  },20);

}

function startCooldown(){

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

    if(currentTime <= 0){

      clearInterval(interval);

      isCooldown = false;

      cooldownText.classList
      .add('hidden');

      watchAdBtn.disabled = false;

      watchAdBtn.innerHTML =
      '▶ Watch Ad +10 MIRA';

      statusMsg.innerText = '';

    }

  },1000);

}
