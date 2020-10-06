/* SERVER SIDE SCRIPT*/

(function($sp, input, data, options) {
	
	data.is_logged_in = gs.getSession().isLoggedIn();
	data.sys_id = '-1';
	data.captch_url= 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit&hl=' + gs.getSession().getLanguage();
	data.enableCaptcha = gs.getProperty('sn_customerservice.captchaEnabled');
	data.captchaSiteKey = gs.getProperty('google.captcha.site_key');
	if (input && input.action == 'register' && input.first_name && input.last_name && input.email && input.code) {
var trueCaptcha = new global.CSManagementUtils().verifyCaptcha(input.grc);
	if(trueCaptcha) {
			var result = {};
			var gr = new GlideRecord('sn_customerservice_registration');
			gr.initialize();
			gr.setValue('first_name', input.first_name);
			gr.setValue('last_name', input.last_name);
			gr.setValue('email', input.email);
			gr.setValue('registration_code', input.code);
			var sys_id = gr.insert();
			if(!gs.nil(sys_id)) {
				data.sys_id = sys_id;
				data.status = "success";
				data.message = gs.getMessage("Your request has been submitted and is pending review. You will receive an email when your request is processed.");
			} else {
				data.status = "error";
			}
			data.result = result;
			return data;
		} else {
			gs.addErrorMessage(gs.getMessage('Please verify the security code.'));
			data.status = "error";
			return data;
		}	
	}
})($sp, input, data, options);



/*CLIENT SCRIPT */

function($scope, $rootScope, $timeout, spUtil, $location) {
    var c = this;
    if (c.data.is_logged_in)
        $location.url($scope.portal.url_suffix);
    c.captchaVerified = false;
    c.policy = false;
    CustomEvent.observe('sn_csm_captcha_verified', function(obj) {
        c.captchaVerified = obj.captchaVerified;
        c.grc = obj.grc;
        scope.$apply();
    });
    c.showSubmit = function() {
        if (c.data.enableCaptcha == 'false')
            return !(c.first_name && c.policy == true && c.last_name && c.email && c.code);
        else
            return !(c.first_name && c.policy == true && c.captchaVerified == true && c.last_name && c.email && c.code && c.grc);
    };
    c.action = function() {

        c.data.action = 'register';
        c.data.first_name = c.first_name;
        c.data.last_name = c.last_name;
        c.data.email = c.email;
        c.data.code = c.code;
        c.data.grc = c.grc;
        c.server.update().then(function(response) {
            var data = response["result"];
            if (response.status == 'success') {
                c.success = response["message"];
                $timeout(function() {
                    $location.url('/' + $scope.portal.url_suffix);
                }, 5000);
            } else if (response.status == 'error') {
                c.success = 'There was an error processing your request';
            }
        });
    };
$scope.onFieldChange = function(val){
	if(val=='read_knowledge_and_collaborate'){
				$scope.orgName=false;
		$scope.orgID=true;
	}
	else if(val=='read_knowledge'){
		$scope.orgName=true;
		$scope.orgID=true;
	}
	else{
		$scope.orgID=false;
		$scope.orgName=false;
	}
}
$scope.orgIDCheck=function(id){
	if(id)
		$scope.orgName=false;
	else
		$scope.orgName = true
}
	$scope.orgNameCheck=function(v){
	if(v)
		$scope.orgID=false;
	else
		$scope.orgID=true;
}
    $scope.registrationInit = function() {};
}
