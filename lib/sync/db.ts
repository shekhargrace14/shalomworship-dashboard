// import { openDB } from 'idb';

// export async function getDB() {
//   if (typeof window === 'undefined') {
//     throw new Error('IndexedDB only available in browser');
//   }

//   return openDB('shalom-db', 1, {
//     upgrade(db) {
//       if (!db.objectStoreNames.contains('songs')) {
//         db.createObjectStore('songs', {
//           keyPath: 'id',
//         });
//       }
//     },
//   });
// }
