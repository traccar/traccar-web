/*
 * Copyright 2017 Anton Tananaev (anton@traccar.org)
 * Copyright 2017 Andrey Kunitsyn (andrey@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.store.ReportPeriods', {
    extend: 'Ext.data.Store',
    fields: ['key', 'name'],

    data: [{
        key: 'custom',
        name: Strings.reportCustom
    }, {
        key: 'today',
        name: Strings.reportToday
    }, {
        key: 'yesterday',
        name: Strings.reportYesterday
    }, {
        key: 'thisWeek',
        name: Strings.reportThisWeek
    }, {
        key: 'previousWeek',
        name: Strings.reportPreviousWeek
    }, {
        key: 'thisMonth',
        name: Strings.reportThisMonth
    }, {
        key: 'previousMonth',
        name: Strings.reportPreviousMonth
    }]
});
