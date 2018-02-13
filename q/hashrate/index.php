<?
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, 'http://127.0.0.1:19214/getinfo');
	$result = curl_exec($ch);
	$obj = json_decode($result, TRUE);
	curl_close($ch);
	$difficulty = $obj['difficulty'];
	echo round($difficulty / 120);	
?>