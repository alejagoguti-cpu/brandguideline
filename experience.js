document.querySelectorAll('[data-modal]').forEach((button) => button.addEventListener('click', () => {
  document.querySelector(button.dataset.modal).classList.add('show');
}));
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => button.closest('.modal').classList.remove('show')));
document.querySelectorAll('.modal').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) modal.classList.remove('show'); }));
document.querySelectorAll('form').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  form.querySelector('.notice').classList.add('show');
  form.querySelector('button[type="submit"]').textContent = '¡Listo!';
}));
