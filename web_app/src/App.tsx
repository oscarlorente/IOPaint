import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import getInputImage from "@/hooks/getInputImage"
import { keepGUIAlive } from "@/lib/utils"
import { getServerConfig } from "@/lib/api"
import Workspace from "@/components/Workspace"
import { useStore } from "./lib/states"
import { useWindowSize } from "react-use"

function Home() {
  const [updateAppState, setServerConfig, setFile] = useStore((state) => [
    state.updateAppState,
    state.setServerConfig,
    state.setFile,
  ])

  const [searchParams] = useSearchParams()
  const [params, setParams] = useState({
    agencyId: searchParams.get("agencyId")!,
    userToken: searchParams.get("userToken")!,
    tourId: searchParams.get("tourId")!,
    imageId: searchParams.get("imageId")!,
    imageName: searchParams.get("imageName")!
  });

  useEffect(() => {
    const agencyId = searchParams.get("agencyId")!;
    const userToken = searchParams.get("userToken")!;
    const tourId = searchParams.get("tourId")!;
    const imageId = searchParams.get("imageId")!;
    const imageName = searchParams.get("imageName")!;
  
    setParams({ agencyId, userToken, tourId, imageId, imageName });
  }, [searchParams]);

  const userInputImage = getInputImage(params.agencyId, params.userToken, params.tourId, params.imageId, params.imageName)

  const windowSize = useWindowSize()

  useEffect(() => {
    if (userInputImage) {
      setFile(userInputImage)
    }
  }, [userInputImage, setFile])

  useEffect(() => {
    updateAppState({ windowSize })
  }, [windowSize])

  useEffect(() => {
    const fetchServerConfig = async () => {
      const serverConfig = await getServerConfig()
      setServerConfig(serverConfig)
      if (serverConfig.isDesktop) {
        // Keeping GUI Window Open
        keepGUIAlive()
      }
    }
    fetchServerConfig()
  }, [])

  return (
    // <main className="flex flex-col items-center justify-between w-full min-h-screen bg-black">
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-[radial-gradient(circle_at_1px_1px,_#8e8e8e8e_1px,_transparent_0)] [background-size:20px_20px] bg-repeat">
      <Workspace />
    </main>
  )
}

export default Home
