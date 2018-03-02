<?
	include("../config.php");

	$data_string = '{"jsonrpc":"2.0","id":"test","method":"getlastblockheader","params":" "}';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $api_url."/json_rpc");
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array(
	    'Content-Type: application/json',
	    'Content-Length: ' . strlen($data_string))
	);
	$result = curl_exec($ch);

	$responseData = json_decode($result, TRUE);
	$rewardRaw = $responseData['result']['block_header']['reward'];
	$reward  = number_format($rewardRaw / 10000000000, 10, ".", "");
	print_r($reward);
	curl_close($ch);
?>