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
    tourId: searchParams.get("tourId")!,
    imageId: searchParams.get("imageId")!
  });

  useEffect(() => {
    const agencyId = searchParams.get("agencyId")!;
    const tourId = searchParams.get("tourId")!;
    const imageId = searchParams.get("imageId")!;
  
    setParams({ agencyId, tourId, imageId });
  }, [searchParams]);

  const userInputImage = getInputImage(params.agencyId, params.tourId, params.imageId)

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
    <main className="flex min-h-screen flex-col items-center justify-between w-full bg-black">
      <Workspace />
    </main>
  )
}

export default Home
