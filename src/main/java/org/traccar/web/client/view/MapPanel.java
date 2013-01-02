package org.traccar.web.client.view;

import java.util.AbstractMap;
import java.util.HashMap;
import java.util.List;

import org.gwtopenmaps.openlayers.client.Icon;
import org.gwtopenmaps.openlayers.client.LonLat;
import org.gwtopenmaps.openlayers.client.Map;
import org.gwtopenmaps.openlayers.client.MapOptions;
import org.gwtopenmaps.openlayers.client.MapWidget;
import org.gwtopenmaps.openlayers.client.Marker;
import org.gwtopenmaps.openlayers.client.Pixel;
import org.gwtopenmaps.openlayers.client.Projection;
import org.gwtopenmaps.openlayers.client.Size;
import org.gwtopenmaps.openlayers.client.control.ScaleLine;
import org.gwtopenmaps.openlayers.client.layer.Markers;
import org.gwtopenmaps.openlayers.client.layer.OSM;
import org.traccar.web.client.Traccar;
import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.smartgwt.client.widgets.WidgetCanvas;
import com.smartgwt.client.widgets.events.DrawEvent;
import com.smartgwt.client.widgets.events.DrawHandler;
import com.smartgwt.client.widgets.events.ResizedEvent;
import com.smartgwt.client.widgets.events.ResizedHandler;
import com.smartgwt.client.widgets.layout.SectionStack;
import com.smartgwt.client.widgets.layout.SectionStackSection;


class MarkerIconFactory {

    private static final Size iconSize = new Size(21, 25);
    private static final Pixel iconOffset = new Pixel(-10.5f, -25.0f);

    private static final String iconUrl = "http://www.openlayers.org/api/img/";
    private static final String iconRed = iconUrl + "marker.png";
    private static final String iconBlue = iconUrl + "marker-blue.png";
    private static final String iconGreen = iconUrl + "marker-green.png";
    private static final String iconGold = iconUrl + "marker-gold.png";

    public static Icon getLocationIcon() {
        return new Icon(iconRed, iconSize, iconOffset);
    }

    public static Icon getSelectedLocationIcon() {
        return new Icon(iconGreen, iconSize, iconOffset);
    }

    public static Icon getArchiveIcon() {
        return new Icon(iconBlue, iconSize, iconOffset);
    }

    public static Icon getSelectedArchiveIcon() {
        return new Icon(iconGold, iconSize, iconOffset);
    }

}

/**
 * Map panel widget
 */
public class MapPanel extends SectionStack {

    private MapWidget mapWidget;
    private Map map;
    private WidgetCanvas mapWrapper;
    private Markers markerLayer;

    private LonLat createPoint(double longitude, double latitude) {
        LonLat point = new LonLat(longitude, latitude);
        point.transform(new Projection("EPSG:4326").getProjectionCode(), map.getProjection());
        return point;
    }

    private void createMapWidget() {
        MapOptions defaultMapOptions = new MapOptions();
        defaultMapOptions.setNumZoomLevels(16);

        mapWidget = new MapWidget("100%", "100%", defaultMapOptions);
        map = mapWidget.getMap();

        OSM mapLayer = OSM.Mapnik(Traccar.getConstants().mapnik());
        mapLayer.setIsBaseLayer(true);

        markerLayer = new Markers(Traccar.getConstants().markers());

        map.addLayer(mapLayer);
        map.addLayer(markerLayer);
        map.addControl(new ScaleLine());

        map.setCenter(createPoint(12.5, 41.9), 1);
    }

    public SectionStackSection section;

    public MapPanel() {
        section = new SectionStackSection(Traccar.getConstants().map());
        section.setShowHeader(false);
        section.setCanCollapse(false);
        section.setExpanded(true);

        createMapWidget();

        mapWrapper = new WidgetCanvas(mapWidget);
        mapWrapper.setStyleName("defaultBorder");
        mapWrapper.setHeight100();
        mapWrapper.setWidth100();

        // Map widget size hack
        mapWrapper.addDrawHandler(new DrawHandler() {
            @Override
            public void onDraw(DrawEvent event) {
                Element e = DOM.getElementById(mapWrapper.getID() + "_widget");
                if (e.getParentNode() != null) {
                    e.getParentElement().getStyle().setProperty("width", "100%");
                    e.getParentElement().getStyle().setProperty("height", "100%");
                }
            }
        });

        // Map resize handler
        mapWrapper.addResizedHandler(new ResizedHandler() {
            @Override
            public void onResized(ResizedEvent event) {
                map.updateSize();
            }
        });

        section.setItems(mapWrapper);
        setSections(section);
    }

    private AbstractMap<Device, Position> positionMap = new HashMap<Device, Position>();
    private AbstractMap<Device, Marker> markerMap = new HashMap<Device, Marker>();
    private Device selectedDevice;

    public void showPositions(List<Position> positions) {
        positionMap.clear();
        markerMap.clear();
        markerLayer.clearMarkers();
        for (Position position : positions) {
            positionMap.put(position.getDevice(), position);
            Marker marker = new Marker(
                    createPoint(position.getLongitude(), position.getLatitude()), MarkerIconFactory.getLocationIcon());
            markerMap.put(position.getDevice(), marker);
            markerLayer.addMarker(marker);
        }
        if (selectedDevice != null) {
            select(selectedDevice, false);
        }
    }

    private void changeMarkerIcon(Marker marker, Icon icon) {
        Marker newMarker = new Marker(marker.getLonLat(), icon);
        markerLayer.removeMarker(marker);
        markerLayer.addMarker(newMarker);
    }

    public void select(Device device, boolean center) {
        if (selectedDevice != null) {
            changeMarkerIcon(markerMap.get(selectedDevice), MarkerIconFactory.getLocationIcon());
        }
        if (device != null) {
            Marker marker = markerMap.get(device);
            if (center) {
                map.panTo(marker.getLonLat());
            }
            changeMarkerIcon(marker, MarkerIconFactory.getSelectedLocationIcon());
        }
        selectedDevice = device;
    }

}
