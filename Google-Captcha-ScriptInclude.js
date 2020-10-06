var GOOGLECaptchaSI = Class.create();
GOOGLECaptchaSI.prototype = {
    initialize: function() {
    },
verifyCatpha : function(grc){
	try{
	if(GlideUtil.isDeveloperInstance() || gs.getProperty('sn_customerservice.captchaEnabled','true') =='false')
		return true;
	else if(grc){
		//Create REST Message to check the passed token with Google recaptcha service
		var r = new sn_ws.RESTMessageV2();
		r.setHttpMethod('post');
		r.setEndpoint('https://www.google.com/recaptcha/api/siteverify');
		
		var secret = gs.getProperty('google.captcha.secret');
		var Encrypter = new GlideEncrypter();
		r.setQueryParameter('secret', Encrypter.decrypt(secret));
		r.setQueryParameter('response',grc);
		
		var response = r.execute();
		var responseBody =  response.getBody();
		
		var parse = new JSONParser().parse(responseBody);
		return parse.sucess;
		
	}
		else
			return false;
	}
	catch(e){
		gs.info('GOOGLECaptchaSI Error ' + e.message);
	}
},
    type: 'GOOGLECaptchaSI'
};
