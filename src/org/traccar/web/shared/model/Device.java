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
package org.traccar.web.shared.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "devices")
public class Device implements Serializable {

    private static final long serialVersionUID = 1;

    public Device() {
    }

    public Device(Device device) {
        id = device.id;
        uniqueId = device.uniqueId;
        name = device.name;
    }

    @Id
    @GeneratedValue
    private long id;

    public long getId() {
        return id;
    }

    @OneToOne(fetch = FetchType.EAGER)
    private Position latestPosition;

    public void setLatestPosition(Position latestPosition) {
        this.latestPosition = latestPosition;
    }

    public Position getLatestPosition() {
        return latestPosition;
    }

    @Column(unique = true)
    private String uniqueId;

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    private String name;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
