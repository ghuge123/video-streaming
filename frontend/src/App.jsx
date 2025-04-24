import Home from "./components/Home"
import { UserProvider } from "./context/userContext"
import { VideoProvider } from "./context/VideoContext"

function App() {

  return (
    <>
      <UserProvider>
        <VideoProvider>
          <Home></Home>
        </VideoProvider>
      </UserProvider>
    </>
  )
}

export default App
