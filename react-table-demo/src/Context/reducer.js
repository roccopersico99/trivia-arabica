import React, { useState, useReducer } from 'react';

let user = localStorage.getItem('currentUser') ?
  JSON.parse(localStorage.getItem('currentUser')).user :
  '';
let token = localStorage.getItem('currentUser') ?
  JSON.parse(localStorage.getItem('currentUser')).auth_token :
  '';

export const initialState = {
  user: '' || user,
  token: '' || token,
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
      };
    case 'LOGOUT':
      return {
        ...initialState,
        user: '',
          token: '',
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