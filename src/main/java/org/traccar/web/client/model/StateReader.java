package org.traccar.web.client.model;

import java.util.LinkedList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import org.traccar.web.client.ApplicationContext;
import org.traccar.web.client.i18n.Messages;
import org.traccar.web.shared.model.Position;

import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.XMLParser;

public class StateReader {

    private Messages i18n = GWT.create(Messages.class);

    private static String toString(Object object) {
        if (object != null) {
            return object.toString();
        }
        return null;
    }

    public List<StateItem> getState(Position position) {
        List<StateItem> state = new LinkedList<StateItem>();

        state.add(new StateItem(i18n.valid(), toString(position.getValid())));
        state.add(new StateItem(i18n.time(), ApplicationContext.getInstance().getFormatterUtil().getTimeFormat().format(position.getTime())));
        state.add(new StateItem(i18n.latitude(), toString(position.getLatitude())));
        state.add(new StateItem(i18n.longitude(), toString(position.getLongitude())));
        state.add(new StateItem(i18n.altitude(), toString(position.getAltitude())));
        state.add(new StateItem(i18n.speed(), ApplicationContext.getInstance().getFormatterUtil().getSpeedFormat().format(position.getSpeed())));
        state.add(new StateItem(i18n.course(), toString(position.getCourse())));
        state.add(new StateItem(i18n.power(), toString(position.getPower())));
        state.add(new StateItem(i18n.address(), position.getAddress()));

        String other = position.getOther();
        if (other != null) {
            try {
                NodeList nodes = XMLParser.parse(other).getFirstChild().getChildNodes();
                for (int i = 0; i < nodes.getLength(); i++) {
                    Node node = nodes.item(i);
                    state.add(new StateItem(node.getNodeName(), node.getFirstChild().getNodeValue()));
                }
            } catch (Exception error) {
            }
        }

        return state;
    }

}
