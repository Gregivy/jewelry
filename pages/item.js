var initItem = module.exports = function (item,url,checkCart) {

	var iabSettings = 'hidden=yes,clearcache=no,clearsessioncache=no';

	function switchBusy() {
		add2cart.set('enabled',!add2cart.get('enabled'));
		activityIndicator.set('visible',!activityIndicator.get('visible'));
	}

	var page = new tabris.Page({
		title: "Описание товара",
		topLevel: false
	});

	var activityIndicator = new tabris.ActivityIndicator({
  		centerX: 0,
  		centerY: 0,
  		visible: false
	}).appendTo(page);

	var img = new tabris.ImageView({
		image: {src: item.imgurl,scale:1},
		background: "rgb(255, 255, 255)",
		scaleMode: "fill",
		layoutData: {top: 10, left: 10, right: 10, height: 200}
	}).appendTo(page);

	var name = new tabris.TextView({
		font: "18px",
		alignment: "center",
		text: item.name,
		layoutData: {left:10, right: 10, top: [img, 20]}
	}).appendTo(page);

	var price = new tabris.TextView({
		font: "18px",
		text: "Цена: " + item.price + " руб.",
		layoutData: {centerX: 0, top: [name, 20]}
	}).appendTo(page);	

	var add2cart = new tabris.Button({
		text: "Добавить в корзину",
		layoutData: {left:50, right:50, height:60, top: [price,10]}
	}).appendTo(page);

	add2cart.on("select", function() {
		switchBusy();

		fetch("http://ekim.ru/baskets", {
			method: "post",
			credentials: "include",
			headers: {  
		   		"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
		    },
		    redirect: "follow",
		    body: "basket[qnt]=1&price_result[oem]="+url+"&price_result[hash_key]="+item.hash_key+"&price_result[detail_name]="+item.name+"&price_result[sys_info]="+item.sys_info
		}).then(function(response){
			return response.text();
		}).then(function(text){
			console.log(text);
			page.close();
		    checkCart();
		});

		/*fetch("./scripts/add2cart.js",{method:"get",cache:"no-cache"}).then(function(response) {
			return response.text();
		}).then(function(text) {
			console.log(text);
			var ref = cordova.InAppBrowser.open('http://ekim.ru/price_items/search?oem='+url, '_blank', iabSettings);
			ref.addEventListener('loadstop', function(e) {
				//console.log( xhr.responseText+"('"+username.get("text")+"','"+password.get("text")+"');");
	   			if (e.url.indexOf("added2cart=true") == -1) {
	   				ref.executeScript({code: text});
	   			} else if (e.url.indexOf("added2cart=true") > -1) {
	    			//switchBusy();	
	    			ref.close();
		    		page.close();
		    		checkCart();
	   			} else {
	   				switchBusy();
	    		}
			});
		});*/
	});

	page.open();
}
