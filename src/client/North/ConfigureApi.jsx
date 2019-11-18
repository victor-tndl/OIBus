import React from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from 'reactstrap'
import { ConfigContext } from '../context/configContext.jsx'
import NorthForm from './Form/NorthForm.jsx'

const ConfigureApi = () => {
  const { newConfig, dispatchNewConfig } = React.useContext(ConfigContext)
  const applications = newConfig && newConfig.north.applications // array of all defined applications
  const { applicationId } = useParams()
  const applicationIndex = applications && applications.findIndex((application) => application.applicationId === applicationId)

  const onChange = (name, value, validity) => {
    dispatchNewConfig({ type: 'update', name: `north.applications.${applicationIndex}.${name}`, value, validity })
  }
  return applications ? (
    <NorthForm
      application={applications[applicationIndex]}
      applicationIndex={applicationIndex}
      onChange={onChange}
    />
  ) : (
    <div className="spinner-container">
      <Spinner color="primary" type="grow" />
      ...loading configuration from OIBus server...
    </div>
  )
}

export default ConfigureApi