export function formatQuery(results, def = null) {
  return { results: results.rowCount ? results.rows : def }
}

export function formatSingle(results, def = null) {
  return { results: results.rowCount ? results.rows[0] : def }
}
