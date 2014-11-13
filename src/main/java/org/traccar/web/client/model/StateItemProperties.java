package org.traccar.web.client.model;

import com.google.gwt.editor.client.Editor.Path;
import com.sencha.gxt.core.client.ValueProvider;
import com.sencha.gxt.data.shared.ModelKeyProvider;
import com.sencha.gxt.data.shared.PropertyAccess;

public interface StateItemProperties extends PropertyAccess<StateItem> {

    @Path("name")
    ModelKeyProvider<StateItem> id();

    ValueProvider<StateItem, String> name();

    ValueProvider<StateItem, String> value();

}
