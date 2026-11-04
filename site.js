const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  nav.classList.toggle('open', !expanded);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation'); menuButton.focus();
  }
});
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function activateTab(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {event.preventDefault();activateTab(tabs[next]);tabs[next].focus();}
  });
});
const dialog = document.querySelector('.lightbox');
let figureTrigger;
document.querySelectorAll('.figure-button').forEach(button => button.addEventListener('click', () => {
  figureTrigger = button;
  const original = button.querySelector('img');
  dialog.querySelector('img').src = original.src;
  dialog.querySelector('img').alt = original.alt;
  dialog.querySelector('.lightbox-label').textContent = button.dataset.label;
  dialog.showModal(); document.body.style.overflow = 'hidden';
}));
dialog?.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => {if (event.target === dialog) {const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
dialog?.addEventListener('close', () => {document.body.style.overflow = '';figureTrigger?.focus();});
document.querySelector('.copy-button')?.addEventListener('click', async event => {
  const button = event.currentTarget;
  const text = document.querySelector('#bibtex').textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied ✓';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();range.selectNodeContents(document.querySelector('#bibtex'));
    selection.removeAllRanges();selection.addRange(range);
    button.textContent = 'Select & copy';
  }
  window.setTimeout(() => {button.textContent = 'Copy BibTeX';}, 2500);
});
if ('IntersectionObserver' in window && nav) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      nav.querySelectorAll('a').forEach(a => {if(a.hash === '#' + entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    }
  }, {rootMargin:'-15% 0px -65% 0px',threshold:0});
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
