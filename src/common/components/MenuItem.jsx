import { makeStyles } from 'tss-react/mui';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const useStyles = makeStyles()(() => ({
  menuItemText: {
    whiteSpace: 'nowrap',
  },
  button: {
    margin: '4px 8px',
    borderRadius: '8px', // Des coins un peu arrondis pour un look moderne
    color: '#0D1B2A', // Bleu foncé pour le texte par défaut
    transition: 'all 0.2s ease-in-out',
    '& .MuiListItemIcon-root': {
      color: '#6B7280', // Gris pour les icônes par défaut
      minWidth: '40px',
    },
    '&:hover': {
      backgroundColor: 'rgba(13, 27, 42, 0.08)', // Effet au survol avec le Bleu foncé très léger
      color: '#28A745', // Le texte passe au Vert principal au survol
      '& .MuiListItemIcon-root': {
        color: '#28A745', // L'icône passe aussi au Vert principal
      },
    },
    '&.Mui-selected': {
      backgroundColor: '#28A745', // Vert principal pour le fond de l'élément sélectionné
      color: '#F5F7FA', // Blanc cassé pour le texte quand c'est sélectionné
      fontWeight: 600,
      '& .MuiListItemIcon-root': {
        color: '#F5F7FA', // L'icône devient blanc cassé sur le fond vert
      },
      '&:hover': {
        backgroundColor: '#7ED957', // Vert clair si on survole l'élément déjà sélectionné
        color: '#0D1B2A', // Le texte redevient Bleu foncé sur le vert clair pour le contraste
        '& .MuiListItemIcon-root': {
          color: '#0D1B2A',
        },
      },
    },
  },
}));

const MenuItem = ({ title, link, icon, selected }) => {
  const { classes } = useStyles();
  return (
    <ListItemButton 
      key={link} 
      component={Link} 
      to={link} 
      selected={selected}
      className={classes.button}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} className={classes.menuItemText} />
    </ListItemButton>
  );
};

export default MenuItem;