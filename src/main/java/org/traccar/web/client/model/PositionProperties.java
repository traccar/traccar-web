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
