import { CButton } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import showdown from 'showdown'
import requests from '../../tools/axios'

function Conselhos() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchAdvice() {
      const response = await requests.get('/gpt/get-advice/')
      setData(response.data.advice)
    }

    fetchAdvice()
  }, [])

  async function fetchNewAdvice() {
    setData(null)
    const response = await requests.get('/gpt/get-advice/?new=true')
    setData(response.data.advice)
  }

  if (!data) {
    return <div>Solicitando resposta à LLama... (pode demorar um pouco)</div>
  }

  const converter = new showdown.Converter()
  const htmlContent = converter.makeHtml(data)

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <CButton color="primary" onClick={fetchNewAdvice}>
          Gerar novo conselho
        </CButton>
      </div>
      <p dangerouslySetInnerHTML={{ __html: htmlContent }}></p>
    </>
  )
}

export default Conselhos
