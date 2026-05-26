import {Navigate} from 'react-router-dom'

const ProtectedRoute = props => {
  const {children} = props

  const token = localStorage.getItem('token')

  if (token === null) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute