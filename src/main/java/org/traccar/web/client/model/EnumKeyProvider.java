package org.traccar.web.client.model;

import com.sencha.gxt.data.shared.ModelKeyProvider;


public class EnumKeyProvider<T extends Enum<T>> implements ModelKeyProvider<T> {

    @Override
    public String getKey(T item) {
        return String.valueOf(item.ordinal());
    }

}
