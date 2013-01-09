package org.traccar.web.shared.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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

    @Column(unique = true)
    private String uniqueId;

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    @Column(unique = true)
    private String name;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
