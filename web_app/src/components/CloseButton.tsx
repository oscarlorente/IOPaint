import { IconButton } from "./ui/button"
import { X } from 'lucide-react';

const CloseButton = () => {
  const handleCloseClick = () => {
    window.parent.postMessage({ type: 'photo_eraser_closed' }, '*');
  };

  return (
    <IconButton tooltip="Close" onClick={handleCloseClick}>
      <X />
    </IconButton>
  );
};

export default CloseButton;