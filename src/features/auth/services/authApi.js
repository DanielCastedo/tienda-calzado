import { httpClient, HttpError, tokenStorage } from '@/services'
import { delay } from '@/utils'

/** Igual que en products: cambia a false cuando el backend esté disponible. */
const USE_MOCK = true

const DEMO_USER = { email: 'demo@tienda.com', password: '123456', name: 'Usuario Demo' }

export const authApi = {
  async login({ email, password }) {
    let response

    if (USE_MOCK) {
      await delay(500)
      if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
        throw new HttpError('Credenciales incorrectas', 401)
      }
      response = { token: 'mock-token', user: { name: DEMO_USER.name, email } }
    } else {
      response = await httpClient.post('/auth/login', { email, password })
    }

    tokenStorage.set(response.token)
    return response.user
  },

  async register(payload) {
    if (USE_MOCK) {
      await delay(500)
      return { name: payload.name, email: payload.email }
    }
    return httpClient.post('/auth/register', payload)
  },

  logout() {
    tokenStorage.clear()
  },
}
