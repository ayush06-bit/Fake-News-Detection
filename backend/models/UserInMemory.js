const bcrypt = require('bcryptjs');
const storage = require('../utils/inMemoryStorage');

class User {
  static async create(userData) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = storage.createUser({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user'
    });

    return user;
  }

  static async findOne(query) {
    if (query.email) {
      return storage.findUserByEmail(query.email);
    }
    return null;
  }

  static async findById(id) {
    return storage.findUserById(id);
  }

  static async findByIdAndUpdate(id, updates, options) {
    return storage.updateUser(id, updates);
  }

  static async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}

module.exports = User;
