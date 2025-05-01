const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10; // This determines how secure the salt should be.

const encryptPassword = (password) => {
  // This generates a random salt:
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  // This takes in the random salt and plaintext password and hashes them together:
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (candidatePassword, storedPassword) => {
  /*
  This takes in the candidate password (what the user entered) to check it.
  The stored password has the original salt, so it will run the
  candidate password and salt through the same hashing process as before.
  If that result is the same as the stored password, then we have a match!
  If this interests you, check out this video https://www.youtube.com/watch?v=8ZtInClXe1Q
  */
  return bcrypt.compareSync(candidatePassword, storedPassword);
};


module.exports = {
  encryptPassword,
  comparePassword,
};
