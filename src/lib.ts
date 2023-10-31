import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

/**
 * A class to handle encryption and decryption
 */
export class DataEncryptor {
  /**
   * Encrypts data by removing characters like [], {}, (), and : and applying character mapping.
   * @param {string} data - The data to be encrypted.
   * @returns The encrypted data.
   * @example
   * const encryptedData = DataEncryptor.encrypt('Hello');
   */
  static encrypt(data: string): string {
    const charMap: { [key: string]: string } = {
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
    const transformedData = data.replace(/[\[\]\{\}\(\):]/g, '');
    return transformedData
      .split('')
      .map((char) => (charMap[char] ? charMap[char]: char))
      .join('');
  }

  /**
   * Decrypts data by reversing the character transformations and adding brackets, braces, and colons.
   * @param {string} encryptedData - The data to be decrypted.
   * @returns The decrypted data.
   * @example
   * const decryptedData = DataEncryptor.decrypt('Hello');
   */
  static decrypt(encryptedData: string): string {
    const charMap = Object.entries(DataEncryptor.charMap).reduce(
      (map, [key, value]) => {
        map[value] = key;
        return map;
      },
      {} as { [key: string]: string }
    );
    return encryptedData
      .split('')
      .map((char) => (charMap[char] ? charMap[char] : char))
      .join('');
  }
  static charMap(charMap: any) {
    throw new Error('Method not implemented.');
  }

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
export class Database {
  /**
   * The Data
   */
  private data: DataModel[] = [];
  /**
   * Creates a new Database Instance with the specified File Name
   * @param {string} fileName - The Name of the Database File
   */
  constructor(private fileName: string) {
    if (!fileName.endsWith('.db')) {
      fileName += '.db';
    }
    this.fileName = fileName;
    this.connect();
  }

  private connect(): void {
    try {
      const databaseFile = fs.readFileSync(this.fileName, 'utf-8');
      const decryptedData = DataEncryptor.decrypt(databaseFile);
      this.data = JSON.parse(decryptedData);
    } catch (error) {
      this.data = [];
    }

  }

  private saveData(): void {
    const dataAsString = JSON.stringify(this.data, null, 2);
    const encryptedData = DataEncryptor.encrypt(dataAsString);
    fs.writeFileSync(this.fileName, encryptedData);
  }

  /**
   * Creates a Model for Data Entities based on the provided Schema
   * 
   * @param {T} schema - The Schema definition for the Data model
   * @extends {Record<string,any>} 
   * @example
   * const User = myDatabase.createModel<{ name: string; age: number }>({ name: '', age: 0 });
   */
  createModel<T extends Record<string, any>>(schema: T) {
    return {
      /**
       * Creates a new Data Object based on the Schema and adds it into the Database
       * @param {T} data- The Data to be Added
       * @returns The created data object with a unique ID
       * @example
       * const user1 = User.create({ name: 'User 1', age: 30 });
       */
      create: (data: T): DataModel => {
        const newDataObject: DataModel = { id: uuidv4(), ...data };
        this.data.push(newDataObject);
        this.saveData();
        return newDataObject;
      },

      /**
       * Finds Data Objects in the Database based on a filter
       * @param {Partial<T>} filter - The Filter criteria to match data objects  
       * @returns An array of data objects that match the filter
       * @example
       * const userWithNameUser1 = User.find({ name: 'User 1' });
       */
      find: (filter: Partial<T>): DataModel[] => {
        return this.data.filter((data) => {
          for (const key in filter) {
            if (filter[key] !== data[key]) return false;
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
      findById: (id: string): DataModel | undefined => {
        return this.data.find((data) => data.id === id);
      },

      /**
       * Updates a Data Object in the Database based on its unique ID
       * @param {string} id - The ID of the Data Object to update
       * @param {Partial<T>} update - The Partial Data to update the existing object
       * @returns The updated data object or null if the ID was not found
       * @example
       * const updatedUser = User.update(user1.id, { age: 35 });
       */
      update: (id: string, update: Partial<T>): DataModel | null => {
        const index = this.data.findIndex((data) => data.id === id);
        if (index !== -1) {
          this.data[index] = { ...this.data[index], ...update };
          this.saveData();
          return this.data[index];
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
      delete: (id: string): string | null => {
        const index = this.data.findIndex((data) => data.id === id);
        if (index !== -1) {
          const deletedId = this.data[index].id;
          this.data.splice(index, 1);
          this.saveData();
          return deletedId;
        }
        return null;
      },

    };

  }

}
/**
 * The `swift_data` Module includes all Classes & Functions from the Source Code
 */
export module swift_data {
/**
 * Defines the structure of Data Models stored in the Database
 */
export interface DataModel {
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
export class Database {
  /**
   * The Data
   */
  private data: DataModel[] = [];
  /**
   * Creates a new Database Instance with the specified File Name
   * @param {string} fileName - The Name of the Database File
   */
  constructor(private fileName: string) {
    if (!fileName.endsWith('.db')) {
      fileName += '.db';
    }
    this.fileName = fileName;
    this.connect();
  }

  private connect(): void {
    try {
      const databaseFile = fs.readFileSync(this.fileName, 'utf-8');
      this.data = JSON.parse(databaseFile);
    } catch (error) {
      this.data = [];
    }

  }

  private saveData(): void {
    const dataAsString = JSON.stringify(this.data, null, 2);
    fs.writeFileSync(this.fileName, dataAsString);
  }

  /**
   * Creates a Model for Data Entities based on the provided Schema
   * 
   * @param {T} schema - The Schema definition for the Data model
   * @extends {Record<string,any>} 
   * @example
   * const User = myDatabase.createModel<{ name: string; age: number }>({ name: '', age: 0 });
   */
  createModel<T extends Record<string, any>>(schema: T) {
    return {
      /**
       * Creates a new Data Object based on the Schema and adds it into the Database
       * @param {T} data- The Data to be Added
       * @returns The created data object with a unique ID
       * @example
       * const user1 = User.create({ name: 'User 1', age: 30 });
       */
      create: (data: T): DataModel => {
        const newDataObject: DataModel = { id: uuidv4(), ...data };
        this.data.push(newDataObject);
        this.saveData();
        return newDataObject;
      },

      /**
       * Finds Data Objects in the Database based on a filter
       * @param {Partial<T>} filter - The Filter criteria to match data objects  
       * @returns An array of data objects that match the filter
       * @example
       * const userWithNameUser1 = User.find({ name: 'User 1' });
       */
      find: (filter: Partial<T>): DataModel[] => {
        return this.data.filter((data) => {
          for (const key in filter) {
            if (filter[key] !== data[key]) return false;
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
      findById: (id: string): DataModel | undefined => {
        return this.data.find((data) => data.id === id);
      },

      /**
       * Updates a Data Object in the Database based on its unique ID
       * @param {string} id - The ID of the Data Object to update
       * @param {Partial<T>} update - The Partial Data to update the existing object
       * @returns The updated data object or null if the ID was not found
       * @example
       * const updatedUser = User.update(user1.id, { age: 35 });
       */
      update: (id: string, update: Partial<T>): DataModel | null => {
        const index = this.data.findIndex((data) => data.id === id);
        if (index !== -1) {
          this.data[index] = { ...this.data[index], ...update };
          this.saveData();
          return this.data[index];
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
      delete: (id: string): string | null => {
        const index = this.data.findIndex((data) => data.id === id);
        if (index !== -1) {
          const deletedId = this.data[index].id;
          this.data.splice(index, 1);
          this.saveData();
          return deletedId;
        }
        return null;
      },

    };

  }

}

/**
 * A class to handle encryption and decryption
 */
export class DataEncryptor {
  /**
   * Encrypts data by removing characters like [], {}, (), and : and applying character mapping.
   * @param {string} data - The data to be encrypted.
   * @returns The encrypted data.
   * @example
   * const encryptedData = DataEncryptor.encrypt('Hello');
   */
  static encrypt(data: string): string {
    const charMap: { [key: string]: string } = {
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
    const transformedData = data.replace(/[\[\]\{\}\(\):]/g, '');
    return transformedData
      .split('')
      .map((char) => (charMap[char] ? charMap[char]: char))
      .join('');
  }

  /**
   * Decrypts data by reversing the character transformations and adding brackets, braces, and colons.
   * @param {string} encryptedData - The data to be decrypted.
   * @returns The decrypted data.
   * @example
   * const decryptedData = DataEncryptor.decrypt('Hello');
   */
  static decrypt(encryptedData: string): string {
    const charMap = Object.entries(DataEncryptor.charMap).reduce(
      (map, [key, value]) => {
        map[value] = key;
        return map;
      },
      {} as { [key: string]: string }
    );
    return encryptedData
      .split('')
      .map((char) => (charMap[char] ? charMap[char] : char))
      .join('');
  }
  static charMap(charMap: any) {
    throw new Error('Method not implemented.');
  }

}
}
