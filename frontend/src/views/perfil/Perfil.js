import { CButton, CCard, CCardBody, CCardHeader, CForm, CFormInput } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import requests from '../../tools/axios'

function Perfil() {
  const [cep, setCep] = useState('')

  useEffect(() => {
    async function fetchCEP() {
      const { data } = await requests.get('/user/get-user-info/')
      setCep(data.cep)
    }

    fetchCEP()
  }, [])

  async function saveCEP() {
    await requests.post('/user/save-cep/', { cep })
  }

  return (
    <CCard style={{ width: '50%', margin: '0 auto' }}>
      <CCardHeader>
        <h4>Geolocalização</h4>
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CFormInput
            type="text"
            placeholder="CEP"
            label="Digite seu CEP"
            text="Apenas números"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
          <div className="d-flex justify-content-end">
            <CButton color="primary" className="mt-2" onClick={saveCEP}>
              Salvar
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default Perfil
