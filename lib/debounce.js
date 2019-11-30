
exports.debounce = (func, sleep) => {
  let timeoutId

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(func, sleep, ...args)
  }
}
