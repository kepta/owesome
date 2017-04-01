// export const SERVER_URL = 'http://localhost:5000/page';
export const SERVER_URL = true
    ? 'http://35.185.210.46:4050/page'
    : 'http://localhost:4050/page';
export const OSC_URL = 'https://planet.osm.org/replication/minute/002';
export const PAGE_LIMIT = 800;
export const THREADS = 8;
export const defaultQuery = `
# Keyboard shortcuts:
#   Run Query:  Ctrl-Enter
#   Auto Complete:  Ctrl-Space (or just start typing)
query ($dateFrom: String, $dateTo: String){
  days(dateFrom: $dateFrom, dateTo: $dateTo) {
    day
    users(users:["andygol"]) {
      user
      nodeCount
      wayCount
      changeset
    }
  }
}
`;
