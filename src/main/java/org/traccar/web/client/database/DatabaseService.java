package org.traccar.web.client.database;

import java.util.List;

import org.traccar.web.shared.model.Device;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("databaseService")
public interface DatabaseService extends RemoteService {

    boolean authenticate(String login, String password);

    boolean register(String login, String password);

    List<Device> getDevices();

}
