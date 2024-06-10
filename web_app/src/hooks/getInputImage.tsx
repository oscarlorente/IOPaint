import { API_ENDPOINT } from "@/lib/api"
import { useCallback, useEffect, useState } from "react"

export default function getInputImage(agencyId: string, tourId: string, imageName: string) {
  const [inputImage, setInputImage] = useState<File | null>(null)

  const fetchInputImage = useCallback(() => {
    const headers = new Headers()
    headers.append("pragma", "no-cache")
    headers.append("cache-control", "no-cache")
    headers.append("ngrok-skip-browser-warning", "true")

    fetch(`${API_ENDPOINT}/get_image_from_s3?agencyId=${agencyId}&tourId=${tourId}&imageName=${imageName}`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          return
        }
        const filename = res.headers
          .get("content-disposition")
          ?.split("filename=")[1]
          .split(";")[0]

        const data = await res.blob()
        if (data && data.type.startsWith("image")) {
          const userInput = new File(
            [data],
            filename !== undefined ? filename : "inputImage"
          )
          setInputImage(userInput)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [setInputImage])

  useEffect(() => {
    fetchInputImage()
  }, [fetchInputImage])

  return inputImage
}
