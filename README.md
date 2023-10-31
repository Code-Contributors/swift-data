# Swift Data 📡
[![](https://img.shields.io/discord/1010915072694046794?label=discord&style=for-the-badge&logo=discord&color=5865F2&logoColor=white)](https://discord.gg/gg8mkc4ecP)
[![](https://aschey.tech/tokei/github/tibue99/ezcord?style=for-the-badge)](https://github.com/Code-Contributors/swift-data)

## 📝**Description:**

The Swift Data npm package is a simple and lightweight database library for Node.js applications that provides database-like functionality with schemas and models, while storing data in files with the ".db" extension. This package allows developers to store and access data in a structured way without the need for a full-fledged database server solution.

## ✨**Key Features:**

- Create data models with custom schemas.
- Simple CRUD operations (Create, Read, Update, Delete) for data objects.
- Store data in files with the ".db" extension.
- Generate unique IDs for data objects.
- User-friendly API with TypeScript support.

### 📚**Example Usage:**

```javascript
const swift_data = require('swift-data');

// Connect to the database
const myDatabase = new swift_data.Database('my-database.db');

// Create a data model for users
const User = myDatabase.createModel({ name: '', age: 0 });

// Add a user
const user1 = User.create({ name: 'User 1', age: 30 });
console.log('Added User 1:', user1);

// Find users
const usersWithNameUser1 = User.find({ name: 'User 1' });
console.log('Users with name "User 1":', usersWithNameUser1);

// Update user data
User.update(user1.id, { age: 35 });
console.log('Updated User 1:', User.findById(user1.id));

// Delete a user
const deletedUserId = User.delete(user1.id);
console.log('Deleted User ID:', deletedUserId);

// Encrypt Data
const encryptedData = swift_data.DataEncryptor.encrypt('Hello World!'); // """"$>># )-§-(#`>?!!
console.log(encryptedData);

// Decrypt Data
const decryptedData = swift_data.DataEncryptor.decrypt('""""$>># )-§-(#`>?!!'); // Hello World