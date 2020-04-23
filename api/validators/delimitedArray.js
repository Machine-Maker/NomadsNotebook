export default (oneOfArray, errMsg, delimiter = ',') => (value) => {
  const inputArray = value.split(delimiter)
  for (const i of inputArray) if (!oneOfArray[i]) throw new Error(errMsg.replace('$1', i))
  return true
}
