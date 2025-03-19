import { map } from '../../map/core/MapView';
import { fishCatchDataGeoJSON } from '../components/FishCatchMock';

export const removeFishCatchFromMap = () => {
    if (map && map.getSource('fishcatches') && map.getLayer('fishcatches')) {
        map.removeLayer('fishcatches');
        map.removeSource('fishcatches');
    }
}

export const addCatchestoMap=(onCatchClick)=> {
    if (!map?.getSource('fishcatches')) {
      map?.addSource('fishcatches', {
        type: 'geojson',
        data: fishCatchDataGeoJSON,
      });
      drawCatchesLocations(map, 'fishcatches', onCatchClick);
    }
}
  
const drawCatchesLocations=(map,sourceDataId,onCatchClick)=> {
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
            'icon-image': 'fish',
          'icon-rotation-alignment': 'map',
          'symbol-placement': 'point',
          'icon-allow-overlap': true,
        },
      })
       map?.on('click',(e) =>{
        const features = map.queryRenderedFeatures(e.point, {
            layers: [sourceDataId], 
          });
          if (features.length > 0) {
            const feature = features[0];
            onCatchClick(feature?.
                properties)
          }
       })
    //   map?.setLayoutProperty(sourceDataId, 'icon-image', 'fish');
    }
  }