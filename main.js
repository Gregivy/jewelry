//new tabris.Drawer().append(new tabris.PageSelector());


document.addEventListener("offline", function () {
	navigator.notification.alert(
  		"Проверьте подключение к интернету!",
	   	function () {
	 		tabris.app.reload();
	    },
	 	"Ошибка!",
		"Продолжить"
  	);
}, false);

//var page = require("./pages/login.js").open();
//var page2 = require("./pages/scanner.js");

var page = new tabris.Page({
  topLevel: true,
  background: "transparent",
  title: "myapp"
});

var button = new tabris.Button({
  layoutData: {left: 10, top: 10},
  text: "Button"
}).on("select", function() {
	/*fetch("./test.html?"+Math.random()).then(function(response) {
		return response.text();
	}).then(function(text) {
		var webview = new tabris.WebView({
		  layoutData: {left: 0, top: [button,0], right: 0, bottom: 0}
		}).set('html',text).appendTo(page);
	});*/
	/*var webview = new tabris.WebView({
		  layoutData: {left: 0, top: [button,0], right: 0, bottom: 0}
		}).set('url',"https://davidwalsh.name/demo/camera.php").appendTo(page);*/
	cordova.InAppBrowser.open("https://davidwalsh.name/demo/camera.php","_blank","location=no");
}).appendTo(page);

page.open();