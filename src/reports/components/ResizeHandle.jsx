import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  handle: {
    height: theme.spacing(1),
    cursor: 'ns-resize',
    backgroundColor: theme.palette.divider,
    flexShrink: 0,
  },
}));

const ResizeHandle = () => {
  const { classes } = useStyles();

  const onPointerDown = (event) => {
    event.preventDefault();
    const containerRectangle = event.currentTarget.parentElement.getBoundingClientRect();

    const onMove = (moveEvent) => {
      const offset = moveEvent.clientY - containerRectangle.top;
      const percentage = Math.max(10, Math.min(90, (offset / containerRectangle.height) * 100));
      document.documentElement.style.setProperty('--report-map-height', `${percentage}%`);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return <div className={classes.handle} onPointerDown={onPointerDown} />;
};

export default ResizeHandle;
