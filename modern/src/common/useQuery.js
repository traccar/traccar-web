import { useLocation } from 'react-router-dom';

export default () => new URLSearchParams(useLocation().search);
