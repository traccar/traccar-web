package org.traccar.web.client.model;

import java.util.Date;
import java.util.List;

import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("dataService")
public interface DataService extends RemoteService {

    boolean authenticated();

    boolean authenticate(String login, String password);

    boolean register(String login, String password);

    List<Device> getDevices();

    Device addDevice(Device device);

    Device updateDevice(Device device);

    Device removeDevice(Device device);

    List<Position> getPositions(Device device, Date from, Date to);

    List<Position> getLatestPositions();

}
