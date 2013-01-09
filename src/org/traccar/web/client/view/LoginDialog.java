package org.traccar.web.client.view;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Widget;
import com.sencha.gxt.widget.core.client.Window;
import com.sencha.gxt.widget.core.client.event.SelectEvent;
import com.sencha.gxt.widget.core.client.form.PasswordField;
import com.sencha.gxt.widget.core.client.form.TextField;

public class LoginDialog {

    private static LoginDialogUiBinder uiBinder = GWT.create(LoginDialogUiBinder.class);

    interface LoginDialogUiBinder extends UiBinder<Widget, LoginDialog> {
    }

    public interface LoginHandler {
        public void onLogin(String login, String password);
        public void onRegister(String login, String password);
    }

    private LoginHandler loginHandler;

    @UiField
    Window window;

    @UiField
    TextField login;

    @UiField
    PasswordField password;

    public LoginDialog(LoginHandler loginHandler) {
        this.loginHandler = loginHandler;
        uiBinder.createAndBindUi(this);
    }

    public void show() {
        window.show();
    }

    public void hide() {
        window.hide();
    }

    @UiHandler("loginButton")
    public void onLoginClicked(SelectEvent event) {
        loginHandler.onLogin(login.getText(), password.getText());
    }

    @UiHandler("registerButton")
    public void onRegisterClicked(SelectEvent event) {
        loginHandler.onRegister(login.getText(), password.getText());
    }

}
