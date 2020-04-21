export function formatQuery(results) {
  return { results: results.rowCount ? results.rows : null }
}

export function formatSingle(results) {
  return { results: results.rowCount ? results.rows[0] : null }
}
