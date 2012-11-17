package org.traccar.web.shared.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Index;

@Entity
@Table(name = "positions")
public class Position {

    @Id
    @GeneratedValue
    long id;

    @ManyToOne
    @Index(name = "positionsIndex")
    private Device device;

    public void setDevice(Device device) {
        this.device = device;
    }

    public Device getDevice() {
        return device;
    }

    @Index(name = "positionsIndex")
    private Date time;

    public void setTime(Date time) {
        this.time = time;
    }

    public Date getTime() {
        return time;
    }

    // TODO: other

}
