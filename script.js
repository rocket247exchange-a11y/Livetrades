// script.js — demo simulation for charts, trades, chat, ticker
const symbols = ['BTC','ETH','SOL','BNB','ADA'];
const marketTickerEl = document.getElementById('marketTicker');
const tradeList = document.getElementById('tradeList');
const chatList = document.getElementById('chatList');
const fakeChatInput = document.getElementById('fakeChatInput');
const sendChat = document.getElementById('sendChat');

function rand(min,max){ return Math.random()*(max-min)+min; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// --- Market ticker simulation ---
let prices = { BTC: rand(29000,34000), ETH: rand(1500,3000), SPX: rand(4400,4700) };
function updateTickerText(){
  marketTickerEl.textContent = `SPX ${prices.SPX.toFixed(2)} • BTC ${prices.BTC.toFixed(0)} • ETH ${prices.ETH.toFixed(0)}`;
}
setInterval(()=>{
  // small random walk
  prices.BTC *= 1 + (rand(-0.002,0.002));
  prices.ETH *= 1 + (rand(-0.003,0.003));
  prices.SPX *= 1 + (rand(-0.001,0.001));
  updateTickerText();
}, 1000);
updateTickerText();

// --- Mini charts (Chart.js) ---
const charts = [];
for(let i=1;i<=5;i++){
  const ctx = document.getElementById(`chart-${i}`).getContext('2d');
  const initData = Array.from({length:40},()=>rand(0,1));
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: initData.map((_,i)=>i),
      datasets: [{
        data: initData,
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.3,
      }]
    },
    options: {
      animation:false,
      responsive:true,
      maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{x:{display:false}, y:{display:false}}
    }
  });
  charts.push(chart);
}

// update charts randomly
setInterval(()=>{
  charts.forEach(ch=>{
    ch.data.datasets[0].data.shift();
    ch.data.datasets[0].data.push(rand(-0.5,1.6));
    ch.update('none');
  });
}, 1000);

// --- Simulated trades feed ---
function pushTrade(){
  const traderNames = ['Jacob','Lori','Toffather','Garret','Akash Singh','Jessy','Victoria','Adam','Derrick','Martins','Chun Li','Federick','Gabriel'];
  const sym = pick(symbols);
  const qty = Math.round(rand(0.1,5)*10)/10;
  const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
  const user = pick(traderNames);
  const price = (sym === 'BTC') ? Math.round(prices.BTC* (1+rand(-0.001,0.001))) : Math.round(rand(20,4000));
  const li = document.createElement('li');
  li.innerHTML = `<strong>${user}</strong> • ${side} ${qty} ${sym} @ ${price}`;
  tradeList.insertBefore(li, tradeList.firstChild);
  if(tradeList.children.length>30) tradeList.removeChild(tradeList.lastChild);
}
setInterval(pushTrade, 1500);

// --- Simulated chat messages ---
const sampleChat = [
  "Watching BTC move now",
  "Scaling in on ETH",
  "Order filled, stop set",
  "Anyone watching SOL spikes?",
  "Taking profit, switching to fiat",
  "EOD re-check on positions",
];
function pushChat(){
  const who = pick(['Jacob','Lori','Toffather','Garret','Akash Singh','Jessy','Victoria','Adam','Derrick','Martins','Chun Li','Federick','Gabriel']);
  const msg = pick(sampleChat);
  const div = document.createElement('div');
  div.innerHTML = `<strong>${who}:</strong> ${msg}`;
  chatList.appendChild(div);
  chatList.scrollTop = chatList.scrollHeight;
  if(chatList.children.length>50) chatList.removeChild(chatList.firstChild);
}
setInterval(pushChat, 2600);

sendChat.addEventListener('click',()=>{
  const val = fakeChatInput.value.trim();
  if(!val) return;
  const div = document.createElement('div');
  div.innerHTML = `<strong>You:</strong> ${val}`;
  chatList.appendChild(div);
  fakeChatInput.value='';
  chatList.scrollTop = chatList.scrollHeight;
});

// --- Optional: auto-pause videos if out of viewport (basic) ---
const videos = Array.from(document.querySelectorAll('video.cam'));
function handleVisibility(){
  videos.forEach(v=>{
    if(v.getBoundingClientRect().top < window.innerHeight && v.getBoundingClientRect().bottom > 0){
      if(v.paused) v.play().catch(()=>{});
    } else {
      if(!v.paused) v.pause();
    }
  });
}
window.addEventListener('scroll', handleVisibility);
window.addEventListener('resize', handleVisibility);
handleVisibility();
