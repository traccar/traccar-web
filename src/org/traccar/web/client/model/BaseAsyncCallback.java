package org.traccar.web.client.model;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.sencha.gxt.widget.core.client.box.AlertMessageBox;

public class BaseAsyncCallback<T> implements AsyncCallback<T> {

    @Override
    public void onFailure(Throwable caught) {
        new AlertMessageBox("Error", "Remote procedure call error").show();
    }

    @Override
    public void onSuccess(T result) {
    }

}
