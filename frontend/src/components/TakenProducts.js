import { useSelector } from 'react-redux'
import RegistryItem from './RegistryItem'

export default function TakenProducts() {
  const userItems = useSelector(state => state.userItems.data)
  const user = useSelector(state => state.auth.user)

  console.log(userItems)
  return (
    <>
      {userItems.map(item => (
        <RegistryItem
          key={item.id}
          data={item}
          disabled={item.takenBy && item.takenBy !== user.id}
          // color={registryData.color}
        />
      ))}
    </>
  )
}
