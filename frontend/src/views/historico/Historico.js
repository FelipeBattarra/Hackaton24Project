import { CCard, CCardBody, CCardHeader, CCardTitle, CCol, CRow } from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import React, { useEffect, useState } from 'react'
import requests from '../../tools/axios'

function Historico() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const response = await requests.get('/form/get-user-submissions/')

      setData(response.data)
    }

    fetchData()
  }, [])

  if (!data) {
    return <div>Carregando...</div>
  }

  return (
    <>
      <CRow className="mb-3">
        <CCol sm="6">
          <CCard>
            <CCardHeader>
              <CCardTitle>Última Pontuação</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <h1>{data.at(-1).score.toFixed(1)}</h1>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm="6">
          <CCard>
            <CCardHeader>
              <CCardTitle>Pontuação Média</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <h1>{(data.reduce((acc, item) => acc + item.score, 0) / data.length).toFixed(1)}</h1>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CCard>
        <CCardBody>
          <CChart
            type="line"
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: '#fff',
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: '#fff',
                  },
                },
                y: {
                  ticks: {
                    color: '#fff',
                  },
                },
              },
            }}
            data={{
              labels: data.map((item) => item.submission_date),
              datasets: [
                {
                  label: 'Felicidade',
                  backgroundColor: 'cyan',
                  borderColor: 'cyan',
                  data: data.map((item) => item.score),
                },
              ],
            }}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Historico
