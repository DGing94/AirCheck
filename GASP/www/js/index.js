var createLogObject = function (app) {
    var symptom = document.getElementById('symptomSelect').value,
        pain = document.getElementById('painRange').value;
    var now = new Date();

    var data = {
        symptom: symptom,
        severity: parseInt(pain, 10),
        ip: app.ip,
        location: app.location,
        time: now.toISOString()
    };

    console.log(data);

    return data;
};

var sendToDB = function (data) {
    var request = new XMLHttpRequest();
    request.open('POST', 'http://40.83.188.181:9200/user/symptoms', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(data));
};

let getIPAddress = function (success, fail) {
    fail = fail || function () {};
    var request = new XMLHttpRequest();
    request.open('GET', 'http://jsonip.com/', true);

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.response);
            success(data);
        } else {
            // We reached our target server, but it returned an error
            fail();
        }
    };

    request.onerror = function () {
        fail();
    };

    request.send();
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.locaiton = [];
        this.ip = null;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var self = this;
        this.receivedEvent('deviceready');
        getIPAddress(function (data) {
            self.ip = data.ip;
        });
        navigator.geolocation.getCurrentPosition(function (data) {
            self.location = [data.coords.latitude, data.coords.longitude];
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var self = this;
        document.querySelector('.js-log').addEventListener('click', function () {
            var data = createLogObject(self);
            sendToDB(data);
        }, false);
    }
};
