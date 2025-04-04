import { useState } from 'react'
import Test1 from './Components/Test1'
import AllRouter from './Components/AllRouter'
// import CustomHeader from './Components/CustomHeader'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AllRouter/>
    </>
  )
}

export default App
