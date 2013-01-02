package org.traccar.web.client.database;

import java.util.Date;
import java.util.List;

import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("databaseService")
public interface DatabaseService extends RemoteService {

    boolean authenticated();

    boolean authenticate(String login, String password);

    boolean register(String login, String password);

    List<Device> getDevices();

    boolean storeDevice(Device device);

    boolean removeDevice(Device device);

    List<Position> getPositions(Device device, Date from, Date to);

}
