import { useState, useEffect } from 'react';
import { useStore } from "@/lib/states"
import useSaveChanges from "@/hooks/useSaveChanges"
import Instructions from "./Instructions"
import CloseButton from './CloseButton';
import { Button } from "@/components/ui/button"
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  file: File
}

const Header = (props: HeaderProps) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing] = useStore((state) => [state.getIsProcessing()]);
  const { file } = props

  // Fetch renders from the store
  const renders = useStore((state) => state.editorState.renders) || [];

  // Initialize saveChanges, isSaving, isSaved using the useSaveChanges hook
  const { saveChanges, isSaving, isSaved } = useSaveChanges(file, renders);

  useEffect(() => {
    const dialogClosed = sessionStorage.getItem('dialogClosed');

    if (dialogClosed === 'true') {
      setIsDialogOpen(false);
    } else {
      setIsDialogOpen(true); // Open the dialog by default if not closed
    }  
  }, []);

  return (
    <header className="h-[60px] px-6 py-4 absolute top-[0] flex justify-between items-center w-full z-20 border-b backdrop-filter backdrop-blur-md bg-background/70">
      <div className="flex gap-1">
        <span className="font-bold text-l">{t('editor.header.title')}</span>
      </div>
      <div className="flex gap-2">
          <Button
            disabled={isProcessing || isSaving || isSaved || renders.length === 0}
            onClick={saveChanges}
          >
            {isSaving ? (
            <>
              <div className="inline-block w-4 h-4 border-2 border-black rounded-full spinner-border animate-spin border-t-transparent"></div>
                {t('editor.saving')}...
            </>
          ) : (
            <>
            {t('editor.save')}
            </>
          )}
          </Button>
        <Instructions isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
        <CloseButton />
      </div>
    </header>
  );
};

export default Header;