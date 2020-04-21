export default class ApiError extends Error {
  constructor(message, status = 500, code = -1) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.code = code
  }
}
