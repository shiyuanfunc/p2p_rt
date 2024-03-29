$(function() {
	cleard();	
});


function changed(){
	var  myselect=document.getElementById("product");
	var index=myselect.selectedIndex ; //索引
	var text=myselect.options[index].text; // 文本
	var selectValue=myselect.options[index].value; // 值
	anun.value=selectValue;
	$("#totalmo").html("0.00元");
	$("#totalAumu").html("0.00元");	
}




function calculator(params) {
	//本金
	var principle = parseFloat(params.principle);
	//贷款月数
	var month = parseInt(params.month);
	//贷款利率
	var rate = parseFloat(params.rate / 100);
	//贷款方式
	var hkfs = params.hkfs;
	//判断天标
	var isDay = parseInt(params.isDay);
	var monthlyRate = "";
	if (hkfs == 1 || hkfs == 2 || hkfs == 3) {//3:按月分期还款(按月)  等额本息   //2:一次性还款(按月)   //4:每月还息到期还本(按月)  先息后本
		monthlyRate = rate / 12;
	} 
	if(isDay ==1){
		monthlyRate = rate / 12 / 30;
	}
	
	//总利率
	var powOfAll = Math.pow(1 + monthlyRate, month);
	//利息
	var powSubtractOne = powOfAll - 1;
	var divideValue = monthlyRate * powOfAll / powSubtractOne;
	var totalAmount = 0;
	//月收入
	var monthlyIncome;
	//判断是否有利息
	if (powOfAll != 1) {
		monthlyIncome = (principle * divideValue);
	} else {
		monthlyIncome = (principle / month);
	}
	//本息
	var restPrinciple = principle;
	var paidPrincipal = parseFloat(0);
	var content = '';
	var outlastMonthIncome;
	//2:一次性还款
	if (hkfs != 1) {
		for ( var i = 1; i <= month; i++) {
			
			if (i <= month - 1 || month == 1) {
				var tmpk = 0;
				var principleOfKMonth = 0;
				var interestOfKMonth = 0;
				var principleOfKMonth2 = 0;
				//4:先息后本
				if (hkfs != 3) {
					tmpk = Math.pow(1 + monthlyRate, i - 1);
					principleOfKMonth = (principle * monthlyRate * tmpk)
							/ powSubtractOne;
					interestOfKMonth = (monthlyIncome - principleOfKMonth)
							.toFixed(2);
					principleOfKMonth2 = (monthlyIncome - interestOfKMonth)
							.toFixed(2);

					paidPrincipal += parseFloat(principleOfKMonth2);
					restPrinciple -= principleOfKMonth2;
					totalAmount += parseFloat(monthlyIncome.toFixed(2));
					
				}

				if (hkfs == 3) {//每月还息到期还本(按月)
					
					if(month == 1){
						tmpk = Math.pow(1 + monthlyRate, i - 1);
						principleOfKMonth = (principle * monthlyRate * tmpk) / powSubtractOne;
						interestOfKMonth = (monthlyIncome - principleOfKMonth).toFixed(2);
						principleOfKMonth2 = (monthlyIncome - interestOfKMonth).toFixed(2);
						paidPrincipal += parseFloat(principleOfKMonth2);
						restPrinciple -= principleOfKMonth2;
						totalAmount =parseFloat(monthlyIncome.toFixed(2));
					}else{
						interestOfKMonth = principle * monthlyRate;
						monthlyIncome = interestOfKMonth;
						principleOfKMonth2 = 0.00;
						restPrinciple = principle;
						totalAmount += parseFloat(monthlyIncome.toFixed(2));
					}
					
					/*totalAmount =principle + parseFloat(monthlyIncome.toFixed(2));*/
					
				}
				
				
			} else {
				var lastMonthIncome = 0;
				var lastMonthPrincipal = 0;
				var lastMonthInterest = 0;
				var remainPrinciple = 0;
				if (hkfs != 3) {
					lastMonthIncome = (getLastMonthIncome(principle,
							monthlyRate, powOfAll, powSubtractOne, month,
							monthlyIncome)).toFixed(2);
					lastMonthPrincipal = (getLastMonthPrincipal(principle,
							paidPrincipal)).toFixed(2);
					lastMonthInterest = (lastMonthIncome - lastMonthPrincipal)
							.toFixed(2);
					totalAmount += parseFloat(lastMonthIncome);
				}

				if (hkfs == 3) {//每月还息到期还本(按月)
					lastMonthInterest = principle * monthlyRate;
					lastMonthIncome = principle + lastMonthInterest;
					lastMonthPrincipal = principle;
					totalAmount += lastMonthIncome;
				}

			}
			//得到最后一个的还款钱数
		}
		var totalInterest = totalAmount.toFixed(2) - principle;
             return totalInterest;

	} else if (hkfs == 1) {//一次性还款(按月)

		totalInterest = principle * monthlyRate * month;
		totalAmount = principle + totalInterest;
		return totalInterest;
	
	}
	
}

function getLastMonthIncome(principle, monthlyRate, powOfAll, powSubtractOne,
		month, monthlyIncome) {
	var totalIncome = (principle * month * monthlyRate * powOfAll)
			/ powSubtractOne;
	var alreadyIncome = monthlyIncome.toFixed(2) * (month - 1);
	return totalIncome - alreadyIncome;
}

function getLastMonthPrincipal(principle, paidPrincipal) {
	return principle - paidPrincipal;
}

function changeToDate(date) {
	return new Date(Date.parse(date.replace(/-/g, "/")));
}

function getPayDate(startDate, num, hkfs) {
	if (hkfs == 3 || hkfs == 2 || hkfs == 4) {//3：按月分期还款(按月)//2：一次性还款(按月)4:每月还息到期还本(按月)
		var oneDayTime = 86400000;

		var payDate = new Date(startDate.getFullYear(), startDate.getMonth()
				+ num, startDate.getDate());
		if (isOnSameDayOfMonth(startDate, payDate)) {
			payDate.setTime(payDate.getTime() - oneDayTime);
			return payDate;
		} else {
			payDate.setTime(payDate.getTime() - payDate.getDate() * oneDayTime);
			return payDate;
		}
	} else if (hkfs == 1) {//按天分期还款(按天)
		var oneDayTime = 86400;
		var payDate = new Date(startDate.getFullYear(), startDate.getMonth(),
				startDate.getDate() + num);
		if (isOnSameDayOfMonth(startDate, payDate)) {
			payDate.setTime(payDate.getTime() - oneDayTime);
			return payDate;
		} else {
			payDate.setTime(payDate.getTime() - payDate.getDate() * oneDayTime);
			return payDate;
		}
	}
}

function isOnSameDayOfMonth(date1, date2) {
	return date1.getDate() == date2.getDate();
}

function changeDateType(payDate) {
	return payDate.getFullYear()
			+ "-"
			+ (payDate.getMonth() < 9 ? "0"
					+ (parseInt(payDate.getMonth()) + 1) : parseInt(payDate
					.getMonth()) + 1)
			+ "-"
			+ (payDate.getDate() < 10 ? "0" + parseInt(payDate.getDate())
					: parseInt(payDate.getDate()));
}

function cleard() {
	$('#investAmount').val("");
	$('#investTime').val("");
	$('#anun').val("");
	$("#investRecordsTable").html("");
	
	$("#monthre").html(0);
	$("#totalmo").html("0.00元");
	$("#totalAumu").html("0.00元");
	$("#lastmonthre").html(0);
	
}

function numberFormatWithoutCurrency(nStr) {
	if (nStr === 0 || nStr === "0") {
		return "0.00";
	}

	if (!nStr || isNaN(nStr)) {
		return "";
	}

	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '.00';
	if (x2.length < 3) {
		x2 += "00";
	}
	x2 = x2.substring(0, 3);
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
