/**
 * Colecciones
 */
const collections = [
    ['clients', {
        fullname: '',
        contactNumber: '',
        hasWhatsapp: false,
        businessName: '',
        businessAddress: '',
        businessGeo: '',
    }],
    ['catalog_products', {
        name: '',
        price: 0.00,
        description: '',
    }],
    ['catalog_categories', {
        name: '',
        description: '',
        products: [],
    }],
    ['utils', {
        key: '',
        value: '',
    }]
];

/**
 * CONFIGURACIÓN DE LA BASE DE DATOS
 */
const DB_CONFIG = {
    name: 'AppDatabase',
    version: 1,
    collections: collections
}

export default DB_CONFIG;