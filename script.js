const themeBtn = document.getElementById('themeBtn');
const savedTheme = localStorage.getItem('yang-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');

if (themeBtn) {
  themeBtn.textContent = document.body.classList.contains('dark') ? '☀' : '☾';
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    localStorage.setItem('yang-theme', dark ? 'dark' : 'light');
    themeBtn.textContent = dark ? '☀' : '☾';
  });
}

const storyGrid = document.getElementById('storyGrid');
if (storyGrid) {
  const searchInput = document.getElementById('searchInput');
  const genreFilter = document.getElementById('genreFilter');
  const emptyState = document.getElementById('emptyState');
  const storyCount = document.getElementById('storyCount');

  function render() {
    const q = searchInput.value.toLowerCase().trim();
    const genre = genreFilter.value;
    const filtered = STORIES.filter(s =>
      (!q || s.title.toLowerCase().includes(q)) &&
      (genre === 'all' || s.genre === genre)
    );

    storyCount.textContent = `${filtered.length} truyện`;
    emptyState.hidden = filtered.length > 0;

    storyGrid.innerHTML = filtered.map(s => {
      const latest = s.chapters[s.chapters.length - 1];
      return `
        <article class="story-card">
          <div class="cover-placeholder small">${s.short}</div>
          <div class="card-body">
            <p class="eyebrow">${s.genreLabel}</p>
            <h3>${s.title}</h3>
            <p class="card-desc">${s.description}</p>
            <div class="card-bottom">
              <span>Chương ${latest.number}</span>
              <a href="story.html?id=${s.id}">Xem truyện →</a>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  searchInput.addEventListener('input', render);
  genreFilter.addEventListener('change', render);
  render();

  const latest = STORIES.flatMap(s => s.chapters.map(c => ({...c, story: s})))
    .sort((a,b) => b.date.localeCompare(a.date) || b.number - a.number)
    .slice(0, 6);

  document.getElementById('latestList').innerHTML = latest.map(x => `
    <a class="latest-item" href="chapter.html?id=${x.story.id}&chapter=${x.number}">
      <span class="latest-number">CH. ${x.number}</span>
      <span class="latest-title">${x.story.title}<small>${x.title}</small></span>
      <span class="latest-arrow">→</span>
    </a>
  `).join('');
}
