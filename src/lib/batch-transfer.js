// Validate OTP
function validateOTP() {
	console.log("Validating OTP....");

	$('#sdk-modalbox').modal('hide');

	$('#modelPleaseWait').modal('show');

	var valueOTP = document.getElementById("input_otp").value;
	var valueUserID = document.getElementById("input_userId").value;
	var valueDataHex = document.getElementById("input_dataHex").value;
	var valueTokenName = document.getElementById("input_tokenName").value;
	var valueOperation = "00";

	var baseURL = "https://apidevdev.dbpdemo.com";
	var http = new XMLHttpRequest();
	var url = baseURL+"/batchtransfer.validate.payment.action";
	var parameters = "otp="+valueOTP+"&userId="+valueUserID+"&dataHex="+valueDataHex+"&operation="+valueOperation+"&tokenName="+valueTokenName+"";
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {//Handler function for call back on state change.
		if(http.readyState == 4) {
			console.log("http.responseText : "+http.responseText);

			if (http.responseText=='OK_AUTHENT') {

				console.log("[OTP validation success] OTP validated successfully!!");

				$('#modelPleaseWait').modal('hide');
				$('#modelPleaseWait').on('hidden.bs.modal', function () {
				    $('#modelOTP_Validate').modal('show');
				    	$('#modelOTP_Validate').on('shown.bs.modal', function() {
				    		$('#modelOTP_Validate').find('.modal-body #modalOTP_Validate_BodyText').html('<p>OTP validated successfully!</p>');
				    	});
				});
			}else{
				console.log("[OTP validation failed] Something must be wrong!");
				$('#modelPleaseWait').modal('hide');
				$('#modelPleaseWait').on('hidden.bs.modal', function () {
				    $('#modelOTP_ValidationFailed').modal('show');
				    	$('#modelOTP_ValidationFailed').on('shown.bs.modal', function() {
				    		$('#modelOTP_ValidationFailed').find('.modal-body #modalOTP_Validation_Failed_BodyText').html('<p>OTP validation failed!</p>');
				    	});
				});
			}
		}
	};
	http.send(parameters);
}
