var openItem = require("./item.js");

var openPage = module.exports = function () {
	//switchBusy();

	function blockUI() {
		page.find("Button").set('enabled',false);
		//scanButton.set('enabled',false);
		activityIndicator.set('visible', true);
	}

	function unblockUI() {
		page.find("Button").set('enabled',true);
		if (scrollView.children().length == 0) {
			orderButton.set('enabled',false);
		}
		activityIndicator.set('visible',false);
	}

	var page = new tabris.Page({
		title: "Ekim. Сканнер штрих-кодов",
		topLevel: false
	});

	/*var openPage = module.exports = function () {
		//switchBusy();
		blockUI();
		page.open();
		window.setTimeout(checkCart,100);
	}*/

	var scanButton = new tabris.Button({
		text: "Сканнировать штрих-код",
		textColor: "#ffffff",
		background: "#217aba",
		layoutData: {left:50, right: 50, top: 10, height:60}
	}).appendTo(page);

	var cartTitle = new tabris.TextView({
	  font: "28px",
	  markupEnabled: true,
	  text: "<b>Ваша корзина</b>",
	  layoutData: {left: 20, top: [scanButton, 10]}
	}).appendTo(page);

	var item = {
		imgurl: '',
		name: '',
		price: ''
	}

	var orderButton = new tabris.Button({
		text: "Оформить заказ",
		background: "#32cd32",
		textColor: "#ffffff",
		layoutData: {left:50, right:50, bottom: 20, height:60}
	}).appendTo(page);

	orderButton.on("select", function () {
		/*fetch("./scripts/deleteitem.js",{method:"get",cache:"no-cache"}).then(function(response) {
  			return response.text();
		}).then(function(text) {

		});
		var xhr = new tabris.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState === xhr.DONE) {
				console.log(xhr.responseText);
				var ref = cordova.InAppBrowser.open('http://ekim.ru/orders/new', '_target', 'hidden=no,location=no,zoom=yes');

				
			}		
		}
		xhr.open("GET", "css/order.css?_="+Math.random());
		xhr.send();*/
		fetch("./scripts/enter.js").then(function(response){
			return response.text();
		}).then(function(text){
			var ref = cordova.InAppBrowser.open('http://ekim.ru/orders/new', '_target', 'hidden=no,location=yes,zoom=yes');
			ref.addEventListener('loadstop', function() {
				ref.executeScript({code: text+"('"+localStorage.getItem("username")+"','"+localStorage.getItem("password")+"');"});
			});
		});
		
		//var ref = cordova.InAppBrowser.open('http://ekim.ru/orders/new', '_blank', 'location=no,zoom=no');
		//ref.insertCSS({file:"css/order.css"});
	})

	var scrollViewSettings = {
		  left: 0, right: 0, top: [cartTitle, 10], bottom: [orderButton,5],
		  direction: "vertical",
		  background: "#ffffff"
	}

	var scrollView = new tabris.ScrollView(scrollViewSettings).appendTo(page);

	var activityIndicator = new tabris.ActivityIndicator({
	  centerX: 0,
	  centerY: 0,
	  visible: false
	}).appendTo(page);


	function rebuildCart(items) {
		if (scrollView.children().length>0) scrollView.children().dispose();
		//scrollView = new tabris.ScrollView(scrollViewSettings).appendTo(page);
		if (items.length == 0) {
			var noitems = new tabris.TextView({
				font: "18px",
				markupEnabled: true,
				text: "<i>Корзина пуста</i>",
				layoutData: {centerX: 0, top: 50}
			}).appendTo(scrollView);
		} else {
			items.forEach(function(item,i) {
				var children = scrollView.children();
				var newitem_top = children.length > 0 ? [children[children.length-1],5] : 0;
				var newitem = new tabris.Composite({
			    	layoutData: {left:20, right:20, top: newitem_top}
			   	}).appendTo(scrollView);


				var deleteButton = new tabris.Button({
					background: "red",
					image: "images/trash.png",
					layoutData: {right:0, top: 0, width: 50}
				}).appendTo(newitem);

				var name = new tabris.TextView({
					font: "12px",
					text: item.name,
					layoutData: {left: 2, top: 0, right: [deleteButton,5]}
				}).appendTo(newitem);

				var price = new tabris.TextView({
					font: "12px",
					markupEnabled: true,
					text: "<b>"+item.price+"</b>",
					layoutData: {left: 2, top: [name, -10]}
				}).appendTo(newitem);

				var hr = new tabris.Composite({
					layoutData: {left: 0, right: 0, top: [deleteButton, 2], height:1},
					background: "#ebebeb"
				}).appendTo(newitem);


				deleteButton.trg = true;

				deleteButton.on("select", function() {
					navigator.notification.confirm(
	    				'Вы действительно хотите убрать этот товар из корзины?',  // message
	    				function (i) {
	    					if (i == 1) {
	    						blockUI();
								newitem.set("background","#cccccc");
								fetch(item.deletelink, {method:"delete"}).then(function(response){
									unblockUI();
									checkCart();
								})
	    					}
	    				},
	    				'Предупреждение',            // title
	    				['Да','Отмена']            // buttonLabels
					);
				});
			});
		}
	}

	function checkCart() {
		//console.log("here");
		blockUI();
		fetch("http://ekim.ru/baskets").then(function(response){
			return response.text();
		}).then(function(text){
			//console.log(text);
			var table = text.split('<table class="tab-bask c-tab-resp">')[1].split("</table>")[0];
			var items = [];
			if (table.indexOf('<tbody>')>-1) {
				var tbody = table.split('<tbody>')[1].split('</tbody>')[0];
				var products = tbody.split("<tr>");
				for (var i = 1; i<products.length; i++) {
					var tds = products[i].split("<td");
					var name = tds[3].split('class="left">')[1].split("<p")[0];
					var price = tds[6].split(">")[1].split("<")[0];
					var deletelink = tds[9].split('href="')[1].split('"')[0];
					items.push({name:name,price:price,deletelink:deletelink});
				}
			}
			rebuildCart(items);
		   	unblockUI();
		});
	}

	function searchonsite(article) {
		blockUI();
 
		fetch("http://ekim.ru/price_items/search?oem="+article).then(function(response1){
			return response1.text();
		}).then(function (text) {
			console.log(text.indexOf('<h1 class="main-title">Nobrand'));
			if (text.indexOf('<h1 class="main-title">Nobrand')==-1) {
				console.log("get/text");
				var xhr = new tabris.XMLHttpRequest();
				xhr.onreadystatechange = function() {
					console.log(xhr.readyState,xhr.DONE);
  					if(xhr.readyState === xhr.DONE) {
  						//console.log(xhr.responseText);
  						unblockUI();
  						if (xhr.responseText=="") {
  							navigator.notification.alert(
	   							"Произошла ошибка, пожалуйста попробуйте еще раз. Статус: "+xhr.status,
				   				function () {},
	    						"Ошибка!",
		   						"Продолжить"
		  					);
  							//xhr.open("GET", "http://ekim.ru/products/price.json?oem="+article);
							//xhr.send();
  						} else {
	      					var json = JSON.parse(xhr.responseText);
	      					//console.log(json);
							var title = json["original_prices"]["data"][0]["detail_name"];
							var cost = json["original_prices"]["data"][0]["cost"];
							var hash_key = json["original_prices"]["data"][0]["hash_key"];
							var sys_info = JSON.stringify(json["original_prices"]["data"][0]["sys_info"]);
							//var imgurl = text.split('" class="lightbox fancybox"')[0].split('');
							var imgurl = "http://ekim.ru/system/product_photo_package/"+json["original_prices"]["data"][0]["make_name"]+"/"+article+".jpg";
							console.log(hash_key);
							openItem({imgurl: imgurl, name: title, price: cost, hash_key: hash_key,sys_info: sys_info},article,checkCart);
						}
  					}
				};
				//xhr.setRequestHeader('Access-Control-Allow-Origin','*');
				xhr.timeout = 30000;
				xhr.open("GET", "http://ekim.ru/products/price.json?oem="+article);
				xhr.send();
			} else {
				unblockUI();
				navigator.notification.alert(
	   				"К сожалению ничего не найдено! Распознанный код:"+article,
	   				function () {},
	    			"Ошибка!",
		   			"Продолжить"
		  		);
			}
		}); 
	}

	scanButton.on("select", function() {
		cordova.plugins.barcodeScanner.scan(
	      	function (result) {
	    		if	(!result.cancelled) {
	    			console.log(result.format,result.text);
	    			//switchBusy();
	    			searchonsite(result.text);
	    		}
	      	}, 
	      	function (error) {
	        	console.log("Scanning failed: " + error);
	      	},	
	      	{
	          "preferFrontCamera" : true, // iOS and Android 
	          "showFlipCameraButton" : true, // iOS and Android 
	          "prompt" : "Поместите штрих-код внутрь сканируемой области", // supported on Android only 
	          //"formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED 
	          "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device 
	      	}
	   );
	});

	blockUI();
	page.open();
	//window.setTimeout(checkCart,100);
	checkCart();
}