// 숨결 — 오늘의 기록 화면 스크립트
// localStorage에 짧은 일기를 저장하고 불러옵니다.

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'sumgyeol-journal-entries';

  const viewEl = document.getElementById('journal-view');
  const formEl = document.getElementById('journal-form');
  const writeBtn = document.getElementById('write-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const entriesListEl = document.getElementById('entries-list');
  const entryTextEl = document.getElementById('entry-text');
  const formDateEl = document.getElementById('form-date');
  const gInputs = Array.from(document.querySelectorAll('.g-input'));

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveEntries(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function formatDate(d) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일, ${days[d.getDay()]}요일`;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  let entries = loadEntries();
  let activeId = entries.length ? entries[0].id : null;

  function renderCard(entry) {
    if (!entry) {
      viewEl.innerHTML = `
        <div class="empty-state">
          아직 작성한 기록이 없어요.<br>오늘 하루, 짧은 한 줄이라도 남겨볼까요?
        </div>`;
      return;
    }
    const gratitudeHtml = entry.gratitudes && entry.gratitudes.length
      ? `<ul class="gratitude-list">${entry.gratitudes.map(g => `<li><span class="check">✓</span> ${escapeHtml(g)}</li>`).join('')}</ul>`
      : '';
    viewEl.innerHTML = `
      <div class="journal-card">
        <div class="journal-date">${entry.date}</div>
        <div class="journal-quote">${escapeHtml(entry.text)}</div>
        ${gratitudeHtml}
      </div>`;
  }

  function renderList() {
    if (!entries.length) {
      entriesListEl.innerHTML = '';
      return;
    }
    const rows = entries.map(entry => `
      <div class="entry-row ${entry.id === activeId ? 'active' : ''}" data-id="${entry.id}">
        <div class="entry-meta">
          <span class="entry-date-sm">${entry.date}</span>
          <span class="entry-preview">${escapeHtml(entry.text)}</span>
        </div>
        <button class="delete-btn" data-id="${entry.id}" type="button">삭제</button>
      </div>
    `).join('');
    entriesListEl.innerHTML = `<div class="entries-title">지난 기록 (${entries.length})</div>${rows}`;

    entriesListEl.querySelectorAll('.entry-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) return;
        activeId = Number(row.dataset.id);
        renderCard(entries.find(x => x.id === activeId));
        renderList();
      });
    });
    entriesListEl.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(btn.dataset.id);
        entries = entries.filter(x => x.id !== id);
        saveEntries(entries);
        if (activeId === id) {
          activeId = entries.length ? entries[0].id : null;
          renderCard(entries.find(x => x.id === activeId) || null);
        }
        renderList();
      });
    });
  }

  function openForm() {
    formDateEl.textContent = formatDate(new Date());
    entryTextEl.value = '';
    gInputs.forEach(i => (i.value = ''));
    formEl.classList.remove('hidden');
    viewEl.classList.add('hidden');
    writeBtn.classList.add('hidden');
    entryTextEl.focus();
  }

  function closeForm() {
    formEl.classList.add('hidden');
    viewEl.classList.remove('hidden');
    writeBtn.classList.remove('hidden');
  }

  writeBtn.addEventListener('click', openForm);
  cancelBtn.addEventListener('click', closeForm);

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = entryTextEl.value.trim();
    if (!text) {
      entryTextEl.focus();
      return;
    }
    const gratitudes = gInputs.map(i => i.value.trim()).filter(Boolean);
    const newEntry = {
      id: Date.now(),
      date: formatDate(new Date()),
      text,
      gratitudes
    };
    entries = [newEntry, ...entries];
    saveEntries(entries);
    activeId = newEntry.id;
    renderCard(newEntry);
    renderList();
    closeForm();
  });

  // 초기 렌더링
  renderCard(entries.find(x => x.id === activeId) || null);
  renderList();
});
