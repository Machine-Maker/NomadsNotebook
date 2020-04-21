module.exports = async (req, res, client, { formatQuery }) => {
  const result = await client.query('SELECT * FROM users')
  return formatQuery(result)
}
