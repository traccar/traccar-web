package org.traccar.web.client;

import org.traccar.web.client.controller.LoginController;

import com.google.gwt.core.client.EntryPoint;

public class Traccar implements EntryPoint, LoginController.LoginHandler {

    @Override
    public void onModuleLoad() {
        new LoginController().login(this);
    }

    @Override
    public void onLogin() {
        new Application().run();
    }

}
