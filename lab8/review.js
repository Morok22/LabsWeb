//Using LocalStorage -START-
var idMask = 'divId_';

var useLocalStorage = true;


window.onload = function() {
	if (useLocalStorage) {
		var online = navigator.onLine;
		if (online == true) {
			$.fn.showReviews();
			localStorage.clear();
		} else {
			$.fn.showReviews();
		}
	} else {
		$.fn.createIDB();
	}
};

$.fn.localStorageUsed = function() {
	var online = navigator.onLine;
	if (online == false) {
	    alert ("Pushed");
		var newDiv = $.fn.createNewDiv();
		var reviewId = $.fn.createReviewId();
		$("#comments").append(newDiv);
	    localStorage.setItem(idMask+reviewId, newDiv);
		$.fn.clearReviewInputs();
	} else {
		alert("Online");
		$.fn.clearReviewInputs();
	}
}

//Create New Review Function
$.fn.createNewDiv = function() {

	var comment = $('textarea[name = \'comment\']').val();
	var reviewId = $.fn.createReviewId();
		alert("Завантаження відгуку ...");
		var date = new Date();
		var dateString = "";
			dateString = date.getDate() + "." + (date.getMonth()+1) + "." + (date.getFullYear())
			+ ", " + date.getHours() + ":" + date.getMinutes();
			var newDiv = "<div data-divid='divId_'"+reviewId+"><p> " + comment +'<br>' + dateString +"</p>";

	    	return newDiv;
		} else {
		   	$.fn.errorAlert();
		}
}

//Search All Existing Id And Create +1 Id Value
$.fn.createReviewId = function() {
	var reviewId = 0;
	$('div[data-divid]').each(function() {
	    var jelId = $(this).attr('data-divid').slice(6);
	    if (jelId > reviewId)
			reviewId = jelId;
	});
	reviewId++;
	return reviewId;
}

//Show All Existing
$.fn.showReviews = function() {
	var lsLen = localStorage.length;
	if (lsLen > 0) {
		for (var i = 0; i < lsLen; i++){
			var key = localStorage.key(i);
			if (key.indexOf(idMask) == 0) {
				$("#comments").append(localStorage.getItem(key));
			}
		}
	}
}

//Using LocalStorage -END-


$.fn.createIDB = function() {

	var request = indexedDB.open('reviewsdatabase', 1);

	request.onupgradeneeded = function(e) {
		var db = e.target.result;

		if(!db.objectStoreNames.contains('reviews')) {
			var os = db.createObjectStore('reviews', { keyPath: "id", autoIncrement: true});
			os.createIndex('name', 'name',{unique:false});
		}
	}

	request.onsuccess = function(e) {
		console.log('Success opened DB')
		db = e.target.result;
		$.fn.showReviewsFromIndexDB();
	}

	request.onerror = function(e) {
		console.log('Error with DB open')
	}
}

//Create New Review On Button Click
function sendReview() {
	if (useLocalStorage) {
		alert("Using localStorage");
		$.fn.localStorageUsed();
	} else {
		$.fn.addReviewToIndexedDB();
	}
}

$.fn.clearReviewInputs = function() {
    document.getElementById("textarea").value = "";
}

$.fn.errorAlert = function() {
    alert("��� ��������� ��������� ��� ����");
}

$.fn.addReviewToIndexedDB = function() {
	var name = document.getElementById('send_user_name').value;
    var date = new Date();
	var dateString = "";
		dateString = date.getDate() + "." + (date.getMonth()+1) + "." + (date.getFullYear())
		+ ", " + date.getHours() + ":" + date.getMinutes();
	var reviewText = document.getElementById('send_review').value;

	var transaction = db.transaction(["reviews"], "readwrite");

	var store = transaction.objectStore("reviews");

	var review = {
		name: name,
		dateString: dateString,
		reviewText: reviewText
	}

	if(name !== null && name !== '' && reviewText !==null && reviewText !== '') {
		var request = store.add(review);
	}

	request.onsuccess = function(e) {
		alert("Success");
	}
}

$.fn.showReviewsFromIndexDB = function() {

	var transaction = db.transaction(["reviews"], "readonly");

	var store = transaction.objectStore("reviews");

	var index = store.index('name');


	index.openCursor().onsuccess = function(e) {
		var cursor = e.target.result;
		if (cursor) {
			var output = '<div class="review divider_bottom" data-divid="'
				    	+ idMask+cursor.value.id
				    	+  '"><div class="user_name"><h1>'
				    	+ cursor.value.name
				    	+ '</h1></div>'
				    	+ '<div class="review_post_time"><h4>'
				    	+ cursor.value.dateString
				    	+ '</h4></div>'
				    	+ '<div class="review_text"><p>'
				    	+ cursor.value.reviewText
				    	+ '</p></div>';
			cursor.continue();
		}
		$('#reviews').append(output);
	}
}
function appendForm(){
		var form = $("form[name = 'form']");
		form.css("display" , "block");
		$("#add_comment").replaceWith(form);
	}
