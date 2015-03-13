// 验证类
// 是否为空
function required(value) {
        return $.trim(value).length != 0;
    }
    // 手机
function isPhone(value) {
        return /^1[3|4|7|5|8][0-9]\d{8}$/.test(value);
    }
    // 中文
function isChinese(value) {
        return /[\u4e00-\u9fa5]/.test(value);
    }
    // 全数字
function isNum(value) {
        return /^[0-9]\d*$/.test(value);
    }
    // 身份证
function isIdCard(value) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value.toUpperCase());
    }
    // 英文、数字、汉字
function isUserName(value) {
        return /^[a-zA-Z0-9\u4E00-\u9FA5]+$/.test(value);
    }
    // 是否为RMB
function isMoney(data, isPositive) {
    return isPositive ? /^\d+(\.\d{1,2})?$/.test(data) && parseFloat(data) > 0 : /^(-)?\d+(\.\d{1,2})?$/.test(data);
}


//工具类
var utils = {
    // 获取有效数字
    getNum: function(v) {
        var num = $.trim(v).replace(/\b(0+)/gi, "");
        return num;
    },
    // 格式化货币，满三位加逗号
    formatMoney: function(num, n) {
        num = String(num.toFixed(n ? n : 2));
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) num = num.replace(re, "$1,$2")
        return n ? num : num.replace(/^([0-9,]+\.[1-9])0$/, "$1").replace(/^([0-9,]+)\.00$/, "$1");;
    },
    // 判断有效的键盘输入
    validKeyPress: function(e) {
        var k = e.keyCode || e.which;
        // 删除 上下左右 HomeEnd  大键盘数字 小键盘数字  F5
        if (k == 8 || k >= 33 && k <= 40 || k >= 46 && k <= 57 || k >= 96 && k <= 105 || k == 116) {
            if (k == 96 || k == 48) {
                if (utils.getLocation(e.target) == 0) {
                    return false;
                };
            };
            return true;
        } else {
            return false;
        }
    },
    // 获取光标位置
    getLocation: function(elm) {
        if (elm.createTextRange) { // IE               
            var range = document.selection.createRange();
            range.setEndPoint('StartToStart', elm.createTextRange());
            return range.text.length;
        } else if (typeof elm.selectionStart == 'number') { // Firefox  Chrome
            return elm.selectionStart;
        }
    },
    // 转百分号，小数后两位
    numPercent: function(num) {
        return (num * 100).toFixed(2) + "%";
    }
}
