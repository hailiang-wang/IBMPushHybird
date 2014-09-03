/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var config = {
    host: "hwcafe.mybluemix.net",
    path: '/mobile/auth/linkedin',
    pushAppId : 'a87432fd-2d2e-43d4-91c9-0832af4d4aec',
    pushAppRoute: 'hwcafe.mybluemix.net',
    pushAppSecret : '049180170bdc55b6428f65f96f80518b37296000',
    debug: true,
    weinre: 'http://192.168.1.108:9088/target/target-script-min.js#musa'
};

    function _setupPushNotificationService(username){
        IBMBluemix.hybrid.initialize({applicationId: config.pushAppId,
                    applicationRoute: config.pushAppRoute,
                    applicationSecret: config.pushAppSecret}).then(function(){
            IBMPush.hybrid.initializeService().then(
                function(pushService){
                    console.log("Initialized push successfully");
                    _registerDevice(pushService, username);
                }, 
                function(err){
                    console.error("Error initializing the Push SDK");
            });
        }); 
    }
    // use a timeout function can make backgroud-foreground works.
    // but close-foreground still does not work.
    // the message arrives, but when the app wake up, the cordova method does not called.
    // 
    function _handleApplePushNotificationArrival(){
        var strBuff = '(function(msg){ '
            + 'setTimeout(function(){alert(msg)},4000);'
            + '})'
        return strBuff;
    }    

    function _registerDevice(push, username){
    	// handleApplePushNotificationArrival is defined as globally in app.js
        push.registerDevice(device.uuid, username, _handleApplePushNotificationArrival()).then(
            function(response) {
                console.log('bluemix push registered device ' + JSON.stringify(response));
            }, 
            function(error) {    
                console.log('bluemix push error registering device ' + error);
            }
        );
    }

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        _setupPushNotificationService('hain_wang');
    }
};
