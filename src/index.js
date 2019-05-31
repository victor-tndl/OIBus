const cluster = require('cluster')

const VERSION = require('../package.json').version

const { parseArgs, checkOrCreateConfigFile } = require('./services/config.service')
const Engine = require('./engine/Engine.class')

if (cluster.isMaster) {
  // Master role is nothing except launching a worker and relauching another
  // one if exit is detected (typically to load a new configuration)
  console.info(`Starting OIBus version: ${VERSION}`)
  cluster.fork()

  cluster.on('exit', (worker, code, signal) => {
    if (signal) {
      console.info(`Worker ${worker.process.pid} was killed by signal: ${signal}`)
    } else {
      console.error(`Worker ${worker.process.pid} exited with error code: ${code}`)
    }

    cluster.fork()
  })
} else {
  // this condition is reached only for a worker (i.e. not master)
  // so this is here where we execute the OIBus Engine
  const args = parseArgs() || {} // Arguments of the command
  const { config = './oibus.json' } = args // Get the configuration file path

  checkOrCreateConfigFile(config) // Create default config file if it doesn't exist
  const engine = new Engine(config)
  engine.start()
}
