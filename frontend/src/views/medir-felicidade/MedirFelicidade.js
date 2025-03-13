import { cilArrowLeft, cilArrowRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CProgress } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import requests from '../../tools/axios'

const options = [
  { value: 1, text: 'Discordo completamente' },
  { value: 2, text: 'Discordo moderadamente' },
  { value: 3, text: 'Discordo minimamente' },
  { value: 4, text: 'Concordo minimamente' },
  { value: 5, text: 'Concordo moderadamente' },
  { value: 6, text: 'Concordo completamente' },
]

function prepareQuestions(data) {
  const newData = []
  data.forEach((item) => {
    newData.push({
      ...item,
      answer: null,
    })
  })
  return newData
}

function CurrentQuestion({ currentQuestion, data, setData }) {
  const { text, answer } = data[currentQuestion]

  function handleAnswer(value) {
    const newData = [...data]
    newData[currentQuestion].answer = value
    setData(newData)
  }

  return (
    <>
      <p className="text-center fs-4 text-secondary">
        {currentQuestion + 1}/{data.length}
      </p>
      <p className="text-center fs-3 text-primary">{text}</p>
      <div className="d-grid gap-2">
        {options.map((option) => (
          <CButton
            key={option.value}
            color={answer === option.value ? 'primary' : 'secondary'}
            onClick={() => handleAnswer(option.value)}
          >
            {option.text}
          </CButton>
        ))}
      </div>
    </>
  )
}

function NavigationButtons({ currentQuestion, setCurrentQuestion, data, setData, setScore }) {
  const allAnswered = data.every((item) => item.answer)

  async function handleSave() {
    const answers = data.map((item) => ({
      question: item.id,
      answer: item.answer,
    }))
    const response = await requests.post('/form/submit-answers/', answers)
    if (response.data.success) {
      setScore(response.data.score)
    } else {
      alert('Erro ao salvar respostas! Tente novamente.')
    }
  }

  return (
    <div className="d-flex justify-content-between">
      <CButton
        color="primary"
        disabled={currentQuestion === 0}
        onClick={() => setCurrentQuestion(currentQuestion - 1)}
      >
        <CIcon icon={cilArrowLeft} />
        <span className="d-inline-block ml-1">Anterior</span>
      </CButton>
      <CButton color="primary" disabled={!allAnswered} onClick={handleSave}>
        Finalizar
      </CButton>
      <CButton
        color="primary"
        disabled={currentQuestion === data.length - 1}
        onClick={() => setCurrentQuestion(currentQuestion + 1)}
      >
        <span className="d-inline-block mr-1">Próxima</span>
        <CIcon icon={cilArrowRight} />
      </CButton>
    </div>
  )
}

function ShowScore({ score }) {
  const integerScore = Math.floor(score)
  let result

  if (integerScore < 3) {
    result = `Se você respondeu honestamente e obteve esse score
baixo, recomendamos que procure observar seu estilo de
vida e procure ajuda profissional para compreender melhor
esses sentimentos e estabelecer uma avaliação mais
apurada desse momento.`
  } else if (integerScore < 5) {
    result = `Um score entre 3 e 5 pode ser uma média numérica exata
de suas respostas de felicidade e infelicidade. Fortaleça,
ainda mais, estes sentimentos com estilo de vida saudável,
alimentação, laser, trabalho, atividades físicas e relações
humanas afetivas e próximas, para se tornar uma pessoa
ainda mais feliz.`
  } else {
    result = `Se sentir feliz tem mais benefícios do que apenas sentir-se
bem, porque a felicidade está relacionada a saúde, qualidade dos relacionamentos e desempenho acadêmico
e profissional.`
  }

  return (
    <CCard className="mb-4">
      <CCardBody>
        <p className="text-center fs-3 text-primary">Seu score é: {integerScore}</p>
        <p className="text-center fs-5">{result}</p>
      </CCardBody>
    </CCard>
  )
}

function MedirFelicidade() {
  const [data, setData] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(null)

  useEffect(() => {
    // Pegar as questões do back-end
    async function fetchBackend() {
      const { data } = await requests.get('/form/get-all-questions/')
      setData(prepareQuestions(data))
    }

    fetchBackend()
  }, [])

  if (!data) {
    return null
  }

  if (score) {
    return <ShowScore score={score} />
  }

  const percentage = Math.floor((data.filter((item) => item.answer).length / data.length) * 100)

  return (
    <>
      <CProgress value={percentage} className="mb-4" />
      <CCard className="mb-4">
        <CCardBody>
          <CurrentQuestion currentQuestion={currentQuestion} data={data} setData={setData} />
        </CCardBody>
      </CCard>
      <NavigationButtons
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        data={data}
        setData={setData}
        setScore={setScore}
      />
    </>
  )
}

export default MedirFelicidade
