import t from './common/localization'
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RemoveDialog from './RemoveDialog'
import { devicesActions } from './store';

const mapStateToProps = state => ({
  devices: Object.values(state.devices.items)
});

class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuAnchorEl: null,
      removeDialogOpen: false
    };
  }

  handleItemClick(device) {
    this.props.dispatch(devicesActions.select(device));
  }

  handleMenuClick(event) {
    this.setState({ menuAnchorEl: event.currentTarget });
  }

  handleMenuClose() {
    this.setState({ menuAnchorEl: null });
  }

  handleMenuEdit() {
    this.props.history.push('/device');
    this.handleMenuClose();
  }

  handleMenuRemove() {
    this.setState({ removeDialogOpen: true });
    this.handleMenuClose();
  }

  render() {
    const devices = this.props.devices.map((device, index, list) =>
      <Fragment key={device.id.toString()}>
        <ListItem button onClick={() => this.handleItemClick(device)}>
          <ListItemAvatar>
            <Avatar>
              <LocationOnIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={device.name} secondary={device.uniqueId} />
          <ListItemSecondaryAction>
            <IconButton onClick={(event) => this.handleMenuClick(event)}>
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        {index < list.length - 1 ? <Divider /> : null}
      </Fragment>
    );

    return (
      <Fragment>
        <List>
          {devices}
        </List>
        <Menu
          id="device-menu"
          anchorEl={this.state.menuAnchorEl}
          keepMounted
          open={Boolean(this.state.menuAnchorEl)}
          onClose={() => this.handleMenuClose()}>
          <MenuItem onClick={() => this.handleMenuEdit()}>{t('sharedEdit')}</MenuItem>
          <MenuItem onClick={() => this.handleMenuRemove()}>{t('sharedRemove')}</MenuItem>
        </Menu>
        <RemoveDialog
          open={this.state.removeDialogOpen}
          onClose={() => { this.setState({ removeDialogOpen: false }) }} />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(DeviceList);
