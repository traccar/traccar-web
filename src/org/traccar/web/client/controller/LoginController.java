package org.traccar.web.client.controller;

import org.traccar.web.client.Application;
import org.traccar.web.client.model.BaseAsyncCallback;
import org.traccar.web.client.view.LoginDialog;

import com.sencha.gxt.widget.core.client.box.AlertMessageBox;

public class LoginController implements LoginDialog.LoginHandler {

    private LoginDialog dialog;

    public interface LoginHandler {
        public void onLogin();
    }

    private LoginHandler loginHandler;

    public void login(final LoginHandler loginHandler) {
        this.loginHandler = loginHandler;

        Application.getDataService().authenticated(new BaseAsyncCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean result) {
                if (result) {
                    loginHandler.onLogin();
                } else {
                    dialog = new LoginDialog(LoginController.this);
                    dialog.show();
                }
            }
        });
    }

    private boolean validate(String login, String password) {
        if (login == null || login.isEmpty() || password == null || password.isEmpty()) {
            new AlertMessageBox("Error", "User name and password must not be empty").show();
            return false;
        }
        return true;
    }

    @Override
    public void onLogin(String login, String password) {
        if (validate(login, password)) {
            Application.getDataService().login(login, password, new BaseAsyncCallback<Boolean>() {
                @Override
                public void onSuccess(Boolean result) {
                    if (result) {
                        if (loginHandler != null) {
                            dialog.hide();
                            loginHandler.onLogin();
                        }
                    } else {
                        new AlertMessageBox("Error", "User name or password is invalid").show();
                    }
                }
            });
        }
    }

    @Override
    public void onRegister(String login, String password) {
        if (validate(login, password)) {
            Application.getDataService().register(login, password, new BaseAsyncCallback<Boolean>() {
                @Override
                public void onSuccess(Boolean result) {
                    if (result) {
                        if (loginHandler != null) {
                            dialog.hide();
                            loginHandler.onLogin();
                        }
                    } else {
                        new AlertMessageBox("Error", "Registration error").show();
                    }
                }
            });
        }
    }

}
