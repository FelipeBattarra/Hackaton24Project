import L from 'leaflet'
import 'leaflet.heat'; // Importa o plugin de heatmap
import React, { useEffect } from 'react'
import requests from '../../tools/axios'

// Criar ícones personalizados
const userIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // ícone vermelho para o usuário
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

function Geofelicidade() {
  useEffect(() => {
    const initializeMap = (lat, lng) => {
      const map = L.map('map').setView([lat, lng], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      return map
    }

    const addHeatMap = (map, data) => {
      const heatData = data.map((item) => {
        const { latitude, longitude, score } = item
        return [latitude, longitude, score / 10]
      })

      L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1,
      }).addTo(map)
    }

    const fetchHappinessData = async (map) => {
      try {
        const response = await requests.get('/geo/get-happiness/')
        const happinessData = response.data

        addHeatMap(map, happinessData)
      } catch (error) {
        console.error('Erro ao buscar os dados de felicidade:', error)
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          const map = initializeMap(latitude, longitude)

          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('Você está aqui!')
            .openPopup()

          fetchHappinessData(map)
        },
        (error) => {
          console.error('Erro ao obter a localização:', error)

          const map = initializeMap(-23.55052, -46.633308)

          fetchHappinessData(map)
        },
      )
    } else {
      const map = initializeMap(-23.55052, -46.633308)

      fetchHappinessData(map)
    }
  }, [])

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>
}

export default Geofelicidade
