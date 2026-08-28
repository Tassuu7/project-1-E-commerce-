/**
 * Base Data Repository with JSON File Storage & In-Memory Caching
 * OmniCommerce Enterprise
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

class BaseRepository {
  constructor(entityName, ModelClass) {
    this.entityName = entityName;
    this.ModelClass = ModelClass;
    this.filePath = path.join(config.storageDir, `${entityName}.json`);
    this.items = [];
    this.initStorage();
  }

  initStorage() {
    if (!fs.existsSync(config.storageDir)) {
      fs.mkdirSync(config.storageDir, { recursive: true });
    }

    if (fs.existsSync(this.filePath)) {
      try {
        const rawData = fs.readFileSync(this.filePath, 'utf8');
        const parsed = JSON.parse(rawData);
        this.items = parsed.map(data => new this.ModelClass(data));
      } catch (err) {
        logger.error(`Error reading storage for ${this.entityName}:`, err);
        this.items = [];
      }
    } else {
      this.saveToFile();
    }
  }

  saveToFile() {
    try {
      const serializable = this.items.map(item => item.toJSON ? item.toJSON() : item);
      fs.writeFileSync(this.filePath, JSON.stringify(serializable, null, 2), 'utf8');
    } catch (err) {
      logger.error(`Error saving storage for ${this.entityName}:`, err);
    }
  }

  formatItem(item) {
    if (!item) return null;
    return item.toJSON ? item.toJSON() : item;
  }

  findAll(predicate = null) {
    const list = typeof predicate === 'function' ? this.items.filter(predicate) : [...this.items];
    return list.map(item => this.formatItem(item));
  }

  findById(id) {
    const item = this.items.find(item => item.id === id) || null;
    return this.formatItem(item);
  }

  findOne(predicate) {
    const item = this.items.find(predicate) || null;
    return this.formatItem(item);
  }

  findPaginated(predicate = null, page = 1, limit = 10) {
    const filtered = predicate ? this.items.filter(predicate) : this.items;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const rawData = filtered.slice(offset, offset + limit);
    const data = rawData.map(item => this.formatItem(item));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  create(itemData) {
    const newItem = new this.ModelClass(itemData);
    this.items.push(newItem);
    this.saveToFile();
    return this.formatItem(newItem);
  }

  update(id, updateData) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const existing = this.items[index];
    const updatedData = {
      ...existing,
      ...updateData,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };

    const updatedItem = new this.ModelClass(updatedData);
    this.items[index] = updatedItem;
    this.saveToFile();
    return this.formatItem(updatedItem);
  }

  delete(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    this.saveToFile();
    return true;
  }

  clear() {
    this.items = [];
    this.saveToFile();
  }
}

module.exports = BaseRepository;
