// 안내 패널 토글
//TODO: 마감 날짜 및 시간 선택 변경/
const expireDateStr = "2026-01-30";
const expireTimeStr = "23:59:59";

const coupons = [
//TODO: 1.쿠폰.gif 변경/
  { img: "https://github.com/championsiheung/A10pctWday/blob/main/%E1%84%87%E1%85%A9%E1%84%92%E1%85%A9%E1%84%8C%E1%85%A110%25%E1%84%91%E1%85%A7%E1%86%BC%E1%84%8B%E1%85%B5%E1%86%AF.gif?raw=true" },
//TODO: 2.유효만료.gif 변경/
  { img: "https://github.com/championsiheung/coupon30/blob/main/%E1%84%80%E1%85%B5%E1%84%80%E1%85%A1%E1%86%AB%E1%84%86%E1%85%A1%E1%86%AB%E1%84%85%E1%85%AD1gif.gif?raw=true" }
];

const container = document.getElementById('coupons-container');
const messageElement = document.getElementById("coupon-message");
const guideElement = document.getElementById("coupon-guide");
const infoElement = document.getElementById("expire-info");

const [year, month, day] = expireDateStr.split("-").map(Number);
const [hour, minute, second] = expireTimeStr.split(":").map(Number);
const expireDate = new Date(year, month - 1, day, hour, minute, second);

function createCouponBox(coupon, index) {
  if (!coupon.img) return null;

  const box = document.createElement('div');
  box.className = 'coupon-box';

  const img = document.createElement('img');
  img.className = 'coupon-img';
  img.src = coupon.img;
  img.alt = `쿠폰 이미지 ${index + 1}`;
  img.draggable = false;

  box.addEventListener('contextmenu', e => e.preventDefault());
  box.addEventListener('touchstart', e => e.preventDefault());

  box.appendChild(img);
  return box;
}

let selectedCoupon = null;
function updateCoupon(isExpired) {
  if (selectedCoupon) container.removeChild(selectedCoupon);
  const imageIndex = isExpired ? 1 : 0;
  selectedCoupon = createCouponBox(coupons[imageIndex], imageIndex);
  if (selectedCoupon) container.appendChild(selectedCoupon);
}

function getTimeRemaining(endTime) {
  const now = new Date();
  const total = endTime.getTime() - now.getTime();

  if (total <= 0) return null;

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  const pad = (n) => n.toString().padStart(2, '0');

  return days > 0
    ? `${days}일 ${pad(hours)}시간 ${pad(minutes)}분 ${pad(seconds)}초`
    : `${pad(hours)}시간 ${pad(minutes)}분 ${pad(seconds)}초`;
}

const titleElement = document.getElementById("main-title");  // h1 요소

function update() {
  const now = new Date();
  const isExpired = now > expireDate;

  updateCoupon(isExpired);

  const titleWrapper = document.getElementById("title-wrapper");
  const titleElement = document.getElementById("main-title");

  if (isExpired) {
    messageElement.style.color = "rgba(255, 132, 132, 1)";  // 빨간색 적용
    messageElement.innerHTML = `<span style="color: white;">현재 이 쿠폰은 </span><u>'사용만료'</u><span style="color: white;">가 되서 사용할 수 없는 쿠폰입니다.</span>`;
    guideElement.style.display = "none";
    infoElement.innerHTML = `<span style="color:#ff4444; font-weight:bold;">유효기간이 만료되었습니다.</span>`;

    if (titleWrapper) titleWrapper.style.paddingTop = "1px"; // 여백 추가
    if (titleElement) {
      titleElement.style.color = "#ffffffff";  // 글자색 변경
      titleElement.style.fontSize = "36px"; // 글자 크기 변경
    }
  } else {
    messageElement.style.color = ""; // 스타일 초기화
    messageElement.innerHTML = "";
    guideElement.style.display = "block";

    const timeStr = getTimeRemaining(expireDate);
    if (timeStr) {
      infoElement.innerHTML = `
        <span style="color:#00cc99; font-weight:bold;">유효기간: ${expireDateStr}</span>
        <span style="margin-left: 20px; color:#ff6b6b; font-weight:bold;">남은시간: ${timeStr}</span>
      `;
    }

    if (titleWrapper) titleWrapper.style.paddingTop = "0";
  }
}

update();
setInterval(update, 1000);

// 매장안내 토글
document.getElementById("info-toggle").addEventListener("click", () => {
  const panel = document.getElementById("store-info");
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});



const toggleBtn = document.getElementById('info-toggle');
const infoPanel = document.getElementById('store-info');

toggleBtn.addEventListener('click', () => {
  const isOpen = infoPanel.style.right === '0px';
  if (isOpen) {
    infoPanel.style.right = '-740px';
    infoPanel.style.display = 'none';   // 👈 추가
    toggleBtn.style.right = '0';
    toggleBtn.textContent = '◀';
    toggleBtn.classList.remove('active');
  } else {
    infoPanel.style.display = 'block';  // 👈 추가
    infoPanel.style.right = '0';
    toggleBtn.style.right = '720px';
    toggleBtn.textContent = '▶';
    toggleBtn.classList.add('active');
  }
});

// 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
  const isClickInsidePanel = infoPanel.contains(e.target);
  const isClickOnToggle = toggleBtn.contains(e.target);

  if (!isClickInsidePanel && !isClickOnToggle) {
    if (infoPanel.style.right === '0px') {
      infoPanel.style.right = '-740px';
      toggleBtn.style.right = '0';
      toggleBtn.textContent = '◀';
      toggleBtn.classList.remove('active');
    }
  }
});

// 모바일 터치 슬라이드 닫기
let startX = 0;
let isDragging = false;

infoPanel.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

infoPanel.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  let currentX = e.touches[0].clientX;
  let diffX = currentX - startX;

  if (diffX > 50) {
    infoPanel.style.right = '-720px';
    toggleBtn.style.right = '0';
    toggleBtn.textContent = '◀';
    toggleBtn.classList.remove('active');
    isDragging = false;
  }
});

infoPanel.addEventListener('touchend', () => {
  isDragging = false;
});

// 기존 코드 아래에 추가하세요

// 🔒 F12, Ctrl+Shift+I, Ctrl+U 등 차단
document.addEventListener('keydown', function (e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
    alert('접근이 제한되어 있습니다.');
  }
});

// 🔒 우클릭 막기
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  alert('우클릭이 제한되어 있습니다.');
});

