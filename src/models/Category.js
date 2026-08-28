/**
 * Category Data Model Definition
 * OmniCommerce Enterprise
 */

const { generateUUID, slugify } = require('../utils/helpers');

class Category {
  constructor({
    id = generateUUID(),
    name,
    description = '',
    parentId = null,
    icon = 'folder',
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.name = name;
    this.slug = slugify(name);
    this.description = description;
    this.parentId = parentId;
    this.icon = icon;
    this.createdAt = createdAt;
  }
}

module.exports = Category;
