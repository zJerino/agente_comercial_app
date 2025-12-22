/**
 * CLASE PARA MANEJO DE INDEXEDDB
 */
import defaultConfig from '../configs/database';

class IDBManager {
    static instance = null;
    /**
     * @return IDBManager
     */
    static getInstance(config) {
        if (!IDBManager.instance) {
            IDBManager.instance = new IDBManager(config);
        }

        return IDBManager.instance;
    }

    constructor(config) {
        this.db = null;
        this.isReady = false;
        this.config = config;
    }

    init() {
        return new Promise((resolve, reject) => {
            if (this.isReady) return resolve(this.db);

            const request = indexedDB.open(this.config.name, this.config.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                this.config.collections.forEach(storeDef => {
                    if (typeof storeDef === 'string') {
                        storeDef = [storeDef, {}];
                    } else if (!Array.isArray(storeDef) || storeDef.length !== 2 || typeof storeDef[0] !== 'string' || typeof storeDef[1] !== 'object') {
                        return;
                    }

                    let [ storeName, indexes ] = storeDef;

                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, {
                            keyPath: (indexes.hasOwnProperty('key') ? 'key' : 'id'),
                            autoIncrement: !indexes.hasOwnProperty('key')
                        });

                        Object.keys(indexes).forEach((key, val) => {
                            if (typeof key !== 'string' || key === 'key') return;

                            // Seguramente se me olvide: pero si la primera letra es mayuscula sera un valor unico
                            store.createIndex(key, key, { unique: /^[A-Z]/.test(key) });
                        });

                        store.createIndex('created_at', 'created_at', { unique: false });
                    }
                });
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.isReady = true;
                console.log('[DB] Contectado');
                resolve(this.db);
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    // Helper interno con validación de colección
    _getTransaction(storeName, mode) {
        if (!this.db) throw new Error("DB no inicializada.");
        if (!this.db.objectStoreNames.contains(storeName)) {
            throw new Error(`La colección '${storeName}' no existe.`);
        }
        return this.db.transaction([storeName], mode).objectStore(storeName);
    }

    add(collectionName, data) {
        return new Promise((resolve, reject) => {
            try {
                const store = this._getTransaction(collectionName, 'readwrite');
                const payload = {
                    ...data,
                    created_at: new Date().toISOString(),
                    updated_at: null
                };
                const request = store.add(payload);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (e) { reject(e); }
        });
    }

    get(collectionName, id) {
        return new Promise((resolve, reject) => {
            try {
                const request = this._getTransaction(collectionName, 'readonly').get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (e) { reject(e); }
        });
    }

    getAll(collectionName) {
        return new Promise((resolve, reject) => {
            try {
                const request = this._getTransaction(collectionName, 'readonly').getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (e) { reject(e); }
        });
    }

    async update(collectionName, data) {
        if (!data.id) throw new Error("Se requiere ID");
        try {
            const current = await this.get(collectionName, data.id);
            return new Promise((resolve, reject) => {
                const store = this._getTransaction(collectionName, 'readwrite');
                const payload = {
                    ...current,
                    ...data,
                    updated_at: new Date().toISOString()
                };
                const request = store.put(payload);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (e) { throw e; }
    }

    remove(collectionName, id) {
        return new Promise((resolve, reject) => {
            try {
                const request = this._getTransaction(collectionName, 'readwrite').delete(id);
                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
            } catch (e) { reject(e); }
        });
    }

    count(collectionName) {
        return new Promise((resolve, reject) => {
            try {
                const request = this._getTransaction(collectionName, 'readonly').count();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (e) { reject(e); }
        });
    }

    search(collectionName, predicateFn) {
        return new Promise((resolve, reject) => {
            try {
                const results = [];
                const store = this._getTransaction(collectionName, 'readonly');
                const request = store.openCursor();

                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        if (predicateFn(cursor.value)) results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };
                request.onerror = () => reject(request.error);
            } catch (e) { reject(e); }
        });
    }
}

export default IDBManager;

export const DBInstance = IDBManager.getInstance(defaultConfig);