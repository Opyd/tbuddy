export default function ({ $axios, app }, inject) {
  const api = $axios.create({
    headers: {
      common: {
        Accept: 'application/json',
      },
    },
  })
  api.onRequest((config) => {
    if (app.$auth.loggedIn) {
      const token = app.$auth.strategy.token.get()
      api.setToken(token, 'Bearer')
    }
  })

  api.setBaseURL('http://127.0.0.1:3100/api')

  inject('api', api)
}
