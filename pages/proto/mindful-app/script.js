// 숨결 — 매일의 마음챙김 앱
// 공통 스크립트: 루틴 화면의 타이핑 문구 효과

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('typed');
  if (!el) return;

  const quotes = [
    '오늘 하루도 나에게 다정하기를',
    '천천히, 그러나 꾸준히',
    '지금 이 순간에 머물러요',
    '작은 숨 한 번, 큰 위로가 되기를'
  ];

  let qIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = quotes[qIndex];
    if (!deleting) {
      charIndex++;
      el.innerHTML = current.slice(0, charIndex) + '<span class="cursor">&nbsp;</span>';
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
    } else {
      charIndex--;
      el.innerHTML = current.slice(0, charIndex) + '<span class="cursor">&nbsp;</span>';
      if (charIndex === 0) {
        deleting = false;
        qIndex = (qIndex + 1) % quotes.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 90);
  }
  tick();
});
