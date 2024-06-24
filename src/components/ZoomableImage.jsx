import Zoom from 'react-medium-image-zoom';
import Image from 'next/image';

const ZoomableImage = ({ src, alt, width, height }) => (
  <div className="inline-block mr-5">
    <Zoom zoomMargin={45}>
      <Image src={src} alt={alt} width={width} height={height} layout="intrinsic" className="rounded-lg" />
    </Zoom>
  </div>
);

export default ZoomableImage;
