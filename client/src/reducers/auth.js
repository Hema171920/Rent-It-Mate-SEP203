import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  GET_USERS,
  AUTH_ERROR,
  USER_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_USERS,
  ACCOUNT_DELETED
} from '../actions/types';
import setAuthToken from '../utils/setAuthToken';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  users:[],
  user: null,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case GET_USERS:
        return {
            ...state,
            users: payload,
            loading: false
        };
    case LOGIN_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: payload
      };
    case AUTH_ERROR:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: {}
      };
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: payload
      };
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case USER_ERROR:
      return{
          ...state,
          error: payload,
          users:[],
          loading:false
        }
    case CLEAR_USERS:
      return{
        ...state,
        error:{},
        users:[],
        loading: false
      }
    default:
      return state;
  }
}
