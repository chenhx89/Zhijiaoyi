"use strict";
/**
 * 智交易手机版公共js
 * version: 1.1.0 (Wed, 8 April 2015)
 * @author taosiwei
 * @requires jQuery v1.8.3 or later
 * @requires Fancybox v2.1.5 or later
 * Website at http://m.dev.zhijiaoyi.org/
 * ©2011-2015 All rights reserved | 郎bank
 */


/**
 * 表单验证插件
 * @usage $form.validate()
 * @param rules 对应表单项name及其所需验证规则
 * @param messages 对应表单项name及其提示信息
 * @param errorElement 错误提示区
 * @param ajaxForm 需要ajax提交
 */
$.fn.validate = function(options) {
    // 检验是否存在对象
    if (!this.length) {
        console.warn("对象不存在！");
        return;
    }

    var that = $(this),
        settings = $.extend({
            // 默认值
            rules: {},
            messages: {},
            submitBtn: $("[type=submit]", that),
            errorElement: $("div.error"),
            ajaxForm: false,
            regs: {
                // 是否为空
                required: function(value, param, element) {
                    if (this.checkable(element)) {
                        return element.checked;
                    }
                    return $.trim(value).length > 0;
                },
                checkable: function(element) {
                    return (/radio|checkbox/i).test(element.type);
                },
                // 重复
                equalTo: function(newvalue, oldvalue) {
                    return newvalue === $("[name=" + oldvalue + "]").val();
                },
                // 最小长度
                min: function(value, min) {
                    return value.length >= min;
                },
                // 最大长度
                max: function(value, max) {
                    return value.length <= max;
                },
                // 长度范围
                range: function(value, range) {
                    return value.length >= range.min && value.length <= range.max;
                },
                //最小数值
                minNumber: function(value, minnmber) {
                    return Number(value) >= Number(minnmber);
                },
                //最大数值
                maxNumber: function(value, maxnmber) {
                    return Number(value) <= Number(maxnmber);
                },
                // 手机
                isPhone: function(value) {
                    return /^1[3|4|7|5|8][0-9]\d{8}$/.test(value);
                },
                // 全中文
                isChinese: function(value) {
                    return /^[\u4e00-\u9fa5]+$/.test(value);
                },
                // 全数字
                isNum: function(value) {
                    return /^[0-9]+$/.test(value);
                },
                // 全英文
                isEnglish: function(value) {
                    return /^[a-zA-Z]+$/.test(value);
                },
                // 英文、数字
                isPwd: function(value) {
                    return /^[a-zA-Z0-9]+$/.test(value);
                },
                // 英文、数字、汉字
                isUname: function(value) {
                    return /^[a-zA-Z0-9\u4E00-\u9FA5]+$/.test(value);
                },
                // 是否为RMB
                isMoney: function(data, isPositive) {
                    return isPositive ? /^\d+(\.\d{1,2})?$/.test(data) && parseFloat(data) > 0 : /^(-)?\d+(\.\d{1,2})?$/.test(data);
                },
                // 身份证
                isIdCard: function(idCard) {
                    //15位和18位身份证号码的正则表达式
                    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

                    //如果通过该验证，说明身份证格式正确，但准确性还需计算
                    if (regIdCard.test(idCard)) {
                        if (idCard.length == 18) {
                            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                            var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                            for (var i = 0; i < 17; i++) {
                                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                            }

                            var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
                            var idCardLast = idCard.substring(17); //得到最后一位身份证号码

                            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                            if (idCardMod == 2) {
                                if (idCardLast == "X" || idCardLast == "x") {
                                    return true;
                                } else {

                                    return false;
                                }
                            } else {
                                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                                if (idCardLast == idCardY[idCardMod]) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    } else {
                        return false;
                    }
                    return true;
                },
                //验证银行卡号
                isBankCard: function(bankCard) {

                    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";

                    var lastNum = bankCard.substr(bankCard.length - 1, 1); //取出最后一位（与luhm进行比较）
                    var first15Num = bankCard.substr(0, bankCard.length - 1); //前15或18位
                    var newArr = new Array();
                    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
                        newArr.push(first15Num.substr(i, 1));
                    }
                    var arrJiShu = new Array(); //奇数位*2的积 <9
                    var arrJiShu2 = new Array(); //奇数位*2的积 >9
                    var arrOuShu = new Array(); //偶数位数组
                    for (var j = 0; j < newArr.length; j++) {
                        if ((j + 1) % 2 == 1) { //奇数位
                            if (parseInt(newArr[j]) * 2 < 9)
                                arrJiShu.push(parseInt(newArr[j]) * 2);
                            else
                                arrJiShu2.push(parseInt(newArr[j]) * 2);
                        } else //偶数位
                            arrOuShu.push(newArr[j]);
                    }
                    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
                    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
                    for (var h = 0; h < arrJiShu2.length; h++) {
                        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
                        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
                    }
                    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
                    var sumOuShu = 0; //偶数位数组之和
                    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
                    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
                    var sumTotal = 0;
                    for (var m = 0; m < arrJiShu.length; m++) {
                        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
                    }
                    for (var n = 0; n < arrOuShu.length; n++) {
                        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
                    }
                    for (var p = 0; p < jishu_child1.length; p++) {
                        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
                        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
                    }
                    //计算总和
                    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
                    //计算Luhm值
                    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
                    var luhm = 10 - k;

                    if (strBin.indexOf(bankCard.substring(0, 2)) == -1) {
                        return false;
                    }
                    if (!(lastNum == luhm)) {
                        return false;
                    }
                    return true;
                },
                // 邮件
                isEmail: function(value) {
                    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
                }
            }
        }, options);


    // 绑定input事件，清掉错误提示
    $.each(settings.rules, function(obj, rules) {
        $("[name=" + obj + "]").on('input propertychange', function(event) {
            settings.errorElement.html("");
        });
    });

    settings.submitBtn.click(function(event) {
        event.preventDefault();
        $(this).attr("disabled", "disabled");
        // 遍历需要验证的项目
        for (var obj in settings.rules) {
            if (settings.rules.hasOwnProperty(obj)) {
                // 当前项
                var curObj = $("[name=" + obj + "]"),
                    // 当前项需要的验证规则
                    curMethods = settings.rules[obj],
                    // 当前值
                    curVal = curObj.val();
                // 遍历当前项的验证规则
                for (var method in curMethods) {
                    // 当前参数
                    var curParam = curMethods[method],
                        // 进行验证
                        result = settings.regs["" + method](curVal, curParam, curObj[0]);
                    if (!result) {
                        // 验证失败显示信息
                        var msg = settings.messages["" + obj]["" + method];
                        settings.errorElement.html(msg);
                        curObj.focus();
                        settings.submitBtn.removeAttr("disabled");
                        return;
                    };
                    // 验证通过移除信息
                    settings.errorElement.html("");
                }
            };
        }
        // 表单提交
        if (!settings.ajaxForm) {
            $.fancybox.showLoading();
            settings.submitBtn.removeAttr("disabled");
            that.submit();
        } else {
            $.fancybox.showLoading();
            var ajaxForm = settings.ajaxForm;
            // 遍历ajax需要的data
            ajaxForm.data = {};
            for (var i = 0; i < ajaxForm.inputs.length; i++) {
                var curInput = ajaxForm.inputs[i],
                    curVal = $("[name=" + curInput + "]").val();
                ajaxForm.data["" + curInput] = curVal;
            };
            // ajax提交
            $.ajax({
                    url: that.attr("action") ? that.attr("action") : ajaxForm.url,
                    type: that.attr("method") ? that.attr("method") : "POST",
                    dataType: ajaxForm.dataType ? ajaxForm.dataType : "json",
                    data: ajaxForm.data,
                    success: function(response) {
                        switch (response.status) {
                            case 1:
                                // 返回成功跳转
                                if (response.popup === false) {
                                    window.location.href = response.return_url;
                                } else {
                                    txtBox(response.msg);
                                    setTimeout(function() {
                                        window.location.href = response.return_url;
                                    }, 2000);
                                }
                                break;
                            default:
                                // 返回错误提示
                                settings.errorElement.html(response.msg);
                                if (response.error_login && response.error_login >= 3) {
                                    $("#valimg").show();
                                };
                        }
                    }
                })
                .fail(function() {
                    txtBox("请求失败,请拨打客服热线：400 867 8833。");
                })
                .always(function() {
                    $.fancybox.hideLoading();
                    settings.submitBtn.removeAttr("disabled");
                });

        };
    });
};


//工具类
var utils = {
    // 获取有效数字
    getNum: function(v) {
        var num = $.trim(v).replace(/\b(0+)/gi, "");
        return num;
    },
    formatMoney: function(num, n) {
        num = String(num.toFixed(n ? n : 2));
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) num = num.replace(re, "$1,$2")
        return n ? num : num.replace(/^([0-9,]+\.[1-9])0$/, "$1").replace(/^([0-9,]+)\.00$/, "$1");;
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
    // 数字转货币，（数字，小数后几位，分隔符默认逗号）
    NumToMoney: function(num, precision, separator) {
        var parts;
        // 判断是否为数字
        if (!isNaN(parseFloat(num)) && isFinite(num)) {
            // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
            // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
            // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
            // 的值变成了 12312312.123456713
            num = Number(num);
            // 处理小数点位数
            num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
            // 分离数字的小数部分和整数部分
            parts = num.split('.');
            // 整数部分加[separator]分隔, 借用一个著名的正则表达式
            parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));
            return parts.join('.');
        }
        return NaN;
    },
    // 货币转数字
    MoneyToNum: function(currency) {
        return Number(currency.replace(/[^0-9\.]+/g, ""));
    },
    // 转百分号，小数后两位
    numPercent: function(num) {
        return (num * 100).toFixed(2) + "%";
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
    }
}

// 弹窗类
// 通用弹窗 参数(主体内容，是否显示关闭按钮，是否能够点击背景退出)
// fancybox使用详情：http://fancyapps.com/fancybox/#useful
function commonFancybox(content, showcloseBtn, closeOnOver) {
    return $.fancybox(content, {
        closeBtn: showcloseBtn,
        padding: 0,
        minWidth: 270,
        minHeight: 50,
        helpers: {
            overlay: {
                closeClick: closeOnOver
            }
        }
    });
}

// 余额不足 lackMoneyBox("1,000","user-treasure-pay.html");
function lackMoneyBox(balance, jumpUrl) {
    var content = '<div class="popup-box">' +
        '<p class="txt1">您的账户余额不足，请充值!</p>' +
        '<p class="txt2">账户余额：<span>' + balance + '</span>元</p>' +
        '<div class="btn-box">' +
        '<div class="btn-cell"><a href="' + jumpUrl + '" class="btn-small">充值</a></div>' +
        '</div>' +
        '</div>';
    commonFancybox(content, false, false);
}

// 确认弹窗 confirmBox("你确认要终止配资吗？","StopPeizi()");
function confirmBox(txt, ajaxFun) {
    var content = '<div class="popup-box">' +
        '<p class="txt1">' + txt + '</p>' +
        '<div class="btn-box">' +
        '<div class="btn-cell"><a href="javascript:;" onclick="' + ajaxFun + '" class="btn-small">确认</a></div>' +
        '<div class="btn-cell"><a href="javascript:$.fancybox.close();" class="btn-small">取消</a></div>' +
        '</div>' +
        '</div>';
    commonFancybox(content, false, false);
}

// 纯文字弹窗 txtBox("请阅读并同意签署《借款协议》")
function txtBox(txt) {
    var content = '<div class="popup-box">' +
        '<p class="txt1">' + txt + '</p>' +
        '</div>';
    commonFancybox(content, false, true);
}

// 文字 + 按钮 txtBtnBox("请先添加银行卡，然后再申请提现！","立即添加","http://baidu.com/");
function txtBtnBox(txt, btnTxt, jumpUrl) {
    var content = '<div class="popup-box">' +
        '<p class="txt1">' + txt + '</p>' +
        '<div class="btn-box">' +
        '<div class="btn-cell"><a href="' + jumpUrl + '" class="btn-small">' + btnTxt + '</a></div>' +
        '</div>' +
        '</div>';
    commonFancybox(content, false, false);
}



// 功能类
// 检验手机号是否已注册
function CheckPhone(phonenumber, callback) {
    $.fancybox.showLoading();
    var isRegistered = false,
        returnMsg = "";
    $.ajax({
        type: "GET",
        url: "/index.php?user&q=getAjax/phone",
        data: {
            phone: phonenumber,
            // 使用Pc接口
            usePc: true
        },
        cache: false,
        dataType: "json",
        success: function(data) {
            // 返回1，则手机号未注册过，不是则注册过
            if (data.code != 1) {
                isRegistered = true;
            }
            returnMsg = data.msg;
            if (callback) {
                callback(isRegistered, returnMsg);
            };
        }
    }).fail(function() {
        // console.warn("请求失败");
        txtBox("请求错误，请稍后再试。<br>如有问题请拨打400 867 8833。");
    }).always(function() {
        $.fancybox.hideLoading();
        // console.log("请求完成");
    });
}

// 发送验证码
// usage: AjaxSendSms(phonenumber, 'reg');
function AjaxSendSms(phonenumber, sendType) {
    var sendSmsData = '',
        url = '/index.php?user&q=action/sendSms';
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: {
            phone: phonenumber,
            sendType: sendType,
            usePc: true
        },
        success: function(msg) {
            sendSmsData = msg;
        }
    }).fail(function() {
        // console.warn("请求失败");
        txtBox("验证码发送失败，请稍后再试。<br>如有问题请拨打400 867 8833。");
    });
    return sendSmsData;
}

// 倒计时
// $btnSms.CountDown({
//     seconds: 60,
//     disableClass: "color-grey",
//     showText: true
// })
$.fn.CountDown = function(options) {
    // 检验是否存在对象
    if (!this.length) {
        console.warn("对象不存在！");
        return;
    }

    var that = $(this),
        settings = $.extend({
            seconds: 60,
            disableClass: "",
            oldText: that.val() ? that.val() : that.text(),
            showText: true
        }, options);

    function Count(obj, second, className, oldText, showText) {
        if (second > 0) {
            obj.attr('disabled', true).addClass(className);
            second--;
            var text;
            if (showText) {
                text = "已发送(" + second.toString() + ")";
            } else {
                text = "(" + second.toString() + ")";
            }
            obj.val() ? obj.val(text) : obj.text(text);
            setTimeout(function() {
                Count(obj, second, className, oldText, showText)
            }, 1000);
        } else {
            obj.removeAttr('disabled').removeClass(className);
            obj.val() ? obj.val(oldText) : obj.text(oldText);
        };
    }
    Count(that, settings.seconds, settings.disableClass, settings.oldText, settings.showText);
}
