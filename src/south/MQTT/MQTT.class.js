const mqtt = require('mqtt')
const ProtocolHandler = require('../ProtocolHandler.class')

class MQTT extends ProtocolHandler {
  connect() {
    super.connect()
    this.listen()
  }

  listen() {
    const { MQTT: { protocol, server, port, username, password } = {}, points } = this.equipment
    this.client = mqtt.connect(
      `${protocol}://${server}`,
      { port, username, password: Buffer.from(password) },
    )
    points.forEach((point) => {
      const { MQTT: { topic } = {} } = point
      this.client.on('connect', () => {
        this.client.subscribe(topic, (err) => {
          if (err) {
            console.error(err)
          }
        })
      })

      this.client.on('message', (_topic, message) => {
        // message is Buffer
        this.engine.addValue({ data: message.toString(), timestamp: Date(), pointId: point.pointId })
        // client.end()
      })
    })
  }
}
module.exports = MQTT