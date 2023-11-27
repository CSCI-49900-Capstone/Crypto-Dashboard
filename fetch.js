const API_URL = "https://feasible-mint-werewolf.ngrok-free.app"
const AUTH_TOKEN = "AUTH_TOKEN"

async function request(path, options = {}) {
  path = path.startsWith('/') ? path : `/${path}`
  token = localStorage.getItem(AUTH_TOKEN)
  const result = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options,
  }).then((response) => response.json());
  if (!result?.ok) {
    console.error(result?.error ?? result)
  }
  return result
}

const api = {
  signUp(input = {}) {
    return request('/sign-up', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        api_key: input.apiKey,
        secret_key: input.secretKey,
        account: input.account,
      }),
    })
  },
  async signIn(input = {}) {
    const result = await request('/sign-in', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        password: input.password,
      }),
    })
    if (result?.data?.token) {
      localStorage.setItem(AUTH_TOKEN, result.data.token);
    }
    return result
  },
  async getProfile() {
    return request('/profile', {
      method: 'GET',
    })
  },
  async updateProfile(input = {}) {
    return request('/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        password: input.password,
        api_key: input.apiKey,
        secret_key: input.secretKey,
        account: input.account,
      }),
    })
  },
  async deleteProfile() {
    const result = await request('/profile', {
      method: 'DELETE',
    })
    if (result?.ok === true) {
      localStorage.removeItem(AUTH_TOKEN);
    }
  },
  async enableAutoTrading(input = {}) {
    return await request('/auto-trade/enable', {
      method: 'PATCH',
      body: JSON.stringify({
        k: input.k, // 0.1 ~ 1.0
        ratio: input.ratio, // 0.10 ~ 1.00
        ticker: input.ticker, // BTC-USD
      }),
    })
  },
  async disableAuthTrading(ticker) {
    return await request('/auto-trade/disable', {
      method: 'PATCH',
      body: JSON.stringify({ 
        ticker: ticker, // BTC-USD
      }),
    })
  },
  async getTransactions(ticker) {
    return request(`/transactions?=${ticker}`, {
      method: 'GET',
    })
  },
}