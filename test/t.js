const swift_data = require('../lib/lib');

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
const encryptedData = swift_data.DataEncryptor.encrypt('Hello World!');
console.log(encryptedData);
