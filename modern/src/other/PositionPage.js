import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Typography, Collapse, Container, Paper, Divider, AppBar, InputBase, Toolbar, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { styled, alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffectAsync } from '../reactHelper';
import { prefixString } from '../common/util/stringUtils';
import { useTranslation } from '../common/components/LocalizationProvider';
import PositionValue from '../common/components/PositionValue';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(0),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(0.5em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    overflow: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  noPadding: {
    margin: '0',
  },
}));

const PositionPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const { id } = useParams();

  const [item, setItem] = useState();

  const [keyword, setKeyword] = useState('');

  const [filteredAttributes, setFilteredAttributes] = useState([]);

  const [open, setOpen] = useState([]);

  let attrNr = 0;

  useEffectAsync(async () => {
    if (id) {
      const response = await fetch(`/api/positions?id=${id}`);
      if (response.ok) {
        const positions = await response.json();
        if (positions.length > 0) {
          setItem(positions[0]);
        }
      } else {
        throw Error(await response.text());
      }
    }
  }, [id]);

  function constructAttributeObj(name, value, key) {
    const obj = {};
    obj.isProperty = false;
    obj.name = name;
    obj.nr = attrNr;
    attrNr += 1;

    let newValue = value[key];
    if (Array.isArray(newValue)
    || (newValue != null && typeof newValue === 'object')
    || (typeof newValue === 'string' && (newValue.startsWith('{') || newValue.startsWith('[')))) {
      const children = [];
      if (typeof newValue === 'string') {
        newValue = JSON.parse(newValue);
      }

      if (Array.isArray(newValue)) {
        for (let i = 0; i < newValue.length; i += 1) {
          const newName = `${name}:${i}`;
          children.push(constructAttributeObj(newName, newValue, newValue[i]));
        }
      } else {
        Object.keys(newValue).forEach((child) => {
          const newName = `${name}:${child}`;
          children.push(constructAttributeObj(newName, newValue, child));
        });
      }

      obj.children = children;
    } else {
      obj.children = [];
    }

    return obj;
  }

  function containsName(rootObj, keyword) {
    const lowerCaseKeyword = keyword.toLowerCase();
    if (rootObj.name.toLowerCase().includes(lowerCaseKeyword)) {
      return true;
    }

    if (rootObj.children != null && rootObj.children.length) {
      return rootObj.children.some((child) => containsName(child, keyword));
    }
    return false;
  }

  function toggleOpenVar(attr) {
    const openNew = [...open];
    openNew[attr.nr] = !openNew[attr.nr];
    setOpen(openNew);
  }

  function createTableRow(attr) {
    const attrName = attr.name.split(':')[attr.name.split(':').length - 1];

    if (attr.children.length) {
      return (
        <React.Fragment key={attr.name}>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell className={classes.noPadding}>
              <IconButton size="small" onClick={() => toggleOpenVar(attr)}>
                {open[attr.nr] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell>{attrName}</TableCell>
            <TableCell><strong>{t(prefixString('position', attrName)) || t(prefixString('device', attrName))}</strong></TableCell>
            <TableCell><PositionValue position={item} attribute={attr.name} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingLeft: 50, paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
              <Collapse in={open[attr.nr]}>
                <Paper sx={{ margin: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Actions</TableCell>
                        <TableCell>{t('stateName')}</TableCell>
                        <TableCell>{t('sharedName')}</TableCell>
                        <TableCell>{t('stateValue')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attr.children.map((child) => createTableRow(child))}
                    </TableBody>
                  </Table>
                </Paper>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    }

    return (
      <TableRow key={attr.name}>
        <TableCell />
        <TableCell>{attrName}</TableCell>
        <TableCell><strong>{t(prefixString('position', attrName)) || t(prefixString('device', attrName))}</strong></TableCell>
        <TableCell><PositionValue position={item} attribute={attr.name} /></TableCell>
      </TableRow>
    );
  }

  useEffect(() => {
    if (item) {
      const allAttributes = [];
      Object.getOwnPropertyNames(item)
        .forEach((name) => {
          if (name !== 'attributes') {
            const obj = {};
            obj.isProperty = true;
            obj.name = name;
            allAttributes.push(obj);
          } else {
            Object.getOwnPropertyNames(item.attributes).forEach((attrName) => {
              const obj = constructAttributeObj(attrName, item.attributes, attrName);
              allAttributes.push(obj);
            });
          }
        });

      const filtered = allAttributes
        .filter((attribute) => containsName(attribute, keyword));
      setFilteredAttributes(filtered);
      setOpen(new Array(5).fill(false));
    }
  }, [item, keyword]);

  const deviceName = useSelector((state) => {
    if (item) {
      const device = state.devices.items[item.deviceId];
      if (device) {
        return device.name;
      }
    }
    return null;
  });

  const attrTables = filteredAttributes.filter((attr) => !attr.isProperty).map((attr) => createTableRow(attr));

  return (
    <div className={classes.root}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {deviceName}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        <Container maxWidth="md">
          <Paper>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search Attributes"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Divider />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Actions</TableCell>
                  <TableCell>{t('stateName')}</TableCell>
                  <TableCell>{t('sharedName')}</TableCell>
                  <TableCell>{t('stateValue')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttributes.filter((attr) => attr.isProperty).map((attr) => (
                  <TableRow key={attr.name}>
                    <TableCell />
                    <TableCell>{attr.name}</TableCell>
                    <TableCell><strong>{t(prefixString('position', attr.name))}</strong></TableCell>
                    <TableCell><PositionValue position={item} property={attr.name} /></TableCell>
                  </TableRow>
                ))}
                {attrTables}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </div>
    </div>
  );
};

export default PositionPage;
