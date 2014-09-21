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

import com.google.gwt.user.client.rpc.GwtTransient;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.*;

@Entity
@Table(name = "devices")
public class Device implements Serializable {

    private static final long serialVersionUID = 1;
    public static final short DEFAULT_TIMEOUT = 5 * 60;

    public Device() {
    }

    public Device(Device device) {
        id = device.id;
        uniqueId = device.uniqueId;
        name = device.name;
        timeout = device.timeout;
        idleSpeedThreshold = device.idleSpeedThreshold;
    }

    @Id
    @GeneratedValue
    private long id;

    public long getId() {
        return id;
    }

    @OneToOne(fetch = FetchType.EAGER)
    @GwtTransient
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

    private transient boolean follow;

    public boolean isFollow() {
        return follow;
    }

    public void setFollow(boolean follow) {
        this.follow = follow;
    }

    private transient boolean recordTrace;

    public boolean isRecordTrace() {
        return recordTrace;
    }

    public void setRecordTrace(boolean recordTrace) {
        this.recordTrace = recordTrace;
    }

    /**
     * Consider device offline after 'timeout' seconds spent from last position
     */
    private int timeout = DEFAULT_TIMEOUT;

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    private double idleSpeedThreshold;

    public double getIdleSpeedThreshold() {
        return idleSpeedThreshold;
    }

    public void setIdleSpeedThreshold(double idleSpeedThreshold) {
        this.idleSpeedThreshold = idleSpeedThreshold;
    }

    @GwtTransient
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_devices",
            joinColumns = { @JoinColumn(name = "devices_id", referencedColumnName = "id") },
            inverseJoinColumns = { @JoinColumn(name = "users_id", referencedColumnName = "id") })
    private Set<User> users;

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Device device = (Device) o;

        if (uniqueId != null ? !uniqueId.equals(device.uniqueId) : device.uniqueId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return uniqueId != null ? uniqueId.hashCode() : 0;
    }
}
