import { useEffect } from 'react';

export default function GoogleMapsLoader({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      window.google &&
      window.google.maps &&
      window.google.maps.places &&
      window.google.maps.geometry
    ) {
      return;
    }
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);
  return <>{children}</>;
} 