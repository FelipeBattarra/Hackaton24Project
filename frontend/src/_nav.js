import { cilHistory, cilLightbulb, cilMap, cilSmile, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavItem, CNavTitle } from '@coreui/react'
import React from 'react'

const _nav = [
  {
    component: CNavItem,
    name: 'Histórico',
    to: '/historico',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Medir Felicidade',
    to: '/medir-felicidade',
    icon: <CIcon icon={cilSmile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Conselhos',
    to: '/conselhos',
    icon: <CIcon icon={cilLightbulb} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'PRO',
    },
  },
  {
    component: CNavItem,
    name: 'Perfil',
    to: '/perfil',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    name: 'Empresas',
    component: CNavTitle,
  },
  {
    component: CNavItem,
    name: 'Geofelicidade',
    to: '/geofelicidade',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'PRO',
    },
  },
]

export default _nav
