import Home from "./components/Home"
import { CommentsProvider } from "./context/CommentsContext"
import { LikeProvider } from "./context/LikeContext"
import { SubscribeProvider } from "./context/SubscribeContext"
import { UserProvider } from "./context/userContext"
import { VideoProvider } from "./context/VideoContext"

function App() {

  return (
    <>
      <UserProvider>
        <VideoProvider>
          <LikeProvider>
            <SubscribeProvider>
              <CommentsProvider>
                <Home></Home>
              </CommentsProvider>
            </SubscribeProvider>
          </LikeProvider>
        </VideoProvider>
      </UserProvider>
    </>
  )
}

export default App
