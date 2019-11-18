import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap'
import { OIbText, OIbInteger, OIbSelect, OIbScanMode, OIbTitle } from '../../client/components/OIbForm'
import validation from './Modbus.validation'

const ModbusForm = ({ dataSource, onChange }) => (
  <>
    <OIbTitle title="Modbus settings">
      <p>This protocol is in restricted release. Please contact Optimistik</p>
    </OIbTitle>
    <Row>
      <Col md="4">
        <OIbText
          label="Host"
          onChange={onChange}
          value={dataSource.Modbus.host}
          valid={validation.Modbus.host}
          name="Modbus.host"
          defaultValue=""
          help={<div>IP address of the Modbus source</div>}
        />
      </Col>
      <Col md="4">
        <OIbInteger
          label="Port"
          onChange={onChange}
          value={dataSource.Modbus.port}
          valid={validation.Modbus.port}
          name="Modbus.port"
          defaultValue={502}
          help={<div>Port number of the Modbus source</div>}
        />
      </Col>
    </Row>
  </>
)

ModbusForm.propTypes = { dataSource: PropTypes.object.isRequired, onChange: PropTypes.func.isRequired }

/**
 * The following keys will be used by the **ConfigurePoints** form to display the headers
 * and the rows that are specific for each protocol.
 * Note: alternatively, we can send a "fake" point array to get the headers
 * using: ProtocolForm.renderPoints([{}],()=>null)[0].map(el => el.value.props.title)
 * @returns {array} Headers for each column
 */
ModbusForm.renderHeaders = () => ['Point Id', 'ScanMode', 'Address', 'Type']
ModbusForm.renderPoints = (points, onChange) => {
  const rows = points.map((point, index) => [
    {
      name: `points.${index}.pointId`,
      value: (
        <OIbText
          title="Point Id"
          name={`points.${index}.pointId`}
          value={point.pointId}
          valid={validation.Modbus.points.pointId}
          onChange={onChange}
          defaultValue=""
        />
      ),
    },
    {
      name: `points.${index}.scanMode`,
      value: (
        <OIbScanMode
          name={`points.${index}.scanMode`}
          scanMode={point.scanMode}
          onChange={onChange}
        />
      ),
    },
    {
      name: `points.${index}.address`,
      value: (
        <OIbText
          title="Address"
          name={`points.${index}.address`}
          value={point.address}
          valid={validation.Modbus.points.address}
          onChange={onChange}
          defaultValue=""
        />
      ),
    },
    {
      name: `points.${index}.type`,
      value: (
        <OIbSelect
          onChange={onChange}
          options={['boolean', 'number']}
          option={point.type}
          name={`points.${index}.type`}
          defaultOption="boolean"
        />
      ),
    },
  ])
  return rows
}

export default ModbusForm