import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from '@mui/material';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';
import fetchOrThrow from '../util/fetchOrThrow';

const AddressValue = ({ latitude, longitude, originalAddress }) => {
  const t = useTranslation();

  const addressEnabled = useSelector((state) => state.session.server.geocoderEnabled);

  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(originalAddress);
  }, [latitude, longitude, originalAddress]);

  // Helper function to extract address components from data
  const extractAddressComponents = (addressObj, addressData) => {
    return {
      street: addressObj.street || addressObj.road || addressObj.streetName || 
             addressObj.address_line1 || addressObj.name || addressObj.place ||
             addressData.street || addressData.road || addressData.streetName || 
             addressData.address_line1 || addressData.name || addressData.place,
      localArea: addressObj.village || addressObj.hamlet || addressObj.town || 
                 addressObj.city || addressObj.municipality || addressObj.township ||
                 addressData.village || addressData.hamlet || addressData.town || 
                 addressData.city || addressData.municipality || addressData.township,
      area: addressObj.area || addressObj.suburb || addressObj.neighbourhood || 
            addressObj.locality || addressData.area || addressData.suburb,
      district: addressObj.district || addressObj.county || addressObj.state_district || 
                addressData.district || addressData.county,
      state: addressObj.state || addressObj.province || addressObj.region || 
             addressData.state || addressData.province || addressData.region,
    };
  };

  // Helper function to fetch from OpenStreetMap Nominatim as fallback
  const fetchFromNominatim = async (lat, lon) => {
    try {
      // Use Nominatim reverse geocoding API
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&zoom=18`;
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'AmsonTracker-Web/1.0', // Required by Nominatim
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      // Silently fail - this is a fallback service
      console.warn('Nominatim geocoding failed:', e);
    }
    return null;
  };

  const showAddress = useCatch(async (event) => {
    event.preventDefault();
    const query = new URLSearchParams({ latitude, longitude });
    const response = await fetchOrThrow(`/api/server/geocode?${query.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    
    // Get response as text first to safely handle both JSON and plain text
    const responseText = await response.text();
    let addressData;
    
    // Try parsing as JSON, but handle errors gracefully
    try {
      addressData = JSON.parse(responseText);
    } catch (e) {
      // If not JSON, it's plain text - try fallback geocoding service
      const plainTextAddress = responseText.trim();
      
      // If we only have district/state, try to get more details from Nominatim
      if (plainTextAddress && !plainTextAddress.includes(',')) {
        const nominatimData = await fetchFromNominatim(latitude, longitude);
        if (nominatimData && nominatimData.address) {
          const components = extractAddressComponents(nominatimData.address, nominatimData);
          const addressParts = [];
          
          if (components.street) addressParts.push(components.street);
          if (components.localArea && !components.street) addressParts.push(components.localArea);
          if (components.area) addressParts.push(components.area);
          if (components.district) addressParts.push(components.district);
          if (components.state) addressParts.push(components.state);
          
          if (addressParts.length > 0) {
            setAddress(addressParts.join(', '));
            return;
          }
        }
      }
      
      // Use plain text as fallback
      setAddress(plainTextAddress);
      return;
    }
    
    // If it's an object with address components, format them
    if (typeof addressData === 'object' && addressData !== null) {
      const addressParts = [];
      
      // Check if address components are nested in an 'address' property
      const addressObj = addressData.address || addressData;
      
      // Extract address components using helper function
      let components = extractAddressComponents(addressObj, addressData);
      
      // If we don't have street/road information, try Nominatim as fallback
      if (!components.street && !components.localArea) {
        const nominatimData = await fetchFromNominatim(latitude, longitude);
        if (nominatimData && nominatimData.address) {
          const nominatimComponents = extractAddressComponents(nominatimData.address, nominatimData);
          
          // Merge components: use Nominatim for missing fields, keep primary API data for existing fields
          components = {
            street: components.street || nominatimComponents.street,
            localArea: components.localArea || nominatimComponents.localArea,
            area: components.area || nominatimComponents.area,
            district: components.district || nominatimComponents.district,
            state: components.state || nominatimComponents.state,
          };
        }
      }
      
      // Build address string with available components in order of specificity
      if (components.street) {
        addressParts.push(components.street);
      } else if (components.localArea) {
        // If no street, use village/town/city as the primary location
        addressParts.push(components.localArea);
      }
      
      // Add area/suburb if available and not already included
      if (components.area && components.area !== components.localArea) {
        addressParts.push(components.area);
      }
      
      // Add district if available
      if (components.district) {
        addressParts.push(components.district);
      }
      
      // Add state if available and we don't already have enough info
      // Only add state if we have at least one other component, or if it's the only info
      if (components.state && (addressParts.length > 0 || !components.district)) {
        addressParts.push(components.state);
      }
      
      // If we have formatted parts, use them
      if (addressParts.length > 0) {
        setAddress(addressParts.join(', '));
      } else if (addressData.display_name || addressData.formatted || addressData.address) {
        // Fall back to display_name or formatted address
        setAddress(addressData.display_name || addressData.formatted || (typeof addressData.address === 'string' ? addressData.address : ''));
      } else {
        // Last resort: try to extract any meaningful address info from the object
        const allAddressFields = [
          addressObj.name, addressObj.place, addressObj.place_name,
          addressData.name, addressData.place, addressData.place_name
        ].filter(Boolean);
        
        if (allAddressFields.length > 0) {
          setAddress(allAddressFields[0]);
        } else {
          // Final fallback
          setAddress(JSON.stringify(addressData));
        }
      }
    } else if (typeof addressData === 'string') {
      setAddress(addressData);
    } else {
      setAddress(String(addressData));
    }
  });

  if (address) {
    return address;
  }
  if (addressEnabled) {
    return (<Link href="#" onClick={showAddress}>{t('sharedShowAddress')}</Link>);
  }
  return '';
};

export default AddressValue;
