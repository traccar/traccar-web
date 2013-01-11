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
