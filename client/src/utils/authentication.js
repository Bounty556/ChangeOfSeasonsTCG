import axios from 'axios';
import moment from 'moment';
export function login() {
  // api call to log in session
  let data;
  _saveAuthLocally(data);
}
export function logout() {
  // api call to log out session
  localStorage.removeItem('authentication');
}
export function register() {
  // register user
  // let data;
  // _saveAuthLocally(data);
  // OR
  // redirect to login
}
export function _getAuthLocally() {
  let auth = JSON.parse(localStorage.getItem('authentication'));
  if (auth) {
    if (moment(auth.expiration_date).diff(moment()) < 0) {
      localStorage.removeItem('authentication');
      return null;
    }
    return auth;
  }
  return null;
}
function _saveAuthLocally(data) {
  localStorage.setItem('authentication', JSON.stringify(data));
}