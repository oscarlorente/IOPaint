import { useState, useEffect } from 'react';
import Instructions from "./Instructions"
import CloseButton from './CloseButton';

const Header = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        <span className="font-bold text-l">Borrador de objetos</span>
      </div>
      <div className="flex gap-2">
        <Instructions isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
        <CloseButton />
      </div>
    </header>
  );
};

export default Header;