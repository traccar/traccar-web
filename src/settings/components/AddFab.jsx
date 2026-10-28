import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import BaseFab from '../../common/components/BaseFab';
import { useRestriction } from '../../common/util/permissions';

const AddFab = ({ editPath, disabled }) => {
  const navigate = useNavigate();

  const readonly = useRestriction('readonly');

  if (!readonly && !disabled) {
    return (
      <BaseFab onClick={() => navigate(editPath)}>
        <AddIcon />
      </BaseFab>
    );
  }
  return '';
};

export default AddFab;
