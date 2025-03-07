import { map } from '../../map/core/MapView';
import fish from '../../resources/images/icon/fish.png';

const data = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "vesselID": "MORNE BLANC - Laida",
                "date": "2021-11-14T06:10:00",
                "color": "purple",
                "latitude": 39.86972222222222,
                "longitude": 0.20805555555555558,
                "catchDetails": [
                    {
                        "name": "SKJ_FAD",
                        "time": "2021-11-16 06:10:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 25
                    },
                    {
                        "name": "BET_FAD",
                        "time": "2021-11-16 06:10:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 0
                    },
                    {
                        "name": "YFT_FAD",
                        "quantity": 5
                    }
                ],
                "fishingTechnique": "FAD"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    0.20805555555555558,
                    39.86972222222222
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "MORNE BLANC - Laida",
                "date": "2021-11-14T06:30:00",
                "color": "purple",
                "latitude": 39.36694444444444,
                "longitude": -0.009444444444444445,
                "catchDetails": [
                    {
                        "name": "SKJ_FAD",
                        "time": "2021-11-18 06:30:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 30
                    },
                    {
                        "name": "BET_FAD",
                        "time": "2021-11-18 06:30:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 16
                    },
                    {
                        "name": "YFT_FAD",
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "FAD"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -0.009444444444444445,
                    39.36694444444444
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "MORNE BLANC - Laida",
                "date": "2021-11-14T09:23:00",
                "color": "purple",
                "latitude": 39.11666666666667,
                "longitude": -0.009444444444444445,
                "catchDetails": [
                    {
                        "name": "SKJ_FAD",
                        "time": "2021-11-16 09:23:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 13
                    },
                    {
                        "name": "BET_FAD",
                        "time": "2021-11-16 09:23:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 3
                    },
                    {
                        "name": "YFT_FAD",
                        "quantity": 0
                    }
                ],
                "fishingTechnique": "FAD"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -0.009444444444444445,
                    39.11666666666667
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "MORNE BLANC - Laida",
                "date": "2021-11-14T09:50:00",
                "color": "purple",
                "latitude": 39.36694444444444,
                "longitude": -0.009444444444444445,
                "catchDetails": [
                    {
                        "name": "SKJ_FAD",
                        "time": "2021-11-18 09:50:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 26
                    },
                    {
                        "name": "BET_FAD",
                        "time": "2021-11-18 09:50:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 8
                    },
                    {
                        "name": "YFT_FAD",
                        "quantity": 4
                    }
                ],
                "fishingTechnique": "FAD"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -0.009444444444444445,
                    39.36694444444444
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "MORNE BLANC - Laida",
                "date": "2021-11-14T11:00:00",
                "color": "purple",
                "latitude": 39.12638888888889,
                "longitude": 0.0775,
                "catchDetails": [
                    {
                        "name": "SKJ_FS",
                        "time": "2021-11-14 11:00:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 0
                    },
                    {
                        "name": "BET_FS",
                        "time": "2021-11-14 11:00:00:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 0
                    },
                    {
                        "name": "YFT_FS",
                        "quantity": 1
                    }
                ],
                "fishingTechnique": "FS"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    0.0775,
                    39.12638888888889
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "KM DEDY ASLAM",
                "date": "2022-06-16T00:00:00",
                "color": "purple",
                "latitude": -3.0833333333333335,
                "longitude": 155.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "School_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    155.39666666666665,
                    -3.0833333333333335
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "KM USAHA MAJU",
                "date": "2022-06-17T00:00:00",
                "color": "purple",
                "latitude": -4.083333333333333,
                "longitude": 149.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "Buoy_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    149.39666666666665,
                    -4.083333333333333
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "KM DEDY ASLAM",
                "date": "2022-06-19T00:00:00",
                "color": "purple",
                "latitude": -4.083333333333333,
                "longitude": 154.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "School_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    154.39666666666665,
                    -4.083333333333333
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "KM DEDY ASLAM",
                "date": "2022-06-20T00:00:00",
                "color": "purple",
                "latitude": -6.083333333333333,
                "longitude": 149.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "School_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    149.39666666666665,
                    -6.083333333333333
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "ANTARTIKA 01",
                "date": "2022-06-20T00:00:00",
                "color": "purple",
                "latitude": -6.083333333333333,
                "longitude": 150.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "Buoy_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    150.39666666666665,
                    -6.083333333333333
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "KM RADEN JOYO 4",
                "date": "2022-06-21T00:00:00",
                "color": "purple",
                "latitude": -9.083333333333334,
                "longitude": 155.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "Buoy_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    155.39666666666665,
                    -9.083333333333334
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "SUNRISE",
                "date": "2022-06-21T00:00:00",
                "color": "purple",
                "latitude": -52.43,
                "longitude": -58.20805555555556,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-08-2021 08:40:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Squid",
                        "time": "10-08-2021 08:40:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 30
                    }
                ],
                "fishingTechnique": "School_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -58.20805555555556,
                    -52.43
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "KM RADEN JOYO 4",
                "date": "2022-06-21T00:00:00",
                "color": "purple",
                "latitude": -3.0833333333333335,
                "longitude": 155.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "Buoy_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    155.39666666666665,
                    -3.0833333333333335
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "KM USAHA MAJU",
                "date": "2022-06-21T00:00:00",
                "color": "purple",
                "latitude": -3.0833333333333335,
                "longitude": 155.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "Buoy_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    155.39666666666665,
                    -3.0833333333333335
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "ANTARTIKA 01",
                "date": "2022-06-21T00:00:00",
                "color": "purple",
                "latitude": -6.083333333333333,
                "longitude": 150.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "Buoy_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    150.39666666666665,
                    -6.083333333333333
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "My Vessel",
                "date": "2022-06-21T00:00:00",
                "color": "purple",
                "latitude": -3.0833333333333335,
                "longitude": 155.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "School_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    155.39666666666665,
                    -3.0833333333333335
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "KMN. MUTIARA KASIH",
                "date": "2022-06-21T00:00:00",
                "color": "purple",
                "latitude": -52.43,
                "longitude": -58.20805555555556,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-08-2021 08:40:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Squid",
                        "time": "10-08-2021 08:40:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 30
                    }
                ],
                "fishingTechnique": "School_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -58.20805555555556,
                    -52.43
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "My Vessel",
                "date": "2022-06-21T00:00:00",
                "color": "purple",
                "latitude": -3.0833333333333335,
                "longitude": 155.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "School_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    155.39666666666665,
                    -3.0833333333333335
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "vesselID": "KM DEDY ASLAM",
                "date": "2022-06-21T00:00:00",
                "color": "purple",
                "latitude": -3.0833333333333335,
                "longitude": 157.39666666666665,
                "catchDetails": [
                    {
                        "name": "Bigeye Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    },
                    {
                        "name": "Swordfish",
                        "quantity": 15
                    },
                    {
                        "name": "Skipjack Tuna",
                        "time": "10-14-2021 08:13:0.000000:0.000000",
                        "alive": true,
                        "finned": true,
                        "quantity": 15
                    }
                ],
                "fishingTechnique": "School_Fishing"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    157.39666666666665,
                    -3.0833333333333335
                ]
            }
        }
    ]
}

export const addCatchestoMap=()=> {
    // console.log(position);
    if (!map?.getSource('fishcatches')) {
      map?.addSource('fishcatches', {
        type: 'geojson',
        data: data,
      });
      drawCatchesLocations(map, 'fishcatches');
    }
}
  
const drawCatchesLocations=(map,sourceDataId)=> {
    if (!map?.getLayer('fishcatches')) {
      if (!map?.hasImage('fish')) {
        map.loadImage(fish, (error, image) => {
          if (error) throw error;
          image && map?.addImage('fish', image, { sdf: true });
        });
      }
      map?.addLayer({
        id: sourceDataId,
        type: 'symbol',
        source: sourceDataId,
        layout: {
            'icon-size': 0.6,
            'icon-image': 'background',
          'icon-rotation-alignment': 'map',
          'symbol-placement': 'point',
          'icon-allow-overlap': true,
        },
        paint: {
          'icon-color': { type: 'identity', property: 'color' },
        },
      });
    //   map?.setLayoutProperty(sourceDataId, 'icon-image', 'fish');
    }
  }