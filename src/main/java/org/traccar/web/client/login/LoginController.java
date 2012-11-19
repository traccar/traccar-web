package org.traccar.web.client.login;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.smartgwt.client.util.SC;
import org.traccar.web.client.database.GlobalDatabaseService;

public class LoginController implements LoginDialog.LoginHandler {

    private LoginDialog dialog;

    public interface LoginHandler {
        public void onLogin();
    }

    private LoginHandler loginHandler;

    public void login(LoginHandler loginHandler) {
        this.loginHandler = loginHandler;

        dialog = new LoginDialog();
        dialog.setLoginHandler(this);
        dialog.draw();
        dialog.centerInPage();
    }

    private boolean validate(String login, String password) {
        if (login == null || login.isEmpty() || password == null || password.isEmpty()) {
            SC.warn("Login and password fields must not be blank");
            return false;
        }
        return true;
    }

    private static abstract class AsyncCallbackHandler implements AsyncCallback<Boolean> {
        @Override
        public void onFailure(Throwable caught) {
            SC.warn("Remote procedure call error");
        }
    }

    private final AsyncCallback<Boolean> loginCallback = new AsyncCallbackHandler() {
        @Override
        public void onSuccess(Boolean result) {
            if (result) {
                if (loginHandler != null) {
                    dialog.destroy();
                    loginHandler.onLogin();
                }
            } else {
                SC.warn("Invalid login or password");
            }
        }
    };

    @Override
    public void onLogin(String login, String password) {
        if (validate(login, password)) {
            GlobalDatabaseService.getInstance().authenticate(login, password, loginCallback);
        }
    }

    private final AsyncCallback<Boolean> registerCallback = new AsyncCallbackHandler() {
        @Override
        public void onSuccess(Boolean result) {
            if (result) {
                if (loginHandler != null) {
                    dialog.destroy();
                    loginHandler.onLogin();
                }
            } else {
                SC.warn("Registration failed");
            }
        }
    };

    @Override
    public void onRegister(String login, String password) {
        if (validate(login, password)) {
            GlobalDatabaseService.getInstance().register(login, password, registerCallback);
        }
    }
}
