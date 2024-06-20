import { Info as InfoIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog"
import { IconButton } from "./ui/button"
import { DialogDescription } from "@radix-ui/react-dialog"

interface InstructionsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function Instructions({ isDialogOpen, setIsDialogOpen }: InstructionsProps) {

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      sessionStorage.setItem('dialogClosed', 'true');
    }
    setIsDialogOpen(open); // Update the state based on the open status
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <IconButton tooltip="Help">
          <InfoIcon />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>¡New photo eraser editor!</DialogTitle>
        <DialogDescription>
          Use the brush to highlight and remove unwanted elements from your images!
        </DialogDescription>
        <video 
          src="https://floorfymdpd.s3.eu-west-1.amazonaws.com/global/videos/videocallLaptop_video.webm" 
          autoPlay 
          loop 
          muted
          className="rounded-lg"
        />
      </DialogContent>
    </Dialog>
  )
}

export default Instructions