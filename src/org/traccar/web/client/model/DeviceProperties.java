package org.traccar.web.client.model;

import org.traccar.web.shared.model.Device;

import com.sencha.gxt.core.client.ValueProvider;
import com.sencha.gxt.data.shared.ModelKeyProvider;
import com.sencha.gxt.data.shared.PropertyAccess;

public interface DeviceProperties extends PropertyAccess<Device> {

    ModelKeyProvider<Device> id();

    ValueProvider<Device, String> uniqueId();

    ValueProvider<Device, String> name();

}
