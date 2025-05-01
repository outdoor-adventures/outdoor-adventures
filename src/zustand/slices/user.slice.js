import axios from 'axios';

// All requests made with axios will include credentials, which means
// the cookie that corresponds with the session will be sent along
// inside every request's header
axios.defaults.withCredentials = true;


const createUserSlice = (set, get) => ({
  user: {},
  authErrorMessage: '',
  fetchUser: async () => {
    //  Retrieves the current user's data from the /api/user endpoint.
    try {
      const { data } = await axios.get('/api/user');
      set({ user: data });
    } catch (err) {
      console.log('fetchUser error:', err);
      set({user : {}});
    }
  },
  register: async (newUserCredentials) => {
    // Registers a new user by sending a POST request to
    // /api/user/register, and then attempts to log them in.
    get().setAuthErrorMessage('');
    try {
      await axios.post('/api/user/register', newUserCredentials);
      get().logIn(newUserCredentials);
    } catch (err) {
      console.log('register error:', err);
      get().setAuthErrorMessage('Oops! Registration failed. That username might already be taken. Try again!');
    }
  },
  logIn: async (userCredentials) => {
    // Logs in an existing user by sending a POST request
    // to /api/user/login and then retrieves their data.
    get().setAuthErrorMessage('')
    try {
      await axios.post('/api/user/login', userCredentials);
      get().fetchUser();
    } catch (err) {
      console.log('logIn error:', err);
      if (err.response.status === 401) {
        // 401 is the status code sent from passport if user isn't in the database or
        // if the username and password don't match in the database, so:
        get().setAuthErrorMessage('Oops! Login failed. You have entered an invalid username or password. Try again!');
      } else {
        // Got an error that wasn't status 401, so we'll show a more generic error:
        get().setAuthErrorMessage('Oops! Login failed. It might be our fault. Try again!');
      }
    }
  },
  logOut : async () => {
    // Logs out the current user by sending a POST request to
    // /api/user/logout, and then clears their data.
    try {
      await axios.post('/api/user/logout');
      set({user : {}});
    } catch (err) {
      console.log('logOut error:', err);
    }
  },
  setAuthErrorMessage: (message) => {
    // Sets an error message for authentication-related issues.
    set({authErrorMessage : message})
  }
})


export default createUserSlice;
