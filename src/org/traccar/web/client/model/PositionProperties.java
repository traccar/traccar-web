package org.traccar.web.client.model;

import java.util.Date;

import org.traccar.web.shared.model.Position;

import com.sencha.gxt.core.client.ValueProvider;
import com.sencha.gxt.data.shared.ModelKeyProvider;
import com.sencha.gxt.data.shared.PropertyAccess;

public interface PositionProperties extends PropertyAccess<Position> {

    ModelKeyProvider<Position> id();

    ValueProvider<Position, Date> time();

    ValueProvider<Position, Boolean> valid();

    ValueProvider<Position, Double> latitude();

    ValueProvider<Position, Double> longitude();

    ValueProvider<Position, Double> altitude();

    ValueProvider<Position, Double> speed();

    ValueProvider<Position, Double> course();

    ValueProvider<Position, Double> power();

    ValueProvider<Position, String> address();

}
