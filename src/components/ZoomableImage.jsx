import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Image from 'next/image';
import styles from '@/styles/ZoomableImage.module.css';

const ZoomableImage = ({ src, alt, width, height }) => (
  <div className={styles.imageWrapper}>
    <Zoom overlayBgColorEnd="rgba(0, 0, 0, 0.9)" classDialog={styles.zoomOverlay}>
      <Image src={src} alt={alt} width={width} height={height} layout="intrinsic" />
    </Zoom>
  </div>
);

export default ZoomableImage;
