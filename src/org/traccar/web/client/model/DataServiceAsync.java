package org.traccar.web.client.model;

import java.util.Date;
import java.util.List;

import org.traccar.web.shared.model.Device;
import org.traccar.web.shared.model.Position;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface DataServiceAsync {

    void authenticated(AsyncCallback<Boolean> callback);

    void login(String login, String password, AsyncCallback<Boolean> callback);

    void logout(AsyncCallback<Boolean> callback);

    void register(String login, String password, AsyncCallback<Boolean> callback);

    void getDevices(AsyncCallback<List<Device>> callback);

    void addDevice(Device device, AsyncCallback<Device> callback);

    void updateDevice(Device device, AsyncCallback<Device> callback);

    void removeDevice(Device device, AsyncCallback<Device> callback);

    void getLatestPositions(AsyncCallback<List<Position>> callback);

    void getPositions(Device device, Date from, Date to, AsyncCallback<List<Position>> callback);

}
