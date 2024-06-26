import { useState, useEffect } from 'react';
import { Info as InfoIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { IconButton } from './ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';
import CheckboxItem from './ui/checkbox';
import { useTranslation } from 'react-i18next';

interface InstructionsProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function Instructions({ isDialogOpen, setIsDialogOpen }: InstructionsProps) {
  const { t } = useTranslation();

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Check sessionStorage for 'dialogClosed' key
    const dialogClosed = sessionStorage.getItem('dialogClosed');
    if (dialogClosed === 'true') {
      setIsChecked(true);
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open && isChecked) {
      sessionStorage.setItem('dialogClosed', 'true');
    }
    setIsDialogOpen(open);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    // Update sessionStorage based on checkbox state
    if (checked) {
      sessionStorage.setItem('dialogClosed', 'true');
    } else {
      sessionStorage.removeItem('dialogClosed');
    }
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <IconButton tooltip={t('editor.header.infoButton')}>
          <InfoIcon />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t('editor.instructions.title')}</DialogTitle>
        <DialogDescription>{t('editor.instructions.description')}</DialogDescription>
        <video
          src="https://floorfymdpd.s3.eu-west-1.amazonaws.com/global/videos/photoEraser_video.webm"
          autoPlay
          loop
          muted
          className="rounded-lg"
        />
        <CheckboxItem label="editor.instructions.checkboxText" checked={isChecked} onCheckedChange={handleCheckboxChange} />
      </DialogContent>
    </Dialog>
  );
}

export default Instructions;