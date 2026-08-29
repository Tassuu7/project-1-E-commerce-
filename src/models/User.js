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
    passwordHash,
    role = USER_ROLES.CUSTOMER,
    addresses = [],
    phone = '',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.name = name;
    this.email = email ? email.toLowerCase().trim() : '';
    this.passwordHash = passwordHash || (password ? hashPassword(password) : '');
    this.role = role;
    this.addresses = addresses;
    this.phone = phone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      passwordHash: this.passwordHash,
      role: this.role,
      addresses: this.addresses,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toSafeJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      addresses: this.addresses,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
