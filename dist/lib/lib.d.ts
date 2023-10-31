/**
 * A class to handle encryption and decryption
 */
export declare class DataEncryptor {
    /**
     * Encrypts data by removing characters like [], {}, (), and : and applying character mapping.
     * @param {string} data - The data to be encrypted.
     * @returns The encrypted data.
     * @example
     * const encryptedData = DataEncryptor.encrypt('Hello');
     */
    static encrypt(data: string): string;
    /**
     * Decrypts data by reversing the character transformations and adding brackets, braces, and colons.
     * @param {string} encryptedData - The data to be decrypted.
     * @returns The decrypted data.
     * @example
     * const decryptedData = DataEncryptor.decrypt('Hello');
     */
    static decrypt(encryptedData: string): string;
    static charMap(charMap: any): void;
}
/**
 * Defines the structure of Data Models stored in the Database
 */
export interface DataModel {
    id: string;
    name?: string;
    alias?: string[];
    crypto?: DataEncryptor;
    [key: string]: any;
}
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
export declare class Database {
    private fileName;
    /**
     * The Data
     */
    private data;
    /**
     * Creates a new Database Instance with the specified File Name
     * @param {string} fileName - The Name of the Database File
     */
    constructor(fileName: string);
    private connect;
    private saveData;
    /**
     * Creates a Model for Data Entities based on the provided Schema
     *
     * @param {T} schema - The Schema definition for the Data model
     * @extends {Record<string,any>}
     * @example
     * const User = myDatabase.createModel<{ name: string; age: number }>({ name: '', age: 0 });
     */
    createModel<T extends Record<string, any>>(schema: T): {
        /**
         * Creates a new Data Object based on the Schema and adds it into the Database
         * @param {T} data- The Data to be Added
         * @returns The created data object with a unique ID
         * @example
         * const user1 = User.create({ name: 'User 1', age: 30 });
         */
        create: (data: T) => DataModel;
        /**
         * Finds Data Objects in the Database based on a filter
         * @param {Partial<T>} filter - The Filter criteria to match data objects
         * @returns An array of data objects that match the filter
         * @example
         * const userWithNameUser1 = User.find({ name: 'User 1' });
         */
        find: (filter: Partial<T>) => DataModel[];
        /**
         * Finds a Data Object in the Database by its unique ID
         * @param {string} id - The ID of the Data Object to find
         * @returns The Data object with he specified ID or undefined if not found
         * @example
         * const user = User.findById(user1.id);
         */
        findById: (id: string) => DataModel | undefined;
        /**
         * Updates a Data Object in the Database based on its unique ID
         * @param {string} id - The ID of the Data Object to update
         * @param {Partial<T>} update - The Partial Data to update the existing object
         * @returns The updated data object or null if the ID was not found
         * @example
         * const updatedUser = User.update(user1.id, { age: 35 });
         */
        update: (id: string, update: Partial<T>) => DataModel | null;
        /**
         * Deletes a Data Object in the Database based on its unique ID
         * @param {string} id - The ID of the Data Object to delete
         * @returns The ID of the deleted data object or null if the ID was not found
         * @example
         * const deletedUserId = User.delete(user2.id);
         */
        delete: (id: string) => string | null;
    };
}
/**
 * The `swift_data` Module includes all Classes & Functions from the Source Code
 */
export declare namespace swift_data {
    /**
     * Defines the structure of Data Models stored in the Database
     */
    interface DataModel {
        id: string;
        [key: string]: any;
    }
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
    class Database {
        private fileName;
        /**
         * The Data
         */
        private data;
        /**
         * Creates a new Database Instance with the specified File Name
         * @param {string} fileName - The Name of the Database File
         */
        constructor(fileName: string);
        private connect;
        private saveData;
        /**
         * Creates a Model for Data Entities based on the provided Schema
         *
         * @param {T} schema - The Schema definition for the Data model
         * @extends {Record<string,any>}
         * @example
         * const User = myDatabase.createModel<{ name: string; age: number }>({ name: '', age: 0 });
         */
        createModel<T extends Record<string, any>>(schema: T): {
            /**
             * Creates a new Data Object based on the Schema and adds it into the Database
             * @param {T} data- The Data to be Added
             * @returns The created data object with a unique ID
             * @example
             * const user1 = User.create({ name: 'User 1', age: 30 });
             */
            create: (data: T) => DataModel;
            /**
             * Finds Data Objects in the Database based on a filter
             * @param {Partial<T>} filter - The Filter criteria to match data objects
             * @returns An array of data objects that match the filter
             * @example
             * const userWithNameUser1 = User.find({ name: 'User 1' });
             */
            find: (filter: Partial<T>) => DataModel[];
            /**
             * Finds a Data Object in the Database by its unique ID
             * @param {string} id - The ID of the Data Object to find
             * @returns The Data object with he specified ID or undefined if not found
             * @example
             * const user = User.findById(user1.id);
             */
            findById: (id: string) => DataModel | undefined;
            /**
             * Updates a Data Object in the Database based on its unique ID
             * @param {string} id - The ID of the Data Object to update
             * @param {Partial<T>} update - The Partial Data to update the existing object
             * @returns The updated data object or null if the ID was not found
             * @example
             * const updatedUser = User.update(user1.id, { age: 35 });
             */
            update: (id: string, update: Partial<T>) => DataModel | null;
            /**
             * Deletes a Data Object in the Database based on its unique ID
             * @param {string} id - The ID of the Data Object to delete
             * @returns The ID of the deleted data object or null if the ID was not found
             * @example
             * const deletedUserId = User.delete(user2.id);
             */
            delete: (id: string) => string | null;
        };
    }
    /**
     * A class to handle encryption and decryption
     */
    class DataEncryptor {
        /**
         * Encrypts data by removing characters like [], {}, (), and : and applying character mapping.
         * @param {string} data - The data to be encrypted.
         * @returns The encrypted data.
         * @example
         * const encryptedData = DataEncryptor.encrypt('Hello');
         */
        static encrypt(data: string): string;
        /**
         * Decrypts data by reversing the character transformations and adding brackets, braces, and colons.
         * @param {string} encryptedData - The data to be decrypted.
         * @returns The decrypted data.
         * @example
         * const decryptedData = DataEncryptor.decrypt('Hello');
         */
        static decrypt(encryptedData: string): string;
        static charMap(charMap: any): void;
    }
}
//# sourceMappingURL=lib.d.ts.map