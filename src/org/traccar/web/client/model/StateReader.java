package org.traccar.web.client.model;

import java.util.LinkedList;
import java.util.List;

import org.traccar.web.client.ApplicationContext;
import org.traccar.web.shared.model.Position;
import org.traccar.web.shared.model.XmlParser;

public class StateReader {

    private static String toString(Object object) {
        if (object != null) {
            return object.toString();
        }
        return null;
    }

    public static List<StateItem> getState(Position position) {
        List<StateItem> state = new LinkedList<StateItem>();

        state.add(new StateItem("valid", toString(position.getValid())));
        state.add(new StateItem("time", ApplicationContext.getInstance().getFormatterUtil().getTimeFormat().format(position.getTime())));
        state.add(new StateItem("latitude", toString(position.getLatitude())));
        state.add(new StateItem("longitude", toString(position.getLongitude())));
        state.add(new StateItem("altitude", toString(position.getAltitude())));
        state.add(new StateItem("speed", ApplicationContext.getInstance().getFormatterUtil().getSpeedFormat().format(position.getSpeed())));
        state.add(new StateItem("course", toString(position.getCourse())));
        state.add(new StateItem("power", toString(position.getPower())));
        state.add(new StateItem("address", position.getAddress()));

        String other = position.getOther();
        if (other != null) {
            for (String key : XmlParser.enumerateElements(other)) {
                state.add(new StateItem(key, XmlParser.getElement(other, key)));
            }
        }

        return state;
    }

}
