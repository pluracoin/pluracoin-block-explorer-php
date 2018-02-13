
	var blockchainExplorer 	= "/?hash={id}#blockchain_block";
	var transactionExplorer = "/?hash={id}#blockchain_transaction";
	var paymentIdExplorer 	= "/?hash={id}#blockchain_payment_id";
	
	var style_cookie_name = "style";
	var style_cookie_duration = 365;
	var style_domain = window.location.hostname;
	
	$(function(){
		$('.theme-switch[rel="/css/themes/white/style.css"]').hide();
		set_style_from_cookie();
		
		$('.theme-switch').click(function() {
			swapStyleSheet($(this).attr('rel'));
			$('.theme-switch').show();
			$(this).hide();
			return false;
		});
		
		function swapStyleSheet(sheet){
			$('#theme_link').attr('href',sheet);
			$('.theme-switch').show();
			$('.theme-switch[rel="'+sheet+'"]').hide();
			set_cookie(style_cookie_name, sheet, style_cookie_duration, style_domain);
		}
	
		function set_style_from_cookie(){
			var style = get_cookie(style_cookie_name);
			if (style.length){
				swapStyleSheet(style);
			}
		}
		function set_cookie (cookie_name, cookie_value, lifespan_in_days, valid_domain){
			var domain_string = valid_domain ?
							   ("; domain=" + valid_domain) : '';
				document.cookie = cookie_name +
							   "=" + encodeURIComponent(cookie_value) +
							   "; max-age=" + 60 * 60 *
							   24 * lifespan_in_days +
							   "; path=/" + domain_string;
		}
		function get_cookie (cookie_name){
			var cookie_string = document.cookie;
			if (cookie_string.length != 0){
				var cookie_value = cookie_string.match(
							  '(^|;)[\s]*' +
							  cookie_name +
							  '=([^;]*)' );
				if(cookie_value != null && cookie_value.length>0) {
					return decodeURIComponent (cookie_value[2]);
				}
			}
			return '';
		}
	});
	
    function getTransactionUrl(id) {
        return transactionExplorer.replace('{symbol}', symbol.toLowerCase()).replace('{id}', id);
    }
    
    $.fn.update = function(txt){
        var el = this[0];
        if (el.textContent !== txt)
            el.textContent = txt;
        return this;
    };

    function updateTextClasses(className, text){
        var els = document.getElementsByClassName(className);
        for (var i = 0; i < els.length; i++){
            var el = els[i];
            if (el.textContent !== text)
                el.textContent = text;
        }
    }

    function updateText(elementId, text){
        var el = document.getElementById(elementId);
        if (el.textContent !== text){
            el.textContent = text;
        }
        return el;
    }

    function updateTextLinkable(elementId, text){
        var el = document.getElementById(elementId);
        if (el.innerHTML !== text){
            el.innerHTML = text;
        }
        return el;
    }

    var currentPage;
    var lastStats;


    function getReadableHashRateString(hashrate){
        var i = 0;
        var byteUnits = [' H', ' kH', ' MH', ' GH', ' TH', ' PH', ' EH', ' ZH', ' YH' ];
        while (hashrate > 1000){
            hashrate = hashrate / 1000;
            i++;
        }
        return hashrate.toFixed(2) + byteUnits[i];
    }
	
	function getReadableDifficultyString(difficulty, precision){
		if (isNaN(parseFloat(difficulty)) || !isFinite(difficulty)) return 0;
		if (typeof precision === 'undefined') precision = 0;
		var units = ['', 'k', 'M', 'G', 'T', 'P'],
            number = Math.floor(Math.log(difficulty) / Math.log(1000));
		if (units[number] === undefined || units[number] === null) {
            return 0
        }
        return (difficulty / Math.pow(1000, Math.floor(number))).toFixed(precision) + ' ' +  units[number];
    }
	
    function formatBlockLink(hash){
        return '<a href="' + getBlockchainUrl(hash) + '">' + hash + '</a>';
    }

    function getReadableCoins(coins, digits, withoutSymbol){
        var amount = (parseInt(coins || 0) / coinUnits).toFixed(digits || coinUnits.toString().length - 1);
        return amount + (withoutSymbol ? '' : (' ' + symbol));
    }

    function formatDate(time){
        if (!time) return '';
        return new Date(parseInt(time) * 1000).toLocaleString();
    }
	
	function formatBytes(a,b) {
		if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]
	}
	
	function formatPaymentLink(hash){
        return '<a href="' + getTransactionUrl(hash) + '">' + hash + '</a>';
    }
	
    function pulseLiveUpdate(){
        var stats_update = document.getElementById('stats_updated');
        stats_update.style.transition = 'opacity 100ms ease-out';
        stats_update.style.opacity = 1;
        setTimeout(function(){
            stats_update.style.transition = 'opacity 7000ms linear';
            stats_update.style.opacity = 0;
        }, 500);
    }

    window.onhashchange = function(){
        routePage();
    };


    function fetchLiveStats() {
        $.ajax({
            url: api + '/getinfo',
            dataType: 'json',
			type: 'GET',
            cache: 'false'
        }).done(function(data){
            pulseLiveUpdate();
            lastStats = data;
            currentPage.update();
        }).always(function () {
			setTimeout(function() {
				fetchLiveStats();
			}, refreshDelay);
        });
    }

    function floatToString(float) {
        return float.toFixed(6).replace(/[0\.]+$/, '');
    }


    var xhrPageLoading;
    function routePage(loadedCallback) {

        if (currentPage) currentPage.destroy();
        $('#page').html('');
        $('#loading').show();

        if (xhrPageLoading)
            xhrPageLoading.abort();

        $('.hot_link').parent().removeClass('active');
        var $link = $('a.hot_link[href="' + (window.location.hash || '#') + '"]');

        $link.parent().addClass('active');
        var page = $link.data('page');

        xhrPageLoading = $.ajax({
            url: 'pages/' + page,
            cache: false,
            success: function (data) {
                $('#loading').hide();
                $('#page').show().html(data);
                currentPage.init();
                currentPage.update();
                if (loadedCallback) loadedCallback();
            }
        });
    }

    function getBlockchainUrl(id) {
        return blockchainExplorer.replace('{id}', id);
    }

    $(function(){
        $.get(api + '/getinfo', function(data){
            lastStats = JSON.parse(data);
            routePage(fetchLiveStats);
        });
    });
	
    // Blockexplorer functions
    urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
           return null;
        }
        else{
           return results[1] || 0;
        }
    }

	$(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });
	
	function hex2a(hexx) {
		var hex = hexx.toString();//force conversion
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	}



			jQuery(function($) { $(document).ready(function() {
				$(window).scroll(function(){
					if ($(this).scrollTop() > 500) {
						$('.scrollup').fadeIn();
					} else {
						$('.scrollup').fadeOut();
					}
				}); 
		
				$('.scrollup').click(function(){
					$("html, body").animate({ scrollTop: 0 }, 600);
					return false;
				});

				$('.scrollup').css('opacity','0.3');
		 
				$('.scrollup').hover(function(){
					$(this).stop().animate({opacity: 0.9}, 400);
				 }, function(){
					$(this).stop().animate({opacity: 0.3}, 400);
				});  
					
			});});
	



$('#btn_search').click(function(e) {

var text = document.getElementById('txt_search').value;

function GetSearchBlockbyHeight(){

	var block, xhrGetSearchBlockbyHeight;
    if (xhrGetSearchBlockbyHeight) xhrGetSearchBlockbyHeight.abort();
	  
			xhrGetSearchBlockbyHeight = $.ajax({
            url: api + '/json_rpc',
            method: "POST",
            data: JSON.stringify({
                jsonrpc:"2.0",
                id: "blockbyheight",
                method:"getblockheaderbyheight",
                params: {
                   height: parseInt(text)
                }
            }),
            dataType: 'json',
            cache: 'false',
            success: function(data){
				if(data.result){
					block = data.result.block_header;
					window.location.href = getBlockchainUrl(block.hash);
				} else if(data.error) {
					wrongSearchAlert();
				}
            }
        });
}

function GetSearchBlock(){
var block, xhrGetSearchBlock;
	if (xhrGetSearchBlock) xhrGetSearchBlock.abort();
		xhrGetSearchBlock = $.ajax({
            url: api + '/json_rpc',
            method: "POST",
            data: JSON.stringify({
                jsonrpc:"2.0",
                id: "GetSearchBlock",
                method:"f_block_json",
                params: {
                   hash: text
                }
            }),
            dataType: 'json',
            cache: 'false',
			success: function(data){
				if(data.result){
					block = data.result.block;
					sessionStorage.setItem('searchBlock', JSON.stringify(block));
					window.location.href = getBlockchainUrl(block.hash);
				} else if(data.error) {
					$.ajax({
						url: api + '/json_rpc',
						method: "POST",
						data: JSON.stringify({
							jsonrpc:"2.0",
							id: "test",
							method:"f_transaction_json",
							params: {
								hash: text
							}
						}),
						dataType: 'json',
						cache: 'false',
						success: function(data){
							  if(data.result){
								sessionStorage.setItem('searchTransaction', JSON.stringify(data.result));
								window.location.href = transactionExplorer.replace('{id}', text);
							  } else if(data.error) {
								xhrGetTsx =  $.ajax({
									url: api + '/json_rpc',
									method: "POST",
									data: JSON.stringify({
										jsonrpc:"2.0",
										id: "test",
										method:"k_transactions_by_payment_id",
										params: {
											payment_id: text
										}
									}),
									dataType: 'json',
									cache: 'false',
									success: function(data){
										if(data.result){
											txsByPaymentId = data.result.transactions;
											sessionStorage.setItem('txsByPaymentId', JSON.stringify(txsByPaymentId));
											window.location.href = paymentIdExplorer.replace('{id}', text);
										} else if(data.error) {
											$('#page').after(
												'<div class="alert alert-warning alert-dismissable fade in" style="position: fixed; right: 50px; top: 50px;">'+
													'<button type="button" class="close" ' + 
															'data-dismiss="alert" aria-hidden="true">' + 
														'&times;' + 
													'</button>' + 
													'We could not find anything.' + 
												 '</div>');
										}
									}
								});
							  
							  }
						}
					});
				}
			}	
		});
}

if ( text.length < 64 ) {
	GetSearchBlockbyHeight();
} else if ( text.length == 64 ) {
	GetSearchBlock();
} else {
	wrongSearchAlert();
}

e.preventDefault();

});

function wrongSearchAlert() {
	$('#page').after(
		'<div class="alert alert-danger alert-dismissable fade in" style="position: fixed; right: 50px; top: 50px;">'+
		'<button type="button" class="close" ' + 
		'data-dismiss="alert" aria-hidden="true">' + 
		'&times;' + 
		'</button>' + 
		'<strong>Wrong search query!</strong><br /> Please enter block height or hash, transaction hash, or payment id.' + 
		'</div>');
}

$('#txt_search').keyup(function(e){
        if(e.keyCode === 13)
            $('#btn_search').click();
});
