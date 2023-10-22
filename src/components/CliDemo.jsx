import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CliDemo = () => {
  const router = useRouter();
  const [playerInitialized, setPlayerInitialized] = useState(false);

  useEffect(() => {
    const initializeAsciinema = () => {
      if (window.AsciinemaPlayer && !playerInitialized) {
        window.AsciinemaPlayer.create(
          `${router.basePath}/assets/asciinema/phase-cli-demo.cast`,
          document.getElementById('player-container'),
          {
            // cols: 96,
            rows: 35,
            autoplay: true,
            loop: true,
            fit: false,
            // terminalFontSize: 'medium',
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
  }, []);

  return (
    <div>
    <div
        id="player-container"
        className="max-w-full text-[9px] sm:text-sm md:text-base xl:text-lg"
      ></div>
      </div>
  );
};

export default CliDemo;
