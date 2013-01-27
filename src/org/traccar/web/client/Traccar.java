/*
 * Copyright 2013 Anton Tananaev (anton.tananaev@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.traccar.web.client;

import org.traccar.web.client.controller.LoginController;
import org.traccar.web.shared.model.XmlParser;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.xml.client.DOMException;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.XMLParser;
import com.sencha.gxt.widget.core.client.box.AlertMessageBox;

public class Traccar implements EntryPoint, LoginController.LoginHandler {

    @Override
    public void onModuleLoad() {
        //new LoginController().login(this);
    	
    	try {
    		String messageXml = "<a>1</a><b>2</b>";
			//parse the XML document into a DOM
    		String x = XmlParser.getElement(messageXml, "b");
    		XmlParser.enumerateElements(messageXml);
			
			
			
			
			
			// find the sender's display name in an attribute of the <from> tag
			/*Node fromNode = messageDom.getElementsByTagName("from").item(0);
			String from = ((Element)fromNode).getAttribute("displayName");
			fromLabel.setText(from);
			
			// get the subject using Node's getNodeValue() function
			String subject = messageDom.getElementsByTagName("subject").item(0).getFirstChild().getNodeValue();
			subjectLabel.setText(subject);
			
			// get the message body by explicitly casting to a Text node
			Text bodyNode = (Text)messageDom.getElementsByTagName("body").item(0).getFirstChild();
			String body = bodyNode.getData();
			bodyLabel.setText(body);*/
			
			new AlertMessageBox("Info", "a=" + x).show();

		} catch (DOMException e) {
			new AlertMessageBox("Error", e.getMessage()).show();
		}
    }

    @Override
    public void onLogin() {
        new Application().run();
    }

}
