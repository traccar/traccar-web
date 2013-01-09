package org.traccar.web.client.model;

import com.sencha.gxt.data.shared.event.StoreAddEvent;
import com.sencha.gxt.data.shared.event.StoreClearEvent;
import com.sencha.gxt.data.shared.event.StoreDataChangeEvent;
import com.sencha.gxt.data.shared.event.StoreFilterEvent;
import com.sencha.gxt.data.shared.event.StoreHandlers;
import com.sencha.gxt.data.shared.event.StoreRecordChangeEvent;
import com.sencha.gxt.data.shared.event.StoreRemoveEvent;
import com.sencha.gxt.data.shared.event.StoreSortEvent;
import com.sencha.gxt.data.shared.event.StoreUpdateEvent;

public class BaseStoreHandlers<T> implements StoreHandlers<T> {

    @Override
    public void onAdd(StoreAddEvent<T> event) {
        onAnything();
    }

    @Override
    public void onRemove(StoreRemoveEvent<T> event) {
        onAnything();
    }

    @Override
    public void onFilter(StoreFilterEvent<T> event) {
        onAnything();
    }

    @Override
    public void onClear(StoreClearEvent<T> event) {
        onAnything();
    }

    @Override
    public void onUpdate(StoreUpdateEvent<T> event) {
        onAnything();
    }

    @Override
    public void onDataChange(StoreDataChangeEvent<T> event) {
        onAnything();
    }

    @Override
    public void onRecordChange(StoreRecordChangeEvent<T> event) {
        onAnything();
    }

    @Override
    public void onSort(StoreSortEvent<T> event) {
        onAnything();
    }

    public void onAnything() {
    }

}
