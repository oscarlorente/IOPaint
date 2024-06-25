import { API_ENDPOINT } from "@/lib/api"
import { useCallback, useEffect, useState } from "react"

export default function getInputImage(bucketName: string, agencyId: string, userToken: string, tourId: string, imageId: string, imageName: string) {
  const [inputImage, setInputImage] = useState<File | null>(null)

  const fetchInputImage = useCallback(() => {
    const headers = new Headers()
    headers.append("pragma", "no-cache")
    headers.append("cache-control", "no-cache")
    headers.append("ngrok-skip-browser-warning", "true")

    fetch(`${API_ENDPOINT}/get_image_from_s3?bucketName=${bucketName}&agencyId=${agencyId}&userToken=${userToken}&tourId=${tourId}&imageId=${imageId}&imageName=${imageName}`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          console.error("Failed to fetch the image");
          return
        }

        const data = await res.blob();
        if (data && data.type.startsWith("image")) {
          const userInput = new File(
            [data],
            imageName !== undefined ? imageName : "inputImage"
          );
          setInputImage(userInput);
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