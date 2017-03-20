// export const SERVER_URL = 'http://localhost:5000/page';
export const SERVER_URL = process.env.NODE_ENV === 'production' ? 'http://138.197.85.231/page' : 'http://localhost:5000/page';
export const OSC_URL = 'https://planet.osm.org/replication/minute/002';
export const PAGE_LIMIT = 800;
export const THREADS = 6;

