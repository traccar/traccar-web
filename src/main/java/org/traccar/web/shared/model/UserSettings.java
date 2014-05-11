package org.traccar.web.shared.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="user_settings")
public class UserSettings implements Serializable {

    private static final long serialVersionUID = 1;
    public static final short DEFAULT_TIME_PRINT_INTERVAL = 10;


    @Id
    @GeneratedValue
    private long id;

    public UserSettings() {
        speedUnit = SpeedUnit.knots;
        timePrintInterval = DEFAULT_TIME_PRINT_INTERVAL;
    }

    public enum SpeedUnit {
        knots,
        kilometersPerHour,
        milesPerHour
    }

    @Enumerated(EnumType.STRING)
    private SpeedUnit speedUnit;

    public void setSpeedUnit(SpeedUnit speedUnit) {
        this.speedUnit = speedUnit;
    }

    public SpeedUnit getSpeedUnit() {
        return speedUnit;
    }

    /**
     * Interval of printing time on recorded trace in minutes based on position time
     */
    private Short timePrintInterval;

    public Short getTimePrintInterval() {
        return timePrintInterval;
    }

    public void setTimePrintInterval(Short timePrintInterval) {
        this.timePrintInterval = timePrintInterval;
    }
}
