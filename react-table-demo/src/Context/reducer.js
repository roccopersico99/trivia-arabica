let user = localStorage.getItem('currentUser') ?
  JSON.parse(localStorage.getItem('currentUser')).user :
  '';
let token = localStorage.getItem('currentUser') ?
  JSON.parse(localStorage.getItem('currentUser')).auth_token :
  '';
let id = localStorage.getItem('currentUser') ?
  JSON.parse(localStorage.getItem('currentUser')).id :
  '';
let imageUrl = localStorage.getItem('currentUser') ?
  JSON.parse(localStorage.getItem('currentUser')).imageUrl :
  '';

export const initialState = {
  user: '' || user,
  token: '' || token,
  id: '' || id,
  imageUrl: '' || imageUrl,
  errorMessage: null,
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {

    case 'REQUEST_LOGIN':
      return {
        ...initialState,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...initialState,
        user: action.payload.name,
          token: action.payload.auth_token,
          id: action.payload.googleId,
          imageUrl: action.payload.imageUrl,
      };

    case 'LOGOUT':
      return {
        ...initialState,
        user: '',
          token: '',
          id: '',
          imageUrl: '',
      };

    case 'LOGIN_ERROR':
      return {
        ...initialState,
        errorMessage: action.error,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};