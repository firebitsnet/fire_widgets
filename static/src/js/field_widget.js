odoo.define('my_field_widget', function (require) {
"use strict";

var AbstractField = require('web.AbstractField');
var fieldRegistry = require('web.field_registry');

var mapField = AbstractField.extend({
    tagName: 'div',
    supportedFieldTypes: ['char'],
    /**
     * @override
     */
    init: function () {
        this._super.apply(this, arguments);
        this.width = "100%";
        this.height = "300px";
    },
    /**
     * @override
     */
    start: function () {
        return this._super.apply(this, arguments).then(this.prepareWidgetOptions.bind(this));
    },
    /**
     * Prepare widget options
     */
    prepareWidgetOptions: function () {
        if (this.mode === 'edit') {
            // update 'width', 'height' if exists
            if (this.attrs.options) {
                if (this.attrs.options.hasOwnProperty('width')) {
                    this.width = this.attrs.options.width;
                }
                if (this.attrs.options.hasOwnProperty('height')) {
                    this.height = this.attrs.options.height;
                }
            }
        }
    },
    /**
     * @override
     */
    _renderEdit: function () {
        var markers = [];
        var inthis = this;

        this.$el.append('<div id="map"></div>')
        var dmap = this.$el.get(0);

        var uluru = {lat: 20.87423, lng: 36.70355};
        
        var map = new google.maps.Map(dmap, {zoom: 4,center: uluru});
        inthis.$el.css({"width": this.width, "height": this.height, "position": "static", "overflow": "visible"});
        
        google.maps.event.addListenerOnce(map, 'idle', function(){
            // do something only the first time the map is loaded
            inthis.$el.css({"width": inthis.width, "height": inthis.height, "position": "static", "overflow": "visible"});

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function showPosition(position) {
                    uluru = {lat: position.coords.latitude, lng: position.coords.longitude};
                    map = new google.maps.Map(dmap, {zoom: 6,center: uluru});
                    var old_latlng = inthis.value;

                    if (old_latlng != false && old_latlng != ""){
                        var lat = parseFloat(old_latlng.split(",")[0]);
                        var lng = parseFloat(old_latlng.split(",")[1]);
                        var current_marker = {lat: lat, lng: lng};
                        var marker = new google.maps.Marker({position: current_marker, map: map});
                        map.panTo(marker.position);
                        markers.push(marker);
                    }

                    google.maps.event.addListener(map, 'click', function(event) {

                        if (markers.length > 1){
                            for (var i = 0; i < markers.length; i++) {
                                markers[i].setMap(null);
                            }
                        }

                        var marker = new google.maps.Marker({
                            position: event.latLng, 
                            map: map
                        });
                        markers.push(marker);

                        var myLatLng = event.latLng;
                        var lat = myLatLng.lat();
                        var lng = myLatLng.lng();
                        inthis._setValue(lat+","+lng);
                       
                    });
                });
            }
        });
    },
    /**
     * @override
     */
    _renderReadonly: function () {
        this.$el.empty();
        this.$el.append('<iframe src="https://maps.google.com/maps?q='+this.value+'&hl=es;z=14&amp;output=embed" width="'+this.width+'" height="'+this.height+'" frameborder="0" style="border:0" allowfullscreen></iframe>');
        $( this.$el.get(0) ).css({"width": this.width, "height": this.height});
    }
});

fieldRegistry.add('fire_add_loc', mapField);

var mapshowField = AbstractField.extend({
    tagName: 'div',
    supportedFieldTypes: ['char'],
    init: function () {
        this._super.apply(this, arguments);
        this.width = "100%";
        this.height = "300px";
    },
    /**
     * @override
     */
    start: function () {
        return this._super.apply(this, arguments).then(this.prepareWidgetOptions.bind(this));
    },
    /**
     * Prepare widget options
     */
    prepareWidgetOptions: function () {
        if (this.mode === 'edit') {
            // update 'width', 'height' if exists
            if (this.attrs.options) {
                if (this.attrs.options.hasOwnProperty('width')) {
                    this.width = this.attrs.options.width;
                }
                if (this.attrs.options.hasOwnProperty('height')) {
                    this.height = this.attrs.options.height;
                }
            }
        }
    },
    /**
     * @override
     */
    _renderEdit: function () {
        this.$el.empty();
        // this.$el.append('<iframe src="https://www.google.com/maps/embed/v1/place?q='+this.value+'&hl=es;z=14&amp;output=embed&amp;key=YOUR_API_KEY" width="'+this.width+'" height="'+this.height+'" frameborder="0" style="border:0" allowfullscreen></iframe>');
        this.$el.append('<iframe src="https://maps.google.com/maps?q='+this.value+'&hl=es;z=14&amp;output=embed" width="'+this.width+'" height="'+this.height+'" frameborder="0" style="border:0" allowfullscreen></iframe>');
        $( this.$el.get(0) ).css({"width": this.width, "height": this.height});
    },
    /**
     * @override
     */
    _renderReadonly: function () {
        this.$el.append('<iframe src="https://maps.google.com/maps?q='+this.value+'&hl=es;z=14&amp;output=embed" width="'+this.width+'" height="'+this.height+'" frameborder="0" style="border:0" allowfullscreen></iframe>');
        $( this.$el.get(0) ).css({"width": this.width, "height": this.height});
    }
});

fieldRegistry.add('fire_show_loc', mapshowField);

return {
    colorField: colorField,
    mapField: mapField,
    mapshowField: mapshowField,
};
});
