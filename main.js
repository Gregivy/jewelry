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
  title: "myapp"
});

new tabris.Button({
  layoutData: {left: 10, top: 10},
  text: "Button"
}).on("select", function() {
  navigator.camera.getPicture(function (){},function () {}, {overlayImageURL:'./images/logo.jpg'})
}).appendTo(page);

page.open();