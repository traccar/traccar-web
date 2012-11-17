package org.traccar.web.client.database;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("databaseService")
public interface DatabaseService extends RemoteService {

    boolean authenticate(String login, String password);

}
