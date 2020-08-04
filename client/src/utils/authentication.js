
export function logout() {
  // api call to log out session
  localStorage.removeItem('authentication');
}

export function getAuthLocally() {
  let auth = JSON.parse(localStorage.getItem('authentication'));
  console.log(auth);
  if (auth) {
    return auth;
  }
  return null;
}
export function saveAuthLocally(data) {
  localStorage.setItem('authentication', JSON.stringify(data));
}
