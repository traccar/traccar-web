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
Ext.define('Traccar.store.UserAttributes', {
    extend: 'Ext.data.Store',
    model: 'Traccar.model.KnownAttribute',
    proxy: 'memory',

    data: [{
        key: 'mail.smtp.host',
        name: Strings.sharedAttributeMailSmtpHost,
        type: 'string'
    }, {
        key: 'mail.smtp.port',
        name: Strings.sharedAttributeMailSmtpPort,
        type: 'number',
        allowDecimals: false,
        minValue: 1,
        maxValue: 65535
    }, {
        key: 'mail.smtp.starttls.enable',
        name: Strings.sharedAttributeMailSmtpStarttlsEnable,
        type: 'boolean'
    }, {
        key: 'mail.smtp.starttls.required',
        name: Strings.sharedAttributeMailSmtpStarttlsRequired,
        type: 'boolean'
    }, {
        key: 'mail.smtp.ssl.enable',
        name: Strings.sharedAttributeMailSmtpSslEnable,
        type: 'boolean'
    }, {
        key: 'mail.smtp.ssl.trust',
        name: Strings.sharedAttributeMailSmtpSslTrust,
        type: 'string'
    }, {
        key: 'mail.smtp.ssl.protocols',
        name: Strings.sharedAttributeMailSmtpSslProtocols,
        type: 'string'
    }, {
        key: 'mail.smtp.from',
        name: Strings.sharedAttributeMailSmtpFrom,
        type: 'string'
    }, {
        key: 'mail.smtp.auth',
        name: Strings.sharedAttributeMailSmtpAuth,
        type: 'boolean'
    }, {
        key: 'mail.smtp.username',
        name: Strings.sharedAttributeMailSmtpUsername,
        type: 'string'
    }, {
        key: 'mail.smtp.password',
        name: Strings.sharedAttributeMailSmtpPassword,
        type: 'string'
    }, {
        key: 'web.liveRouteLength',
        name: Strings.sharedAttributeWebLiveRouteLength,
        type: 'number',
        allowDecimals: false
    }]
});
