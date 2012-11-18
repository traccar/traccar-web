package org.traccar.web.client;

import java.util.List;

import org.traccar.web.client.database.DatabaseService;
import org.traccar.web.client.database.DatabaseServiceAsync;
import org.traccar.web.client.login.LoginDialog;
import org.traccar.web.shared.model.Device;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.smartgwt.client.util.SC;

/**
 * Entry point class
 */
public class Traccar implements EntryPoint {

    private DevicePanel devicePanel;
    private ArchivePanel archivePanel;
    private MapPanel mapPanel;

    /**
     * Entry point method
     */
    @Override
    public void onModuleLoad() {

        final DatabaseServiceAsync databaseService = GWT.create(DatabaseService.class);

        final AsyncCallback<List<Device>> callback2 = new AsyncCallback<List<Device>>() {
            @Override
            public void onFailure(Throwable caught) {
                SC.say("onFailure2: " + caught.toString());
            }
            @Override
            public void onSuccess(List<Device> result) {
                String s = "";
                if (result!= null) {
                    for (Device d : result) {
                        s += d.getName() + " ";
                    }
                }
                SC.say("Devices: " + s);
            }
        };

        final AsyncCallback<Boolean> callback = new AsyncCallback<Boolean>() {
            @Override
            public void onFailure(Throwable caught) {
                SC.say("onFailure: " + caught.toString());
            }

            @Override
            public void onSuccess(Boolean result) {
                databaseService.getDevices(callback2);
            }
        };

        final LoginDialog loginDialog = new LoginDialog();

        loginDialog.setLoginHandler(new LoginDialog.LoginHandler() {
            private boolean validate(String login, String password) {
                if (login == null || login.isEmpty() || password == null || password.isEmpty()) {
                    SC.warn("Login and password fields must not be blank");
                    return false;
                }
                return true;
            }

            @Override
            public void onLogin(String login, String password) {
                if (validate(login, password)) {
                    loginDialog.destroy();
                    databaseService.authenticate(login, password, callback);
                }
            }

            @Override
            public void onRegister(String login, String password) {
                if (validate(login, password)) {
                    loginDialog.destroy();
                    databaseService.register(login, password, callback);
                }
            }
        });

        loginDialog.draw();
        loginDialog.centerInPage();

        /*devicePanel = new DevicePanel();
        devicePanel.setWidth("20%");
        devicePanel.setShowResizeBar(true);

        mapPanel = new MapPanel();
        mapPanel.setWidth("80%");

        HLayout hLayout = new HLayout();
        hLayout.setHeight("70%");
        hLayout.addMember(devicePanel);
        hLayout.addMember(mapPanel);
        hLayout.setShowResizeBar(true);
        hLayout.setResizeBarTarget("next");

        archivePanel = new ArchivePanel();
        archivePanel.setHeight("30%");

        VLayout mainLayout = new VLayout();
        mainLayout.setWidth100();
        mainLayout.setHeight100();
        mainLayout.addMember(hLayout);
        mainLayout.addMember(archivePanel);
        mainLayout.draw();*/
    }
}
