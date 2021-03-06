const fs = require('fs/promises')
const path = require('path')

const ApiHandler = require('../ApiHandler.class')

class FileWriter extends ApiHandler {
  /**
   * Constructor for FileWriter
   * @constructor
   * @param {Object} applicationParameters - The application parameters
   * @param {Engine} engine - The Engine
   * @return {void}
   */
  constructor(applicationParameters, engine) {
    super(applicationParameters, engine)
    this.canHandleValues = true
    this.canHandleFiles = true

    this.outputFolder = path.resolve(applicationParameters.FileWriter.outputFolder)
    this.prefixFileName = applicationParameters.FileWriter.prefixFileName ?? ''
    this.suffixFileName = applicationParameters.FileWriter.suffixFileName ?? ''
  }

  /**
   * Handle values by writing them to a file.
   * @param {object[]} values - The values
   * @return {Promise} - The handle status
   */
  async handleValues(values) {
    this.logger.silly(`Link handleValues() call with ${values.length} values`)
    const fileName = `${this.prefixFileName}${this.application.applicationId}-${new Date().getTime() + this.suffixFileName}.json`
    const cleanedValues = values.map((value) => ({
      timestamp: value.timestamp,
      data: value.data,
      pointId: value.pointId,
    }))
    const data = JSON.stringify(cleanedValues)
    try {
      await fs.writeFile(path.join(this.outputFolder, fileName), data)
      return values.length
    } catch (error) {
      this.logger.error(`Error handling values, ${error}`)
      return ApiHandler.STATUS.LOGIC_ERROR
    }
  }

  /**
   * Handle the file.
   * @param {String} filePath - The path of the file
   * @return {Promise} - The send status
   */
  /* eslint-disable-next-line class-methods-use-this */
  async handleFile(filePath) {
    const stats = fs.statSync(filePath)
    this.logger.debug(`handleFile(${filePath}) (${stats.size} bytes)`)
    const extension = path.extname(filePath)
    let fileName = path.basename(filePath, extension)
    fileName = `${this.prefixFileName}${fileName}${this.suffixFileName}${extension}`
    try {
      await fs.copyFile(filePath, path.join(this.outputFolder, fileName))
      return ApiHandler.STATUS.SUCCESS
    } catch (error) {
      this.logger.error(`Error handling file, ${error}`)
      return ApiHandler.STATUS.LOGIC_ERROR
    }
  }
}

module.exports = FileWriter
