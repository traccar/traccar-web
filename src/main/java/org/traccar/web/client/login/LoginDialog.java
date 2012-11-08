package org.traccar.web.client.login;

import com.smartgwt.client.widgets.Window;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.PasswordItem;
import com.smartgwt.client.widgets.form.fields.TextItem;
import com.smartgwt.client.widgets.form.fields.ButtonItem;
import com.smartgwt.client.types.Alignment;
import com.smartgwt.client.types.TitleOrientation;
import com.smartgwt.client.widgets.layout.Layout;
import com.smartgwt.client.widgets.form.fields.ToolbarItem;
import com.smartgwt.client.widgets.IButton;
import com.smartgwt.client.widgets.Button;

public class LoginDialog extends Window {

	private DynamicForm form;

	public LoginDialog() {

		// Window properties
        setTitle("User Authentication");
        setShowCloseButton(false);
        setShowMinimizeButton(false);
        setAutoSize(true);

        // Login form
		form = new DynamicForm();
        form.setHeight100();
        form.setWidth100();
        TextItem loginEdit = new TextItem();
        loginEdit.setTitle("Login");
        PasswordItem passwordEdit = new PasswordItem();
        passwordEdit.setTitle("Password");

        ToolbarItem toolbarItem = new ToolbarItem();
        toolbarItem.setButtons(new IButton("Login"), new IButton("Register"));

        form.setFields(loginEdit, passwordEdit, toolbarItem);
        form.setCellPadding(5);

        Layout layout = new Layout();
        layout.setPadding(10);

        layout.addMember(form);

        addItem(layout);
    }

}
