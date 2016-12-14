/*
 * Copyright 2016 Anton Tananaev (anton@traccar.org)
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

var url = 'http://localhost:8082';
var token = 'TOKEN';

var map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    target: 'map',
    view: new ol.View({
        center: [0, 0],
        zoom: 2
    })
});

var ajax = function (method, url, callback) {
    var x = new XMLHttpRequest();
    x.open(method, url, true);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(JSON.parse(x.responseText));
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/json');
    }
    x.send()
};

ajax('GET', url + '/api/session?token=' + token, function(user) {
    ajax('GET', url + '/api/devices', function(devices) {

        var socket = new WebSocket('ws' + url.substring(4) + '/api/socket');

        socket.onclose = function (event) {
            console.log('socket closed');
        };

        socket.onmessage = function (event) {
            var data = JSON.parse(event.data);

            console.log(data);
        };

    });
});
