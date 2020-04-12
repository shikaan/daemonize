const { fork } = require('child_process')
const { createInterface } = require('readline')
const nodeWatch = require('node-watch')

const { debounce } = require('../lib/debounce')

const terminal = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

let fileWatcher

function launchSubprocess ({ script, delay = 2000, watch = process.cwd(), args = [] } = {}) {
  // Clear console
  console.clear()

  // Clear previous listeners
  process.stdin.removeAllListeners('keypress')
  fileWatcher && fileWatcher.close()

  // Launch process
  const subprocess = fork(script, args, { silent: false })

  // Watches for file changes and debounces the callback
  const debouncedListener = debounce((event, filename) => {
    if (event === 'update' && filename) {
      subprocess.kill('SIGKILL')
      launchSubprocess({ script, delay, watch, args })
    }
  }, delay)
  fileWatcher = nodeWatch(watch, { recursive: true }, debouncedListener)

  // Handle subprocess exits
  subprocess.on('exit', (code, signal) => {
    if (code === 0) {
      console.log('> Clean exit')
      console.log("> Enter 'rs' to restart")

      terminal.removeAllListeners('line')
      terminal.on('line', line => {
        if (line.includes('rs')) {
          launchSubprocess({ script, delay, watch, args })
        }
      })
    } else if (signal !== 'SIGKILL') {
      console.log('> Waiting for changes to restart...')
    }

    subprocess.kill('SIGKILL')
  })
}

module.exports = {
  launchSubprocess
}
