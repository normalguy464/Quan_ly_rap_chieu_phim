import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import Dashboard from './Components/Dashboard'
import Test1 from './Components/Test1'
import QLNhanVien from './Components/QLNhanVien/ThemNhanVien'
// import CustomHeader from './Components/CustomHeader'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Test1 />
      </div>
    </>
  )
}

export default App
