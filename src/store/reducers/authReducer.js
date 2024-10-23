const initialState = {
  user: null,
  token: null,
  refreshToken: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_REFRESH_TOKEN':
      return { ...state, refreshToken: action.payload };
    case 'CLEAR_AUTH':
      return initialState;
    default:
      return state;
  }
};

export default authReducer;

