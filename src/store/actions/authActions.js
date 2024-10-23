export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user
});

export const setToken = (token) => ({
  type: 'SET_TOKEN',
  payload: token
});

export const setRefreshToken = (refreshToken) => ({
  type: 'SET_REFRESH_TOKEN',
  payload: refreshToken
});

export const clearAuth = () => ({
  type: 'CLEAR_AUTH'
});

