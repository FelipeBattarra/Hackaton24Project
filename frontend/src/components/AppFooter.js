import { CFooter } from '@coreui/react'
import React from 'react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; 2024 Street Programming.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
