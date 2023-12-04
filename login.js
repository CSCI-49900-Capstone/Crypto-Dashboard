const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const loginForm  = document.querySelector('#js-login-form');
const registerForm  = document.querySelector('#js-register-form');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

loginForm.addEventListener('submit', async (event)=> {
  event.preventDefault();
  form = event.target;
  const email = form.querySelector('input[name="email"]');
  const password = form.querySelector('input[name="password"]');

  const result = await api.signIn({
    email: email.value,
    password: password.value,
  })
  if (result.ok) {
    window.location.href = './';
  } else {
    alert(result.error);
  }
})

registerForm.addEventListener('submit', async (event)=> {
  event.preventDefault();
  form = event.target;
  const email = form.querySelector('input[name="email"]');
  const password = form.querySelector('input[name="password"]');
  const apiKey = form.querySelector('input[name="api_key"]');
  const secretKey = form.querySelector('input[name="secret_key"]');
  const account = form.querySelector('input[name="account"]');

  const result = await api.signUp({
    email: email.value,
    password: password.value,
    apiKey: apiKey.value,
    secretKey: secretKey.value,
    account: account.value,
  })
  if (result.ok) {
    wrapper.classList.remove('active');
    const loginEmail = loginForm.querySelector('input[name="email"]');
    loginEmail.value = email.value;
  } else {
    alert(result.error);
  }
})
