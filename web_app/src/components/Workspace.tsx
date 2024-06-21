import { useEffect } from "react"
import Editor from "./Editor"
import { currentModel } from "@/lib/api"
import { useStore } from "@/lib/states"
import ProgressBar from "@/components/ProgressBar"


const Workspace = () => {
  const [file, updateSettings] = useStore((state) => [
    state.file,
    state.updateSettings,
  ])

  useEffect(() => {
    const fetchCurrentModel = async () => {
      const model = await currentModel()
      updateSettings({ model })
    }
    fetchCurrentModel()
  }, [])

  return (
    <>
      {!file ?  <div className="flex items-center justify-center w-screen h-screen"><ProgressBar /></div>: <></>}
      {file ? <Editor file={file} /> : <></>}
    </>
  )
}

export default Workspace
