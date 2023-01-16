import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { toJson } from '../common/util/converter';

export default (keyword, filter, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions) => {
  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);

  const filterRegex = /^.+{.*}$/;
  function extractFilter(string) {
    if (filterRegex.test(string)) {
      return [string.substring(0, string.indexOf('{')).toLowerCase(), string.substring(string.indexOf('{') + 1, string.length - 1)];
    }

    return ['', string];
  }

  const regexRegex = /^.*r\/.*\/$/;
  function isRegex(string) {
    return regexRegex.test(string);
  }

  function extractRegex(string) {
    let regex;
    try {
      regex = new RegExp(string.substring(string.indexOf('r/') + 2, string.lastIndexOf('/')));
    } catch (e) {
      regex = /.*/;
    }
    return regex;
  }

  useEffect(() => {
    const deviceGroups = (device) => {
      const groupIds = [];
      let { groupId } = device;
      while (groupId) {
        groupIds.push(groupId);
        groupId = groups[groupId]?.groupId || 0;
      }
      return groupIds;
    };

    const filtered = Object.values(devices)
      .filter((device) => !filter.statuses.length || filter.statuses.includes(device.status))
      .filter((device) => !filter.groups.length || deviceGroups(device).some((id) => filter.groups.includes(id)))
      .filter((device) => {
        // Init position attributes to search
        let posAttr = null;
        if (positions[device.id] !== undefined) {
          posAttr = { ...positions[device.id] };
          delete posAttr.attributes;
          posAttr = { ...posAttr, ...positions[device.id].attributes };
        }

        // ['key:value' search]
        if (keyword.includes(':')) {
          const split = keyword.split(':');
          // Keyword used to search for the attribute key is split to find and search children attributes
          const keyParts = split[0].split('.');
          const attr = { ...posAttr, ...device.attributes };
          let attrVal = [attr];

          const foundKey = keyParts.every((part) => {
            const keyVal = [];
            for (let i = 0; i < attrVal.length; i += 1) {
              keyVal.push([]);
            }

            // Search key with regex
            if (isRegex(part)) {
              const regex = extractRegex(part);
              for (let i = 0; i < attrVal.length; i += 1) {
                Object.keys(attrVal[i]).forEach((key) => {
                  if (regex.test(key)) {
                    keyVal[i].push(key);
                  }
                });
              }
            // Search key with normal keyword
            } else {
              // Four variations are searched: the keyword, first letter uppercase keyword, full lower case keyword and full upper case keyword
              const splitVars = [part, part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(), part.toLowerCase(), part.toUpperCase()];
              splitVars.forEach((key) => {
                for (let i = 0; i < attrVal.length; i += 1) {
                  if (key in attrVal[i]) {
                    keyVal[i].push(key);
                  }
                }
              });
            }

            // Update array to search for more values
            // All keys that match are searched, this is why there are for loops here
            if (keyVal.length) {
              const newAttrVal = [];
              for (let i = 0; i < attrVal.length; i += 1) {
                for (let j = 0; j < keyVal[i].length; j += 1) {
                  let newAttr = attrVal[i][keyVal[i][j]];
                  newAttr = toJson(newAttr);
                }
              }
              attrVal = newAttrVal;
              return true;
            }
            return false;
          });

          // Search value with regex
          let followsPattern = function f(toSearch) {
            if (toSearch === undefined) return false;
            return toSearch.some((e) => e.toString().toLowerCase().includes(split[1].toLowerCase()));
          };

          // Search value with normal keyword
          if (isRegex(split[1])) {
            const regex = extractRegex(split[1]);
            followsPattern = function f(toSearch) {
              if (toSearch === undefined) return false;
              return toSearch.some((e) => regex.test(e.toString()));
            };
          }

          return foundKey && followsPattern(attrVal);
        }

        let newKeyword;
        [filter, newKeyword] = extractFilter(keyword);
        let toSearchDeviceProps = [];
        let searchDeviceAttributes = false;
        let searchPositionAttributes = false;

        // [Filter search]
        switch (filter) {
          case 'name':
            toSearchDeviceProps = [device.name];
            break;
          case 'id':
            toSearchDeviceProps = [device.uniqueId];
            break;
          case 'phone':
            toSearchDeviceProps = [device.phone];
            break;
          case 'model':
            toSearchDeviceProps = [device.model];
            break;
          case 'contact':
            toSearchDeviceProps = [device.contact];
            break;
          case 'config':
            toSearchDeviceProps = [device.name, device.uniqueId, device.phone, device.model, device.contact];
            searchDeviceAttributes = true;
            break;
          case 'attr':
            searchPositionAttributes = true;
            break;
          default:
            toSearchDeviceProps = [device.name, device.uniqueId, device.phone, device.model, device.contact];
            searchDeviceAttributes = true;
            searchPositionAttributes = true;
            break;
        }

        // [Normal keyword search]
        // Search value with regex
        let followsPattern = function f(toSearch) {
          if (toSearch === undefined) return false;
          return toSearch.toLowerCase().includes(newKeyword.toLowerCase());
        };

        // Search value with normal keyword
        if (isRegex(newKeyword)) {
          const regex = extractRegex(newKeyword);
          followsPattern = function f(toSearch) {
            if (toSearch === undefined) return false;
            return regex.test(toSearch);
          };
        }

        //     // Search keyword in base device properties
        return toSearchDeviceProps.some((s) => s && followsPattern(s))
               // Search keyword in device attributes
               || (searchDeviceAttributes && Object.entries(device.attributes).map((entry) => entry.map((item) => item.toString())).some((entry) => entry.some((item) => followsPattern(item))))
               // Search keyword in latest device position attributes
               || (searchPositionAttributes && posAttr !== null && (Object.entries(posAttr).map((entry) => entry.map((item) => item?.toString())).some((entry) => entry.some((item) => followsPattern(item)))));
      });
    switch (filterSort) {
      case 'name':
        filtered.sort((device1, device2) => device1.name.localeCompare(device2.name));
        break;
      case 'lastUpdate':
        filtered.sort((device1, device2) => {
          const time1 = device1.lastUpdate ? moment(device1.lastUpdate).valueOf() : 0;
          const time2 = device2.lastUpdate ? moment(device2.lastUpdate).valueOf() : 0;
          return time2 - time1;
        });
        break;
      default:
        break;
    }
    setFilteredDevices(filtered);
    setFilteredPositions(filterMap
      ? filtered.map((device) => positions[device.id]).filter(Boolean)
      : Object.values(positions));
  }, [keyword, filter, filterSort, filterMap, groups, devices, positions, setFilteredDevices, setFilteredPositions]);
};
