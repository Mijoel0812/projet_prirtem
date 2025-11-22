/**
 * IMPORTANT: Ces fonctions utilisent localStorage.
 * Si ce code est utilisé dans un artifact Claude.ai, 
 * remplacer par React state (useState/useReducer)
 */

export const setUserData = (userData) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

export const getUserData = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const clearUserData = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};