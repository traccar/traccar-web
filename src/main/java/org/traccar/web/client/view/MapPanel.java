package org.traccar.web.client.view;

import org.gwtopenmaps.openlayers.client.LonLat;
import org.gwtopenmaps.openlayers.client.Map;
import org.gwtopenmaps.openlayers.client.MapOptions;
import org.gwtopenmaps.openlayers.client.MapWidget;
import org.gwtopenmaps.openlayers.client.Projection;
import org.gwtopenmaps.openlayers.client.control.ScaleLine;
import org.gwtopenmaps.openlayers.client.layer.OSM;

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.smartgwt.client.widgets.WidgetCanvas;
import com.smartgwt.client.widgets.events.DrawEvent;
import com.smartgwt.client.widgets.events.DrawHandler;
import com.smartgwt.client.widgets.events.ResizedEvent;
import com.smartgwt.client.widgets.events.ResizedHandler;
import com.smartgwt.client.widgets.layout.SectionStack;
import com.smartgwt.client.widgets.layout.SectionStackSection;

/**
 * Map panel widget
 */
public class MapPanel extends SectionStack {

    private final static int BORDER_SIZE = 1;

    private MapWidget mapWidget;
    private WidgetCanvas mapWrapper;

    private MapWidget createMapWidget() {
        MapOptions defaultMapOptions = new MapOptions();
        defaultMapOptions.setNumZoomLevels(16);

        MapWidget mapWidget = new MapWidget("100%", "100%", defaultMapOptions);

        // Google layer
        /*GoogleV3Options layerOptiond = new GoogleV3Options();
        layerOptiond.setIsBaseLayer(true);
        layerOptiond.setType(GoogleV3MapType.G_NORMAL_MAP);
        GoogleV3 layer = new GoogleV3("Google", layerOptiond);*/

        // Open Street Map layer
        OSM layer = OSM.Mapnik("Mapnik");
        layer.setIsBaseLayer(true);

        Map map = mapWidget.getMap();
        map.addLayer(layer);
        map.addControl(new ScaleLine());

        // Default center
        LonLat lonLat = new LonLat(12.5, 41.9);
        lonLat.transform(new Projection("EPSG:4326").getProjectionCode(), map.getProjection());
        map.setCenter(lonLat, 1);

        return mapWidget;
    }

    public MapPanel() {
        SectionStackSection section = new SectionStackSection("Map");
        section.setCanCollapse(false);
        section.setExpanded(true);

        mapWidget = createMapWidget();

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
                mapWidget.getMap().updateSize();
            }
        });

        section.setItems(mapWrapper);
        setSections(section);
    }

}
