import { useState } from 'react';

const Header = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <header className="h-[60px] px-6 py-4 absolute top-[0] flex justify-between items-center w-full z-20 border-b backdrop-filter backdrop-blur-md bg-primary/70">
      <div className="flex gap-1">
        <h1 className="text-xl font-bold">Floorfy - </h1>
        <h1 className="text-xl font-bold">Use the brush to highlight and remove unwanted elements from your images!</h1>
      </div>
      <div className="flex gap-1 ">
        <button onClick={togglePopup} className="p-2">
          <h1 className="text-xl font-bold">Instructions</h1>
        </button>
      </div>
    </header>
  );
};

export default Header;