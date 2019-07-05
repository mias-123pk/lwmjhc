  var NfcAdapter;
  var NdefRecord;
  var NdefMessage;

  function listenNFCStatus() {
  	try {
  		var main = plus.android.runtimeMainActivity();
  		var Intent = plus.android.importClass('android.content.Intent');
  		var Activity = plus.android.importClass('android.app.Activity');
  		var PendingIntent = plus.android.importClass('android.app.PendingIntent');
  		var IntentFilter = plus.android.importClass('android.content.IntentFilter');
  		NfcAdapter = plus.android.importClass('android.nfc.NfcAdapter');
  		var nfcAdapter = NfcAdapter.getDefaultAdapter(main);
  		var intent = new Intent(main, main.getClass());
  		intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
  		var pendingIntent = PendingIntent.getActivity(main, 0, intent, 0);
  		var ndef = new IntentFilter("android.nfc.action.TECH_DISCOVERED");
  		ndef.addDataType("*/*");
  		var intentFiltersArray = [ndef];
  		var techListsArray = [
  			["android.nfc.tech.IsoDep"],
  			["android.nfc.tech.NfcA"],
  			["android.nfc.tech.NfcB"],
  			["android.nfc.tech.NfcF"],
  			["android.nfc.tech.Nfcf"],
  			["android.nfc.tech.NfcV"],
  			["android.nfc.tech.NdefFormatable"],
  			["android.nfc.tech.MifareClassic"],
  			["android.nfc.tech.MifareUltralight"]
  		];
  		document.addEventListener("newintent",
  			function() {
  				console.error('newintent');
  				setTimeout(handle_nfc_data1, 1000);
  			}, false);
  		document.addEventListener("pause", function(e) {
  			if(nfcAdapter) {
  				nfcAdapter.disableForegroundDispatch(main);
  				console.log('pause');
  			}
  		}, false);
  		document.addEventListener("resume", function(e) {
  			if(nfcAdapter) {
  				nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
  			}
  		}, false);
  		nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
  	} catch(e) {
  		console.error(e);
  	}
  }

  function handle_nfc_data1() {
  	NdefRecord = plus.android.importClass("android.nfc.NdefRecord");
  	NdefMessage = plus.android.importClass("android.nfc.NdefMessage");
  	var main = plus.android.runtimeMainActivity();
  	var intent = main.getIntent();
  	console.log("action type:" + intent.getAction());
  	if("android.nfc.action.TECH_DISCOVERED" == intent.getAction()) {
  		if(readyWriteData) {
  			__write(intent);
  			readyWriteData = false;
  		} else if(readyRead) {
  			__read(intent);
  			readyRead = false;
  		}
  	}
  }

  function showToast(msg) {
  	plus.nativeUI.toast(msg);
  }

  function __read(intent) {
  	try {
  		var content = "";
  		waiting.setTitle('请勿移开标签\n正在读取数据...');
  		var tag = plus.android.importClass("android.nfc.Tag");
  		tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
  		var bytesId = intent.getByteArrayExtra(NfcAdapter.EXTRA_ID);
  		console.log("bytesId:" + (bytesId));
  		waiting.close();
  		content += "卡片字节数组ID：" + tag.getId() + "<br/>";
  		content += "卡片16进制ID：" + bytesToHexString(tag.getId()) + "<br/>";
  		var tagid = reverseTwo(bytesToHexString(tag.getId()));
  		content += "卡片16进制翻转ID：" + tagid + "<br/>";
  		content += "卡片10进制卡号：" + parseInt(tagid, 16) + "<br/>";
  		deviceentry_rfid_scaner_rfidCallback(bytesToHexString(tag.getId()));

  	} catch(e) {
  		alert(e);
  		//TODO handle the exception
  	}
  }

  function __write(intent) {
  	try {
  		waiting.setTitle('请勿移开标签\n正在写入...');
  		var text = document.getElementById('text').value;
  		console.log("text=" + text);
  		var textBytes = plus.android.invoke(text, "getBytes");
  		var textRecord = new NdefRecord(NdefRecord.TNF_MIME_MEDIA,
  			plus.android.invoke("text/plain", "getBytes"), plus.android.invoke("", "getBytes"), textBytes);
  		var message = new NdefMessage([textRecord]);
  		var Ndef = plus.android.importClass('android.nfc.tech.Ndef');
  		var NdefFormatable = plus.android.importClass('android.nfc.tech.NdefFormatable');
  		var tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
  		var ndef = Ndef.get(tag);
  		if(ndef != null) {
  			var size = message.toByteArray().length;
  			console.log("size=" + size);
  			ndef.connect();
  			if(!ndef.isWritable()) {
  				showToast("tag不允许写入");
  				waiting.close();
  				return;
  			}
  			if(ndef.getMaxSize() < size) {
  				showToast("文件大小超出容量");
  				waiting.close();
  				return;
  			}

  			ndef.writeNdefMessage(message);
  			waiting.close();
  			showToast("写入数据成功.");
  			return;
  		} else {
  			var format = NdefFormatable.get(tag);
  			if(format != null) {
  				try {
  					format.connect();
  					format.format(message);
  					showToast("格式化tag并且写入message");
  					waiting.close();
  					return;
  				} catch(e) {
  					showToast("格式化tag失败.");
  					waiting.close();
  					return;
  				}
  			} else {
  				showToast("Tag不支持NDEF");
  				waiting.close();
  				return;
  			}
  		}
  	} catch(e) {
  		console.log("error=" + e);
  		waiting.close();
  		alert('写入失败');
  	}

  }

  function bytesToHexString(inarray) {
  	var i, j, x;
  	var hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A",
  		"B", "C", "D", "E", "F"
  	];
  	var out = "";
  	for(j = 0; j < inarray.length; ++j) {
  		x = parseInt(inarray[j]) & 0xff;
  		i = (x >> 4) & 0x0f;
  		out += hex[i];
  		i = x & 0x0f;
  		out += hex[i];
  	}
  	return out;
  }

  function reverseTwo(str) {

  	var str1 = "";
  	for(var i = 1; i <= str.length; i++) {
  		str1 += str[i - 1];
  		if(i % 2 == 0) {
  			if(i == str.length) {
  				break;
  			}
  			str1 += ":";
  		}
  	}
  	var str2 = "";
  	for(var i = str1.split(":").length - 1; i >= 0; i--) {
  		str2 += str1.split(":")[i];
  	}
  	return str2;
  }

  document.addEventListener('plusready', listenNFCStatus, false);

  var waiting;
  var readyWriteData = false;
  var readyRead = false;

  function writeData() {
  	var textEle = document.getElementById('text');
  	if(!textEle.value) {
  		alert('请输入要写入的内容');
  		return;
  	}
  	readyWriteData = true;
  	waiting = plus.nativeUI.showWaiting("请将NFC标签靠近！");
  }

  function readData() {
  	readyRead = true;
  	waiting = plus.nativeUI.showWaiting("请将NFC标签靠近！");
  }