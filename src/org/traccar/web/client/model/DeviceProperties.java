package org.traccar.web.client.model;

import org.traccar.web.shared.model.Device;

import com.google.gwt.editor.client.Editor.Path;
import com.sencha.gxt.core.client.ValueProvider;
import com.sencha.gxt.data.shared.LabelProvider;
import com.sencha.gxt.data.shared.ModelKeyProvider;
import com.sencha.gxt.data.shared.PropertyAccess;

public interface DeviceProperties extends PropertyAccess<Device> {

    ModelKeyProvider<Device> id();

    ValueProvider<Device, String> uniqueId();

    ValueProvider<Device, String> name();

    @Path("name")
    LabelProvider<Device> label();

}
