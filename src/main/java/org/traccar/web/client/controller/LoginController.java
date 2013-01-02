package org.traccar.web.client.controller;

import org.traccar.web.client.Traccar;
import org.traccar.web.client.database.BaseAsyncCallback;
import org.traccar.web.client.view.LoginDialog;

import com.smartgwt.client.util.SC;

public class LoginController implements LoginDialog.LoginHandler {

    private LoginDialog dialog;

    public interface LoginHandler {
        public void onLogin();
    }

    private LoginHandler loginHandler;

    public void login(final LoginHandler loginHandler) {
        this.loginHandler = loginHandler;

        Traccar.getDatabaseService().authenticated(new BaseAsyncCallback<Boolean>() {
            @Override
            public void onSuccess(Boolean result) {

                if (result) {
                    loginHandler.onLogin();
                } else {
                    dialog = new LoginDialog();
                    dialog.setLoginHandler(LoginController.this);
                    dialog.draw();
                    dialog.centerInPage();
                }
            }
        });
    }

    private boolean validate(String login, String password) {
        if (login == null || login.isEmpty() || password == null || password.isEmpty()) {
            SC.warn(Traccar.getConstants().blankLoginPassword());
            return false;
        }
        return true;
    }

    @Override
    public void onLogin(String login, String password) {
        if (validate(login, password)) {
            Traccar.getDatabaseService().authenticate(login, password, new BaseAsyncCallback<Boolean>() {
                @Override
                public void onSuccess(Boolean result) {
                    if (result) {
                        if (loginHandler != null) {
                            dialog.destroy();
                            loginHandler.onLogin();
                        }
                    } else {
                        SC.warn(Traccar.getConstants().invalidLoginPassword());
                    }
                }
            });
        }
    }

    @Override
    public void onRegister(String login, String password) {
        if (validate(login, password)) {
            Traccar.getDatabaseService().register(login, password, new BaseAsyncCallback<Boolean>() {
                @Override
                public void onSuccess(Boolean result) {
                    if (result) {
                        if (loginHandler != null) {
                            dialog.destroy();
                            loginHandler.onLogin();
                        }
                    } else {
                        SC.warn(Traccar.getConstants().registrationError());
                    }
                }
            });
        }
    }

}
