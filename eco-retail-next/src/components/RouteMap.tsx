"use client";
import { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { Route } from '@mui/icons-material';

interface RouteMapProps {
  from: string;
  to: string;
  routePolyline?: string;
  distance: string;
  duration: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function RouteMap({ from, to, routePolyline, distance, duration }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Define initializeMap first to avoid ReferenceError
    const initializeMap = () => {
      if (!mapRef.current || !window.google || initialized) return;
      try {
        setInitialized(true);
        // Create map
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 12,
          center: { lat: 19.076, lng: 72.8777 }, // Default to Mumbai
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });
        setMap(mapInstance);
        // Geocode addresses and add markers
        const geocoder = new window.google.maps.Geocoder();
        // Geocode origin
        geocoder.geocode({ address: from }, (results: any, status: any) => {
          if (status === 'OK') {
            const origin = results[0].geometry.location;
            // Add origin marker
            new window.google.maps.Marker({
              position: origin,
              map: mapInstance,
              title: 'Origin',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#4CAF50" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
                anchor: new window.google.maps.Point(12, 12)
              }
            });
            // Geocode destination
            geocoder.geocode({ address: to }, (destResults: any, destStatus: any) => {
              if (destStatus === 'OK') {
                const destination = destResults[0].geometry.location;
                // Add destination marker
                new window.google.maps.Marker({
                  position: destination,
                  map: mapInstance,
                  title: 'Destination',
                  icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#F44336" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" fill="white"/>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(24, 24),
                    anchor: new window.google.maps.Point(12, 12)
                  }
                });
                // Draw route polyline if available
                if (routePolyline) {
                  if (
                    window.google.maps.geometry &&
                    window.google.maps.geometry.encoding &&
                    typeof window.google.maps.geometry.encoding.decodePath === 'function'
                  ) {
                    try {
                      const path = window.google.maps.geometry.encoding.decodePath(routePolyline);
                      new window.google.maps.Polyline({
                        path: path,
                        geodesic: true,
                        strokeColor: '#4285F4', // Google Maps blue
                        strokeOpacity: 1.0,
                        strokeWeight: 5,
                        map: mapInstance
                      });
                    } catch (err) {
                      setError('Failed to decode route polyline.');
                    }
                  } else {
                    setError('Google Maps geometry library is not loaded. Please try again.');
                  }
                } else {
                  // Draw straight line if no polyline
                  new window.google.maps.Polyline({
                    path: [origin, destination],
                    geodesic: true,
                    strokeColor: '#4285F4',
                    strokeOpacity: 1.0,
                    strokeWeight: 5,
                    map: mapInstance
                  });
                }
                // Fit map to show both markers
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend(origin);
                bounds.extend(destination);
                mapInstance.fitBounds(bounds);
                // Add some padding to bounds
                window.google.maps.event.addListenerOnce(mapInstance, 'bounds_changed', () => {
                  mapInstance.setZoom(Math.min(mapInstance.getZoom(), 15));
                });
              }
            });
          }
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize map');
        setLoading(false);
      }
    };
    // Now safe to reference initializeMap below
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps) {
          initializeMap();
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
      return;
    }
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => setError('Failed to load Google Maps');
      document.head.appendChild(script);
    };
    loadGoogleMaps();
    return () => {
      if (map) {
        window.google.maps.event.clearInstanceListeners(map);
        setMap(null);
      }
    };
  }, [from, to, routePolyline]);

  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden' }}>
      <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Route sx={{ mr: 1 }} />
          Route Visualization
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Distance: {distance} • Duration: {duration}
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative', height: 400 }}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: 400
          }}
        />
      </Box>
      
      <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              mr: 1
            }}
          />
          <Typography variant="body2">Origin</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#F44336',
              mr: 1
            }}
          />
          <Typography variant="body2">Destination</Typography>
        </Box>
        {/* Start in Google Maps Button */}
        {from && to && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button
                style={{
                  background: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 24px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(26,115,232,0.08)',
                  transition: 'background 0.2s',
                }}
              >
                Start in Google Maps
              </button>
            </a>
          </Box>
        )}
      </Box>
    </Paper>
  );
} 