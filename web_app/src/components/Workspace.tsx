import { useEffect } from "react"
import Editor from "./Editor"
import { currentModel } from "@/lib/api"
import { useStore } from "@/lib/states"

const Workspace = () => {
  const [file, params, updateSettings] = useStore((state) => [
    state.file,
    state.params,
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
      {file ? <Editor file={file} params={params} /> : <></>}
    </>
  )
}

export default Workspace
