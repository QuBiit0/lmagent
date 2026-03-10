// Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // LCP image
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>

// Lazy load below-fold images
<Image
  src="/feature.jpg"
  alt="Feature"
  width={400}
  height={300}
  loading="lazy"
/>