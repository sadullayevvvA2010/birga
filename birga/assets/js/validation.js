const Validation = (() => {
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isUsername(v) { return /^[a-zA-Z0-9_]{3,20}$/.test(v); }
  function minLen(v, n) { return typeof v === 'string' && v.trim().length >= n; }
  function notEmpty(v) { return typeof v === 'string' && v.trim().length > 0; }

  function showError(input, msg) {
    clearError(input);
    input.style.borderColor = 'var(--danger)';
    const err = document.createElement('div');
    err.className = 'form-error';
    err.textContent = msg;
    input.parentElement.appendChild(err);
  }
  function clearError(input) {
    input.style.borderColor = '';
    const parent = input.parentElement;
    if (parent) {
      const existing = parent.querySelector('.form-error');
      if (existing) existing.remove();
    }
  }
  function clearAll(form) {
    form.querySelectorAll('.form-error').forEach(e => e.remove());
    form.querySelectorAll('.input, .textarea').forEach(i => i.style.borderColor = '');
  }

  function validateRegister(data) {
    const errors = {};
    if (!notEmpty(data.name)) errors.name = t('auth.error.required');
    if (!isUsername(data.username)) errors.username = t('auth.error.required');
    if (!isEmail(data.email)) errors.email = t('auth.error.email');
    if (!minLen(data.password, 6)) errors.password = t('auth.error.password');
    if (data.password !== data.confirm) errors.confirm = t('auth.error.match');
    return errors;
  }
  function validateLogin(data) {
    const errors = {};
    if (!notEmpty(data.email)) errors.email = t('auth.error.required');
    if (!notEmpty(data.password)) errors.password = t('auth.error.required');
    return errors;
  }

  return { isEmail, isUsername, minLen, notEmpty, showError, clearError, clearAll, validateRegister, validateLogin };
})();
window.Validation = Validation;