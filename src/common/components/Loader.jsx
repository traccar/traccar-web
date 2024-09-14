import { useEffect } from 'react';

const Loader = () => {
  useEffect(() => {
    const loader = document.querySelector('.loader');
    loader.style.display = '';
    return () => loader.style.display = 'none';
  }, []);
  return null;
};

export default Loader;
