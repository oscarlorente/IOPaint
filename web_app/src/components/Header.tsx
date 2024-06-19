import { useState, useEffect } from 'react';
import Instructions from "./Instructions"
import { IconButton } from "./ui/button"
import { X } from 'lucide-react';

const Header = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);

  
  return (
    <header className="h-[60px] px-6 py-4 absolute top-[0] flex justify-between items-center w-full z-20 border-b backdrop-filter backdrop-blur-md">
      <div className="flex gap-1">
        <span className="font-bold text-l">Use the brush to highlight and remove unwanted elements from your images!</span>
      </div>
      <div className="flex gap-1 ">
        <Instructions isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
        <IconButton tooltip="Close">
          <X />
        </IconButton>
      </div>
    </header>
  );
};

export default Header;