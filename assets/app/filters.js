app.filter('truncate', function () {
	return function (text, length, end) {
		if (text !== undefined) {
			if (isNaN(length)) {
				length = 30;
			}

			if (end === undefined) {
				end = "...";
			}

			if (text.length <= length || text.length - end.length <= length) {
				return text;
			} else {
				return String(text).substring(0, length - end.length) + end;
			}
		}
	};
});


app.filter('getById', function () {
	return function (input, id) {
		var i = 0,
			len = input.length;
		for (; i < len; i++) {
			if (+input[i].id == +id) {
				return input[i];
			}
		}
		return null;
	}
});

app.filter('inArray', ['$filter', function ($filter) {
	return function (list, arrayFilter, element) {
		if (arrayFilter) {
			return $filter("filter")(list, function (listItem) {
				return arrayFilter.indexOf(listItem[element]) != -1;
			});
		}
	};
}]);

app.filter('myStrictFilter', function($filter){
    return function(input, predicate){
        var r =[], l = input.length;
        if(typeof predicate.$ ==='undefined'){
            return input;
        }
        for(var i=0;i<l;i++){
            console.log(input[i].isPaid.toString());
            if(input[i].isPaid.toString()===predicate.$){
                r.push(input[i]);
            }
        }
        return r;
    }
});

app.filter('unique', function() {
    return function (arr, field) {
        var o = {}, i, l = arr.length, r = [];
        for(i=0; i<l;i+=1) {
            o[arr[i][field]] = arr[i];
        }
        for(i in o) {
            r.push(o[i]);
        }
        return r;
    };
})
app.filter('FileSize', function () {
    return function (size) {
        if (isNaN(size))
            size = 0;

        if (size < 1024)
            return size + ' Bytes';

        size /= 1024;

        if (size < 1024)
            return size.toFixed(2) + ' Kb';

        size /= 1024;

        if (size < 1024)
            return size.toFixed(2) + ' Mb';

        size /= 1024;

        if (size < 1024)
            return size.toFixed(2) + ' Gb';

        size /= 1024;

        return size.toFixed(2) + ' Tb';
    };
});
app.filter('numberTruncat',function() {
    return function (value) {
        if (isNaN(value)) {
            return value;
        }
        var abs = Math.abs(value);
        if (abs >= Math.pow(10, 12)){
        // trillion
            return (value / Math.pow(10, 12)).toFixed(1) + "t";
        }
        else if(abs < Math.pow(10, 12) &&  abs >= Math.pow(10, 9)){
        // billion
            return  (value / Math.pow(10, 9)).toFixed(1) + "b"
        }
        else if (abs < Math.pow(10, 9) &&   abs >= Math.pow(10, 6)){
        // million
        return  (value / Math.pow(10, 6)).toFixed(1) + "m";
        }
        else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)){
        // thousand
            return (value / Math.pow(10, 3)).toFixed(1)+"k";
        }
        else{
            return value;
        }
    };
});