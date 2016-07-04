module.exports = function(ctx) {
	if (ctx.opts.platforms.indexOf('android') < 0) {
        return;
    }
    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        deferral = ctx.requireCordovaModule('q').defer();
    var platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android/');
    console.log("gregivy1 - "+platformRoot);
    var data = fs.readFileSync(platformRoot+'AndroidManifest.xml', 'utf-8').toString();
    console.log("gregivy2 - "+data);
    var beforeManifest = data.split("<manifest")[0];
    var manifesttag = data.split("<manifest")[1].split(">")[0];
    var afterManifest = data.split("<manifest")[1].split(">")[1];
  	var newValue = beforeManifest + "<manifest" + manifesttag + ">" + '<uses-feature android:name="android.hardware.camera" android:required="true" />' + afterManifest;
  	fs.writeFileSync(platformRoot+'AndroidManifest.xml', newValue, 'utf-8');

}