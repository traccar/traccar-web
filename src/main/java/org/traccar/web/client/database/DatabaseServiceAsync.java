package org.traccar.web.client.database;

import java.util.Date;
import java.util.List;

import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface DatabaseServiceAsync {

    void authenticate(String login, String password, AsyncCallback<Boolean> callback);

    void register(String login, String password, AsyncCallback<Boolean> callback);

    void getDevices(AsyncCallback<List<Device>> callback);

    void getPositions(Device device, Date from, Date to, AsyncCallback<List<Position>> callback);

}
