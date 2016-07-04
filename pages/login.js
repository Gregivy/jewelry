var openScanner = require("./scanner.js");

function switchBusy() {
	login.set('enabled',!login.get('enabled'));
	activityIndicator.set('visible',!activityIndicator.get('visible'));
}

var iabSettings = 'hidden=yes,clearcache=no,clearsessioncache=no';

var page = module.exports = new tabris.Page({
	title: "Ekim. Авторизация",
	topLevel: true
});

page.on("appear", function() {
	var un = localStorage.getItem("username");
	var pw = localStorage.getItem("password");
	if (un != undefined) username.set("text",un);
	if (pw != undefined) password.set("text",pw);
})

var activityIndicator = new tabris.ActivityIndicator({
  centerX: 0,
  centerY: 0,
  visible: false
}).appendTo(page);

var logo = new tabris.ImageView({
	image: {src:"images/logo.jpg",scale:1},
	background: "rgb(255, 255, 255)",
	layoutData: {top: 0, left: 0, right: 0, height: 200}
}).appendTo(page);

var username = new tabris.TextInput({
	message: "Введите ваш логин",
	layoutData: {top: [logo,30], left: 50, right: 50}
}).appendTo(page);

var password = new tabris.TextInput({
	message: "Введите ваш пароль",
	type: "password",
	layoutData: {top: [username,10], left: 50, right: 50}
}).appendTo(page);

var login = new tabris.Button({
	text: "Войти",
	textColor: "#ffffff",
	background: "#217aba",
	layoutData: {left: 50, right:50 , top: [password,10]}
}).appendTo(page);

function checksuccess() {
	fetch("./scripts/checklogin.js",{method:"get",cache:"no-cache"}).then(function(response) {
		console.log(response);
  		return response.text();
	}).then(function(text) {
		var ref = cordova.InAppBrowser.open('http://ekim.ru', '_blank', iabSettings);
		ref.addEventListener('loadstop', function() {
    		ref.executeScript({code: text}, function(r) {
    			//console.log(r);
    			ref.close();
    			switchBusy();
    			if (r[0]=="success") {
    				console.log("we are here");
    				openScanner();
    				//page.close();
    			} else {
    				navigator.notification.alert(
		   				"Неверный логин или пароль!",
	    				function () {},
	    				"Ошибка!",
		   				"Продолжить"
		  			);
    				//textView.set("text", "Неверный логин или пароль!");
    			}
    		});
		});
	});
}


var trg = true;
login.on("select", function() {
	switchBusy();
	localStorage.setItem("username",username.get("text"));
	localStorage.setItem("password",password.get("text"));
	fetch("http://ekim.ru/logout").then(function(){
		fetch("http://ekim.ru/customer_sessions", {
			method: "post",
			credentials: "include",
			headers: {  
		   		"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
		    },
		    redirect: "follow",
		    body: "utf8=✓&customer_session[email]="+username.get("text")+"&customer_session[password]="+password.get("text")
		}).then(function(response){
			return response.text();
		}).then(function(text){
			switchBusy();
			if (text.indexOf("http://ekim.ru/logout")>-1) {
				openScanner();
			} else {
				navigator.notification.alert(
			   		"Неверный логин или пароль!",
		    		function () {},
		    		"Ошибка!",
					"Продолжить"
			  	);
			}
		});
	});
	
	

	/*fetch("./scripts/login.js",{method:"get",cache:"no-cache"}).then(function(response) {
		console.log(response);
  		return response.text();
	}).then(function(text) {
		console.log(text);
		var ref = cordova.InAppBrowser.open('http://ekim.ru', '_blank', iabSettings);
		ref.addEventListener('loadstop', function() {
			//console.log( xhr.responseText+"('"+username.get("text")+"','"+password.get("text")+"');");
    		if (trg) {
    			ref.executeScript({code: text+"('"+username.get("text")+"','"+password.get("text")+"');"}, function(r){
   					//console.log(r);
   					if (r[0] == "oldsession") {
    					//switchBusy();
    					//ref.close();
    					//openScanner();
    					//page.close();
    				} else {
    					trg = false;
    				}
    			});
    		} else {
    			//switchBusy();
    			trg = true;
    			ref.close();
	    		window.setTimeout(checksuccess,100);
    		}
		});
	});*/
	
});