"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swift_data = exports.Database = exports.DataEncryptor = void 0;
var fs = require("fs");
var uuid_1 = require("uuid");
/**
 * A class to handle encryption and decryption
 */
var DataEncryptor = /** @class */ (function () {
    function DataEncryptor() {
    }
    /**
     * Encrypts data by removing characters like [], {}, (), and : and applying character mapping.
     * @param {string} data - The data to be encrypted.
     * @returns The encrypted data.
     * @example
     * const encryptedData = DataEncryptor.encrypt('Hello');
     */
    DataEncryptor.encrypt = function (data) {
        var charMap = {
            a: '[]',
            b: '()',
            c: '\\/',
            d: '?!',
            e: '$',
            f: '}',
            g: '{',
            h: '_',
            i: '.',
            j: ':',
            k: '<',
            l: '>',
            m: '><',
            n: '>>',
            o: '#',
            r: '`',
            s: '""',
            t: '[]/()',
            u: '"§)',
            v: '-X',
            w: ')§(',
            x: '"§&)G',
            y: '}=',
            z: 'ö',
            A: '[/]',
            B: '(§)',
            C: '\\//',
            D: '?"§!',
            E: '"!$',
            F: '}_:',
            G: '{"§',
            H: '""""',
            I: '§(=).',
            J: ':',
            K: '<>>>>>',
            L: '<<<<<>',
            M: '>>><<<',
            N: '>§%>',
            O: '#',
            P: '~~',
            Q: '§$&(',
            R: '``^',
            S: '°""',
            T: '[S]/()',
            U: '€rz',
            V: '-XX-',
            W: ')-§-(',
            X: '"§&)G',
            Y: '}=',
            Z: ':3',
            ä: '102010101010',
            Ä: '11002204',
            ü: '??',
            Ü: '???',
            ö: '§§',
            Ö: 'Ö',
        };
        var transformedData = data.replace(/[\[\]\{\}\(\):]/g, '');
        return transformedData
            .split('')
            .map(function (char) { return (charMap[char] ? charMap[char] : char); })
            .join('');
    };
    /**
     * Decrypts data by reversing the character transformations and adding brackets, braces, and colons.
     * @param {string} encryptedData - The data to be decrypted.
     * @returns The decrypted data.
     * @example
     * const decryptedData = DataEncryptor.decrypt('Hello');
     */
    DataEncryptor.decrypt = function (encryptedData) {
        var charMap = Object.entries(DataEncryptor.charMap).reduce(function (map, _a) {
            var key = _a[0], value = _a[1];
            map[value] = key;
            return map;
        }, {});
        return encryptedData
            .split('')
            .map(function (char) { return (charMap[char] ? charMap[char] : char); })
            .join('');
    };
    DataEncryptor.charMap = function (charMap) {
        throw new Error('Method not implemented.');
    };
    return DataEncryptor;
}());
exports.DataEncryptor = DataEncryptor;
/**
 * * A simple database class that provides basic CRUD operations.
 * @example
 * const myDatabase = new Database('my-database.json');
 * const User = myDatabase.createModel<{ name: string; age: number }>({ name: '', age: 0 });
 * const user1 = User.create({ name: 'User 1', age: 30 });
 * const user2 = User.create({ name: 'User 2', age: 25 });
 * console.log('All users:', User.find({}));
 * console.log('User with ID 1:', User.findById(user1.id));
 * User.update(user1.id, { age: 35 });
 * console.log('User 1 after update:', User.findById(user1.id));
 * User.delete(user2.id);
 * console.log('All users after deleting User 2:', User.find({}));
 */
var Database = /** @class */ (function () {
    /**
     * Creates a new Database Instance with the specified File Name
     * @param {string} fileName - The Name of the Database File
     */
    function Database(fileName) {
        this.fileName = fileName;
        /**
         * The Data
         */
        this.data = [];
        if (!fileName.endsWith('.db')) {
            fileName += '.db';
        }
        this.fileName = fileName;
        this.connect();
    }
    Database.prototype.connect = function () {
        try {
            var databaseFile = fs.readFileSync(this.fileName, 'utf-8');
            var decryptedData = DataEncryptor.decrypt(databaseFile);
            this.data = JSON.parse(decryptedData);
        }
        catch (error) {
            this.data = [];
        }
    };
    Database.prototype.saveData = function () {
        var dataAsString = JSON.stringify(this.data, null, 2);
        var encryptedData = DataEncryptor.encrypt(dataAsString);
        fs.writeFileSync(this.fileName, encryptedData);
    };
    /**
     * Creates a Model for Data Entities based on the provided Schema
     *
     * @param {T} schema - The Schema definition for the Data model
     * @extends {Record<string,any>}
     * @example
     * const User = myDatabase.createModel<{ name: string; age: number }>({ name: '', age: 0 });
     */
    Database.prototype.createModel = function (schema) {
        var _this = this;
        return {
            /**
             * Creates a new Data Object based on the Schema and adds it into the Database
             * @param {T} data- The Data to be Added
             * @returns The created data object with a unique ID
             * @example
             * const user1 = User.create({ name: 'User 1', age: 30 });
             */
            create: function (data) {
                var newDataObject = __assign({ id: (0, uuid_1.v4)() }, data);
                _this.data.push(newDataObject);
                _this.saveData();
                return newDataObject;
            },
            /**
             * Finds Data Objects in the Database based on a filter
             * @param {Partial<T>} filter - The Filter criteria to match data objects
             * @returns An array of data objects that match the filter
             * @example
             * const userWithNameUser1 = User.find({ name: 'User 1' });
             */
            find: function (filter) {
                return _this.data.filter(function (data) {
                    for (var key in filter) {
                        if (filter[key] !== data[key])
                            return false;
                    }
                    return true;
                });
            },
            /**
             * Finds a Data Object in the Database by its unique ID
             * @param {string} id - The ID of the Data Object to find
             * @returns The Data object with he specified ID or undefined if not found
             * @example
             * const user = User.findById(user1.id);
             */
            findById: function (id) {
                return _this.data.find(function (data) { return data.id === id; });
            },
            /**
             * Updates a Data Object in the Database based on its unique ID
             * @param {string} id - The ID of the Data Object to update
             * @param {Partial<T>} update - The Partial Data to update the existing object
             * @returns The updated data object or null if the ID was not found
             * @example
             * const updatedUser = User.update(user1.id, { age: 35 });
             */
            update: function (id, update) {
                var index = _this.data.findIndex(function (data) { return data.id === id; });
                if (index !== -1) {
                    _this.data[index] = __assign(__assign({}, _this.data[index]), update);
                    _this.saveData();
                    return _this.data[index];
                }
                return null;
            },
            /**
             * Deletes a Data Object in the Database based on its unique ID
             * @param {string} id - The ID of the Data Object to delete
             * @returns The ID of the deleted data object or null if the ID was not found
             * @example
             * const deletedUserId = User.delete(user2.id);
             */
            delete: function (id) {
                var index = _this.data.findIndex(function (data) { return data.id === id; });
                if (index !== -1) {
                    var deletedId = _this.data[index].id;
                    _this.data.splice(index, 1);
                    _this.saveData();
                    return deletedId;
                }
                return null;
            },
        };
    };
    return Database;
}());
exports.Database = Database;
/**
 * The `swift_data` Module includes all Classes & Functions from the Source Code
 */
var swift_data;
(function (swift_data) {
    /**
     * * A simple database class that provides basic CRUD operations.
     * @example
     * const myDatabase = new Database('my-database.json');
     * const User = myDatabase.createModel<{ name: string; age: number }>({ name: '', age: 0 });
     * const user1 = User.create({ name: 'User 1', age: 30 });
     * const user2 = User.create({ name: 'User 2', age: 25 });
     * console.log('All users:', User.find({}));
     * console.log('User with ID 1:', User.findById(user1.id));
     * User.update(user1.id, { age: 35 });
     * console.log('User 1 after update:', User.findById(user1.id));
     * User.delete(user2.id);
     * console.log('All users after deleting User 2:', User.find({}));
     */
    var Database = /** @class */ (function () {
        /**
         * Creates a new Database Instance with the specified File Name
         * @param {string} fileName - The Name of the Database File
         */
        function Database(fileName) {
            this.fileName = fileName;
            /**
             * The Data
             */
            this.data = [];
            if (!fileName.endsWith('.db')) {
                fileName += '.db';
            }
            this.fileName = fileName;
            this.connect();
        }
        Database.prototype.connect = function () {
            try {
                var databaseFile = fs.readFileSync(this.fileName, 'utf-8');
                this.data = JSON.parse(databaseFile);
            }
            catch (error) {
                this.data = [];
            }
        };
        Database.prototype.saveData = function () {
            var dataAsString = JSON.stringify(this.data, null, 2);
            fs.writeFileSync(this.fileName, dataAsString);
        };
        /**
         * Creates a Model for Data Entities based on the provided Schema
         *
         * @param {T} schema - The Schema definition for the Data model
         * @extends {Record<string,any>}
         * @example
         * const User = myDatabase.createModel<{ name: string; age: number }>({ name: '', age: 0 });
         */
        Database.prototype.createModel = function (schema) {
            var _this = this;
            return {
                /**
                 * Creates a new Data Object based on the Schema and adds it into the Database
                 * @param {T} data- The Data to be Added
                 * @returns The created data object with a unique ID
                 * @example
                 * const user1 = User.create({ name: 'User 1', age: 30 });
                 */
                create: function (data) {
                    var newDataObject = __assign({ id: (0, uuid_1.v4)() }, data);
                    _this.data.push(newDataObject);
                    _this.saveData();
                    return newDataObject;
                },
                /**
                 * Finds Data Objects in the Database based on a filter
                 * @param {Partial<T>} filter - The Filter criteria to match data objects
                 * @returns An array of data objects that match the filter
                 * @example
                 * const userWithNameUser1 = User.find({ name: 'User 1' });
                 */
                find: function (filter) {
                    return _this.data.filter(function (data) {
                        for (var key in filter) {
                            if (filter[key] !== data[key])
                                return false;
                        }
                        return true;
                    });
                },
                /**
                 * Finds a Data Object in the Database by its unique ID
                 * @param {string} id - The ID of the Data Object to find
                 * @returns The Data object with he specified ID or undefined if not found
                 * @example
                 * const user = User.findById(user1.id);
                 */
                findById: function (id) {
                    return _this.data.find(function (data) { return data.id === id; });
                },
                /**
                 * Updates a Data Object in the Database based on its unique ID
                 * @param {string} id - The ID of the Data Object to update
                 * @param {Partial<T>} update - The Partial Data to update the existing object
                 * @returns The updated data object or null if the ID was not found
                 * @example
                 * const updatedUser = User.update(user1.id, { age: 35 });
                 */
                update: function (id, update) {
                    var index = _this.data.findIndex(function (data) { return data.id === id; });
                    if (index !== -1) {
                        _this.data[index] = __assign(__assign({}, _this.data[index]), update);
                        _this.saveData();
                        return _this.data[index];
                    }
                    return null;
                },
                /**
                 * Deletes a Data Object in the Database based on its unique ID
                 * @param {string} id - The ID of the Data Object to delete
                 * @returns The ID of the deleted data object or null if the ID was not found
                 * @example
                 * const deletedUserId = User.delete(user2.id);
                 */
                delete: function (id) {
                    var index = _this.data.findIndex(function (data) { return data.id === id; });
                    if (index !== -1) {
                        var deletedId = _this.data[index].id;
                        _this.data.splice(index, 1);
                        _this.saveData();
                        return deletedId;
                    }
                    return null;
                },
            };
        };
        return Database;
    }());
    swift_data.Database = Database;
    /**
     * A class to handle encryption and decryption
     */
    var DataEncryptor = /** @class */ (function () {
        function DataEncryptor() {
        }
        /**
         * Encrypts data by removing characters like [], {}, (), and : and applying character mapping.
         * @param {string} data - The data to be encrypted.
         * @returns The encrypted data.
         * @example
         * const encryptedData = DataEncryptor.encrypt('Hello');
         */
        DataEncryptor.encrypt = function (data) {
            var charMap = {
                a: '[]',
                b: '()',
                c: '\\/',
                d: '?!',
                e: '$',
                f: '}',
                g: '{',
                h: '_',
                i: '.',
                j: ':',
                k: '<',
                l: '>',
                m: '><',
                n: '>>',
                o: '#',
                r: '`',
                s: '""',
                t: '[]/()',
                u: '"§)',
                v: '-X',
                w: ')§(',
                x: '"§&)G',
                y: '}=',
                z: 'ö',
                A: '[/]',
                B: '(§)',
                C: '\\//',
                D: '?"§!',
                E: '"!$',
                F: '}_:',
                G: '{"§',
                H: '""""',
                I: '§(=).',
                J: ':',
                K: '<>>>>>',
                L: '<<<<<>',
                M: '>>><<<',
                N: '>§%>',
                O: '#',
                P: '~~',
                Q: '§$&(',
                R: '``^',
                S: '°""',
                T: '[S]/()',
                U: '€rz',
                V: '-XX-',
                W: ')-§-(',
                X: '"§&)G',
                Y: '}=',
                Z: ':3',
                ä: '102010101010',
                Ä: '11002204',
                ü: '??',
                Ü: '???',
                ö: '§§',
                Ö: 'Ö',
            };
            var transformedData = data.replace(/[\[\]\{\}\(\):]/g, '');
            return transformedData
                .split('')
                .map(function (char) { return (charMap[char] ? charMap[char] : char); })
                .join('');
        };
        /**
         * Decrypts data by reversing the character transformations and adding brackets, braces, and colons.
         * @param {string} encryptedData - The data to be decrypted.
         * @returns The decrypted data.
         * @example
         * const decryptedData = DataEncryptor.decrypt('Hello');
         */
        DataEncryptor.decrypt = function (encryptedData) {
            var charMap = Object.entries(DataEncryptor.charMap).reduce(function (map, _a) {
                var key = _a[0], value = _a[1];
                map[value] = key;
                return map;
            }, {});
            return encryptedData
                .split('')
                .map(function (char) { return (charMap[char] ? charMap[char] : char); })
                .join('');
        };
        DataEncryptor.charMap = function (charMap) {
            throw new Error('Method not implemented.');
        };
        return DataEncryptor;
    }());
    swift_data.DataEncryptor = DataEncryptor;
})(swift_data || (exports.swift_data = swift_data = {}));
//# sourceMappingURL=lib.js.map
