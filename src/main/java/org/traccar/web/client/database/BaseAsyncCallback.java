package org.traccar.web.client.database;

import org.traccar.web.client.Traccar;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.smartgwt.client.util.SC;

public class BaseAsyncCallback<T> implements AsyncCallback<T> {

    @Override
    public void onFailure(Throwable caught) {
        SC.warn(Traccar.getConstants().remoteProcedureCallError());
    }

    @Override
    public void onSuccess(T result) {
    }

}
