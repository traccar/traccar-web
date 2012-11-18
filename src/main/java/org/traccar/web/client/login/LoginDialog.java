package org.traccar.web.client.login;

import org.traccar.web.client.Style;

import com.smartgwt.client.widgets.IButton;
import com.smartgwt.client.widgets.Window;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.PasswordItem;
import com.smartgwt.client.widgets.form.fields.TextItem;
import com.smartgwt.client.widgets.form.fields.ToolbarItem;
import com.smartgwt.client.widgets.layout.Layout;

public class LoginDialog extends Window {

    public LoginDialog() {

        // Window properties
        setTitle("User Authentication");
        setShowCloseButton(false);
        setShowMinimizeButton(false);
        setAutoSize(true);

        // Login form
        final DynamicForm form = new DynamicForm();
        form.setHeight100();
        form.setWidth100();
        final TextItem loginEdit = new TextItem();
        loginEdit.setTitle("Login");
        final PasswordItem passwordEdit = new PasswordItem();
        passwordEdit.setTitle("Password");

        final ToolbarItem toolbarItem = new ToolbarItem();
        toolbarItem.setButtons(
                new IButton("Login", new ClickHandler() {
                    @Override
                    public void onClick(ClickEvent event) {
                        if (loginHandler != null) {
                            loginHandler.onLogin(
                                    loginEdit.getValueAsString(), passwordEdit.getValueAsString());
                        }
                    }
                }),
                new IButton("Register", new ClickHandler() {
                    @Override
                    public void onClick(ClickEvent event) {
                        if (loginHandler != null) {
                            loginHandler.onRegister(
                                    loginEdit.getValueAsString(), passwordEdit.getValueAsString());
                        }
                    }
                }));

        form.setFields(loginEdit, passwordEdit, toolbarItem);
        form.setCellPadding(Style.getCellPadding());

        final Layout layout = new Layout();
        layout.setPadding(Style.getPadding());

        layout.addMember(form);

        addItem(layout);
    }

    public interface LoginHandler {
        public void onLogin(String login, String password);
        public void onRegister(String login, String password);
    }

    private LoginHandler loginHandler;

    public void setLoginHandler(LoginHandler loginHandler) {
        this.loginHandler = loginHandler;
    }

}
