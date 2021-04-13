import * as React from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import theme from '@mapbox/mapbox-gl-draw/src/lib/theme';
import { map } from './Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import {useState,useEffect} from 'react';
import 'font-awesome/css/font-awesome.min.css';
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode
} from 'mapbox-gl-draw-circle';

class extendDrawBar {
  constructor(opt) {
    let ctrl = this;
    ctrl.draw = opt.draw;
    ctrl.buttons = opt.buttons || [];
    ctrl.onAddOrig = opt.draw.onAdd;
    ctrl.onRemoveOrig = opt.draw.onRemove;
  }
  onAdd(map) {
    let ctrl = this;
    ctrl.map = map;
    ctrl.elContainer = ctrl.onAddOrig(map);
    ctrl.buttons.forEach((b) => {
      ctrl.addButton(b);
    });
    return ctrl.elContainer;
  }
  onRemove(map) {
    let ctrl = this;
    ctrl.buttons.forEach((b) => {
      ctrl.removeButton(b);
    });
    ctrl.onRemoveOrig(map);
  }
  addButton(opt) {
    let ctrl = this;
    var elButton = document.createElement('button');
    elButton.className = 'fa fa-circle-o';
    if (opt.classes instanceof Array) {
      opt.classes.forEach((c) => {
        elButton.classList.add(c);
      });
    }
    elButton.addEventListener(opt.on, opt.action);
    ctrl.elContainer.appendChild(elButton);
    opt.elButton = elButton;
  }
  removeButton(opt) {
    opt.elButton.removeEventListener(opt.on, opt.action);
    opt.elButton.remove();
  }
}

const draw = new MapboxDraw({
 displayControlsDefault: false,
  controls: {
    point: true,
    line_string: true,
    polygon: true,
    trash: true,
  
  },
 
  styles: theme,
  
 
  modes: {
   ...MapboxDraw.modes,
    draw_circle  : CircleMode,
    drag_circle  : DragCircleMode,
    direct_select: DirectMode,
    simple_select: SimpleSelectMode
  },
    
  
  defaultMode: "simple_select",
  userProperties: true
});
var drawBar = new extendDrawBar({
  draw: draw,
  
  buttons: [
    {
      on: 'click',
      action: function circle(){
      draw.changeMode('draw_circle');
      },
      classes: []
    }
  ] 
}); 
const GeofenceEditMap = () => {
  useEffect(() => {
    map.addControl(drawBar, 'top-left');
    return () => map.removeControl(drawBar);
  }, []);

  return null;
}

export default GeofenceEditMap;
