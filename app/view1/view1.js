'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/floatcalc', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', [function () {

        this.number = 125.875;
        this.getShiftCount = function (binary) {
            var parts = binary.split(".");
            return parts[0].length-1;
        };

        this.shift = function (binary) {
            var parts = binary.replace(".", "").split("");
            return parts.shift()+"."+parts.join("");
        };

        this.mantissa = function (binary) {
            var parts = binary.replace(".", "").split("");
            parts.shift();

            return parts.join("")+Array(24-parts.length).join("0") ;
        };

    }]).filter('toBinaryWithComma', function () {
    return function (input, uppercase) {
        if (input < 0) {
            input = input * -1;
        }
        var afterComma = input % 1;
        var beforeComma = Math.floor(input);
        var beforeCommaoutput = "";
        while (beforeComma !== 0) {
            var rest = beforeComma % 2;
            beforeComma = Math.floor(beforeComma / 2);
            beforeCommaoutput = rest + beforeCommaoutput;
        }
        var afterCommaoutput = "";
        var i = -1;

        if (afterComma === 0){
            return beforeCommaoutput;
        }
        while (afterComma !== 0 && i > -23) {
            if (afterComma >= Math.pow(2, i)) {
                afterComma -= Math.pow(2, i);
                afterCommaoutput = "1" + afterCommaoutput;
            }
            else {
                afterCommaoutput = "0" + afterCommaoutput;
            }
            i--;
        }
        return beforeCommaoutput + "." + afterCommaoutput;
    }
}).filter('float64ToInt64Binary', function () {
    return function (input, uppercase) {
        var positiveinput = input;
        if (input < 0) {
            positiveinput = input * -1;
        }
        var view = new DataView(new ArrayBuffer(4));
        view.setFloat32(0, positiveinput);
        var binary = view.getInt32(0).toString(2);

        while (binary.length < 31) {
            binary = "0" + binary;
        }
        if (input < 0) {
            binary = "1" + binary;
        }
        else {
            binary = "0" + binary;
        }

        return binary;
    };
});
