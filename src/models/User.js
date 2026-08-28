/**
 * User Data Model Definition
 * OmniCommerce Enterprise
 */

const { generateUUID, hashPassword } = require('../utils/helpers');
const { USER_ROLES } = require('../config/constants');

class User {
  constructor({
    id = generateUUID(),
    name,
    email,
    password,
    role = USER_ROLES.CUSTOMER,
    addresses = [],
    phone = '',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.name = name;
    this.email = email ? email.toLowerCase().trim() : '';
    this.passwordHash = password ? hashPassword(password) : '';
    this.role = role;
    this.addresses = addresses; // Array of { id, street, city, state, zip, country, isDefault }
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    const { passwordHash, ...safeUser } = this;
    return safeUser;
  }
}

module.exports = User;
