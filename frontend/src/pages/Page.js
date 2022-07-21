import { useSelector } from 'react-redux'
import AddList from '../components/AddList'

export default function Page() {
  const isAuthenticated = useSelector(state => state.auth.user !== undefined)

  return isAuthenticated ? <AddList /> : null
}
