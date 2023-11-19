import { useSelector } from 'react-redux';

const DriverValue = ({ driverUniqueId }) => {
  const driver = useSelector((state) => state.drivers.items[driverUniqueId]);

  return driver.name;
};

export default DriverValue;
