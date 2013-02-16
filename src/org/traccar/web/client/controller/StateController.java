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
package org.traccar.web.client.controller;

import org.traccar.web.client.model.StateItem;
import org.traccar.web.client.model.StateItemProperties;
import org.traccar.web.client.model.StateReader;
import org.traccar.web.client.view.StateView;
import org.traccar.web.shared.model.Position;

import com.google.gwt.core.client.GWT;
import com.sencha.gxt.data.shared.ListStore;
import com.sencha.gxt.widget.core.client.ContentPanel;

public class StateController implements ContentController {

    private ListStore<StateItem> stateStore;

    private StateView stateView;

    public StateController() {
        StateItemProperties stateItemProperties = GWT.create(StateItemProperties.class);
        stateStore = new ListStore<StateItem>(stateItemProperties.id());
        stateView = new StateView(stateStore);
    }

    @Override
    public ContentPanel getView() {
        return stateView.getView();
    }

    @Override
    public void run() {
    }

    public void showState(Position position) {
        if (position != null) {
            stateStore.replaceAll(StateReader.getState(position));
        } else {
            stateStore.clear();
        }
    }

}
