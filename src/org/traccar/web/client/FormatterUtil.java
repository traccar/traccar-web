package org.traccar.web.client;

import java.util.Date;

import com.google.gwt.i18n.client.DateTimeFormat;

public class FormatterUtil {

    public DateTimeFormat getTimeFormat() {
        return DateTimeFormat.getFormat("yyyy-MM-dd HH:mm:ss");
    }

    public String formatTime(Date time) {
        return getTimeFormat().format(time);
    }

}
