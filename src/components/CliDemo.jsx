import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CliDemo = ({ castFile, terminalFontSize}) => {
  const router = useRouter();
  const [playerInitialized, setPlayerInitialized] = useState(false);

  // Generate a unique ID for the player container
  const uniqueId = `player-container-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const initializeAsciinema = () => {
      if (window.AsciinemaPlayer && !playerInitialized) {
        window.AsciinemaPlayer.create(
          `${router.basePath}/assets/asciinema/${castFile}`,
          document.getElementById(uniqueId),
          {
            //cols: 150,
            rows: 35,
            autoplay: true,
            loop: true,
            fit: false,
            terminalFontSize: terminalFontSize,
          }
        );
        setPlayerInitialized(true);
      }
    };

    if (window.AsciinemaPlayer) {
      initializeAsciinema();
    } else {
      window.addEventListener('load', initializeAsciinema);
    }

    return () => {
      window.removeEventListener('load', initializeAsciinema);
    };
  }, [castFile, terminalFontSize, playerInitialized, router.basePath, uniqueId]);

  return (
    <div>
      <div
        id={uniqueId}
        className="max-w-full text-[9px] sm:text-sm md:text-base xl:text-lg"
      ></div>
    </div>
  );
};

export default CliDemo;
