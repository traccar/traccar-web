package org.traccar.web.client.database;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface DatabaseServiceAsync {

    void authenticate(String login, String password,
            AsyncCallback<Boolean> callback);

}
