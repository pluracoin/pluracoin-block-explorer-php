<?
	include("../config.php");

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $api_url."/getinfo");
	$result = curl_exec($ch);
	
	$obj = json_decode($result, TRUE);
	
	curl_close($ch);
	
	print_r($obj['last_known_block_index']);
?>