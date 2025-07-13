"use client";
import { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

interface AddressAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  color?: 'primary' | 'secondary';
  disabled?: boolean;
}

interface PlaceResult {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function AddressAutocomplete({
  label,
  value,
  onChange,
  placeholder,
  color = 'primary',
  disabled = false
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);
  const autocompleteRef = useRef<any>(null);

  // Load Google Places API
  useEffect(() => {
    // Only set services if Google Maps API is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
      setPlacesService(new window.google.maps.places.PlacesService(document.createElement('div')));
    } else {
      // Wait for Google Maps API to be available
      const checkGooglePlaces = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setAutocompleteService(new window.google.maps.places.AutocompleteService());
          setPlacesService(new window.google.maps.places.PlacesService(document.createElement('div')));
        } else {
          setTimeout(checkGooglePlaces, 100);
        }
      };
      checkGooglePlaces();
    }
  }, []);

  // Fetch suggestions when input changes
  useEffect(() => {
    if (!autocompleteService || !inputValue || inputValue.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    
    const fetchSuggestions = () => {
      autocompleteService.getPlacePredictions(
        {
          input: inputValue,
          componentRestrictions: { country: 'IN' }, // Restrict to India
          types: ['geocode', 'establishment'] // Include addresses and businesses
        },
        (predictions: PlaceResult[], status: string) => {
          setLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setOptions(predictions);
          } else {
            setOptions([]);
          }
        }
      );
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, autocompleteService]);

  // Update parent when selection changes
  const handleChange = (event: any, newValue: PlaceResult | null) => {
    if (newValue) {
      onChange(newValue.description);
      setInputValue(newValue.description);
    }
  };

  // Update input value
  const handleInputChange = (event: any, newInputValue: string) => {
    setInputValue(newInputValue);
    if (!newInputValue) {
      onChange('');
    }
  };

  return (
    <Autocomplete
      ref={autocompleteRef}
      value={value}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      options={options}
      getOptionLabel={(option) => 
        typeof option === 'string' ? option : option.description
      }
      filterOptions={(x) => x} // Disable built-in filtering
      loading={loading || !autocompleteService}
      disabled={disabled || !autocompleteService}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <LocationOn sx={{ mr: 1, color: `${color}.main` }} />
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          color={color}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={key} {...otherProps}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {option.structured_formatting.main_text}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Box>
          </Box>
        );
      }}
      noOptionsText="No addresses found"
      loadingText="Loading addresses..."
      fullWidth
      sx={{
        minWidth: 300,
        width: 400,
        maxWidth: '100%',
        ...{
          '& .MuiAutocomplete-option': {
            padding: 2,
          },
          '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: `${color}.50`,
          },
          '& .MuiAutocomplete-option[data-focus="true"]': {
            backgroundColor: `${color}.100`,
          },
        }
      }}
    />
  );
} 