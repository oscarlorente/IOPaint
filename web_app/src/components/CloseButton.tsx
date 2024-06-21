import { IconButton } from "./ui/button"
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CloseButton = () => {
  const { t } = useTranslation();
  const handleCloseClick = () => {
    window.parent.postMessage({ type: 'photo_eraser_closed' }, '*');
  };

  return (
    <IconButton tooltip={t('editor.header.closeButton')} onClick={handleCloseClick}>
      <X />
    </IconButton>
  );
};

export default CloseButton;