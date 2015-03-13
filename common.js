"use strict";

// 验证类
var rules = {
    // 是否为空
    required: function(value) {
        return $.trim(value).length != 0;
    },
    // 手机
    isPhone: function(value) {
        return /^1[3|4|7|5|8][0-9]\d{8}$/.test(value);
    },
    // 中文
    isChinese: function(value) {
        return /[\u4e00-\u9fa5]/.test(value);
    },
    // 全数字
    isNum: function(value) {
        return /^[0-9]\d*$/.test(value);
    },
    // 身份证
    isIdCard: function(value) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value.toUpperCase());
    },
    // 英文、数字、汉字
    isUserName: function(value) {
        return /^[a-zA-Z0-9\u4E00-\u9FA5]+$/.test(value);
    },
    // 是否为RMB
    isMoney: function(data, isPositive) {
        return isPositive ? /^\d+(\.\d{1,2})?$/.test(data) && parseFloat(data) > 0 : /^(-)?\d+(\.\d{1,2})?$/.test(data);
    }
}


//工具类
var utils = {
    // 获取有效数字
    getNum: function(v) {
        var num = $.trim(v).replace(/\b(0+)/gi, "");
        return num;
    },
    //获取字符串真实长度
    getStrLength: function(str) {
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    },
    // 格式化货币，满三位加逗号
    formatMoney: function(num, n) {
        num = String(num.toFixed(n ? n : 2));
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) num = num.replace(re, "$1,$2")
        return n ? num : num.replace(/^([0-9,]+\.[1-9])0$/, "$1").replace(/^([0-9,]+)\.00$/, "$1");;
    },
    // 转百分号，小数后两位
    numPercent: function(num) {
        return (num * 100).toFixed(2) + "%";
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
    /** 
     * 倒计时函数
     * @param o jQ对象
     * @param s 时间 默认60
     */
    countDown: function(o, s) {
        //v是默认文字
        var v = o.val();
        var s = s ? s : 60;
        count(o, v, s);

        function count(o, v, s) {
            if (s > 0) {
                o.attr('disabled', 'true');
                s--;
                o.val(v + "(" + s + ")");
                setTimeout(function() {
                    count(o, v, s);
                }, 1000);
            } else {
                o.removeAttr('disabled');
                o.val(v);
            }
        }
    }

}
