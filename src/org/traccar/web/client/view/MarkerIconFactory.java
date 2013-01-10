package org.traccar.web.client.view;

import org.gwtopenmaps.openlayers.client.Icon;
import org.gwtopenmaps.openlayers.client.Pixel;
import org.gwtopenmaps.openlayers.client.Size;

class MarkerIconFactory {

    private static final Size iconSize = new Size(21, 25);
    private static final Pixel iconOffset = new Pixel(-10.5f, -25.0f);

    private static final String iconUrl = "http://www.openlayers.org/api/img/";
    private static final String iconRed = iconUrl + "marker.png";
    private static final String iconBlue = iconUrl + "marker-blue.png";
    private static final String iconGreen = iconUrl + "marker-green.png";
    private static final String iconGold = iconUrl + "marker-gold.png";

    public static enum IconType {
        iconLatest,
        iconArchive
    };

    public static Icon getIcon(IconType type, boolean selected) {
        if (type == IconType.iconLatest) {
            return new Icon(selected ? iconGreen : iconRed, iconSize, iconOffset);
        } else if (type == IconType.iconArchive) {
            return new Icon(selected ? iconGold : iconBlue, iconSize, iconOffset);
        }
        return null;
    }

}
