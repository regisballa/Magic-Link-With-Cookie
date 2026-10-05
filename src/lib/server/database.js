// Die Bibliothek mysql2 laden (mit "promise" können wir await benutzen)
import mysql from 'mysql2/promise';

// Die Werte aus der .env-Datei lesen (nur der Server sieht sie, nie der Browser)
import {
    DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
} from '$env/static/private';

// Einen Pool erstellen: mehrere fertige Verbindungen, die immer wieder benutzt werden
const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
});

// Den Pool exportieren, damit andere Dateien ihn mit "import pool" benutzen können
export default pool;
