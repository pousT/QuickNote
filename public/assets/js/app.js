var Server = {};
Server.transfer = function (jsonData) {
    var stringifiedJson = JSON.stringify(jsonData);
    var url = baseUrl + "updateAll";
    $.ajax({
        type: 'POST',
        url: url,
        data: stringifiedJson,
        contentType: "text/plain",
        success: function (data) {
            console.log("updateAll suceess");
            var res = jQuery.parseJSON(data);
            if(res.status == "success") {
                showMsg(getMsg(res.msg));
            }
        },
        error: function (data) {
            if(data.status == 401) { // unauthorized
//                bootbox.alert("Authentication failed. Please log in first.", function() {});
                
                bootbox
                .dialog({
                    title: 'Authentication failed. Please log in first',
                    message: $('#loginForm'),
                    show: false /* We will show it manually later */
                })
                .on('shown.bs.modal', function() {
                    $('#loginForm')
                        .show()                             /* Show the login form */
                        .formValidation('resetForm', true); /* Reset form */
                })
                .on('hide.bs.modal', function(e) {
                    /**
                     * Bootbox will remove the modal (including the body which contains the login form)
                     * after hiding the modal
                     * Therefor, we need to backup the form
                     */
                    $('#loginForm').hide().appendTo('body');
                })
                .modal('show');
            }
            else {
                var res = jQuery.parseJSON(data.responseText);
                showMsg(getMsg(res.msg));
            }
        }
    });
};

Server.uploadToServer = function() {
    var newAllAppData = {};
    newAllAppData.UserInfo = UserInfo;
    newAllAppData.notebooks = transform(Notebook.cache);
    newAllAppData.shareNotebooks = shareNotebooks;
    newAllAppData.sharedUserInfos = sharedUserInfos;
    newAllAppData.notes = transform(Note.cache);
    newAllAppData.latestNotes = transform(Note.cache);
    newAllAppData.tagsJson = clone(Tag.tags);
//    trackingLog.add(TrackLogbook); // if upload when use exits, it should already be added in by calling saveIntoLocal
    newAllAppData.trackingLog = trackingLog;
    newAllAppData.shareNotebookDefault = shareNotebookDefault;
    newAllAppData.group = group;
    
    Server.transfer(newAllAppData);
}

// utility functions
function trimLeft(t, e) {
    if (!e || " " == e) return $.trim(t);
    for (; 0 == t.indexOf(e);) t = t.substring(e.length);
    return t
}
function json(str) {
    return eval("(" + str + ")")
}

// 用于替换html标签里的内容
function t() {
    var t = arguments;
    if (t.length <= 1) return t[0];
    var e = t[0];
    if (!e) return e;
    var n = "LEAAEL";
    e = e.replace(/\?/g, n); // 把所有？替换为"LEAAEL"
    for (var o = 1; o <= t.length; ++o) e = e.replace(n, t[o]); // 按顺序，一次把"LEAAEL"替换为参数
    return e
}

function arrayEqual(t, e) {
    return t = t || [],
    e = e || [],
    t.join(",") == e.join(",")
}
function isArray(t) {
    return "[object Array]" === Object.prototype.toString.call(t)
}
function isEmpty(t) {
    return t ? isArray(t) && 0 == t.length ? !0 : !1 : !0
}
function getFormJsonData(t) {
    var e = formArrDataToJson($("#" + t).serializeArray());
    return e
}
function formArrDataToJson(t) {
    var e = {},
    n = {};
    for (var o in t) {
        var r = t[o].name,
        i = t[o].value;
        "[]" != r.substring(r.length - 2, r.length) ? e[r] = i: (r = r.substring(0, r.length - 2), void 0 == n[r] ? n[r] = [i] : n[r].push(i))
    }
    return $.extend(e, n)
}
function formSerializeDataToJson(t) {
    for (var e = t.split("&"), n = {},
    o = {},
    r = 0; r < e.length; ++r) {
        var i = e[r].split("="),
        a = decodeURI(i[0]),
        s = decodeURI(i[1]);
        "[]" != a.substring(a.length - 2, a.length) ? n[a] = s: (a = a.substring(0, a.length - 2), void 0 == o[a] ? o[a] = [s] : o[a].push(s))
    }
    return $.extend(n, o)
}
function _ajaxCallback(t, e, n) {
    if (t === !0 || "true" == t || "object" == typeof t) {
        if (t && "object" == typeof t && "NOTLOGIN" == t.Msg) return void alert(getMsg("Please log in firstly!"));
        "function" == typeof e && e(t)
    } else "function" == typeof n ? n(t) : alert("error!")
}

// Note object
function _ajax(t, e, n, o, r, i) {
    return i = "undefined" == typeof i ? !0 : !1,
    $.ajax({
        type: t,
        url: e,
        data: n, //发送/接受的数据
        async: i,
        success: function(t) {
            _ajaxCallback(t, o, r)
        },
        error: function(t) {
            _ajaxCallback(t, o, r)
        }
    })
}

//t: 目标路径
//e:
//n: function
function ajaxGet(t, e, n, o, r) {
    return _ajax("GET", t, e, n, o, r)
}

function ajaxPost(t, e, n, o, r) {
    _ajax("POST", t, e, n, o, r)
}

function ajaxPostJson(t, e, n, o, r) {
    r = "undefined" == typeof r ? !0 : !1,
    $.ajax({
        url: t, //发送请求的地址
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        async: r,
        data: JSON.stringify(e),
        success: function(t, e) { //请求成功后的回调函数
            _ajaxCallback(t, n, o)
        },
        error: function(t) {
            _ajaxCallback(t, n, o)
        }
    })
}
function findParents(t, e) {
    if ($(t).is(e)) return $(t);
    for (var n = $(t).parents(), o = 0; o < n.length; ++o) if (log(n.eq(o)), n.eq(o).is(e)) return n.seq(o);
    return null
}
function getVendorPrefix() {
    for (var t = document.body || document.documentElement,
    e = t.style,
    n = ["webkit", "khtml", "moz", "ms", "o"], o = 0; o < n.length;) {
        if ("string" == typeof e[n[o] + "Transition"]) return n[o];
        o++
    }
}

function switchEditor(t) {
//    LEA.isM = t,
//    t ? ($("#mdEditor").css("z-index", 3).show(), $("#leanoteNav").hide()) : ($("#editor").show(), $("#mdEditor").css("z-index", 1).hide(), $("#leanoteNav").show())
    $("#editor").show();
}


// t就是note的html content
function setEditorContent(t, e, n, o) {
    if (t || (t = ""), clearIntervalForSetContent && clearInterval(clearIntervalForSetContent), e) MD ? (MD.setContent(t), MD.clearUndo && MD.clearUndo(), o && o()) : clearIntervalForSetContent = setTimeout(function() {
        setEditorContent(t, !0, !1, o)
    },
    100);
    else if ("undefined" != typeof tinymce && tinymce.activeEditor) {
        var r = tinymce.activeEditor; // r就是editor可编辑的部分
//        alert(t);
//        var thisEditor = $("editor");
        r.setContent(t); // 真正更新内容的地方！！！！！！！！！
//        alert(thisEditor.html());
//        thisEditor.html(t);
        o && o();
        r.undoManager.clear();
        addDDListeners();
    } else clearIntervalForSetContent = setTimeout(function() {
        setEditorContent(t, !1, !1, o)
    },
    100);
    // for resizing
    $(".ui-resizable-handle").remove();
}
function previewIsEmpty(t) {
    return t && t.substr(0, previewToken.length) != previewToken ? !1 : !0
}
function isAceError(t) {
    return t ? -1 != t.indexOf("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") : !1
}

// 提取editor内容
// t: boolean值：是否为markdown
function getEditorContent(t) {
    var e = _getEditorContent(t);
    return '<p><br data-mce-bogus="1"></p>' === e ? "<p><br></p>": e
}

function _getEditorContent(t) {
    // if it is markdown
    if (t) return [MD.getContent(), "<div>" + $("#preview-contents").html() + "</div>"];
    // if not markdown
    var e = tinymce.activeEditor;
    if (e) {
        var n = $(e.getBody()).clone();
        if (n.find(".toggle-raw").remove(), window.LeaAce && LeaAce.getAce) for (var o = n.find("pre"), r = 0; r < o.length; ++r) {
            var i = o.eq(r),
            a = i.attr("id"),
            s = LeaAce.getAce(a);
            if (s) {
                var l = s.getValue();
                isAceError(l) && (l = i.html()),
                l = l.replace(/</g, "&lt").replace(/>/g, "&gt"),
                i.removeAttr("style", "").removeAttr("contenteditable").removeClass("ace_editor"),
                i.html(l)
            }
        }
        if (n.find("pinit").remove(), n.find(".thunderpin").remove(), n.find(".pin").parent().remove(), n = $(n).html()) for (;;) {
            var c = n.lastIndexOf("</script>");
            if ( - 1 == c) return n;
            var u = n.length;
            if (u - 9 != c) return n;
            var f = n.lastIndexOf("<script ");
            if ( - 1 == f && (f = n.lastIndexOf("<script>")), -1 == f) return n;
            n = n.substring(0, f)
        }
        return n
    }
}
//function disableEditor() {
//    var t = tinymce.activeEditor;
//    t && (t.hide(), LEA.editorStatus = !1, $("#mceTollbarMark").show().css("z-index", 1e3))
//}
//function enableEditor() {
//    if (!LEA.editorStatus) {
//        $("#mceTollbarMark").css("z-index", -1).hide();
//        var t = tinymce.activeEditor;
//        t && t.show()
//    }
//}
function showDialog(t, e) {
    $("#leanoteDialog #modalTitle").html(e.title),
    $("#leanoteDialog .modal-body").html($("#" + t + " .modal-body").html()),
    $("#leanoteDialog .modal-footer").html($("#" + t + " .modal-footer").html()),
    delete e.title,
    e.show = !0,
    $("#leanoteDialog").modal(e)
}
function hideDialog(t) {
    t || (t = 0),
    setTimeout(function() {
        $("#leanoteDialog").modal("hide")
    },
    t)
}
function closeDialog() {
    $(".modal").modal("hide")
}
function showDialog2(t, e) {
    e = e || {},
    e.show = !0,
    $(t).modal(e)
}
function hideDialog2(t, e) {
    e || (e = 0),
    setTimeout(function() {
        $(t).modal("hide")
    },
    e)
}

// 显示modal dialog（sharing）
// t: 回调函数名
// e: 包含notebookId的json
//iris
function showDialogRemote(t, e) {
    // group sharing 信息初始化
    $("#groupInfoTable").empty(); // empty the dialog first
    $("#baseInfoTableBody").empty();
    $("#shareMsg").empty();

    for(var i in group) {     
//        dom element example:
//        <tr data-id="56fccc7aab64415150000de4" data-uid="56d53e56ab64417fb1001e21">
//            <td>
//                mk
//            </td>
//            <td>
//                <label><input type="radio" name="perm_56fccc7aab64415150000de4" checked="checked" value="0" class="group-perm"> Read only</label> 
//                <label><input type="radio" name="perm_56fccc7aab64415150000de4" value="1" class="group-perm"> Writable</label>
//            </td>
//            <td>
//                <button class="btn btn-default btn-share-or-not">Not shared</button>
//            </td>
//        </tr>
        var curGroup = group[i];
        var newGroupDom = '<tr data-id="' + curGroup.GroupId + '"' + ' data-uid="">';
        newGroupDom += "<td>" + curGroup.GroupName + "</td>";
        newGroupDom += "<td>" + '<label><input type="radio" name="perm_' + curGroup.GroupId + '" checked="checked" value="0" class="group-perm">  <i class="fa fa-eye" aria-hidden="true"></i> Read Only </label><br/>';
        newGroupDom += '<label><input type="radio" name="perm_' + curGroup.GroupId + '" value="1" class="group-perm">  <i class="fa fa-pencil" aria-hidden="true"></i> Read and Write</label> </td>';
        // newGroupDom += "<td>" + '<label><input type="radio" name="perm_' + curGroup.GroupId + '" checked="checked" value="0" class="group-perm"> Read only </label>';
        // newGroupDom += '<label><input type="radio" name="perm_' + curGroup.GroupId + '" value="1" class="group-perm"> Writable</label> </td>';
        newGroupDom += '<td> <button id = "notsharebtn" class="btn btn-default btn-share-or-not"><i class="fa fa-share" aria-hidden="true"></i> Share</button> </td>';
        newGroupDom += "</tr>";
        $("#groupInfoTable").append(newGroupDom);
    }
    
    
    e = e || {},
    t += "?";
    for (var n in e) t += n + "=" + e[n] + "&";
    $("#leanoteDialogRemote").modal({
//        remote: t
    })
}

function hideDialogRemote(t) {
    t ? setTimeout(function() {
        $("#leanoteDialogRemote").modal("hide")
    },
    t) : $("#leanoteDialogRemote").modal("hide")
}

//function hideGroupDialogRemote(t, e) {
//    t ? setTimeout(function() {
//        $("#leanoteDialogRemote").modal("hide")
//    },
//    t) : $("#leanoteDialogRemote").modal("hide")
//}

function notifyInfo(t) {
    $.pnotify({
        title: "通知",
        text: t,
        type: "info",
        styling: "bootstrap"
    })
}
function notifyError(t) {
    $.pnotify.defaults.delay = 2e3,
    $.pnotify({
        title: "通知",
        text: t,
        type: "error",
        styling: "bootstrap"
    })
}
function notifySuccess(t) {
    $.pnotify({
        title: "通知",
        text: t,
        type: "success",
        styling: "bootstrap"
    })
}
function goNowToDatetime(t) {
    if (!t) return "";
    if ("object" == typeof t) try {
        return t.format("yyyy-M-d hh:mm:ss")
    } catch(e) {
        return getCurDate()
    }
    return t.substr(0, 10) + " " + t.substr(11, 8)
}
function getCurDate() {
    return (new Date).format("yyyy-MM-dd hh:mm:ss")
}
function enter(t, e, n) {
    t || (t = "body"),
    $(t).on("keydown", e,
    function(t) {
        13 == t.keyCode && n.call(this)
    })
}
function enterBlur(t, e) {
    t || (t = "body"),
    e || (e = t, t = "body"),
    $(t).on("keydown", e,
    function(t) {
        13 == t.keyCode && $(this).trigger("blur")
    })
}

// gernerate a hashcode as the object ID
function getObjectId() {
    return ObjectId() // JQuery function
}

//function resizeEditor(t) {
//    return void(LEA.isM && MD && MD.resize && MD.resize())
//}
function showMsg(t, e) {
    $("#msg").html(t),
    e && setTimeout(function() {
        $("#msg").html("")
    },
    e)
}
function showMsg2(t, e, n) {
    $(t).html(e),
    n && setTimeout(function() {
        $(t).html("")
    },
    n)
}
function showAlert(t, e, n, o) {
    $(t).html(e).removeClass("alert-danger").removeClass("alert-success").removeClass("alert-warning").addClass("alert-" + n).show(),
    o && $(o).focus()
}
function hideAlert(t, e) {
    e ? setTimeout(function() {
        $(t).hide()
    },
    e) : $(t).hide()
}
function post(t, e, n, o) {
    o && $(o).button("loading"),
    ajaxPost(t, e,
    function(t) {
        o && $(o).button("reset"),
        "object" == typeof t ? "function" == typeof n && n(t) : alert("Q-Note出现了错误!")
    })
}
function isEmail(t) {
    var e = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9\-]+@([a-zA-Z0-9\-]+[_|\_|\.|\-]?)*[a-zA-Z0-9\-]+\.[0-9a-zA-Z]{2,3}$/;
    return e.test(t)
}

// 验证输入的email
function isEmailFromInput(t, e, n, o) {
    var input = $(t).val(),
    i = function() {};
    if (e && (i = function(e, n) {
        showAlert(e, n, "danger", t)
    }), input) {
        return input;
//        if (isEmail(r)) return r;
//        i(e, o || getMsg("errorEmail"))
    } else i(e, n || getMsg("inputEmail"))
}

function initCopy(t, e) {
    var n = new ZeroClipboard(document.getElementById(t), {
        moviePath: "/js/ZeroClipboard/ZeroClipboard.swf"
    });
    n.on("complete",
    function(t, n) {
        e(n)
    })
}
function showLoading() {
    $("#loading").css("visibility", "visible")
}
function hideLoading() {
    $("#loading").css("visibility", "hidden")
}
function setCookie(t, e, n) {
    var o = new Date;
    o.setDate(o.getDate() + n),
    document.cookie = t + "=" + escape(e) + (null == n ? "": ";expires=" + o.toGMTString()) + "path=/",
    document.cookie = t + "=" + escape(e) + (null == n ? "": ";expires=" + o.toGMTString()) + "path=/note"
}

function logout() {
    bootbox.confirm("Are you sure to quit now?", function(result) {
        if(result) {
            Note.curChangedSaveIt(!0);
            //    LEA.isLogout = !0,
            setCookie("QUICKNOTE_SESSION", "", -1);
        //    location.href = UrlPrefix + "/logout?id=1"
        //    location.href = "SignIn.html"


            var data = { // 如果share的是notebook
                UserId: UserId
            };
            var stringifiedJson = JSON.stringify(data);
            var url = baseUrl + "logOut";
            $.ajax({
                type: 'POST', 
                url: url,
                data: stringifiedJson,
                contentType: "text/plain",
                success: function (data) {
                    var res = jQuery.parseJSON(data);
                    if (res.status == "success") { // 如果成功

                    } else { // 如果失败
                        bootbox.alert(res.msg, function() {
                        });
                    }
                },
                error: function (xhr, status, error) {
                }
            });
            location.href = "login.html";
        }
    });
}

function getImageSize(t, e) {
    function n(t, n) {
        o.parentNode.removeChild(o),
        e({
            width: t,
            height: n
        })
    }
    var o = document.createElement("img");
    o.onload = function() {
        n(o.clientWidth, o.clientHeight)
    },
    o.onerror = function() {
        n()
    },
    o.src = t;
    var r = o.style;
    r.visibility = "hidden",
    r.position = "fixed",
    r.bottom = r.left = 0,
    r.width = r.height = "auto",
    document.body.appendChild(o)
}
function hiddenIframeBorder() {
    $(".mce-window iframe").attr("frameborder", "no").attr("scrolling", "no")
}
function getEmailLoginAddress(t) {
    if (t) {
        var e = t.split("@");
        if (e && !(e.length < 2)) {
            var n = e[1];
            return email2LoginAddress[n] || "http://mail." + n
        }
    }
}
function reIsOk(t) {
    return t && "object" == typeof t && t.Ok
}
function getHashObject() {
    var t = location.hash; // location对象包含有关当前 URL 的信息。location.hash返回URL 的锚部分（从 # 号开始的部分）
    // 此时的location还只是变note之前的那个URL
    if (!t) return {};
    for (var e = t.substr(1), n = e.split("&"), o = {},
    r = 0; r < n.length; ++r) {
        var i = n[r].split("=");
        2 == i.length && (o[i[0]] = i[1])
    }
    return o
}
function getHash(t, e) {
    var n = getHashObject();
    return n[t]
}
function setHash(t, e) {
    var n = location.hash;
    if (!n) return void(location.href = "#" + t + "=" + e);
    var o = getHashObject();
    o[t] = e;
    var r = "";
    for (var i in o) o[i] && (r && (r += "&"), r += i + "=" + o[i]);
    location.href = "#" + r
}

//声明变量


////声明LEA: editor
if ("undefined" == typeof LEA) var LEA = {};
var Notebook = {
    cache: {}
},

//声明Note类
//cache是一个attribute
Note = {
    cache: {}
},
Tag = {},
Notebook = {},
Share = {},
Mobile = {},
LeaAce = {},
Converter,
MarkdownEditor,
ScrollLink,
MD;

// 给LEA添加新的方法
$.extend(LEA, {
    _eventCallbacks: {},
    _listen: function(t, e) {
        var n = this._eventCallbacks[t] || (this._eventCallbacks[t] = []);
        n.push(e)
    },
    on: function(t, e) {
        for (var n = t.split(/\s+/), o = 0; o < n.length; ++o) this._listen(n[o], e);
        return this
    },
    off: function(t, e) {
        var n, o, r, i, a = t.split(/\s+/);
        for (n = 0; n < a.length; n++) if (r = this._eventCallbacks[a[n].toLowerCase()]) {
            for (i = null, o = 0; o < r.length; o++) r[o] == e && (i = o);
            null !== i && r.splice(i, 1)
        }
    },
    trigger: function(t, e) {
        var n = this._eventCallbacks[t] || []; //如果this._eventCallbacks[t]存在则返回，否则返回[]
        if (0 !== n.length) for (var o = 0; o < n.length; o++) n[o].call(this, e)
    }
});

var tt = t; // t是function t()

//LEA.isM = !1,
//LEA.isMarkdownEditor = function() {
//    return LEA.isM
//};
var previewToken = "<div style='display: none'>FORTOKEN</div>",
clearIntervalForSetContent;
//LEA.editorStatus = !0,

$(function() {
    $.pnotify && ($.pnotify.defaults.delay = 1e3)
}),

Date.prototype.format = function(t) {
    var e = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    /(y+)/.test(t) && (t = t.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
    for (var n in e) new RegExp("(" + n + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[n] : ("00" + e[n]).substr(("" + e[n]).length)));
    return t
};


var email2LoginAddress = {
    "qq.com": "http://mail.qq.com",
    "gmail.com": "http://mail.google.com",
    "sina.com": "http://mail.sina.com.cn",
    "163.com": "http://mail.163.com",
    "126.com": "http://mail.126.com",
    "yeah.net": "http://www.yeah.net/",
    "sohu.com": "http://mail.sohu.com/",
    "tom.com": "http://mail.tom.com/",
    "sogou.com": "http://mail.sogou.com/",
    "139.com": "http://mail.10086.cn/",
    "hotmail.com": "http://www.hotmail.com",
    "live.com": "http://login.live.com/",
    "live.cn": "http://login.live.cn/",
    "live.com.cn": "http://login.live.com.cn",
    "189.com": "http://webmail16.189.cn/webmail/",
    "yahoo.com.cn": "http://mail.cn.yahoo.com/",
    "yahoo.cn": "http://mail.cn.yahoo.com/",
    "eyou.com": "http://www.eyou.com/",
    "21cn.com": "http://mail.21cn.com/",
    "188.com": "http://www.188.com/",
    "foxmail.com": "http://mail.foxmail.com"
};
//LEA.bookmark = null,
//LEA.hasBookmark = !1;
var vd = {
    isInt: function(t) {
        var e = /^0$|^[1-9]\d*$/;
        return result = e.test(t),
        result
    },
    isNumeric: function(t) {
        return $.isNumeric(t)
    },
    isFloat: function(t) {
        var e = /^0(\.\d+)?$|^[1-9]\d*(\.\d+)?$/;
        return result = e.test(t),
        result
    },
    isEmail: function(t) {
        var e = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9\-]+@([a-zA-Z0-9\-]+[_|\_|\.|\-]?)*[a-zA-Z0-9\-]+\.[0-9a-zA-Z]{2,3}$/;
        return result = e.test(t),
        result
    },
    isBlank: function(t) {
        return ! $.trim(t)
    },
    has_special_chars: function(t) {
        return /['"#$%&\^<>\?*]/.test(t)
    },
    init: function(form, rule_funcs) {
        function is_required(t) {
            var e = get_name(t),
            n = get_rules(t, e),
            o = n[0];
            return "required" == o.rule ? !0 : !1
        }
        function get_rules(target, name) {
            return rules[name] || (rules[name] = eval("(" + target.data("rules") + ")")),
            rules[name]
        }
        function get_msg_target(t, e) {
            if (!msg_targets[e]) {
                var n = t.data("msg_target");
                if (n) msg_targets[e] = $(n);
                else {
                    var o = $('<div class="help-block alert alert-warning" style="display: block;"></div>');
                    t.parent().append(o),
                    msg_targets[e] = o
                }
            }
            return msg_targets[e]
        }
        function hide_msg(t, e) {
            var n = get_msg_target(t, e);
            n.hasClass("alert-success") || n.hide()
        }
        function show_msg(t, e, n, o) {
            var r = get_msg_target(t, e);
            r.html(getMsg(n, o)).removeClass("hide alert-success").addClass("alert-danger").show()
        }
        function pre_fix(t) {
            var e = t.data("pre_fix");
            if (e) switch (e) {
            case "int":
                int_fix(t);
                break;
            case "price":
                price_fix(t);
                break;
            case "decimal":
                decimal_fix(t)
            }
        }
        function apply_rules(t, e) {
            var n = get_rules(t, e);
            if (pre_fix(t), !n) return ! 0;
            for (var o = 0; o < n.length; ++o) {
                var r = n[o],
                i = r.rule,
                a = r.msg,
                s = r.msgData;
                if (!rule_funcs[i](t, r)) return show_msg(t, e, a, s),
                !1
            }
            hide_msg(t, e);
            var l = t.data("post_rule");
            return l && setTimeout(function() {
                var t = $(l);
                apply_rules(t, get_name(t))
            },
            0),
            !0
        }
        function focus_func(t) {
            var e = $(t.target),
            n = get_name(e);
            hide_msg(e, n),
            pre_fix(e)
        }
        function unfocus_func(t) {
            var e = $(t.target),
            n = get_name(e);
            apply_rules(e, n)
        }
        function get_name(t) {
            return t.data("u_name") || t.attr("name") || t.attr("id")
        }
        var get_val = function(t) {
            if (t.is(":checkbox")) {
                var e = t.attr("name"),
                n = $('input[name="' + e + '"]:checked').length;
                return n
            }
            return t.is(":radio") ? void 0 : t.val()
        },
        default_rule_funcs = {
            required: function(t) {
                return get_val(t)
            },
            min: function(t, e) {
                var n = get_val(t);
                return ("" !== n || is_required(t)) && n < e.data ? !1 : !0
            },
            minLength: function(t, e) {
                var n = get_val(t);
                return ("" !== n || is_required(t)) && n.length < e.data ? !1 : !0
            },
            email: function(t, e) {
                var n = get_val(t);
                return "" !== n || is_required(t) ? vd.isEmail(n) : !0
            },
            noSpecialChars: function(t) {
                var e = get_val(t);
                return e && /[^0-9a-zzA-Z_\-]/.test(e) ? !1 : !0
            },
            password: function(t, e) {
                var n = get_val(t);
                return "" !== n || is_required(t) ? n.length >= 6 : !0
            },
            equalTo: function(t, e) {
                var n = get_val(t);
                return "" !== n || is_required(t) ? $(e.data).val() == n: !0
            }
        };
        rule_funcs = rule_funcs || {},
        rule_funcs = $.extend(default_rule_funcs, rule_funcs);
        var rules = {},
        msg_targets = {},
        $allElems = $(form).find("[data-rules]"),
        $form = $(form);
        $form.on({
            keyup: function(t) {
                13 != t.keyCode && focus_func(t)
            },
            blur: unfocus_func
        },
        'input[type="text"], input[type="password"]'),
        $form.on({
            change: function(t) {
                $(this).val() ? focus_func(t) : unfocus_func(t)
            }
        },
        "select"),
        $form.on({
            change: function(t) {
                unfocus_func(t)
            }
        },
        'input[type="checkbox"]'),
        this.valid = function() {
            for (var t = $allElems,
            e = !0,
            n = 0; n < t.length; ++n) {
                var o = t.eq(n),
                r = get_name(o);
                if (!apply_rules(o, r)) return e = !1,
                o.focus(),
                !1
            }
            return e
        },
        this.validElement = function(t) {
            for (var t = $(t), e = !0, n = 0; n < t.length; ++n) {
                var o = t.eq(n),
                r = get_name(o);
                apply_rules(o, r) || (e = !1)
            }
            return e
        }
    }
},
trimTitle = function(t) {
    return t && "string" == typeof t ? t.replace(/</g, "&lt;").replace(/>/g, "&gt;") : ""
};
Note.curNoteId = "",
Note.interval = "",
    
// 有时间版
//Note.itemIsBlog = '<div class="item-blog"><i class="fa fa-bold" title="blog"></i></div><div class="item-setting"><i class="fa fa-cog" title="setting"></i></div>',
//Note.itemTplNoImg = '<li href="#" class="item ?" data-seq="?" noteId="?">',
//Note.itemTplNoImg += Note.itemIsBlog + '<div class="item-desc"><p class="item-title">?</p ><p class="item-info"><i class="fa fa-book"></i> <span class="note-notebook">?</span> <i class="fa fa-clock-o"></i> <span class="updated-time">?</span></p ></div></li>',
////Note.itemTpl = '<li href="#" class="item ?" data-seq="?" noteId="?"><div class="item-thumb" style="">< img src="?"/></div>',
//Note.itemTpl = '<li href="#" class="item ?" data-seq="?" noteId="?">',
//Note.itemTpl += Note.itemIsBlog + '<div class="item-desc" style=""><p class="item-title">?</p ><p class="item-info"><i class="fa fa-book"></i> <span class="note-notebook">?</span> <i class="fa fa-clock-o"></i> <span class="updated-time">?</span></p ><p class="desc">?</p ></div></li>',
//Note.newItemTpl = '<li href="#" class="item item-active ?" data-seq="?" fromUserId="?" noteId="?">',
//Note.newItemTpl += Note.itemIsBlog + '<div class="item-desc" style="right: 0px;"><p class="item-title">?</p ><p class="item-info"><i class="fa fa-book"></i> <span class="note-notebook">?</span> <i class="fa fa-clock-o"></i> <span class="updated-time">?</span></p ><p class="desc">?</p ></div></li>',

// 无时间版
Note.itemIsBlog = '<div class="item-blog"><i class="fa fa-bold" title="blog"></i></div><div class="item-setting"><i class="fa fa-cog" title="setting"></i></div>',
Note.itemTplNoImg = '<li href="#" class="item ?" data-seq="?" noteId="?">',
Note.itemTplNoImg += Note.itemIsBlog + '<div class="item-desc"><p class="item-title">?</p ><p class="item-info"><i class="fa fa-book"></i> <span class="note-notebook">?</span></p ></div></li>',
//Note.itemTpl = '<li href="#" class="item ?" data-seq="?" noteId="?"><div class="item-thumb" style="">< img src="?"/></div>',
Note.itemTpl = '<li href="#" class="item ?" data-seq="?" noteId="?">',
Note.itemTpl += Note.itemIsBlog + '<div class="item-desc" style=""><p class="item-title">?</p ><p class="item-info"><i class="fa fa-book"></i> <span class="note-notebook">?</span> </p ><p class="desc">?</p ></div></li>',
Note.newItemTpl = '<li href="#" class="item item-active ?" data-seq="?" fromUserId="?" noteId="?">',
Note.newItemTpl += Note.itemIsBlog + '<div class="item-desc" style="right: 0px;"><p class="item-title">?</p ><p class="item-info"><i class="fa fa-book"></i> <span class="note-notebook">?</span> </p ><p class="desc">?</p ></div></li>',
    
Note.noteItemListO = $("#noteItemList"),

Note.cacheByNotebookId = {
    all: {}
},

Note.notebookIds = {},
Note.isReadOnly = !1,
//Note.intervalTime = 0,
Note.intervalTime = 10e3, // 10s

// save automatically every 10 seconds
Note.startInterval = function() {
    clearInterval(Note.interval),
    Note.interval = setInterval(function() {
        log("automatically saving starts..."),
        Note.curChangedSaveIt()
    },
    Note.intervalTime)
},
    
Note.stopInterval = function() {
    clearInterval(Note.interval),
    setTimeout(function() {
        Note.startInterval()
    },
    Note.intervalTime)
},

// t是notes变量中的某个note element
// 将note加载进cache
Note.addNoteCache = function(t) {
    Note.cache[t.NoteId] = t, //cache是数组，存着所有需要加载的note
    Note.clearCacheByNotebookId(t.NotebookId)
},

// t是notes变量中的每个note element
// $.extend()为JQuery函数：合并object：第一个被第二个覆盖
// void 0 是个值：类似于undefined
// e是个boolean
// 方法：如果cache存在t则更新(extend)，否则直接添加一个新的；
//      如果e是真，则清除cache里的t；
Note.setNoteCache = function(t, e) {
    if(t.NoteId == undefined) return;
    Note.cache[t.NoteId] ? $.extend(Note.cache[t.NoteId], t) : Note.cache[t.NoteId] = t,
    void 0 == e && (e = !0),
    e && Note.clearCacheByNotebookId(t.NotebookId)
},

Note.setCurNoteId = function(t) {
    this.curNoteId = t
},
Note.clearCurNoteId = function() {
    this.curNoteId = null
},
Note.getCurNote = function() {
    var t = this;
    return "" == t.curNoteId ? null: t.cache[t.curNoteId]
},
Note.getNote = function(t) {
    var e = this;
    return e.cache[t]
},

// t是某个note的notebookId
// 清空cacheByNotebookId里t对应的element
Note.clearCacheByNotebookId = function(t) {
    t && (Note.cacheByNotebookId[t] = {},
    Note.cacheByNotebookId.all = {},
    Note.notebookIds[t] = !0)
},

Note.notebookHasNotes = function(t) {
    var e = Note.getNotesByNotebookId(t);
    return ! isEmpty(e)
},

// 返回属于notebookId t的排序后的note数组
// 用于renderNotes：按updated时间排序显示notes
// cacheByNotebookId所用之处
// t: 空或者指定的notebookId
// e: 是Note的attr名（规定按照什么排序）
Note.getNotesByNotebookId = function(t, e, o) {
    // 下面如果t为false（空），就让t为"all";如果e为false（空），就让e为"UpdatedTime"

    if (e || (e = "UpdatedTime"), "undefined" == o && (o = !1), t || (t = "all"), !Note.cacheByNotebookId[t]) return [];
    if (Note.cacheByNotebookId[t][e]) return Note.cacheByNotebookId[t][e];
    var a = [];
    // 遍历所有note，把符合条件的放进a
    for (var n in Note.cache) if (n) {
        var i = Note.cache[n];
        //如果i不是trash && 不被shared && t == "all" 或者是特定的notebookId，则把i放进a
        i.IsTrash || i.IsShared || ("all" == t || i.NotebookId == t) && a.push(i)
    }
    return a.sort(function(t, a) {
        // t和a都是array里的前后两个element
        // 这里规定按照什么排序：e
        var n = t[e],
        i = a[e];
        if (o) {
            if (i > n) return - 1;
            if (n > i) return 1
        } else {
            if (i > n) return 1;
            if (n > i) return - 1
        }
        return 0
    }),
    Note.cacheByNotebookId[t][e] = a,
    a
},

Note.renderNotesAndFirstOneContent = function(t) {
    // alert("Note.renderNotesAndFirstOneContent activated");
    isArray(t) && (Note.renderNotes(t), isEmpty(t[0]) || Note.changeNoteForPjax(t[0].NoteId, !0, !1))
},

// t是个boolean：按保存时传递过来的是true
// return:  如果没有change，返回！1（false）
//          如果change了，返回一个object（包含当前changed note的信息：内容都是change过了）
Note.curHasChanged = function(t) {
    var e = Note.getCurNote(); //当前note（但是是旧的）
    if (!e) return ! 1;
    var o = $("#noteTitle").val(),
    a = Tag.getTags(),
    // n为当前note（改变以后的）
    n = {
        hasChanged: !1,
        IsNew: e.IsNew,
        IsMarkdown: e.IsMarkdown,
        FromUserId: e.FromUserId,
        NoteId: e.NoteId,
        NotebookId: e.NotebookId
    };
    e.IsNew && (n.hasChanged = !0),
    e.Title != o && (n.hasChanged = !0, n.Title = o),
    arrayEqual(e.Tags, a) || (n.hasChanged = !0, n.Tags = a.join(","));
    var i = !1;
    if ((e.IsNew || t || !Note.readOnly) && (i = !0), !n.hasChanged && !i) return ! 1; // 返回!1 == false，说明没改变
    if (!i) return n;
    var r, s, c = getEditorContent(e.IsMarkdown);
    if (isArray(c) ? (r = c[0], s = c[1], r && previewIsEmpty(s) && Converter && (s = Converter.makeHtml(r)), r || (s = ""), e.Preview = s) : r = c, e.Content != r) {
        n.hasChanged = !0,
        n.Content = r; //导入content??????
        var l = s || r;
        e.HasSelfDefined && e.IsBlog || (n.Desc = Note.genDesc(l), n.ImgSrc = Note.getImgSrc(l), n.Abstract = Note.genAbstract(l))
    } else log("text相同");

//    alert(n.Content);
    return n.hasChanged ? n: !1
},

// 将jason里的desc去掉所有标签：方便显示
Note.genDesc = function(t) {
    return t ? (t = t.replace(/<br \/>/g, " "), t = t.replace(/<\/p>/g, " "), t = t.replace(/<\/div>/g, " "), t = t.replace(/<\/?[^>]+(>|$)/g, ""), t = $.trim(t), t = t.replace(/</g, "&lt;"), t = t.replace(/>/g, "&gt;"), t.length < 300 ? t: t.substring(0, 300)) : ""
},
Note.genAbstract = function(t, e) {
    if (!t) return "";
    if (void 0 == e && (e = 1e3), t.length < e) return t;
    for (var o = !1,
    a = !1,
    n = 0,
    i = "",
    r = e,
    s = 0; s < t.length; ++s) {
        var c = t[s];
        if ("<" == c ? o = !0 : "&" == c ? a = !0 : ">" == c && o ? (n -= 1, o = !1) : ";" == c && a && (a = !1), o || a || (n += 1), i += c, n >= r) break
    }
    var l = document.createElement("div");
    return l.innerHTML = i,
    l.innerHTML
},
Note.getImgSrc = function(t) {
    if (!t) return "";
    var e = $(t).find("img");
    for (var o in e) {
        var a = e.eq(o).attr("src");
        if (a) return a
    }
    return ""
},
Note.saveInProcess = {},
Note.savePool = {},

// 最外层的保存function：只是将changed note保存到cache里
// t是个boolean值：保存时传递的是true
// e是个function
Note.curChangedSaveIt = function(t, e) {
    var o = this;
//    if (Note.curNoteId && !Note.isReadOnly) {
    if (Note.curNoteId) {
        var a;
        try {
            a = Note.curHasChanged(t) // a是个boolean值（当前note没变）或者一个object（已改变的note，包含content属性，并且是新的）
        } catch(n) {
            return void(e && e(!1))
        }
        return a && a.hasChanged ? //如果已改变
//            (log("需要保存..."),
             (Note.renderChangedNote(a), //更新notelist
             delete a.hasChanged, // 表明change已保存
             showMsg("Locally saving"),
             setTimeout(function() {
                showMsg("Locally saved")
                },500),
             o.saveInProcess[a.NoteId] = !0, // !0为true：表示当前这个note是要存的？
             // 传至服务器更新note
//             ajaxPost("/note/updateNoteOrContent", a,
//                function(t) { //ajax成功时执行的function
//                    o.saveInProcess[a.NoteId] = !1, // 对应的id存下：false（表示已经保存？）
//                    a.IsNew && //如果a.IsNew == true，才执行以下
//                        (t.IsNew = !1,
//                        Note.setNoteCache(t, !1), // 更新cache
//                        Pjax.changeNote(t)),
//                    e && e(),
//                    showMsg(getMsg("saveSuccess"), 1e3)
//                }),
            void 0 != a.Tags && "string" == typeof a.Tags && (a.Tags = a.Tags.split(",")), Note.setNoteCache(a, !1), // 更新cache
            Note.setNoteCache({NoteId: a.NoteId, //更新updatedtime
                                UpdatedTime: getCurDate()
                              },
                                !1),
            a) // 更新cache
            : // 如果没改变 （这里冒号对应上面的问号）
            (log("无需保存"), !1)
    }
},

Note.updatePoolNote = function() {
    var t = this;
    for (var e in t.savePool) if (e) {
        delete t.savePool[e];
        var o = t.savePool[e];
        t.saveInProcess[e] = !0, // !0 == true
        ajaxPost("/note/updateNoteOrContent", o,
        function(o) {
            t.saveInProcess[e] = !1 // !1 == false
        })
    }
},
Note.updatePoolNoteInterval = null,
Note.startUpdatePoolNoteInterval = function() {
    return
},

//清除当前note的被选中效果
Note.clearSelect = function(t) {
    $(".item").removeClass("item-active")
},

//t: 选到的noteID对应的notelist里的dom对象
// 这里通过添加class，实现不同的css效果（即被点击中的效果）
Note.selectTarget = function(t) {
    this.clearSelect(), //清除原note的被选中效果
    $(t).addClass("item-active")
},
Note.showContentLoading = function() {
    $("#noteMaskForLoading").css("z-index", 11)
},
Note.hideContentLoading = function() {
    $("#noteMaskForLoading").css("z-index", -1)
},
Note.directToNote = function(t) {
    var e = $("#noteItemList"),
    o = e.height(),
    a = $("[noteId='" + t + "']").position().top,
    n = e.scrollTop();
    if (a += n, a >= n && o + n >= a);
    else {
        var i = a;
        log("定位到特定note, 在可视范围内");
//        LEA.isMobile || Mobile.isMobile() || ($("#noteItemList").scrollTop(i), $("#noteItemList").slimScroll({
//            scrollTo: i + "px",
//            height: "100%",
//            onlyScrollBar: !0
//        }))
    }
},

//t: 目标note的noteID
// share: !0, !1
// 普通note: !1
Note.changeNoteForPjax = function(t, e, o) {
    // alert(" Note.changeNoteForPjax activated");
    var a = this,
    n = a.getNote(t);
    if(!n)
        n = Share.getNote(t);
    if (n) {
        var i = void 0 != n.Perm;
        void 0 == o && (o = !0),
        a.changeNote(t, i, !0,
        function(a) {
            void 0 == e && (e = !0),
            e && Pjax.changeNote(a),
            o && Note.directToNote(t)
        }),
        o && (i ? $("#myShareNotebooks").hasClass("closed") && $("#myShareNotebooks .folderHeader").trigger("click") : $("#myNotebooks").hasClass("closed") && $("#myNotebooks .folderHeader").trigger("click"), Notebook.expandNotebookTo(n.NotebookId))
    }
},

Note.contentAjax = null,
Note.contentAjaxSeq = 1,

////Note.changeNote老方法：
////t: 目标note的noteID
////e: boolean值
//Note.changeNote = function(t, e, o, a) {
//    function n(e, o) {
//        Note.contentAjax = null,
//        o == Note.contentAjaxSeq && (Note.setNoteCache(e, !1),
//        e = Note.cache[t], // e为目标note
////        alert(e.NoteId + e.Content),
//        Note.renderNoteContent(e), //！
//        i.hideContentLoading(), a && a(e))
//        //这里Note.renderNoteContent()是真正更新当前editor部分的function，通过下面的ajaxGet传递并调用
//    }
//    var i = this;
//    if (t) {
//        Note.stopInterval();
//        var r = i.getTargetById(t); //r是目标noteid对应的notelist里的dom对象
//        if (Note.selectTarget(r), void 0 == o && (o = !0), o) {
//            Note.curChangedSaveIt() //保存当前的note
//        }
//        Note.clearCurNoteId();
//        var s = i.getNote(t); //s是新选中的note
//        if (s) {
//            e || void 0 != s.Perm && (e = !0);
//            var c = !e || Share.hasUpdatePerm(t);
//            c ? (Note.hideReadOnly(), Note.renderNote(s)) : Note.renderNoteReadOnly(s),
//            switchEditor(s.IsMarkdown),
//            LEA.trigger("noteChanged", s),
//            Attach.renderNoteAttachNum(t, !0),
//            Note.contentAjaxSeq++;
//            var l = Note.contentAjaxSeq;
//            if (s.Content) return void n(s, l);
//            var d = "/note/getNoteContent",
//            N = {
//                noteId: t
//            };
//            e && (d = "/share/getShareNoteContent", N.sharedUserId = s.UserId),
//            i.showContentLoading(),
//            null != Note.contentAjax && Note.contentAjax.abort(),
////            N是目标note
//            Note.contentAjax = ajaxGet(d, N,
//            function(t) {
//                return function(e) {
//                    delete e.IsBlog,
//                    n(e, t)
//                }
//            } (l))
//        }
//    }
//},

//Note.changeNote新方法
//t: 目标note的noteID
//e: boolean值
Note.changeNote = function(t, e, o, a) {
    // alert("changeNote");

    function n(e, o) {
        Note.contentAjax = null,
        o == Note.contentAjaxSeq && (Note.setNoteCache(e, !1),
        e = Note.cache[t] || Share.getNote(t), // e为目标note
//        alert(e.NoteId + e.Content),
        Note.renderNoteContent(e), //！
        i.hideContentLoading(), a && a(e))
        //这里Note.renderNoteContent()是真正更新当前editor部分的function，通过下面的ajaxGet传递并调用
    }
    var i = this;
    if (t) {
        Note.stopInterval();
        var r = i.getTargetById(t); //r是目标noteid对应的notelist里的dom对象
        if (Note.selectTarget(r), void 0 == o && (o = !0), o) {
//            Note.curChangedSaveIt() //保存当前的note
            Note.curChangedSaveIt(!0) //保存当前的note，这里实现切换笔记时的自动保存！
//            alert("Save when changing note!");
        }
        Note.clearCurNoteId();
        var s = i.getNote(t) || Share.getNote(t); //s是新选中的note
        if (s) {
            e || void 0 != s.Perm && (e = !0);
            var c = !e || Share.hasUpdatePerm(t);
            c ? (Note.renderNote(s)) : Note.renderNoteReadOnly(s),
            switchEditor(s.IsMarkdown),
//            LEA.trigger("noteChanged", s);
//            Attach.renderNoteAttachNum(t, !0),
//            Note.contentAjaxSeq++;
//            var l = Note.contentAjaxSeq;
//            if (s.Content) return void n(s, l);
//            var d = "/note/getNoteContent",
//            N = {
//                noteId: t
//            };
//            e && (d = "/share/getShareNoteContent", N.sharedUserId = s.UserId),
            i.showContentLoading(),
            e = Note.cache[t] || Share.getNote(t), // e为目标note
            Note.renderNoteContent(e), //！
            i.hideContentLoading()
//            null != Note.contentAjax && Note.contentAjax.abort(),
////            N是目标note
//            Note.contentAjax = ajaxGet(d, N,
//            function(t) {
//                return function(e) {
//                    delete e.IsBlog,
//                    n(e, t)
//                }
//            } (l))
        }
    }
},

// 更新notelist里的内容
// t: 更新note的id
Note.renderChangedNote = function(t) {
    if (t) {
        var e = $(tt('[noteId="?"]', t.NoteId));
        t.Title && e.find(".item-title").html(trimTitle(t.Title)),
        t.Desc && e.find(".desc").html(trimTitle(t.Desc));
        //下面这行代码是控制略缩图显示与否
        //t.ImgSrc ? ($thumb = e.find(".item-thumb"), $thumb.length > 0 ? $thumb.find("img").attr("src", t.ImgSrc) : (e.append(tt('<div class="item-thumb" style="">< img src="?"></div>', t.ImgSrc)), e.addClass("item-image")), e.find(".item-desc").removeAttr("style")) : "" == t.ImgSrc && (e.find(".item-thumb").remove(), e.removeClass("item-image"))
    }
},

// 清空editor部分内容
Note.clearNoteInfo = function() {
    Note.clearCurNoteId(),
    Tag.clearTags(),
    $("#noteTitle").val(""), // 清空editor部分的title
    setEditorContent("") // 清空editor
//    $("#noteRead").hide() //没有"noteRead"
},
Note.clearNoteList = function() {
    Note.noteItemListO.html("")
},
Note.clearAll = function() {
    Note.clearCurNoteId(),
    Note.clearNoteInfo(),
    Note.clearNoteList()
},
Note.renderNote = function(t) {
    t && ($("#noteTitle").val(t.Title), Tag.renderTags(t.Tags))
},

// 更新editor
// t是整个note实例
Note.renderNoteContent = function(t) {
    // t.content就是html内容
    setEditorContent(t.Content, t.IsMarkdown, t.Preview,
    function() {
        Note.setCurNoteId(t.NoteId)
//        Note.toggleReadOnly()
    })
},
    
// show mask when there is no notebook
Note.showEditorMask = function() {
//    console.log("showEditorMask is called");
    $('#noteList').attr('style', "visibility: hidden"); 
    $('#tool').attr('style', "visibility: hidden");
    $('#noteTitleDiv').attr('style', "visibility: hidden"); 
    
//    $('#addTagInput').attr('disabled',true), // disable the tag input area
//    $('#noteTitle').attr('disabled',true), // diable the note title input area
    $("#editorMask").css("z-index", 10).show(), // shwo the mask
    Notebook.curNotebookIsTrashOrAll() ? ($("#editorMaskBtns").hide(), $("#editorMaskBtnsEmpty").show()) // if it is in the Trash or All 
    :  
    ($("#editorMaskBtns").show(), $("#editorMaskBtnsEmpty").hide())
},
Note.hideEditorMask = function() {
    $('#noteList').attr('style', "visibility: visible"); 
    $('#tool').attr('style', "visibility: visible");
    $('#noteTitleDiv').attr('style', "visibility: visible"); 
    
//    $('#addTagInput').attr('disabled',false),
//    $('#noteTitle').attr('disabled',false),
    $("#editorMask").css("z-index", -10).hide()
},

Note.renderNotesC = 0, //notes的数量

// 在notelist里加载t对应的notes
// t是所有notes
// o标记是否为share notes
// share是!1, !0
Note.renderNotes = function(t, e, o) {
//    console.log("notes are rendered");
    var a = ++Note.renderNotesC;
    if (this.clearSeqForNew(),
        this.batch.reset(),
        LEA.isMobile || Mobile.isMobile() || $("#noteItemList").slimScroll({
            scrollTo: "0px",
            height: "100%",
            onlyScrollBar: !0
    }), !t || "object" != typeof t || t.length <= 0) return void(e || Note.showEditorMask());

    Note.hideEditorMask(),
    void 0 == e && (e = !1),
    e || Note.noteItemListO.html(""); // #noteItemList 是主页中note list部分
    var n = t.length,
    i = Math.ceil(n / 20);
    Note._renderNotes(t, e, o, 1);

    // 将每个note存进cache
    for (var r = 0; n > r; ++r) {
        var s = t[r];
        if(!o)
            Note.setNoteCache(s, !1);
        else
            Share.setCache(s);
    }
    for (var r = 1; i > r; ++r) setTimeout(function(n) {
        return function() {
            a == Note.renderNotesC && Note._renderNotes(t, e, o, n + 1)
        }
    } (r), 2e3 * r)
},

// 真正update网页里的note list部分的html代
Note._renderNotes = function(t, e, o, a) {
    for (var n = t.length,
    i = 20 * (a - 1); n > i && 20 * a > i; ++i) {
        var r = t[i];
        r.Title = trimTitle(r.Title);
        var s = "item-my";
        Note.nowIsInShared = !1,
        (o || r.UserId != UserInfo.UserId) && (s = "item-shared", Note.nowIsInShared = !0),
        e || 0 != i || (s += " item-active");
        var c;
//        c = tt(Note.itemTplNoImg, s, i, r.NoteId, r.Title, Notebook.getNotebookTitle(r.NotebookId), goNowToDatetime(r.UpdatedTime), r.Desc),
        c = tt(Note.itemTplNoImg, s, i, r.NoteId, r.Title, Notebook.getNotebookTitle(r.NotebookId)),
        r.IsBlog || (c = $(c), c.find(".item-blog").hide()),
        Note.noteItemListO.append(c)
    }
},
Note._seqForNew = 0,
Note.clearSeqForNew = function() {
    this._seqForNew = 0
},
Note.newNoteSeq = function() {
    return--this._seqForNew
},

// 创建新的note
// t是属于的notebook的ID
Note.newNote = function(t, e, o, a) {
    
    if(Object.getOwnPropertyNames(Notebook.cache).length <= 2) {
        bootbox.alert("Sorry, please create a notebook first", function() {
        });
        return;
    }
    Note.hideEditorMask();
//    if(Notebook.curNotebookId == "0" || Notebook.curNotebookId == "0")
//    switchEditor(a),
//    Note.hideEditorMask(),
//    Note.hideReadOnly(),
    Note.stopInterval(),
//    Note.curChangedSaveIt(),
    Note.curChangedSaveIt(!0); // 自动保存之前修改
    Note.batch.reset();
    // n是新note
    var n = {
        NoteId: getObjectId(),
        Title: "",
        Tags: [],
        Content: "",
        NotebookId: t,
        IsNew: !0,
        IsTrash: !1,
        IsDeleted: !1,
        Desc: "",
        IsTop: !0,
        FromUserId: o,
        IsMarkdown: a,
        AttachNum: 0,
        CommentNum: 0,
        CreatedTime: getCurDate(),
        CreatedUserId: "",
        HasSelfDefined: !1,
        IsBlog: !1,
        IsRecommend: !1,
        LikeNum: 0,
        ReadNum: 0,
        RecommendTime: "0001-01-01T00:00:00Z",
        UpdatedUserId: "",
        UrlTitle: "",
        UserId: UserInfo.UserId
//        Usn: 0
    };
    Note.addNoteCache(n); // 加进cache！
//    Attach.clearNoteAttachNum();
    var i = "",
    r = "item-my";
    e && (r = "item-shared");
    var s = Notebook.getNotebook(t),
    c = s ? s.Title: "";
//    l = getCurDate();
    i = e ? tt(Note.newItemTpl, r, this.newNoteSeq(), o, n.NoteId, n.Title, c, "") : tt(Note.newItemTpl, r, this.newNoteSeq(), "", n.NoteId, n.Title, c, ""),
    s.IsBlog || (i = $(i), i.find(".item-blog").hide()),
    Notebook.isCurNotebook(t) ? Note.noteItemListO.prepend(i) : (Note.clearAll(), Note.noteItemListO.prepend(i), e ? Share.changeNotebookForNewNote(t) : Notebook.changeNotebookForNewNote(t)),
    Note.selectTarget($(tt('[noteId="?"]', n.NoteId))),
    $("#noteTitle").focus(),
    Note.renderNote(n), // 这里可能是只显示新note的原因
    Note.renderNoteContent(n),
    Note.setCurNoteId(n.NoteId),
    Notebook.incrNotebookNumberNotes(t);
    showMsg("New note created");
//    Note.toggleWriteable(!0)
},

Note.changeToNext = function(t) {
    var e = $(t),
    o = e.next();
    if (!o.length) {
        var a = e.prev();
        if (!a.length) return void Note.showEditorMask();
        o = a
    }
    Note.changeNote(o.attr("noteId"))
},
    
Note.changeToNextSkipNotes = function(t) {
    var e = Note;
    if (!isEmpty(t)) {
        if (e.$itemList.find("li").length == t.length) return void e.showEditorMask();
        if (1 == t.length) {
            var o = e.$itemList.find(".item-active");
            if (1 == o.length && o.attr("noteId") != t[0]) return
        }
        for (var a = e.getTargetById(t[0]), n = a.next(), i = 1, r = t.length, s = !1; n.length;) {
            if (i >= r) {
                s = !0;
                break
            }
            if (n.attr("noteId") != e.getTargetById(t[i]).attr("noteId")) {
                s = !0;
                break
            }
            n = n.next(),
            i++
        }
        s || (n = a.prev()),
        n && e.changeNote(n.attr("noteId"))
    }
},

// 删除note
// t是当前选择的note的某个对象（可能是dom？）
Note.deleteNote = function(t, e, o) {
    var n = Note;
    var a = n.inBatch ? n.getBatchNoteIds() : [$(t).attr("noteId")]; // a是当前note的id
    if (!isEmpty(a)) {
        var thisNote = Note.cache[a];
        var thisNoteTitle = thisNote.Title;
        // if in the Trash, delete the note
        // if in the Trash and currently in the All, delete the note 
        if(Notebook.curNotebookId == "-1" || (Notebook.curNotebookId == "0" && thisNote.NotebookId == "-1")) {  
            bootbox.confirm("Please confirm to forever delete the note: " + thisNoteTitle, function(result) {
                if(result) {
                    1 == a.length && $(t).hasClass("item-active") && (Note.stopInterval(), n.clearCurNoteId(), Note.clearNoteInfo());
                    var i;
                    // 如果当前只有一个note，i就是$(t)即，否则就是Notelist里当前选中的Note
                    i = 1 == a.length ? $(t) : n.$itemList.find(".item-active"),
                    i.hide(), //把notelist里要删的note给隐藏了（下面再删，这是为了防止post时失败）
            //        ajaxPost("/note/deleteNote", {
            //            noteIds: a,
            //            isShared: o
            //        },
            //        function(t) {
            //            if (t) {
            //                Note.changeToNextSkipNotes(a), //
            //                i.remove();
            //                for (var e = 0; e < a.length; ++e) {
            //                    var o = a[e],
            //                    r = n.getNote(o);
            //                    r && (Notebook.minusNotebookNumberNotes(r.NotebookId), Note.clearCacheByNotebookId(r.NotebookId), delete Note.cache[o])
            //                }
            //            }
            //        }),
                    Note.changeToNextSkipNotes(a), //
                    i.remove(); // 删除notelist里要删的那个note的html模块
                    for (var e = 0; e < a.length; ++e) {
                        var o = a[e], // o是noteId
                        r = n.getNote(o);
                        r && (Notebook.minusNotebookNumberNotes(r.NotebookId), //该notebook里notes数-1并且更新网页上的数字
                              Note.clearCacheByNotebookId(r.NotebookId), // ??????
                              delete Note.cache[o]) // 删除cache里的note
                    }
            //        n.batch.reset() // ????
                    showMsg("Note " + thisNoteTitle + " deleted successfully");
                }
            });
        }
        // if not in the trash, move the note into trash
        else {
    //        alert("move to trash");
    //        a = [$(t).attr("noteId")]; // a是当前note的id
            Note.moveNoteWithId(a, -1);
            showMsg("Note moved to trash");
        }
    }
},

// 点击sharetofriend后，调用
// 显示share dialog
Note.listNoteShareUserInfo = function(t) {    
    var thisNoteId = $(t).attr("noteId");
    Share.dialogIsNote = 1;
    Share.dialogNoteOrNotebookId = thisNoteId;
    showDialogRemote("/share/listNoteShareUserInfo", {
        noteId: thisNoteId
    })
},
Note.shareNote = function(t) {
    var e = $(t).find(".item-title").text();
    showDialog("dialogShareNote", {
        title: getMsg("shareToFriends") + "-" + e
    }),
    setTimeout(function() {
        $("#friendsEmail").focus()
    },
    500);
    var o = $(t).attr("noteId");
    shareNoteOrNotebook(o, !0)
},
Note.download = function(t, e) {
    var o = "";
    for (var a in e) o += '<input name="' + a + '" value="' + e[a] + '">';
    $('<form target="mdImageManager" action="' + t + '" method="GET">' + o + "</form>").appendTo("body").submit().remove()
},
Note.exportPDF = function(t) {
    var e = $(t).attr("noteId");
    $('<form target="mdImageManager" action="/note/exportPdf" method="GET"><input name="noteId" value="' + e + '"/></form>').appendTo("body").submit().remove()
},
//Note.showReadOnly = function() {
//    Note.isReadOnly = !0,
//    $("#note").addClass("read-only")
//},
//Note.hideReadOnly = function() {
//    Note.isReadOnly = !1,
//    $("#note").removeClass("read-only"),
//    $("#noteRead").hide()
//},
Note.renderNoteReadOnly = function(t) {
//    Note.showReadOnly(),
    $("#noteReadTitle").html(t.Title || getMsg("unTitled")),
    Tag.renderReadOnlyTags(t.Tags),
    $("#noteReadCreatedTime").html(goNowToDatetime(t.CreatedTime)),
    $("#noteReadUpdatedTime").html(goNowToDatetime(t.UpdatedTime))
},
Note.lastSearch = null,
Note.lastKey = null,
Note.lastSearchTime = new Date,
Note.isOver2Seconds = !1,
Note.isSameSearch = function(t) {
    var e = new Date,
    o = e.getTime() - Note.lastSearchTime.getTime();
    return Note.isOver2Seconds = o > 2e3 ? !0 : !1,
    !Note.lastKey || Note.lastKey != t || o > 1e3 ? (Note.lastKey = t, Note.lastSearchTime = e, !1) : t == Note.lastKey ? !0 : (Note.lastSearchTime = e, Note.lastKey = t, !1)
},
    
Note.searchNote = function() {
    var t = $("#searchNoteInput").val();
    return t ? void(Note.isSameSearch(t) || (Note.lastSearch && Note.lastSearch.abort(), Note.curChangedSaveIt(), Note.clearAll(), showLoading(), Notebook.showNoteAndEditorLoading(), Note.lastSearch = $.post("/note/searchNote", {
        key: t
    },
    function(t) {
        hideLoading(),
        Notebook.hideNoteAndEditorLoading(),
        t && (Note.lastSearch = null, Note.renderNotes(t), isEmpty(t) || Note.changeNote(t[0].NoteId, !1))
    }))) : void Notebook.changeNotebook("0")
},
    
Note.$itemList = $("#noteItemList"),

// 找到notelist里对应id的dom对象
Note.getTargetById = function(t) {
    return this.$itemList.find('li[noteId="' + t + '"]')
},

//Note.setNote2Blog = function(t) {
//    Note._setBlog(t, !0)
//},
//Note.unsetNote2Blog = function(t) {
//    Note._setBlog(t, !1)
//},
//
//Note._setBlog = function(t, e) {
//    var o, a = Note;
//    o = Note.inBatch ? a.getBatchNoteIds() : [$(t).attr("noteId")],
//    ajaxPost("/note/setNote2Blog", {
//        noteIds: o,
//        isBlog: e
//    },
//    function(t) {
//        if (t) for (var n = 0; n < o.length; ++n) {
//            var i = o[n],
//            r = a.getTargetById(i);
//            e ? r.find(".item-blog").show() : r.find(".item-blog").hide(),
//            a.setNoteCache({
//                NoteId: i,
//                IsBlog: e
//            },
//            !1)
//        }
//    })
//},
    
//Note.setAllNoteBlogStatus = function(t, e) {
//    if (t) {
//        var o = Note.getNotesByNotebookId(t);
//        if (isArray(o)) {
//            var a = o.length;
//            if (0 == a) for (var n in Note.cache) Note.cache[n].NotebookId == t && (Note.cache[n].IsBlog = e);
//            else for (var n = 0; a > n; ++n) o[n].IsBlog = e
//        }
//    }
//},

// e是目标notebook对象
Note.moveNote = function(t, e) {
//    alert("t is: " + t);
    var o, a = Note;
    o = Note.inBatch ? a.getBatchNoteIds() : [$(t).attr("noteId")]; // o是当前noteId，是数组形式
//    o =  [$(t).attr("noteId")];
    var n = e.notebookId; // 目标notebookId
//    alert(n);
    if (Notebook.getCurNotebookId() != n) {
        if (1 == o.length) {
            var i = a.getNote(o[0]);
            if (!i.IsTrash && i.NotebookId == n) return
        }
//        ajaxPost("/note/moveNote", {
//            noteIds: o,
//            notebookId: n
//        },
//        function(e) {
//            if (e) {
//                a.clearCacheByNotebookId(n);
//                for (var i = 0; i < o.length; ++i) {
//                    var r = o[i],
//                    s = a.getNote(r);
//                    s && (s.NotebookId != n ? (Notebook.incrNotebookNumberNotes(n), s.IsTrash || Notebook.minusNotebookNumberNotes(s.NotebookId)) : s.IsTrash && Notebook.incrNotebookNumberNotes(s.NotebookId), a.clearCacheByNotebookId(s.NotebookId), s.NotebookId = n, s.IsTrash = !1, s.UpdatedTime = new Date, a.setNoteCache(s))
//                }
//                var c;
//                c = 1 == o.length ? t: a.$itemList.find(".item-active"),
//                Notebook.curActiveNotebookIsAll() ? (c.find(".note-notebook").html(Notebook.getNotebookTitle(n)), a.changeNote(c.eq(0).attr("noteId"))) : (a.changeToNextSkipNotes(o), c.remove())
//            }
//        })
//        a.batch.reset()
        console.log(o);
        a.clearCacheByNotebookId(n); // a是Note，n是目标notebookId
        for (var i = 0; i < o.length; ++i) { // o是目标noteId，是数组形式
            var r = o[i], // r是目标noteId
            s = a.getNote(r); // s是目标note
            s && (s.NotebookId != n ? 
                  (Notebook.incrNotebookNumberNotes(n), s.IsTrash || Notebook.minusNotebookNumberNotes(s.NotebookId), console.log("first")) // 如果move到不同于当前的notebook
                  : 
                  s.IsTrash && Notebook.incrNotebookNumberNotes(s.NotebookId), a.clearCacheByNotebookId(s.NotebookId), s.NotebookId = n, s.IsTrash = !1, s.UpdatedTime = new Date, a.setNoteCache(s), console.log("second"))
        }
        var c;
        c = 1 == o.length ? t: a.$itemList.find(".item-active"),
        Notebook.curActiveNotebookIsAll() ? (c.find(".note-notebook").html(Notebook.getNotebookTitle(n)), a.changeNote(c.eq(0).attr("noteId"))) : (a.changeToNextSkipNotes(o), c.remove())
    }
},

// o是当前note Id
// n是目标notebook Id
Note.moveNoteWithId = function(o, n) {

    var a = Note;
//    o = Note.inBatch ? a.getBatchNoteIds() : [$(t).attr("noteId")]; // o是当前noteId
////    o =  [$(t).attr("noteId")];
//    var n = e.notebookId; // 目标notebookId
//    alert(n);
    if (Notebook.getCurNotebookId() != n) {
        if (1 == o.length) {
            var i = a.getNote(o[0]);
            if (!i.IsTrash && i.NotebookId == n) return
        }
    a.clearCacheByNotebookId(n);
    for (var i = 0; i < o.length; ++i) {
        var r = o[i],
        s = a.getNote(r);
        s && (s.NotebookId != n ? (Notebook.incrNotebookNumberNotes(n), s.IsTrash || Notebook.minusNotebookNumberNotes(s.NotebookId)) : s.IsTrash && Notebook.incrNotebookNumberNotes(s.NotebookId), a.clearCacheByNotebookId(s.NotebookId), s.NotebookId = n, s.IsTrash = !1, s.UpdatedTime = new Date, a.setNoteCache(s))
    }
    var c;
    c = 1 == o.length ? t: a.$itemList.find(".item-active"),
    Notebook.curActiveNotebookIsAll() ? (c.find(".note-notebook").html(Notebook.getNotebookTitle(n)), a.changeNote(c.eq(0).attr("noteId"))) : (a.changeToNextSkipNotes(o), c.remove())
    }
},

// t
// e: 目标notebook
// o: 是否是copy的share的note
Note.copyNote = function(t, e, o) {
//    console.log(t);
    var a, n = Note,
    i = e.notebookId; // 目标notebookId
    a = Note.inBatch ? n.getBatchNoteIds() : [$(t).attr("noteId")];
//    a = [$(t).attr("noteId")];
    for (var r = [], s = 0; s < a.length; ++s) {
        var c = a[s],
        l = n.getNote(c);
        if (l) {
            if (l.IsTrash || l.NotebookId == i) continue;
            r.push(c)
        }
    }
    // r是被选中要复制的noteId
    
//    console.log(r);
//    if (0 != r.length) {
//        var d = "/note/copyNote",
//        e = {
//            noteIds: r,
//            notebookId: i
//        };
//        if (o) {
//            d = "/note/copySharedNote";
//            var l = n.getNote(r[0]);
//            e.fromUserId = l.UserId
//        }
//        ajaxPost(d, e,
//        function(t) {
//            if (reIsOk(t)) {
//                var e = t.Item;
//                if (isEmpty(e)) return;
//                Note.clearCacheByNotebookId(i);
//                for (var o = 0; o < e.length; ++o) {
//                    var a = e[o];
//                    a.NoteId && (Note.setNoteCache(a), Notebook.incrNotebookNumberNotes(i))
//                }
//            }
//        })
//    }
//    var 
//    var e = t.Item; // e是目标notebook（已经copy结束，包含新的note）
//    if (isEmpty(e)) return;
//    Note.clearCacheByNotebookId(i);
//    for (var o = 0; o < e.length; ++o) {
//        var a = e[o];
//        a.NoteId && (Note.setNoteCache(a), Notebook.incrNotebookNumberNotes(i))
//    }

    
//        console.log(o);
//    a.clearCacheByNotebookId(n); // a是Note，n是目标notebookId
//    for (var i = 0; i < o.length; ++i) { // o是目标noteId，是数组形式
//        var r = o[i], // r是目标noteId
//        s = a.getNote(r); // s是目标note
//        s && (s.NotebookId != n ? 
//              (Notebook.incrNotebookNumberNotes(n), s.IsTrash || Notebook.minusNotebookNumberNotes(s.NotebookId), console.log("first")) // 如果move到不同于当前的notebook
//              : 
//              s.IsTrash && Notebook.incrNotebookNumberNotes(s.NotebookId), a.clearCacheByNotebookId(s.NotebookId), s.NotebookId = n, s.IsTrash = !1, s.UpdatedTime = new Date, a.setNoteCache(s), console.log("second"))
//    }
//    var c;
//    c = 1 == o.length ? t: a.$itemList.find(".item-active"),
//    Notebook.curActiveNotebookIsAll() ? (c.find(".note-notebook").html(Notebook.getNotebookTitle(n)), a.changeNote(c.eq(0).attr("noteId"))) : (a.changeToNextSkipNotes(o), c.remove())
        
    Note.clearCacheByNotebookId(i); // a是Note，n是目标notebookId
    var targetNote = Note.getNote(r); // s是目标note
    var s = clone(targetNote);
    Notebook.incrNotebookNumberNotes(i);
    Note.clearCacheByNotebookId(s.NotebookId);
//    s.Tags = targetNote.Tags;
    s.NotebookId = i;
    s.IsTrash = !1;
    s.UpdatedTime = getCurDate();
    s.NoteId = getObjectId();
    Note.setNoteCache(s);
    
//    var c;
//    c = 1 == e.length ? t: Note.$itemList.find(".item-active"),
//    Notebook.curActiveNotebookIsAll() ? (c.find(".note-notebook").html(Notebook.getNotebookTitle(n)), Note.changeNote(c.eq(0).attr("noteId"))) : (Note.changeToNextSkipNotes(o), c.remove())
},
    
//// 删除note绑定的tag
//// e: tag name
//// t: 包含e这个tag name的所有notes
//Note.deleteNoteTag = function(t, e) {
//    if (t) for (var o in t) {
//        var a = Note.getNote(o);
//        if (a) {
//            a.Tags = a.Tags || [];
//            for (var n in a.Tags) a.Tags[n] != e || a.Tags.splice(n, 1);
//            o == Note.curNoteId && Tag.renderTags(a.Tags)
//        }
//    }
//},
    
// 重写
// 删除note绑定的tag
// e: tag name
Note.deleteNoteTag = function(tagName) {
    for (var o in Note.cache) {
        var a = Note.getNote(o);
        if (a) {
            a.Tags = a.Tags || [];
            for (var n in a.Tags) a.Tags[n] == tagName && a.Tags.splice(n, 1);
            o == Note.curNoteId && Tag.renderTags(a.Tags)
        }
    }
    Tag.tags
},
    
//Note.readOnly = !0,
//LEA.readOnly = !0,
    
//Note.toggleReadOnly = function(t) {
//    if (LEA.em && LEA.em.isWriting()) return Note.toggleWriteable();
//    var e = this,
//    o = e.getCurNote(),
//    a = $("#editor");
//    a.addClass("read-only").removeClass("all-tool"),
//    $("#editorContent").attr("contenteditable", !1),
//    $("#mdEditor").addClass("read-only"),
//    $("#note").addClass("read-only-editor"),
//    o && ($(".info-toolbar").removeClass("invisible"), o.IsMarkdown ? ($("#mdInfoToolbar .created-time").html(goNowToDatetime(o.CreatedTime)), $("#mdInfoToolbar .updated-time").html(goNowToDatetime(o.UpdatedTime))) : ($("#infoToolbar .created-time").html(goNowToDatetime(o.CreatedTime)), $("#infoToolbar .updated-time").html(goNowToDatetime(o.UpdatedTime))), t && Note.curChangedSaveIt(), Note.readOnly = !0, LEA.readOnly = !0, o.IsMarkdown || $("#editorContent pre").each(function() {
//        LeaAce.setAceReadOnly($(this), !0)
//    }))
//},
//    
//LEA.toggleWriteable = Note.toggleWriteable = function(t) {
//    var e = Note;
//    $("#editor").removeClass("read-only"),
//    $("#note").removeClass("read-only-editor"),
//    $("#editorContent").attr("contenteditable", !0),
//    $("#mdEditor").removeClass("read-only");
//    var o = e.getCurNote();
//    o && (Note.readOnly = !1, LEA.readOnly = !1, o.IsMarkdown ? MD && (t || MD.focus(), MD.onResize()) : ($("#editorContent pre").each(function() {
//        LeaAce.setAceReadOnly($(this), !1)
//    }), t || tinymce.activeEditor.focus()))
//},
//Note.toggleWriteableAndReadOnly = function() {
//    LEA.readOnly ? Note.toggleWriteable() : Note.toggleReadOnly(!0)
//},
Note.getPostUrl = function(t) {
    var e = t.UrlTitle || t.NoteId;
    return UserInfo.PostUrl + "/" + e
},
Note.getContextNotebooks = function(t) {
    var e = [],
    o = [],
    a = [];
    for (var n in t) {
        var i = t[n],
        r = {
            text: i.Title,
            notebookId: i.NotebookId,
            action: Note.moveNote
        },
        s = {
            text: i.Title,
            notebookId: i.NotebookId,
            action: Note.copyNote
        },
        c = {
            text: i.Title,
            notebookId: i.NotebookId,
            action: Share.copySharedNote
        };
        if (!isEmpty(i.Subs)) {
            var l = Note.getContextNotebooks(i.Subs);
            r.items = l[0],
            s.items = l[1],
            c.items = l[2],
            r.type = "group",
            r.width = 150,
            s.type = "group",
            s.width = 150,
            c.type = "group",
            c.width = 150
        }
        e.push(r),
        o.push(s),
        a.push(c)
    }
    return [e, o, a]
},
Note.contextmenu = null,
Note.notebooksCopy = [],

// Contextmenu
Note.initContextmenu = function() {
    function t(t) {
        var e = $(this).attr("noteId");
//        alert(e);
//        alert("o: " + o);
        o = [];
        if (Note.inBatch)
            o.push("shareToFriends"),
            o.push("exportPDF"),
            Notebook.curActiveNotebookIsTrash() && (o.push("shareStatus"),
//                                                o.push("unset2Blog"),
//                                                o.push("set2Blog"),
                                                o.push("copy"));
        else {
            var a = Note.getNote(e);
            if (!a) return;
            if (a.IsTrash || Notebook.curActiveNotebookIsTrash()) o.push("shareToFriends"),
            o.push("shareStatus"),
//            o.push("unset2Blog"),
//            o.push("set2Blog"),
            o.push("copy");
            else {
//                a.IsBlog ? o.push("set2Blog") : o.push("unset2Blog");
                var n = Notebook.getNotebookTitle(a.NotebookId);
                o.push("move." + n),
                o.push("copy." + n)
            }
        }
        t.applyrule({
            name: "target..",
            disable: !0,
            items: o
        })
    }
    function e() {
        return "target3" != this.id
    }
    var o = Note;
    Note.contextmenu && Note.contextmenu.destroy();
    var a = Notebook.everNotebooks,
    n = o.getContextNotebooks(a),
    i = n[0],
    r = n[1];
    o.notebooksCopy = n[2];

    // contextmenu信息
    // 给s添加新的attr即可在contextmenu添加新选项
    var s = {
        width: 180,
        items: [{
            text: getMsg("shareToFriends"),
            alias: "shareToFriends",
            icon: "",
            faIcon: "fa-share-square-o",
            action: Note.listNoteShareUserInfo
        },
//        {
//            type: "splitLine"
//        },
//        {
//            text: getMsg("publicAsBlog"),
//            alias: "set2Blog",
//            faIcon: "fa-bold",
//            action: Note.setNote2Blog
//        },
//        {
//            text: getMsg("cancelPublic"),
//            alias: "unset2Blog",
//            faIcon: "fa-undo",
//            action: Note.unsetNote2Blog
//        },
        {
            type: "splitLine"
        },
        {
            text: "information",
            alias: "information",
            faIcon: "fa-file-pdf-o",
            action: Note.getInformation
        },
        {
            text: getMsg("exportPdf"),
            alias: "exportPDF",
            faIcon: "fa-file-pdf-o",
            action: Note.exportPDF
        },
        {
            type: "splitLine"
        },
        {// 删除note
         // 没有alias，因为是默认属性，一直会显示
         // 没有alias，因为是默认属性，一直会显示
            text: getMsg("delete"),
            icon: "",
            faIcon: "fa-trash-o",
            action: Note.deleteNote
        },
        {
            text: getMsg("move"),
            alias: "move",
            faIcon: "fa-arrow-right",
            type: "group",
            width: 180,
            items: i
        },
        {
            text: getMsg("copy"),
            alias: "copy",
            icon: "",
            faIcon: "fa-copy",
            type: "group",
            width: 180,
            items: r
        }],
        onShow: t,
        onContextMenu: e,
        parent: "#noteItemList",
        children: ".item-my"
    };
    Note.contextmenu = $("#noteItemList .item-my").contextmenu(s)
};

var Attach = {
    loadedNoteAttachs: {},
    attachsMap: {},
    init: function() {
        var t = this;
        $("#showAttach").click(function() {
            t.renderAttachs(Note.curNoteId)
        }),
        t.attachListO.click(function(t) {
            t.stopPropagation()
        }),
        t.attachListO.on("click", ".delete-attach",
        function(e) {
            e.stopPropagation();
            var o = $(this).closest("li").data("id"),
            a = this;
            confirm(getMsg("Are you sure to delete it ?")) && ($(a).button("loading"), ajaxPost("/attach/deleteAttach", {
                attachId: o
            },
            function(e) {
                $(a).button("reset"),
                reIsOk(e) ? t.deleteAttach(o) : alert(e.Msg)
            }))
        }),
        
        // download
        t.attachListO.on("click", ".download-attach",
        function(t) {
            t.stopPropagation();
            var e = $(this).closest("li").data("id");
            Note.download("/attach/download", {
                attachId: e
            })
        }),
            
        // 
        t.downloadAllBtnO.click(function() {
            Note.download("/attach/downloadAll", {
                noteId: Note.curNoteId
            })
        }),
        // insert the link
        t.attachListO.on("click", ".link-attach",
        function(e) {
            e.stopPropagation();
            var o = $(this).closest("li").data("id"),
            a = t.attachsMap[o],
            n = UrlPrefix + "/api/file/getAttach?fileId=" + o;
//            Note.toggleWriteable(),
            LEA.isMarkdownEditor() && MD ? MD.insertLink(n, a.Title) : tinymce.activeEditor.insertContent('<a target="_blank" href="' + n + '">' + a.Title + "</a>");
        })
    },
    attachListO: $("#attachList"),
    attachNumO: $("#attachNum"),
    attachDropdownO: $("#attachDropdown"),
    downloadAllBtnO: $("#downloadAllBtn"),
    linkAllBtnO: $("#linkAllBtn"),
    clearNoteAttachNum: function() {
        var t = this;
        t.attachNumO.html("").hide()
    },
    renderNoteAttachNum: function(t, e) {
        var o = this,
        a = Note.getNote(t);
        a.AttachNum ? (o.attachNumO.html("(" + a.AttachNum + ")").show(), o.downloadAllBtnO.show(), o.linkAllBtnO.show()) : (o.attachNumO.hide(), o.downloadAllBtnO.hide(), o.linkAllBtnO.hide()),
        e && o.attachDropdownO.removeClass("open")
    },
    _renderAttachs: function(t) {
        for (var e = this,
        o = "",
        a = t.length,
        n = getMsg("Delete"), i = getMsg("Download"), r = getMsg("Insert link into content"), s = 0; a > s; ++s) {
            var c = t[s];
            o += '<li class="clearfix" data-id="' + c.AttachId + '"><div class="attach-title">' + c.Title + '</div><div class="attach-process"> 	  <button class="btn btn-sm btn-warning delete-attach" data-loading-text="..." title="' + n + '"><i class="fa fa-trash-o"></i></button> 	  <button type="button" class="btn btn-sm btn-primary download-attach" title="' + i + '"><i class="fa fa-download"></i></button> 	  <button type="button" class="btn btn-sm btn-default link-attach" title="' + r + '"><i class="fa fa-link"></i></button> </div></li>',
            e.attachsMap[c.AttachId] = c
        }
        e.attachListO.html(o);
        var l = Note.getCurNote();
        l && (l.AttachNum = a, e.renderNoteAttachNum(l.NoteId, !1))
    },
    _bookmark: null,
    renderAttachs: function(t) {
        var e = this;
        return e.loadedNoteAttachs[t] ? void e._renderAttachs(e.loadedNoteAttachs[t]) : (e.attachListO.html('<li class="loading"><img src="/images/loading-24.gif"/></li>'), void ajaxGet("/attach/getAttachs", {
            noteId: t
        },
        function(o) {
            var a = [];
            o.Ok && (a = o.List, a || (a = [])),
            e.loadedNoteAttachs[t] = a,
            e._renderAttachs(a)
        }))
    },
    addAttach: function(t) {
        var e = this;
        e.loadedNoteAttachs[t.NoteId] || (e.loadedNoteAttachs[t.NoteId] = []),
        e.loadedNoteAttachs[t.NoteId].push(t),
        e.renderAttachs(t.NoteId)
    },
    deleteAttach: function(t) {
        for (var e = this,
        o = Note.curNoteId,
        a = e.loadedNoteAttachs[o], n = 0; n < a.length; ++n) if (a[n].AttachId == t) {
            a.splice(n, 1);
            break
        }
        e.renderAttachs(o)
    },
    downloadAttach: function(t) {},
    downloadAll: function() {}
};

Note.inBatch = !1, // set to false: disable it

Note.getBatchNoteIds = function() {
    for (var t = [], e = Note.$itemList.find(".item-active"), o = 0; o < e.length; ++o) t.push(e.eq(o).attr("noteId"));
    return t
},

// 多选的时候
Note.batch = {
    $noteItemList: $("#noteItemList"),
    cancelInBatch: function() {
        Note.inBatch = !1,
        this.$body.removeClass("batch")
    },
    setInBatch: function() {
        Note.inBatch = !0,
        this.$body.addClass("batch")
    },
    isInBatch: function() {
        var t = this,
        e = t.$noteItemList.find(".item-active");
        return e.length >= 2 ? !0 : !1
    },
    _startNoteO: null,
    getStartNoteO: function() {
        var t = this;
        return t._startNoteO || (t._startNoteO = t.getCurSelected()),
        t._startNoteO
    },
    _selectByStart: {},
    clearByStart: function(t) {
        var e = this;
        if (t) {
            var o = this._selectByStart[t];
            if (!isEmpty(o)) for (var a = 0; a < o.length; ++a) e.clearTarget(o[a])
        }
    },
    selectTo: function(t) {
        var e = this.getStartNoteO();
        e || alert("nono start");
        var o, a, n, i, r = +e.data("seq"),
        s = +t.data("seq");
        s > r ? (o = e, a = t, n = r, i = s) : (o = t, a = e, n = s, i = r);
        var c = e.attr("noteId");
        this.clearByStart(c);
        var l = o;
        this._selectByStart[c] = [];
        for (var d = n; i >= d; ++d) this.selectTarget(l),
        this._selectByStart[c].push(l),
        l = l.next()
    },
    selectAll: function() {
        this.$noteItemList.find("li").addClass("item-active")
    },
    clearAllSelect: function() {
        Note.clearSelect()
    },
    selectTarget: function(t) {
        t && t.addClass("item-active")
    },
    clearTarget: function(t) {
        t && t.removeClass("item-active")
    },
    select: function(t) {
        var e = this;
        if (t.hasClass("item-active")) {
            var o = this.isInBatch();
            o && t.removeClass("item-active")
        } else e._startNoteO = t,
        this.selectTarget(t)
    },
    getCurSelected: function() {
        return this.$noteItemList.find(".item-active")
    },
    reset: function() {
        this.cancelInBatch(),
        this._selectByStart = {},
        this._startMove = !1,
        this._startNoteO = null,
        this.clearRender()
    },

    // always return false to disble batch function
    canBatch: function() {
//        return ! LEA.em.isWritingMode
        return false;
    },

    // notelist里点按note切换的事件，是在这里注册
    // 最后通过调用Note.changeNote()完成
    init: function() {
        var t = this;

        // 就是这里！注册notelist里点按note切换的事件
        // ????但奇怪的是因为canBatch始终返回false，这里没有调用任何function，不知道changeNote是怎么调用的
        t.$noteItemList.on("click", ".item",
            function(e) {
                var o = $(this);
                a = o.attr("noteId"); // 直接把a变作全局变量
                if (a) {
                    var n = !1,
                    i = !1; // 直接把i变作全局变量
                    t.canBatch() && (e.shiftKey ? i = !0 : n = e.metaKey || e.ctrlKey),

                    (n || i) && Note.curChangedSaveIt(),
                    n ? t.select(o) : i ? t.selectTo(o) : Note.selectTarget(o),
                    t.finalFix() // 调用了切换笔记的function
                }
        }),

        t._startMove = !1,

        t.$noteItemList.on("mousedown", ".item",
            function(e) {
                t.canBatch() && (t.isContextMenu(e) || (t._startMove || !(e.metaKey || e.ctrlKey || e.shiftKey)) && (t._startNoteO = $(this), t._startMove = !0))
            }),

        t.$noteItemList.on("mousemove", ".item",
        function(e) {
            t.canBatch() && t._startMove && (Note.curChangedSaveIt(), t.clearAllSelect(), t.selectTo($(this)), t.finalFix(!0))
        });
        var e = $("body");
        e.on("mouseup",
        function() {
            t._startMove = !1
        }),
        e.keydown(function(e) {
            e.target && "BODY" === e.target.nodeName && (e.ctrlKey || e.metaKey) && 65 === e.which && (e.preventDefault(), t.canBatch() && (Note.curChangedSaveIt(), t.selectAll(), t.finalFix()))
        }),
        t.$noteItemList.on("dragstart",
        function(t) {
            t.preventDefault(),
            t.stopPropagation()
        }),
        t.initContextmenu()
    },
    initContextmenu: function() {
        var t = this;
        t.$batchMask.on("contextmenu",
        function(t) {
            t.preventDefault(),
            Note.nowIsInShared ? Share.contextmenu.showMenu(t) : Note.contextmenu.showMenu(t)
        }),
        t.$batchMask.find(".batch-info .fa").click(function(t) {
            t.preventDefault(),
            t.pageX -= 90,
            t.pageY += 10,
            t.stopPropagation(),
            $(document).click(),
            Note.nowIsInShared ? Share.contextmenu.showMenu(t) : Note.contextmenu.showMenu(t)
        })
    },
    $body: $("body"),
    // 切换笔记最开始处理的地方！
    finalFix: function(t) {
        // alert("here?!");
        var e = this;
        if (e.isInBatch()) Note.clearCurNoteId(),
        e.renderBatchNotes(),
        e.setInBatch();
        else {
            e.clearRender(),
            e.cancelInBatch();
            var o = e.getCurSelected();
            if (o) {
                var a = o.attr("noteId");
                t || (e._startNoteO = o),
                Mobile.changeNote(a),
                Note.curNoteId != a && Note.changeNoteForPjax(a, !0, !1)
            }
        }
    },
    isContextMenu: function(t) {
        return void 0 != t.which && 1 == t.which || 1 == t.button ? !1 : void 0 != t.which && 3 == t.which || 2 == t.button ? !0 : !1
    },
    _notes: {},
    clearRender: function() {
        this._notes = {},
        this.$batchCtn.html(""),
        this.hideMask()
    },
    showMask: function() {
        this.$batchMask.css({
            "z-index": 99
        }).show()
    },
    hideMask: function() {
        this.$batchMask.css({
            "z-index": -2
        }).hide()
    },
    renderBatchNotes: function() {
        var t = this;
        t.showMask();
        var e = t.$noteItemList.find(".item-active");
        t.$batchNum.html(e.length);
        for (var o = {},
        a = 0; a < e.length; ++a) {
            var n = e.eq(a).attr("noteId");
            t.addTo(n),
            o[n] = 1
        }
        for (var n in t._notes) if (!o[n]) {
            var i = t._notes[n];
            i.css({
                "margin-left": "-800px"
            }),
            setTimeout(function() {
                i.remove()
            },
            500),
            delete t._notes[n]
        }
    },
    $batchMask: $("#batchMask"),
    $batchCtn: $("#batchCtn"),
    $batchNum: $("#batchMask .batch-info span"),
    _i: 1,
    getRotate: function() {
        var t = this,
        e = t._i++,
        o = e % 2 === 0 ? 1 : -1,
        a = (o * Math.random() * 70, [0, 10, 20, 30, 40]),
        n = o * a[e % 5] * 3;
        return n -= 80,
        [o * Math.random() * 30, n]
    },
    addTo: function(t) {
        var e = this;
        if (!e._notes[t]) {
            var o = Note.getNote(t),
            a = o.Title || getMsg("unTitled"),
            n = o.Desc || "...",
            i = $('<div class="batch-note"><div class="title">' + a + '</div><div class="content">' + n + "</div></div>");
            e._notes[t] = i;
            var r = e.getRotate();
            e.$batchCtn.append(i),
            setTimeout(function() {
                i.css({
                    transform: "rotate(" + r[0] + "deg)",
                    "margin-left": r[1] + "px"
                })
            })
        }
    }
},

    
// register event
$(function() {
//    Attach.init(),
//    $("#noteItemList").on("mouseenter", ".item",
//    function(t) { $(this).trigger("click")
//    }),
    Note.batch.init(),

    // create new note
    $("#newNoteBtn, #editorMask .note").click(function() {
        var t = $("#curNotebookForNewNote").attr("notebookId");
        Note.newNote(t)
    }),
//
//    $("#newNoteMarkdownBtn, #editorMask .markdown").click(function() {
//        var t = $("#curNotebookForNewNote").attr("notebookId");
//        Note.newNote(t, !1, "", !0)
//    }),
    $("#notebookNavForNewNote").on("click", "li div",
    function() {
        var t = $(this).attr("notebookId");
        $(this).hasClass("new-note-right") ? Note.newNote(t, !1, "", !0) : Note.newNote(t)
    }),
    $("#searchNotebookForAdd").click(function(t) {
        t.stopPropagation()
    }),
    $("#searchNotebookForAdd").keyup(function() {
        var t = $(this).val();
        Notebook.searchNotebookForAddNote(t)
    }),
    $("#searchNotebookForList").keyup(function() {
        var t = $(this).val();
        Notebook.searchNotebookForList(t)
    }),
    $("#noteTitle").on("keydown",
    function(t) {
        var e = t.keyCode || t.witch;
//        9 == e && (Note.toggleWriteable(), t.preventDefault())
        9 == e && (t.preventDefault())
    }),
    $("#searchNoteInput").on("keydown",
    function(t) {
        var e = t.keyCode || t.witch;
        return 13 == e || 108 == e ? (t.preventDefault(), Note.searchNote(), !1) : void 0
    }),

    // register event to 'saveBtn'
    $("#saveBtn").click(function() {
        Note.curChangedSaveIt(!0); //!0 == true
//        Server.uploadToServer();
        saveIntoLocal();
        
        tinymce.activeEditor.notificationManager.open({
            text: 'Save locally',
            type: 'info',
            timeout: 1500
        });
        
    }),
        
    // register event to 'synBtn'
    $("#synBtn").click(function() {
        Note.curChangedSaveIt(!0); //!0 == true
        Server.uploadToServer();
        
        saveIntoLocal();
        
        tinymce.activeEditor.notificationManager.open({
            text: 'Save locally',
            type: 'info',
            timeout: 1500
        });
    }),

    // register event to 'addBtn'
    $("#addBtn").click(function() {
        $('#editor').append("<div class = \"drggableDiv\" draggable=true contenteditable=true></div>");
        // 保证只有一个activeEditor，所以删了以下代码
//        tinymce.init({
//          selector: '#editor div',
//          inline: true,
//          plugins: [
//            'advlist autolink lists link image charmap print preview anchor',
//            'searchreplace visualblocks code fullscreen',
//            'insertdatetime media table contextmenu'
//    //                                      去除掉“paste”，DD时正常（不会多余复制）
//          ],
//          toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
//        });
        addDDListeners();
    }),
        
    // register event to 'infoDropdownBtn'
    $("#infoDropdownBtn").click(function() {
        var createdTime = Note.cache[Note.curNoteId].CreatedTime;
        var updatedTime = Note.cache[Note.curNoteId].UpdatedTime;
        $("#noteInfo").empty();
        var noteInfo = "<table>" + "<tr><th>" + getMsg("Create Time") + '</th><td id="noteInfoCreatedTime">' + createdTime + '</td></tr>' + "<tr><th>" + getMsg("Update Time") + '</th><td id="noteInfoUpdatedTime">' + updatedTime + '</td></tr>' + "</table>";
        $("#noteInfo").append(noteInfo);
    }),

    Note.$itemList.on("click", ".item-blog",
    function(t) {
        t.preventDefault(),
        t.stopPropagation(),
        $(document).click();
        var e = $(this).parent().attr("noteId"),
        o = Note.getNote(e);
        o && window.open(Note.getPostUrl(o))
    }),
    Note.$itemList.on("click", ".item-my .item-setting",
    function(t) {
        t.preventDefault(),
        t.stopPropagation(),
        $(document).click();
        var e = $(this).parent();
        Note.contextmenu.showMenu(t, e)
    }),
        
    $(".toolbar-update").click(function() {
//        Note.toggleWriteable()
    }),

    // register event to 'editBtn'
//    $("#editBtn").click(function() {
//        Note.toggleWriteableAndReadOnly()
//    }),

    $("#editorContent").on("click", "a",
    function(t) {
        if (Note.readOnly) {
            var e = $(this).attr("href");
            if (e && "#" == e[0]) return;
            t.preventDefault(),
            window.open(e)
        }
    }),
        
    $("#preview-contents").on("click", "a",
    function(t) {
        var e = $(this).attr("href");
        e && "#" == e[0] || (t.preventDefault(), window.open(e))
    }),
    
    $(".shareLink").click(function() {
        // clear alert messages
        $("#shareMsg").empty();
        $("#shareMsg").removeClass("alert-danger");
        $("#shareMsg").removeClass("alert-success");
    })
//        
//    $(".iframeWrapper").resizable({
//        animate: true,
//        animateEasing: 'swing',
//        imateDuration: 500
//    });
	  
}),
Note.startInterval();

//function editorMode() {
//    this.writingHash = "writing",
//    this.normalHash = "normal",
//    this.isWritingMode = location.hash.indexOf(this.writingHash) >= 0,
//    this.toggleA = null
//}

function initSlimScroll() {
    Mobile.isMobile() || ($("#notebook").slimScroll({
        height: "100%"
    }), $("#noteItemList").slimScroll({
        height: "100%"
    }), $("#wmd-panel-preview").slimScroll({
        height: "100%"
    }), $("#wmd-panel-preview").css("width", "100%"))
}

//function initEditor() {
//    $("#moreBtn").click(function() {
//        saveBookmark();
//        var e = $("#editor");
//        e.hasClass("all-tool") ? e.removeClass("all-tool") : e.addClass("all-tool"),
//        restoreBookmark()
//    }),
//    tinymce.init({
//        inline: !0,
//        theme: "leanote",
//        valid_children: "+pre[div|#text|p|span|textarea|i|b|strong]",
//        setup: function(e) {
//            e.on("keydown",
//            function(e) {
//                var t = e.which ? e.which: e.keyCode;
//                return ! Note.readOnly || (e.ctrlKey || e.metaKey) && 67 == t ? void LeaAce.removeCurToggleRaw() : void e.preventDefault()
//            }),
//            e.on("cut",
//            function(e) {
//                return $(e.target).hasClass("ace_text-input") ? void e.preventDefault() : void 0
//            })
//        },
//        convert_urls: !0,
//        relative_urls: !1,
//        remove_script_host: !1,
//        selector: "#editorContent",
//        skin: "custom",
//        language: "en" != LEA.locale && "zh" != LEA.locale ? "en": LEA.locale,
//        plugins: ["autolink link leaui_image lists hr", "paste", "searchreplace leanote_nav leanote_code tabfocus", "table textcolor"],
//        toolbar1: "formatselect | forecolor backcolor | bold italic underline strikethrough | leaui_image | leanote_code leanote_inline_code | bullist numlist | alignleft aligncenter alignright alignjustify",
//        toolbar2: "outdent indent blockquote | link unlink | table | hr removeformat | subscript superscript |searchreplace | pastetext | leanote_ace_pre | fontselect fontsizeselect",
//        menubar: !1,
//        toolbar_items_size: "small",
//        statusbar: !1,
//        url_converter: !1,
//        font_formats: "Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Times New Roman=times new roman,times;Courier New=courier new,courier;Tahoma=tahoma,arial,helvetica,sans-serif;Verdana=verdana,geneva;宋体=SimSun;新宋体=NSimSun;黑体=SimHei;微软雅黑=Microsoft YaHei",
//        block_formats: "Header 1=h1;Header 2=h2;Header 3=h3;Header 4=h4;Paragraph=p",
//        paste_data_images: !0
//    }),
//    window.onbeforeunload = function(e) {
//        LEA.isLogout || Note.curChangedSaveIt(!0)
//    },
//    $("body").on("keydown",
//    function(e) {
//        var t = e.which ? e.which: e.keyCode,
//        o = e.ctrlKey || e.metaKey;
//        if (o) {
//            if (83 == t) return Note.curChangedSaveIt(),
//            e.preventDefault(),
//            !1;
//            if (69 == t) return Note.toggleWriteableAndReadOnly(),
//            e.preventDefault(),
//            !1
//        }
//    })
//}

function scrollTo(e, t, o) {
    var i = $("#editorContent"),
    n = i.find(t + ":contains(" + o + ")");
    random++;
    for (var r = $('#leanoteNavContent [data-a="' + t + "-" + encodeURI(o) + '"]'), s = r.size(), a = 0; s > a && r[a] != e; ++a);
    if (n.size() >= a + 1) {
        n = n.eq(a);
        var l = i.scrollTop() - i.offset().top + n.offset().top;
        return void i.animate({
            scrollTop: l
        },
        300)
    }
}

function updateLeftIsMin(e) {
    ajaxGet("/user/updateLeftIsMin", {
        leftIsMin: e
    })
}

//从大变小
function minLeft(e) {
    $page.addClass("mini-left"),
    e && updateLeftIsMin(!0)
}
//从小变大
function maxLeft(e) {
    $page.removeClass("mini-left"),
    $("#noteAndEditor").css("left", "12%"),
    $("#leftNotebook").width("12%"),
//    resizeEditor();
    e && updateLeftIsMin(!1)
}
function getMaxDropdownHeight(e) {
    var t = $(e).offset(),
    o = $(document).height() - t.top;
    o -= 70,
    0 > o && (o = 0);
    var i = $(e).find("ul").height();
    return o > i ? i: o
}

// 加载notes至note类中的cache
// 加载tag
function initPage() {
    console.log("initPage");
    if (Notebook.renderNotebooks(notebooks), // 这里的notebooks变量定义在主页里
        console.log("fst"),
        console.log(Notebook.cache),
        Share.renderShareNotebooks(sharedUserInfos, shareNotebooks), // render那些分享的notebookrenderShareNotebooks
        // console.log(Notebook.cache),
        curSharedNoteNotebookId ? // curSharedNoteNotebookId变量定义在主页，默认为""
        Share.firstRenderShareNote(curSharedUserId, curSharedNoteNotebookId, curNoteId) :
        // 如果curSharedNoteNotebookId为空，则执行以下
        (Note.setNoteCache(noteContentJson), // noteContentJson变量定义在主页：是当前note内容
        Note.renderNotes(notes), // notes变量定义在主页里：所有notes

        // 如果curNoteId有，就切换到这个note
        curNoteId && (setTimeout(function() {
            // alert("here");
            Note.changeNoteForPjax(curNoteId, !0, curNotebookId)
        }),
        // 如果curNotebookId存在，就不会执行selectNotebook(...)
        curNotebookId || Notebook.selectNotebook($(tt('#notebook [notebookId="?"]', Notebook.allNotebookId))))), latestNotes.length > 0) { // 下面是if(true) 的内容
            for (var e = 0; e < latestNotes.length; ++e) {
                Note.addNoteCache(latestNotes[e]);
//                alert("iteration: " + e);
            }
        }
    Tag.renderTagNav(tagsJson), // 加载并显示tag区
    Tag.initializeTagHint(),
//        initSlimScroll(),
    LeaAce.handleEvent()
}

//editorMode.prototype.toggleAText = function(e) {
//    var t = this;
//    setTimeout(function() {
//        var o = $(".toggle-editor-mode a"),
//        i = $(".toggle-editor-mode span");
//        e ? (o.attr("href", "#" + t.normalHash), i.text(getMsg("normalMode"))) : (o.attr("href", "#" + t.writingHash), i.text(getMsg("writingMode")))
//    },
//    0)
//},
//editorMode.prototype.isWriting = function(e) {
//    return e || (e = location.hash),
//    e.indexOf(this.writingHash) >= 0
//},
//editorMode.prototype.init = function() {
//    this.$themeLink = $("#themeLink"),
//    this.changeMode(this.isWritingMode);
//    var e = this;
//    $(".toggle-editor-mode").click(function(t) {
//        t.preventDefault(),
//        saveBookmark();
//        var o = $(this).find("a"),
//        i = e.isWriting(o.attr("href"));
//        e.changeMode(i),
//        i ? setHash("m", e.writingHash) : setHash("m", e.normalHash),
//        restoreBookmark()
//    })
//},
//editorMode.prototype.changeMode = function(e) {
//    this.toggleAText(e),
//    e ? this.writtingMode() : this.normalMode()
//},
//editorMode.prototype.resizeEditor = function() {
//    setTimeout(function() {
//        resizeEditor()
//    },
//    10),
//    setTimeout(function() {
//        resizeEditor()
//    },
//    20),
//    setTimeout(function() {
//        resizeEditor()
//    },
//    500)
//},
//editorMode.prototype.normalMode = function() {
//    $("#noteItemListWrap, #notesAndSort").show(),
//    $("#noteList").unbind("mouseenter").unbind("mouseleave");
//    var e = UserInfo.Theme || "default";
//    e += ".css";
//    $("#themeLink"); - 1 != this.$themeLink.attr("href").indexOf("writting-overwrite.css") && this.$themeLink.attr("href", "/css/theme/" + e),
//    $("#noteList").width(UserInfo.NoteListWidth),
//    $("#note").css("left", UserInfo.NoteListWidth),
//    this.isWritingMode = !1,
//    this.resizeEditor()
//},
//editorMode.prototype.writtingMode = function() {
//    Note.inBatch || ( - 1 == this.$themeLink.attr("href").indexOf("writting-overwrite.css") && this.$themeLink.attr("href", "/css/theme/writting-overwrite.css"), $("#noteItemListWrap, #notesAndSort").fadeOut(), $("#noteList").hover(function() {
//        $("#noteItemListWrap, #notesAndSort").fadeIn()
//    },
//    function() {
//        $("#noteItemListWrap, #notesAndSort").fadeOut()
//    }), this.resizeEditor(), $("#noteList").width(250), $("#note").css("left", 0), Note.toggleWriteable(), this.isWritingMode = !0)
//},
//editorMode.prototype.getWritingCss = function() {
//    return this.isWritingMode ? ["/css/editor/editor-writting-mode.css"] : []
//};
//var em = new editorMode;
//LEA.em = em;
var Resize = {
    lineMove: !1,
    mdLineMove: !1,
    target: null,
    leftNotebook: $("#leftNotebook"),
    notebookSplitter: $("#notebookSplitter"),
    noteList: $("#noteList"),
    noteAndEditor: $("#noteAndEditor"),
    noteSplitter: $("#noteSplitter"),
    mediaSplitter: $("#mediaSplitter"),
    note: $("#note"),
    body: $("body"),
    media: $("#media"),
    leftColumn: $("#left-column"),
    rightColumn: $("#right-column"),
    mdSplitter: $("#mdSplitter2"),
    init: function() {
        var e = this;
        e.initEvent()
    },
    initEvent: function() {
        var e = this; // Resize
        $(".noteSplit").bind("mousedown",
        function(t) {
            t.preventDefault(),
            e.lineMove = !0,
            $(this).css("background-color", "#ccc"),
            e.target = $(this).attr("id"),
            $("#noteMask").css("z-index", 99999)
        }),
        e.mdSplitter.bind("mousedown",
        function(t) {
            t.preventDefault(),
            $(this).hasClass("open") && (e.mdLineMove = !0)
        }),

        e.body.bind("mousemove",
        function(t) {// t是鼠标
            if(e.lineMove) {
                t.preventDefault();

                e.resize3Columns(t);
            }
                 // :
                 // e.mdLineMove && (t.preventDefault(), e.resizeMdColumns(t))
        }),
        e.body.bind("mouseup",
        function(t) {
            e.stopResize(),
            $("#noteMask").css("z-index", -1)
        });
        var t;
        $(".layout-toggler-preview").click(function() {
            var o = $(this),
            i = e.leftColumn.parent();
            if (o.hasClass("open")) {
                var n = i.width(),
                r = 22,
                s = n - r;
                t = e.leftColumn.width(),
                e.leftColumn.width(s),
                e.rightColumn.css("left", "auto").width(r),
                o.removeClass("open"),
                e.rightColumn.find(".layout-resizer").removeClass("open"),
                $(".preview-container").hide()
            } else o.addClass("open"),
            e.rightColumn.find(".layout-resizer").addClass("open"),
            e.leftColumn.width(t),
            $(".preview-container").show(),
            e.rightColumn.css("left", t).width("auto"),
            MD && MD.onResize()
        })
    },
    stopResize: function() {
        var e = this; (e.lineMove || e.mdLineMove) && ajaxGet("/user/updateColumnWidth", {
            mdEditorWidth: UserInfo.MdEditorWidth,
            notebookWidth: UserInfo.NotebookWidth,
            noteListWidth: UserInfo.NoteListWidth,
            MediaWidth: UserInfo.MediaWidth
        },
        function() {}),
        e.lineMove = !1,
        e.mdLineMove = !1,
        $(".noteSplit").css("background", "none"),
        e.mdSplitter.css("background", "none")
    },
    set3ColumnsWidth: function(e, t) {
        var o = this;
        if (! (150 > e || 100 > t || e>200 || t>150 )) { //当e >= 150 && t >= 100时执行
            var i = o.body.width() - e - t; // 除去左边两个剩余总宽度
            400 > i || // 当i>=400时执行
                        (o.leftNotebook.width(e),
                        o.notebookSplitter.css("left", e),
                        o.noteAndEditor.css("left", e),
                        o.noteList.width(t),
                        o.noteSplitter.css("left", t),
                        o.note.css("left", t),
                        UserInfo.NotebookWidth = e,
                        UserInfo.NoteListWidth = t)
        }
    },

    setMediaWidth: function(xClient) {
        var o = this;
        if (xClient>=830 && xClient <= 1400){
            o.noteAndEditor.width(xClient - o.leftNotebook.width());
            o.note.width(xClient - o.leftNotebook.width()- o.noteList.width());
            o.mediaSplitter.css("left", xClient);
            o.media.css("left", xClient);

        }
    },

    resize3Columns: function(e, t) {
        var o = this; // Resize
        // alert(t);
        t && (e.clientX += o.body.width() - o.note.width()); // 不执行
        var i, n;
        // alert(o.target);

        if(o.lineMove) {
            if("notebookSplitter" == o.target) {// o.target当前splitter id
                i = e.clientX;
                n = o.noteList.width();
                o.set3ColumnsWidth(i, n);
            }
            else if("noteSplitter" == o.target) {
                i = o.leftNotebook.width();
                n = e.clientX - i; // 新notelist宽度
                o.set3ColumnsWidth(i, n);
//                resizeEditor();
            }
            else {
                i = e.clientX;
                o.setMediaWidth(i);
//                resizeEditor();
            }
        }
    },
    resizeMDInterval: null,
    resizeMdColumns: function(e) {
        var t = this;
        if (t.mdLineMove) {
            var o = e.clientX - t.leftColumn.offset().left;
            t.setMdColumnWidth(o),
            clearInterval(t.resizeMDInterval),
            t.resizeMDInterval = setTimeout(function() {
                MD.resize && MD.resize()
            },
            50)
        }
    },
    setMdColumnWidth: function(e) {
        var t = this,
        o = $("#note").width();
        e > 100 && o - 80 > e && (UserInfo.MdEditorWidth = e, t.leftColumn.width(e), t.rightColumn.css("left", e)),
        MD && MD.onResize()
    }
};
Mobile = {
    noteO: $("#note"),
    bodyO: $("body"),
    setMenuO: $("#setMenu"),
    hashChange: function() {
        var e = Mobile,
        t = location.hash;
        if ( - 1 != t.indexOf("noteId")) {
            e.toEditor(!1);
            var o = t.substr(8);
            Note.changeNote(o, !1, !1)
        } else e.toNormal(!1)
    },
    init: function() {
        var e = this;
        e.isMobile()
    },
    isMobile: function() {
        var e = navigator.userAgent;
        return !1;
//        return LEA.isMobile = !1,
//        LEA.isMobile = /Mobile|Android|iPhone|iPad/i.test(e),
//        LEA.isIpad = /iPad/i.test(e),
//        LEA.isIphone = /iPhone/i.test(e),
//        !LEA.isMobile && $(document).width() <= 700 && (LEA.isMobile = !0),
//        LEA.isMobile
    },
    changeNote: function(e) {
        var t = this;
        return !0;
//        return LEA.isMobile ? (t.toEditor(!0, e), !1) : !0
    },
    toEditor: function(e, t) {
        var o = this;
        o.bodyO.addClass("full-editor"),
        o.noteO.addClass("editor-show")
    },
    toNormal: function(e) {
        var t = this;
        t.bodyO.removeClass("full-editor"),
        t.noteO.removeClass("editor-show")
    },
    switchPage: function() {
        var e = this;
        return ! LEA.isMobile || LEA.isIpad ? !0 : (e.bodyO.hasClass("full-editor") ? e.toNormal(!0) : e.toEditor(!0), !1)
    }
};
var random = 1;
LEA.s3 = new Date,

console.log("initing...(only reading app.min.js file)"),
    
$(window).resize(function() {
    Mobile.isMobile()
//    resizeEditor()
}),

//initEditor(),

$(".folderHeader").click(function() {
    var e = $(this).next(),
    t = $(this).parent();
    e.is(":hidden") ? ($(".folderNote").removeClass("opened").addClass("closed"), t.removeClass("closed").addClass("opened"), $(this).find(".fa-angle-right").removeClass("fa-angle-right").addClass("fa-angle-down")) : ($(".folderNote").removeClass("opened").addClass("closed"), t.removeClass("opened").addClass("closed"), $(this).find(".fa-angle-down").removeClass("fa-angle-down").addClass("fa-angle-right"))
}),
$(".leanoteNav h1").on("click",
function(e) {
    var t = $(this).closest(".leanoteNav");
    t.hasClass("unfolder") ? t.removeClass("unfolder") : t.addClass("unfolder")
}),
$("#wrongEmail").click(function() {
    openSetInfoDialog(1)
}),
$("#setTheme").click(function() {
    showDialog2("#setThemeDialog", {
        title: "主题设置",
        postShow: function() {
            UserInfo.Theme || (UserInfo.Theme = "default"),
            $("#themeForm input[value='" + UserInfo.Theme + "']").attr("checked", !0)
        }
    })
}),

$("#themeForm").on("click", "input",
function(e) {
    var t = $(this).val(),
    o = $("#themeLink").attr("href"),
    i = o.split("="),
    n = 1;
    2 == i.length && (n = i[1]),
    $("#themeLink").attr("href", "/css/theme/" + t + ".css?id=" + n),
    ajaxPost("/user/updateTheme", {
        theme: t
    },
    function(e) {
        reIsOk(e) && (UserInfo.Theme = t)
    })
}),

$("#notebook, #newMyNote, #myProfile, #topNav, #notesAndSort", "#leanoteNavTrigger").bind("selectstart",
function(e) {
    return e.preventDefault(),
    !1
});

var $page = $("#page");
var UerInfo = {};
// 从小变大
$("#leftSwitcher2").on("click",
function() {
    maxLeft(!0)
}),

    
    
// 从大变小
$("#leftSwitcher").click("click",
function() {
    Mobile.switchPage() && minLeft(!0)
}),
$("#notebookMin div.minContainer").click(function() {
    var e = $(this).attr("target");
    maxLeft(!0),
    "#notebookList" == e ? $("#myNotebooks").hasClass("closed") && $("#myNotebooks .folderHeader").trigger("click") : "#tagNav" == e ? $("##g").hasClass("closed") && $("#myTag .folderHeader").trigger("click") : $("#myShareNotebooks").hasClass("closed") && $("#myShareNotebooks .folderHeader").trigger("click")
}),

UserInfo.NotebookWidth = UserInfo.NotebookWidth || $("#notebook").width(),
UserInfo.NoteListWidth = UserInfo.NoteListWidth || $("#noteList").width(),
UserInfo.MediaWidth = UserInfo.MediaWidth || $("#media").width(),
Resize.init(),
Resize.set3ColumnsWidth(UserInfo.NotebookWidth, UserInfo.NoteListWidth, UserInfo.MediaWidth),
Resize.setMdColumnWidth(UserInfo.MdEditorWidth),
UserInfo.LeftIsMin ? minLeft(!1) : maxLeft(!1),
$("#mainMask").html(""),
$("#mainMask").hide(100),
$(".dropdown").on("shown.bs.dropdown",
function() {
    $(this).find("ul")
}),
//em.init(),
Mobile.init();

//uses ajax and pushState to deliver a fast browsing experience with real permalinks, page titles, and a working back button.
var Pjax = {

    // 使“后退”，不用重新刷新
    // 使“切换笔记”，页面不用全部加载
    init: function() {
        var e = this;
        window.addEventListener("popstate",
        function(t) {
            var o = t.state;
            o && (document.title = o.title || "Untitled", log("pop"), e.changeNotebookAndNote(o.noteId))
        },
        !1),
        history.pushState || $(window).on("hashchange", // "hashchange"事件：当前URL的锚部分(以 '#' 号为开始) 发生改变时触发（切换笔记时）
        function() {
            var t = getHash("noteId");
            t && e.changeNotebookAndNote(t)
        })
    },

    // 切换当前笔记本
    // e是目标笔记的ID
    changeNotebookAndNote: function(e) {
        // alert("changeNotebookAndNote activated");
        var t = Note.getNote(e); // t是个note实例
        if (t) {
            var o = void 0 != t.Perm,
            i = t.NotebookId; // i是切换目标note的notebook id
            return Notebook.curNotebookId == i ? void Note.changeNoteForPjax(e, !1) // 如果仍在当前笔记本
            : void(o ? Share.changeNotebook(t.UserId, i,
            function(t) {
                Note.renderNotes(t),
                Note.changeNoteForPjax(e, !1, !0)
            }) : Notebook.changeNotebook(i, // 调用切换程序！！！！！
            function(t) {
                Note.renderNotes(t),
                Note.changeNoteForPjax(e, !1, !0)
            }))
        }
        else {
            t = Share.getNote(e); // t是个note实例
            if (t) {
                var o = void 0 != t.Perm,
                i = t.NotebookId; // i是切换目标note的notebook id
                return Notebook.curNotebookId == i ? void Note.changeNoteForPjax(e, !1) // 如果仍在当前笔记本
                : void(o ? Share.changeNotebook(t.UserId, i,
                function(t) {
                    Note.renderNotes(t),
                    Note.changeNoteForPjax(e, !1, !0)
                }) : Notebook.changeNotebook(i, // 调用切换程序！！！！！
                function(t) {
                    Note.renderNotes(t),
                    Note.changeNoteForPjax(e, !1, !0)
                }))
            }
        }
    },


    //?????
    changeNote: function(e) {
        var t = e.NoteId,
        o = e.Title,
        i = "/note/" + t;
        if (location.href.indexOf("?online") > 0 && (i += "?online=" + /online=([0-9])/.exec(location.href)[1]), location.hash && (i += location.hash), history.pushState) {
            var n = {
                url: i,
                noteId: t,
                title: o
            };
            history.pushState(n, o, i),
            document.title = o || "Untitled"
        } else setHash("noteId", t)
    }
};

// 自动运行
$(function() {
    Pjax.init()
}),
LeaAce = {
    _aceId: 0,
    _aceEditors: {},
    _isInit: !1,
    _canAce: !1,
    isAce: !0,
    disableAddHistory: function() {
        tinymce.activeEditor.undoManager.setCanAdd(!1)
    },
    resetAddHistory: function() {
        tinymce.activeEditor.undoManager.setCanAdd(!0)
    },
    canAce: function() {
        return this._isInit ? this._canAce: ("webkit" != getVendorPrefix() || Mobile.isMobile() ? this._canAce = !1 : this._canAce = !0, this._isInit = !0, this._canAce)
    },
    canAndIsAce: function() {
        return this.canAce() && this.isAce
    },
    getAceId: function() {
        return this.aceId++,
        "leanote_ace_" + (new Date).getTime() + "_" + this._aceId
    },
    initAce: function(e, t, o) {
        var i = this;
        if (o || i.canAndIsAce()) {
            var n = $("#" + e);
            if (0 != n.length) {
                var r = n.html();
                try {
                    i.disableAddHistory();
                    var s = n.attr("class") || "",
                    a = -1 != s.indexOf("brush:html"); (n.attr("style") || !a && -1 != n.html().indexOf("style")) && n.html(n.text()),
                    n.find(".toggle-raw").remove();
                    n.html();
                    n.removeClass("ace-to-pre"),
                    n.attr("contenteditable", !1);
                    var l = ace.edit(e);
                    l.container.style.lineHeight = 1.5,
                    l.setTheme("ace/theme/tomorrow");
                    var c = i.getPreBrush(n),
                    d = "";
                    if (c) try {
                        d = c.split(":")[1]
                    } catch(h) {}
                    return d && "false" !== d || (d = "javascript"),
                    l.session.setMode("ace/mode/" + d),
                    l.session.setOption("useWorker", !1),
                    2 == window.devicePixelRatio ? l.setFontSize("12px") : l.setFontSize("14px"),
                    l.getSession().setUseWorker(!1),
                    l.setOption("showInvisibles", !1),
                    l.setShowInvisibles(!1),
                    l.setOption("wrap", "free"),
                    l.setShowInvisibles(!1),
                    l.setReadOnly(Note.readOnly),
                    l.setAutoScrollEditorIntoView(!0),
                    l.setOption("maxLines", 1e4),
                    l.commands.addCommand({
                        name: "undo",
                        bindKey: {
                            win: "Ctrl-z",
                            mac: "Command-z"
                        },
                        exec: function(e) {
                            var t = e.getSession().getUndoManager();
                            t.hasUndo() ? t.undo() : (t.reset(), tinymce.activeEditor.undoManager.undo())
                        }
                    }),
                    this._aceEditors[e] = l,
                    t && l.setValue(t),
                    i.resetAddHistory(),
                    l
                } catch(h) {
                    console.error("ace error!!!!"),
                    console.error(h),
                    n.attr("contenteditable", !0),
                    n.removeClass("ace-tomorrow ace_editor ace-tm"),
                    n.html(r),
                    i.resetAddHistory()
                }
            }
        }
    },
    clearIntervalForInitAce: null,
    initAceFromContent: function(e) {
        if (!this.canAndIsAce()) {
            var t = $(e.getBody());
            return void t.find("pre").removeClass("ace_editor")
        }
        var o = this;
        this.clearIntervalForInitAce && clearInterval(this.clearIntervalForInitAce),
        this.clearIntervalForInitAce = setTimeout(function() {
            for (var t = $(e.getBody()), i = t.find("pre"), n = 0; n < i.length; ++n) {
                var r = i.eq(n),
                s = o.isInAce(r);
                if (s) {
                    if (!isAceError(s[0].getValue())) break;
                    console.error("之前有些没有destroy掉")
                }
                setTimeout(function(e) {
                    return function() {
                        e.find(".toggle-raw").remove();
                        var t = e.html();
                        t = t.replace(/ /g, "&nbsp;").replace(/\<br *\/*\>/gi, "\n").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
                        e.html(t);
                        var i = e.attr("id");
                        i || (i = o.getAceId(), e.attr("id", i)),
                        o.initAce(i)
                    }
                } (r))
            }
        },
        10)
    },
    allToPre: function(e) {
        if (this.canAndIsAce()) {
            var t = this;
            t.clearIntervalForInitAce && clearInterval(t.clearIntervalForInitAce),
            t.clearIntervalForInitAce = setTimeout(function() {
                for (var o = $(e.getBody()), i = o.find("pre"), n = 0; n < i.length; ++n) {
                    var r = i.eq(n);
                    setTimeout(function(e) {
                        return function() {
                            t.aceToPre(e)
                        }
                    } (r))
                }
            },
            10)
        }
    },
    undo: function(e) {
        if (this.canAndIsAce()) {
            var t = this;
            this.clearIntervalForInitAce && clearInterval(this.clearIntervalForInitAce),
            this.clearIntervalForInitAce = setTimeout(function() {
                for (var o = $(e.getBody()), i = o.find("pre"), n = 0; n < i.length; ++n) {
                    var r = i.eq(n);
                    setTimeout(function(e) {
                        return function() {
                            var o = e.html(),
                            i = e.attr("id"),
                            n = t.getAce(i);
                            if (n) {
                                var o = n.getValue();
                                n.destroy();
                                var n = t.initAce(i, o);
                                n.selection.clearSelection()
                            } else {
                                o = o.replace(/ /g, "&nbsp;").replace(/\<br *\/*\>/gi, "\n"),
                                e.html(o);
                                var i = e.attr("id");
                                i || (i = t.getAceId(), e.attr("id", i)),
                                t.initAce(i)
                            }
                        }
                    } (r))
                }
            },
            10)
        }
    },
    destroyAceFromContent: function(e) {
        if (this.canAce()) for (var t = e.find("pre"), o = 0; o < t.length; ++o) {
            var i = t.eq(o).attr("id"),
            n = this.getAce(i);
            n && (n.destroy(), this._aceEditors[i] = null)
        }
    },
    getAce: function(e) {
        return this.canAce() ? this._aceEditors[e] : void 0
    },
    setAceReadOnly: function(e, t) {
        var o = this;
        if ("object" == typeof e) var i = e.attr("id");
        else var i = e;
        var n = o.getAce(i);
        n && n.setReadOnly(t)
    },
    nowIsInAce: function() {
        if (this.canAce()) {
            var e = tinymce.activeEditor.selection.getNode();
            return this.isInAce(e)
        }
    },
    nowIsInPre: function() {
        var e = tinymce.activeEditor.selection.getNode();
        return this.isInPre(e)
    },
    isInPre: function(e) {
        var t = $(e),
        e = t.get(0);
        return "PRE" == e.nodeName ? !0 : ($pre = t.closest("pre"), 0 == $pre.length ? !1 : !0)
    },
    isInAce: function(e) {
        if (this.canAce()) {
            var t = $(e),
            e = t.get(0);
            if ("PRE" == e.nodeName) {
                var o = t.attr("id"),
                i = this.getAce(o);
                return i ? [i, t] : !1
            }
            return $pre = t.closest("pre"),
            0 == $pre.length ? !1 : this.isInAce($pre)
        }
    },
    getPreBrush: function(e) {
        var t = $(e),
        o = t.attr("class");
        if (!o) return "";
        var i = o.match(/brush:[^ ]*/),
        n = "";
        return i && i.length > 0 && (n = i[0]),
        n
    },
    preToAce: function(e, t) {
        if (t || this.canAce()) {
            var o = $(e),
            i = this.getAceId();
            o.attr("id", i);
            var n = this.initAce(i, "", !0);
            n && n.focus()
        }
    },
    aceToPre: function(e, t) {
        var o = this,
        i = $(e),
        n = o.isInAce(i);
        if (n) {
            var r = n[0],
            i = n[1],
            s = r.getValue();
            isAceError(s) && (s = i.html()),
            s = s.replace(/</g, "&lt").replace(/>/g, "&gt");
            var a = $('<pre class="' + i.attr("class") + ' ace-to-pre">' + s + "</pre>");
            i.replaceWith(a),
            r.destroy(),
            o._aceEditors[i.attr("id")] = null,
            t && setTimeout(function() {
                var e = tinymce.activeEditor,
                t = e.selection,
                o = t.getRng();
                o.selectNode(a.get(0)),
                e.focus(),
                a.trigger("click"),
                a.html(s + " ")
            },
            0)
        }
    },
    removeAllToggleRaw: function() {
        $("#editorContent .toggle-raw").remove()
    },
    removeCurToggleRaw: function() {
        if (this.curToggleRaw) try {
            this.curToggleRaw.remove()
        } catch(e) {}
    },
    curToggleRaw: null,
    handleEvent: function() {
        if (this.canAce()) {
            var e = this;
            $("#editorContent").on("mouseenter", "pre",
            function(t) {
                var o = $(this);
                if ($raw = o.find(".toggle-raw"), 0 == $raw.length) {
                    var i = $('<div class="toggle-raw" title="Toggle code with raw html"><input type="checkbox" /></div>');
                    o.append(i),
                    e.curToggleRaw = i
                }
                $input = o.find(".toggle-raw input"),
                LeaAce.isInAce(o) ? $input.prop("checked", !0) : $input.prop("checked", !1)
            }),
            $("#editorContent").on("mouseleave", "pre",
            function() {
                var e = $(this).find(".toggle-raw");
                e.remove()
            }),
            $("#editorContent").on("change", ".toggle-raw input",
            function() {
                var t = $(this).prop("checked"),
                o = $(this).closest("pre");
                t ? e.preToAce(o, !0) : e.aceToPre(o, !0)
            });
            var t;
            $("#editorContent").on("keyup", "pre",
            function(o) {
                var i = o.keyCode;
                if (8 == i || 46 == i) if (t) {
                    var n = (new Date).getTime();
                    if (300 > n - t) {
                        var r = e.isInAce($(this));
                        if (r && !r[0].getValue()) return r[0].destroy(),
                        void $(this).remove()
                    }
                    t = n
                } else t = (new Date).getTime()
            })
        }
    }
};
function revertTagStatus() {
    $("#addTagTrigger").show(),
    $("#addTagInput").hide()
}
function hideTagList(a) {
    $("#tagDropdown").removeClass("open"),
    a && a.stopPropagation()
}
function showTagList(a) {
    $("#tagDropdown").addClass("open"),
    a && a.stopPropagation()
}
function reRenderTags() {
    var a = ["label label-default", "label label-info"],
    e = 0;
    $("#tags").children().each(function() {
        var t = $(this).attr("class"); 
        ("label label-default" == t || "label label-info" == t) && ($(this).removeClass(t).addClass(a[e % 2]), e++)
    })
}

//根据tagname找note
function searchNotesByTagName(tagName) {
    var foundNotes = [];
    for (var n in Note.cache) if (n) {
        var i = Note.cache[n];
//        console.log(i);
        if(i.Tags != undefined) {
            var tags = i.Tags;
            for (var index in tags) {
//                console.log(tags[index]);
                if (tags[index] == tagName) {
                    foundNotes.push(i);
                    break;
                } 
            }
        }
    }
    return foundNotes;
}

Tag.classes = {
    "蓝色": "label label-blue",
    "红色": "label label-red",
    "绿色": "label label-green",
    "黄色": "label label-yellow",
    blue: "label label-blue",
    red: "label label-red",
    green: "label label-green",
    yellow: "label label-yellow"
},
Tag.mapCn2En = {
    "蓝色": "blue",
    "红色": "red",
    "绿色": "green",
    "黄色": "yellow"
},
Tag.mapEn2Cn = {
    blue: "蓝色",
    red: "红色",
    green: "绿色",
    yellow: "黄色"
},
Tag.t = $("#tags"),
Tag.getTags = function() {
    var a = [];
    return Tag.t.children().each(function() {
        var e = $(this).data("tag");
        e = Tag.mapCn2En[e] || e,
        a.push(e)
    }),
    a
},
Tag.clearTags = function() {
    Tag.t.html("")
},
Tag.renderTags = function(a) {
    if (Tag.t.html(""), !isEmpty(a)) for (var e = 0; e < a.length; ++e) {
        var t = a[e];
        Tag.appendTag(t)
    }
},
Tag.renderReadOnlyTags = function(a) {
    function e() {
        return t ? "label label-default": (t = !0, "label label-info")
    }
    $("#noteReadTags").html(""),
    (isEmpty(a) || 1 == a.length && "" == a[0]) && $("#noteReadTags").html(getMsg("noTag"));
    var t = !0;
    for (var t in a) {
        var l = a[t];
        l = Tag.mapEn2Cn[l] || l;
        var n = Tag.classes[l];
        n || (n = e()),
        tag = tt('<span class="?">?</span>', n, trimTitle(l)),
        $("#noteReadTags").append(tag)
    }
},
    
// 添加新tag
// a: tagName
// e: !0
Tag.appendTag = function(a, e) {
    var t, l, n = !1;
    console.log("start");
    var tagName = a;
    if ("object" == typeof a) {
        if (t = a.classes, l = a.text, !l) {
            // console.log("here");
            return;
        }
    } else {
        if (a = $.trim(a), l = a, !l) return;
        var t = Tag.classes[l];
        t ? n = !0 : t = "label label-default" //如果存在，n为真
    }
    var g = l;
//    "zh" == LEA.locale && (l = Tag.mapEn2Cn[l] || l, g = Tag.mapCn2En[g] || g),
    a = tt('<span class="?" data-tag="?">?<i title="' + getMsg("delete") + '"> x</i></span>', t, l, l);
    // a = tt('<span class="?" data-tag="?">?<i title="' + getMsg("delete") + '"><i class="fa fa-times" aria-hidden="true"></i></i></span>', t, l, l);

    var r = !1;
    $("#tags").children().each(function() {
        if (n) {
            var e = $("<div></div>").append($(this).clone()).html();
            e == a && ($(this).remove(), r = !0)
        } else l + " x" == $(this).text() && ($(this).remove(), r = !0)
    }),
    $("#tags").append(a),
    hideTagList(),
    n || reRenderTags();
//    e && (r || Note.curChangedSaveIt(!0,
//    function() {
//        ajaxPost("/tag/updateTag", {
//            tag: g
//        },
//        function(a) {
//            reIsOk(a) && Tag.addTagNav(a.Item)
//        })
//    }))
    var newTag = {
        Count: 1,
        CreatedTime: getCurDate(),
        IsDeleted: false,
        Tag: tagName,
        TagId: getObjectId(),
        UpdatedTime: getCurDate(),
        UserId: UserInfo.UserId,
        Usn: 94
    };
    e && (r || Note.curChangedSaveIt(!0), Tag.addTagNav(newTag))
},
    
// 删除笔记区域的tag
// a: 目标tag html dom对象
Tag.removeTag = function(a) {
    var e = a.data("tag");
    a.remove(),
    reRenderTags(),
//    "zh" == LEA.locale && (e = Tag.mapCn2En[e] || e),
    Note.curChangedSaveIt(!0,
    function() {
        ajaxPost("/tag/updateTag", {
            tag: e
        },
        function(a) {
            reIsOk(a) && Tag.addTagNav(a.Item)
        })
    })
},
    
Tag.tags = [],
Tag.initializeTagHint = function() { // initialize the tag navigation
    $("#tagColor").empty(); // clear
    for(var i in Tag.tags) {
        var curTag = Tag.tags[i];
//        dom example:
//        <li role="presentation"><span class="label label-red">red</span></li>
        var newTagHintdDom = '<li role="presentation"><span class="label label-red">' + curTag.Tag + "</span></li>";
        $("#tagColor").append(newTagHintdDom);
    }
    // register envents
    $("#tagColor li").click(function(a) {
        console.log("here");
        var e;
        e = $(this).attr("role") ? $(this).find("span") : $(this);
        //        console.log(e);
        Tag.appendTag(e.html());
        //        Tag.appendTag({
        //            classes: e.attr("class"),
        //            text: e.text()
        //        },
        //        !0)
    });
},
    // iris0524
Tag.renderTagNav = function(a) {
    a = a || [],
    Tag.tags = a,
    $("#tagNav").html("");
    for (var e in a) {
        var t = a[e],
        l = t.Tag,
        n = l;
//        if ("zh" == LEA.locale) var n = Tag.mapEn2Cn[l] || n;
        n = trimTitle(n);
        var g = Tag.classes[l] || "label label-default";
        $("#tagNav").append(tt('<li data-tag="?"><a> <span class="?">?</span> <span class="tag-delete"><i class="fa fa-times" aria-hidden="true"></i></span></li>', l, g, n))
    }
},

// 真正添加tag的地方
Tag.addTagNav = function(a) {
    var e = this;
    for (var t in e.tags) {
        var l = e.tags[t];
        if (l.Tag == a.Tag) {
            e.tags.splice(t, 1); // 删除相同名字的
            break
        }
    }
    e.tags.unshift(a), //加到tags里第一个（这样显示的时候就是第一个）
    e.renderTagNav(e.tags);
    showMsg("New tag added");
    Tag.initializeTagHint();
},

// 删除Tag数组中的tag
Tag.deleteTagNav = function(tagName) {
    var e = this;
    for (var t in e.tags) {
        var l = e.tags[t];
        if (l.Tag == tagName) {
            e.tags.splice(t, 1); // 删除相同名字的
            break
        }
    }
},

$(function() {
    
    // 在tag区删除tag
    function a() {
        $li = $(this).closest("li");
        var tagName = $.trim($li.data("tag"));
//        confirm("Are you sure ?") && ajaxPost("/tag/deleteTag", {
//            tag: a
//        },
//        function(e) {
//            if (reIsOk(e)) {
//                var t = e.Item;
//                Note.deleteNoteTag(t, a),
//                $li.remove()
//            }
//        })
        bootbox.confirm("Please confirm to delete this tag: " + tagName, function(result) {
            if(result) {
                var t = e.Item;
                Note.deleteNoteTag(tagName);
                $li.remove();
                Tag.deleteTagNav(tagName);
            }
        }); 
    }
    
    // searchNoteByTags
    // 点击tag后激发
    function e() {
        var a = $(this).closest("li"), // a选中的tag在html中对应的li dom对象
        e = $.trim(a.data("tag")); // 获取tag name
//        console.log(a);
        Note.curChangedSaveIt();
        Note.clearAll();
        $("#tagSearch").html(a.html()).show(); // 更新tag name展示区
        $("#tagSearch .tag-delete").remove();
//        showLoading(),
//        hideLoading(),    
       if(a) {
            var notesToRender = searchNotesByTagName(e);
            Note.renderNotes(notesToRender), isEmpty(notesToRender) || Note.changeNote(notesToRender[0].NoteId);   
       }
//        ajaxGet("/note/searchNoteByTags", {
//            tags: [e]
//        },
//        function(a) {
//            hideLoading(),
//            a && (Note.renderNotes(a), isEmpty(a) || Note.changeNote(a[0].NoteId))
//        })
    }
    $("#addTagTrigger").click(function() {
        $(this).hide(),
        $("#addTagInput").show().focus().val("")
    }),
    $("#addTagInput").click(function(a) {
        showTagList(a)
    }),
    $("#addTagInput").blur(function() {
        var a = $(this).val(); // 输入的tagName
//        console.log(a);
        a && Tag.appendTag(a, !0)
    }),
    $("#addTagInput").keydown(function(a) {
        13 == a.keyCode && (hideTagList(), $("#addTagInput").val() ? ($(this).trigger("blur"), $("#addTagTrigger").trigger("click")) : $(this).trigger("blur"))
    }),
//    $("#tagColor li").click(function(a) {
//        console.log("here");
//        var e;
//        e = $(this).attr("role") ? $(this).find("span") : $(this);
////        console.log(e);
//        Tag.appendTag(e.html());
////        Tag.appendTag({
////            classes: e.attr("class"),
////            text: e.text()
////        },
////        !0)
//    }),
    // 笔记部分tag区域的删除
    $("#tags").on("click", "i",
    function() {
        Tag.removeTag($(this).parent())
    }),
    $("#myTag .folderBody").on("click", "li .label", e),
    $("#myTag .folderBody").on("click", "li .tag-delete", a)
});
Notebook.curNotebookId = "",
Notebook.cache = {}, // 所有notebook信息都存在这里
Notebook.notebooks = [],
Notebook.notebookNavForListNote = "",
Notebook.notebookNavForNewNote = "",
Notebook.setCache = function(o) {
    var e = o.NotebookId;
    e && (Notebook.cache[e] || (Notebook.cache[e] = {}), $.extend(Notebook.cache[e], o))
},
Notebook.getCurNotebookId = function() {
    return Notebook.curNotebookId
},
Notebook.getCurNotebook = function() {
    return Notebook.cache[Notebook.curNotebookId]
},

// e是-1，就是minus
// e是+1，就是incr
// o是notebookId
Notebook._updateNotebookNumberNotes = function(o, e) {
    var t = this,
    N = t.getNotebook(o);
    N && (N.NumberNotes += e,
          N.NumberNotes < 0 && (N.NumberNotes = 0), // 防止小于0
          $("#numberNotes_" + o).html(N.NumberNotes) // 更新网页上的数字
         )
},

Notebook.incrNotebookNumberNotes = function(o) {
    var e = this;
    e._updateNotebookNumberNotes(o, 1)
},

Notebook.minusNotebookNumberNotes = function(o) {
    var e = this;
    e._updateNotebookNumberNotes(o, -1)
},
Notebook.getNotebook = function(o) {
    return Notebook.cache[o]
},
Notebook.getNotebookTitle = function(o) {
    var e = Notebook.cache[o];
    return e ? e.Title: "未知"
},
    
Notebook.getTreeSetting = function(o, e) {
    function t(o, t) {
        var N = 5,
        n = $("#" + o + " #" + t.tId + "_switch"),
        a = $("#" + o + " #" + t.tId + "_ico");
        if (n.remove(), a.before(n), e ? Share.isDefaultNotebookId(t.NotebookId) || a.after($('<span class="fa notebook-setting" title="setting"></span>')) : Notebook.isAllNotebookId(t.NotebookId) || Notebook.isTrashNotebookId(t.NotebookId) || (a.after($('<span class="notebook-number-notes" id="numberNotes_' + t.NotebookId + '">' + (t.NumberNotes || 0) + "</span>")), a.after($('<span class="fa notebook-setting" title="setting"></span>'))), t.level > 1) {
            var r = "<span style='display: inline-block;width:" + N * t.level + "px'></span>";
            n.before(r)
        }
    }
    function N(o, e) {
        for (var t = 0,
        N = e.length; N > t; t++) if (e[t].drag === !1) return ! 1;
        return ! 0
    }
    function n(o, e, t, N) {
        return t ? t.drop !== !1 : !0
    }
    
    // called when dropping notebook
    function onDrop(o, e, t, N, moveType) {
//        alert("inside a");

        function filter(o) {
            return o.level == d
        }
        var draggingNotebook = t[0];
        var nodesSet;
        if (N) {
            var i, k = b.tree,
            s = {
                curNotebookId: r.NotebookId
            };
            if (i = "inner" == moveType ? N: N.getParentNode()) { // 如果拖进一个notebook，i为被放入笔记本的笔记本所对应的node并且该if为真
//                console.log("here");
//                console.log("parent is " + i.Title);
                var parentNotebookId = i.NotebookId;
                Notebook.cache[draggingNotebook.NotebookId].ParentNotebookId = parentNotebookId;
//                var curNotebook = Notebook.getCurNotebook();
//                console.log("cur is " + r.Title);
                draggingNotebook.ParentNotebookId = parentNotebookId;
                s.parentNotebookId = parentNotebookId;
                var d = i.level + 1;
//                nodesSet = k.getNodesByFilter(filter, !1, i);
//                Notebook.cache[parentNotebookId].Subs.push(draggingNotebook);
            } else nodesSet = k.getNodes();
//            s.siblings = [];
//            for (var i in nodesSet) {
//                var notebookId = nodesSet[i].NotebookId;
//                Notebook.isAllNotebookId(notebookId) || Notebook.isTrashNotebookId(notebookId) || s.siblings.push(notebookId) // 如果不是All或Trash
//            }
//            ajaxPost("/notebook/dragNotebooks", {
//                data: JSON.stringify(s)
//            }),
            setTimeout(function() {
                Notebook.changeNav()
            },
            100)
        }
    }
    var r = !o,
    b = this;
    if (e) var i = function(o, e, t) { //i是点击时的回调函数： 这里触发了Share.changeNotebook
//        alert("inside getTreeSetting");
        var N = t.NotebookId; // N是当前点击的NoteBook的Id
//        alert("Notebook Id is" + N);
        var n = $(o.target).closest(".friend-notebooks").attr("fromUserId"); // n是分享的笔记本中当前点击的notebook的UserId
//        alert("UserId Id is" + n);  
        Share.changeNotebook(n, N)
    },
    k = null;
    else var i = function(o, e, t) { 
        var N = t.NotebookId;
        Notebook.changeNotebook(N)
    },
    k = function(o) {
        var e = $(o.target).attr("notebookId");
        Notebook.isAllNotebookId(e) || Notebook.isTrashNotebookId(e) || b.updateNotebookTitle(o.target)
    };
    var setting = {
        view: {
            showLine: !1,
            showIcon: !1,
            selectedMulti: !1,
            dblClickExpand: !1,
            addDiyDom: t
        },
        data: {
            key: {
                name: "Title",
                children: "Subs"
            }
        },
        edit: {
            enable: !0,
            showRemoveBtn: !1,
            showRenameBtn: !1,
            drag: {
                isMove: r,
                prev: r,
                inner: r,
                next: r
            }
        },
        callback: {
            beforeDrag: N,
            beforeDrop: n,
            onDrop: onDrop, // drop时的回调函数。用于将notebook拖进另一个notebook
            onClick: i, // 点击时的回调函数
            onDblClick: k,

            // o: treeId
            // e: treeNode
            // t: name
            beforeRename: function(o, e, t, N) {
//                alert("It is run here!");
                if ("" == t) return e.IsNew ? (b.tree.removeNode(e), !0) : !1;
                if (e.Title == t) return ! 0;
                if (e.IsNew) {
                    var n = e.getParentNode(),
                    a = n ? n.NotebookId: "";
                    b.doAddNotebook(e.NotebookId, t, a)
                } else b.doUpdateNotebookTitle(e.NotebookId, t);
                return ! 0
            }
        }
    };
    return setting
},

Notebook.allNotebookId = "0", // "All"
Notebook.trashNotebookId = "-1", // "Trash"
Notebook.curNotebookIsTrashOrAll = function() {
    return Notebook.curNotebookId == Notebook.trashNotebookId || Notebook.curNotebookId == Notebook.allNotebookId
},

// display notebooks in the notebook list
// o是变量notebooks
Notebook.renderNotebooks = function(o) {
    var e = this;
    // 如果
    var trash;
    var indexOfTrash;
    (!o || "object" != typeof o || o.length < 0) && (o = []);
    for (var t = 0, N = o.length; N > t; ++t) {
        var n = o[t];
        n.Title = trimTitle(n.Title)
        if(n.NotebookId == "-1") {
            indexOfTrash = t;
            trash = n;
        }
    }
    
    // make the trash at the last
    if(trash != undefined) {
        o.splice(indexOfTrash, 1);
        // 数组o的末尾添加"trash"notebook
        o.push(trash);
    }


//    // 数组o的开头添加"Aewest"notebook
//    o = [{
//        NotebookId: Notebook.allNotebookId,
//        Title: getMsg("all"),
//        drop: !1,
//        drag: !1
//    }].concat(o),
//


    Notebook.notebooks = o; // Notebook.notebooks就是变量notebooks
    var temp = [];
    for(var i in o) {
        var curNotebook = o[i];
        if(!curNotebook.ParentNotebookId) {
            temp.push(curNotebook);
        }
    }
    e.tree = $.fn.notebookZTree.init($("#notebookList"), e.getTreeSetting(), temp); // initialize the zTree

    var a = $("#notebookList");

    // 设置hover效果（contextmenu的按钮出现）
    a.hover(function() {
            $(this).hasClass("showIcon") || $(this).addClass("showIcon")
        },

        function() {
            $(this).removeClass("showIcon")
    }),

                    //如果o不空
    isEmpty(o) || (Notebook.curNotebookId = o[0].NotebookId, e.cacheAllNotebooks(o)) //cacheAllNotebooks把o遍历放进Notebook.cache里

    Notebook.renderNav();// 用于初始contextmenu
//    Notebook.changeNotebookNavForNewNote(o[0].NotebookId) // ????
//    console.log("After renderNotebooks");
//    console.log(Notebook.cache);
},

// 把notebooks变量里的notebook全部存进Notebook.cache里(Notebook.cache是object)
// o: notebook变量
Notebook.cacheAllNotebooks = function(o) {
    var e = this;
    for (var t in o) {
        var N = o[t];
        Notebook.cache[N.NotebookId] = N,
        isEmpty(N.Subs) || e.cacheAllNotebooks(N.Subs)
    }
},

Notebook.expandNotebookTo = function(o, e) {
    var t = this,
    N = !1,
    n = t.tree;
    if (e && (n = Share.trees[e]), n) {
        var a = n.getNodeByTId(o);
        if (a) for (;;) {
            var r = a.getParentNode();
            if (!r) {
                N || Notebook.changeNotebookNav(o);
                break
            }
            n.expandNode(r, !0),
            N || (Notebook.changeNotebookNav(o), N = !0),
            a = r
        }
    }
},

Notebook.renderNav = function(o) {
    var e = this;
    e.changeNav()
},

Notebook.searchNotebookForAddNote = function(o) {
    var e = this;
    if (o) {
        var t = e.tree.getNodesByParamFuzzy("Title", o);
        t = t || [];
        var N = [];
        for (var n in t) {
            var a = t[n].NotebookId;
            e.isAllNotebookId(a) || e.isTrashNotebookId(a) || N.push(t[n])
        }
        isEmpty(N) ? $("#notebookNavForNewNote").html("") : $("#notebookNavForNewNote").html(e.getChangedNotebooks(N))
    } else $("#notebookNavForNewNote").html(e.everNavForNewNote)
},
Notebook.searchNotebookForList = function(o) {
    var e = this,
    t = $("#notebookListForSearch"),
    N = $("#notebookList");
    if (o) {
        t.show(),
        N.hide();
        var n = e.tree.getNodesByParamFuzzy("Title", o);
        if (log("search"), log(n), isEmpty(n)) t.html("");
        else {
            var a = e.getTreeSetting(!0);
            e.tree2 = $.fn.notebookZTree.init(t, a, n)
        }
    } else e.tree2 = null,
    t.hide(),
    N.show(),
    $("#notebookNavForNewNote").html(e.everNavForNewNote)
},
Notebook.getChangedNotebooks = function(o) {
    for (var e = this,
    t = "",
    N = o.length,
    n = 0; N > n; ++n) {
        var a = o[n],
        r = "";
        isEmpty(a.Subs) || (r = "dropdown-submenu");
        var b = tt('<li role="presentation" class="clearfix ?"><div class="new-note-left pull-left" title="为该笔记本新建笔记" href="#" notebookId="?">?</div><div title="为该笔记本新建markdown笔记" class="new-note-right pull-left" notebookId="?">M</div>', r, a.NotebookId, a.Title, a.NotebookId);
        isEmpty(a.Subs) || (b += "<ul class='dropdown-menu'>", b += e.getChangedNotebooks(a.Subs), b += "</ul>"),
        b += "</li>",
        t += b
    }
    return t
},
Notebook.everNavForNewNote = "",
Notebook.everNotebooks = [],

// 更新note的contxtmenu
Notebook.changeNav = function() {
    var o = Notebook;
    var notebookNodes = Notebook.tree.getNodes();
    var slicedNotebookNodes = [];
    for(var i in notebookNodes) {
        var curNotebookNode = notebookNodes[i];
        if(curNotebookNode.NotebookId != "0" && curNotebookNode.NotebookId != "-1") {
            slicedNotebookNodes.push(curNotebookNode);
        }
    }
//    t = e.slice(1, -1), // 去头去尾
    var N = o.getChangedNotebooks(slicedNotebookNodes);
    o.everNavForNewNote = N;
    o.everNotebooks = slicedNotebookNodes;
    $("#notebookNavForNewNote").html(N);
    Note.initContextmenu();
    Share.initContextmenu(Note.notebooksCopy);
},

// Notebook.renderShareNotebooks = function(o, e) {
//     if (!isEmpty(o) && e && "object" == typeof e && !(e.length < 0)) {
//         var t = $("#shareNotebooks"),
//         N = {};
//         for (var n in e) {
//             var a = e[n];
//             N[a.UserId] = a
//         }
//         for (var n in o) {
//             var r = o[n],
//             a = N[r.UserId] || {
//                 ShareNotebooks: []
//             };
//             a.ShareNotebooks = [{
//                 NotebookId: "-2",
//                 Title: "默认共享"
//             }].concat(a.ShareNotebooks);
//             var b = r.Username || r.Email,
//             i = tt('<div class="folderNote closed"><div class="folderHeader"><a><h1 title="? 的共享"><i class="fa fa-angle-right"></i>?</h1></a></div>', b, b),
//             k = '<ul class="folderBody">';
//             for (var s in a.ShareNotebooks) {
//                 var d = a.ShareNotebooks[s];
//                 k += tt('<li><a notebookId="?">?</a></li>', d.NotebookId, d.Title)
//             }
//             k += "</ul>",
//             t.append(i + k + "</div>")
//         }
//     }
// },
Notebook.selectNotebook = function(o) {
    $(".notebook-item").removeClass("curSelectedNode"),
    $(o).addClass("curSelectedNode")
},
Notebook.changeNotebookNavForNewNote = function(o, e) {
    if (!o) {
        var t = Notebook.notebooks[0];
        o = t.NotebookId,
        e = t.Title
    }
    if (!e) {
        var t = Notebook.cache[0];
        e = t.Title
    }
    if (Notebook.isAllNotebookId(o) || Notebook.isTrashNotebookId(o)) {
        if (!$("#curNotebookForNewNote").attr("notebookId") && Notebook.notebooks.length > 2) {
            var t = Notebook.notebooks[1];
            o = t.NotebookId,
            e = t.Title,
            Notebook.changeNotebookNavForNewNote(o, e)
        }
    } else $("#curNotebookForNewNote").html(e).attr("notebookId", o)
},
Notebook.toggleToMyNav = function(o, e) {
    $("#sharedNotebookNavForListNav").hide(),
    $("#myNotebookNavForListNav").show(),
    $("#newMyNote").show(),
    $("#newSharedNote").hide(),
    $("#tagSearch").hide()
},
Notebook.changeNotebookNav = function(o) {
    Notebook.curNotebookId = o,
    Notebook.toggleToMyNav(),
    Notebook.selectNotebook($(tt('#notebook [notebookId="?"]', o)));
    var e = Notebook.cache[o];
    e && ($("#curNotebookForListNote").html(e.Title), Notebook.changeNotebookNavForNewNote(o, e.Title))
},
Notebook.isAllNotebookId = function(o) {
    return o == Notebook.allNotebookId
},
Notebook.isTrashNotebookId = function(o) {
    return o == Notebook.trashNotebookId
},
Notebook.curActiveNotebookIsAll = function() {
    return Notebook.isAllNotebookId($("#notebookList .curSelectedNode").attr("notebookId"))
},
Notebook.curActiveNotebookIsTrash = function() {
    return Notebook.isTrashNotebookId($("#notebookList .curSelectedNode").attr("notebookId"))
},
Notebook.changeNotebookSeq = 1,

// o: 目标notebook的ID
// e: function: 调用时给的function为（Note.renderNotes(t), Note.changeNoteForPjax(e, !1, !0))
Notebook.changeNotebook = function(o, e) {
    // alert("Note.changeNotebook activated");
    var t = this;
    Notebook.changeNotebookNav(o),
    Notebook.curNotebookId = o,
    Note.curChangedSaveIt(),
    Note.clearAll();
    var N = "/note/listNotes/",
    n = {
        notebookId: o
    };
    if (Notebook.isTrashNotebookId(o)) { // 如果要转到“Trash”
        N = "/note/listTrashNotes";
        n = {};
        cacheNotes = Note.getNotesByNotebookId(-1);//将当前notebook里的note存进cacheNotes里
        return void(e ? e(cacheNotes) : Note.renderNotesAndFirstOneContent(cacheNotes)) //这里加载note: 调用传递过来的function e
    }
//    n = {};
    else if (Notebook.isAllNotebookId(o)) { //如果要转到"All"
        n = {};
        cacheNotes = Note.getNotesByNotebookId(); //将当前notebook里的note存进cacheNotes里
//        !isEmpty(cacheNotes))
        return void(e ? e(cacheNotes) : Note.renderNotesAndFirstOneContent(cacheNotes)) //这里加载note: 调用传递过来的function e
    } else {
//        alert("changeNotebook");
        cacheNotes = Note.getNotesByNotebookId(o); // 目标notebook下所有notes
        var a = Notebook.cache[o], // 目标notebook
        r = cacheNotes ? cacheNotes.length: 0; // 检查一下，防止数量不对
        if (r == a.NumberNotes)
            return void(e ? e(cacheNotes) : Note.renderNotesAndFirstOneContent(cacheNotes)); // 这里是正常情况的更新！！！
        // 如果数量不一致
//        alert("number is wrong"),
        Note.clearCacheByNotebookId(o);
//        log("数量不一致")
    }

    t.showNoteAndEditorLoading(),
    t.changeNotebookSeq++,
    function(o) {
        ajaxGet(N, n,
        function(N) {
            return o != t.changeNotebookSeq ? (log("notebook changed too fast!"), void log(N)) : (e ? e(N) : Note.renderNotesAndFirstOneContent(N), void t.hideNoteAndEditorLoading())
        })
    } (t.changeNotebookSeq)
},
Notebook.showNoteAndEditorLoading = function() {
    $("#noteAndEditorMask").show()
},
Notebook.hideNoteAndEditorLoading = function() {
    $("#noteAndEditorMask").hide()
},
Notebook.isCurNotebook = function(o) {
    return "active" == $(tt('#notebookList [notebookId="?"], #shareNotebooks [notebookId="?"]', o, o)).attr("class")
},
Notebook.changeNotebookForNewNote = function(o) {
    if (!Notebook.isTrashNotebookId(o) && !Notebook.isAllNotebookId(o)) {
        Notebook.changeNotebookNav(o, !0),
        Notebook.curNotebookId = o;
        Note.renderNotes(o, !0);
//        var e = "/note/listNotes/",
//        t = {
//            notebookId: o
//        };
//        ajaxGet(e, t,
//        function(o) {
//            Note.renderNotes(o, !0)
//        })
    }
},
    
// sharetofriends被点击是触发，用于弹出dialog
// o是被点击的notebook html对象
Notebook.listNotebookShareUserInfo = function(o) {
//    alert("listNotebookShareUserInfo activated");
    var notebookId = $(o).attr("notebookId");
    Share.dialogNoteOrNotebookId = notebookId;
    Share.dialogIsNote = 0;
    showDialogRemote("/share/listNotebookShareUserInfo", { // 展示display dialog
        notebookId: notebookId
    });
},
Notebook.shareNotebooks = function(o) {
    var e = $(o).text();
    showDialog("dialogShareNote", {
        title: "分享笔记本给好友-" + e
    }),
    setTimeout(function() {
        $("#friendsEmail").focus()
    },
    500);
    var t = $(o).attr("notebookId");
    shareNoteOrNotebook(t, !1)
},
//Notebook.setNotebook2Blog = function(o) {
//    var e = $(o).attr("notebookId"),
//    t = Notebook.cache[e],
//    N = !0;
//    void 0 != t.IsBlog && (N = !t.IsBlog),
//    Notebook.curNotebookId == e ? N ? $("#noteList .item-blog").show() : $("#noteList .item-blog").hide() : Notebook.curNotebookId == Notebook.allNotebookId && $("#noteItemList .item").each(function() {
//        var o = $(this).attr("noteId"),
//        t = Note.cache[o];
//        t.NotebookId == e && (N ? $(this).find(".item-blog").show() : $(this).find(".item-blog").hide())
//    }),
//    ajaxPost("/notebook/setNotebook2Blog", {
//        notebookId: e,
//        isBlog: N
//    },
//    function(o) {
//        o && (Note.setAllNoteBlogStatus(e, N), Notebook.setCache({
//            NotebookId: e,
//            IsBlog: N
//        }))
//    })
//},
Notebook.updateNotebookTitle = function(o) {
    var e = Notebook,
    t = $(o).attr("notebookId");
    e.tree2 ? e.tree2.editName(e.tree2.getNodeByTId(t)) : e.tree.editName(e.tree.getNodeByTId(t))
},
Notebook.doUpdateNotebookTitle = function(o, e) {
    var t = Notebook;
    ajaxPost("/notebook/updateNotebookTitle", {
        notebookId: o,
        title: e
    },
    function(N) {
        if (Notebook.cache[o].Title = e, Notebook.changeNav(), t.tree2) {
            var n = t.tree.getNodeByTId(o);
            n.Title = e,
            t.tree.updateNode(n)
        }
    })
},
Notebook.addNotebookSeq = 1,


Notebook.addNotebook = function() {
    var o = Notebook;
    $("#myNotebooks").hasClass("closed") && $("#myNotebooks .folderHeader").trigger("click"),
    o.tree.addNodes(null, {
        Title: "",
        NotebookId: getObjectId(),
        IsNew: !0
    },
    !0, !0)
},
    
// o: 分配的notebookId
// e: notebook的title
// t: parentNoteBookId
Notebook.doAddNotebook = function(o, e, t) {
    var N = Notebook;
    var newNotebook = {
        IsTrash: false,
        CreatedTime: getCurDate(),
        UpdateTime: getCurDate(),
        NumberNotes: 0,
        IsTrash: false,
        IsDeleted: false,
        NotebookId: o,
        Title: e,
        ParentNotebookId: t,
        Subs: []
    };
    Notebook.cache[newNotebook.NotebookId] = newNotebook;
    var t = N.tree.getNodeByTId(o);
    $.extend(t, newNotebook),
    t.IsNew = !1,
    Notebook.changeNotebook(o),
    Notebook.changeNav();
    showMsg("New notebook created");
},

Notebook.addChildNotebook = function(o) {
    var e = Notebook;
    $("#myNotebooks").hasClass("closed") && $("#myNotebooks .folderHeader").trigger("click");
    var t = $(o).attr("notebookId");
    e.tree.addNodes(e.tree.getNodeByTId(t), {
        Title: "",
        NotebookId: getObjectId(),
        IsNew: !0
    },
    !1, !0)
},

// delete the notebook
Notebook.deleteNotebook = function(o) {
    var notebookCopy = Notebook,
    curNotebookId = $(o).attr("notebookId");
    var curNotebookTitle = Notebook.cache[curNotebookId].Title;
    if(curNotebookTitle) {
        bootbox.confirm("Please confirm to delete notebook: " + curNotebookTitle, function(result) {
            if(result) {
                // remove the notebook from the zTree
                notebookCopy.tree.removeNode(notebookCopy.tree.getNodeByTId(curNotebookId));
                if(notebookCopy.tree2) {
                    notebookCopy.tree2.removeNode(notebookCopy.tree2.getNodeByTId(curNotebookId));
                }

                // if the notebook contains subnotebooks, delete them all
                var subNotebooks = Notebook.cache[curNotebookId].Subs;
                if(subNotebooks) {
                    for(var i in subNotebooks) {
                        Notebook.deleteNotebookHelper(subNotebooks[i].NotebookId);
                    }
                }
                                  
                // if the notebook to delete is a subnotebook of another notebook, delte it in that notebook
                var parentNotebook = Notebook.cache[Notebook.cache[curNotebookId].ParentNotebookId];
                if(parentNotebook) {
                    var subNotebooks = parentNotebook.Subs;
                    for(var i in subNotebooks) {
                        if(subNotebooks.NotebookId == "curNotebookId") {
                            subNotebooks.splice(i,1);
                        }
                    }
                }

                // delete the notebook
                delete Notebook.cache[curNotebookId];
                Note.clearCacheByNotebookId(curNotebookId);
                delete Note.cacheByNotebookId[curNotebookId];

                // delete notes in the notebook
                for(var i in Note.cache) {
                    var curNote = Note.cache[i];
                    if(curNote.NotebookId == curNotebookId) {
                        delete Note.cache[i];
                    }
                }
                
                Notebook.changeNav();
            }
        }); 
    }
},

// Used when deleting hiercharical notebooks
Notebook.deleteNotebookHelper = function(curNotebookId) {
    // if the notebook contains subnotebooks, delete them
    var subNotebooks = Notebook.cache[curNotebookId].Subs;
    if(subNotebooks) {
        for(var i in subNotebooks) {
            Notebook.deleteNotebookHelper(subNotebooks[i].NotebookId);
        }
    }

//    // if the notebook to delete is a subnotebook of another notebook, delte it in that notebook
//    var parentNotebook = Notebook.cache[Notebook.cache[curNotebookId].ParentNotebookId];
//    if(parentNotebook) {
//        var subNotebooks = parentNotebook.Subs;
//        for(var i in subNotebooks) {
//            if(subNotebooks.NotebookId == "curNotebookId") {
//                subNotebooks.splice(i,1);
//            }
//        }
//    }

    // delete the notebook
    delete Notebook.cache[curNotebookId];
    Note.clearCacheByNotebookId(curNotebookId);
    delete Note.cacheByNotebookId[curNotebookId];

    // delete notes in the notebook
    for(var i in Note.cache) {
        var curNote = Note.cache[i];
        if(curNote.NotebookId == curNotebookId) {
            delete Note.cache[i];
        }
    }
},
    
$(function() {
    function o(o) {
        var e = $(this).attr("notebookId"),
        t = Notebook.cache[e];
        if (t) {
            var N = [];
            t.IsBlog ? N.push("set2Blog") : N.push("unset2Blog"),
            Note.notebookHasNotes(e) && N.push("delete"),
            o.applyrule({
                name: "target2",
                disable: !0,
                items: N
            })
        }
    }
    function e() {
        var o = $(this).attr("notebookId");
        return ! Notebook.isTrashNotebookId(o) && !Notebook.isAllNotebookId(o)
    }
    $("#minNotebookList").on("click", "li",
    function() {
        var o = $(this).find("a").attr("notebookId");
        Notebook.changeNotebook(o)
    });
    
//    设置notebook的contextmenu
    var t = {
        width: 180,
        items: [{
            text: getMsg("shareToFriends"),
            alias: "shareToFriends",
            icon: "",
            faIcon: "fa-share-square-o",
            action: Notebook.listNotebookShareUserInfo
        },
        {
            type: "splitLine"
        },
//        {
//            text: getMsg("publicAsBlog"),
//            alias: "set2Blog",
//            faIcon: "fa-bold",
//            action: Notebook.setNotebook2Blog
//        },
//        {
//            text: getMsg("cancelPublic"),
//            alias: "unset2Blog",
//            faIcon: "fa-undo",
//            action: Notebook.setNotebook2Blog
//        },
//        {
//            type: "splitLine"
//        },
        {
            text: getMsg("addChildNotebook"),
            faIcon: "fa-sitemap",
            action: Notebook.addChildNotebook
        },
        {
            text: getMsg("rename"),
            faIcon: "fa-pencil",
            action: Notebook.updateNotebookTitle
        },
        {
            text: getMsg("delete"),
//            icon: "",
//            alias: "delete",
            faIcon: "fa-trash-o",
            action: Notebook.deleteNotebook
        }],
        onShow: o,
        onContextMenu: e,
        parent: "#notebookList ",
        children: "li a"
    },
    N = {
        width: 180,
        items: [{
            text: getMsg("shareToFriends"),
            alias: "shareToFriends",
            icon: "",
            faIcon: "fa-share-square-o",
            action: Notebook.listNotebookShareUserInfo
        },
        {
            type: "splitLine"
        },
//        {
//            text: getMsg("publicAsBlog"),
//            alias: "set2Blog",
//            faIcon: "fa-bold",
//            action: Notebook.setNotebook2Blog
//        },
//        {
//            text: getMsg("cancelPublic"),
//            alias: "unset2Blog",
//            faIcon: "fa-undo",
//            action: Notebook.setNotebook2Blog
//        },
        {
            type: "splitLine"
        },
        {
            text: getMsg("rename"),
            icon: "",
            action: Notebook.updateNotebookTitle
        },
        {
            text: getMsg("delete"),
            icon: "",
            alias: "delete",
            faIcon: "fa-trash-o",
            action: Notebook.deleteNotebook
        }],
        onShow: o,
        onContextMenu: e,
        parent: "#notebookListForSearch ",
        children: "li a"
    };
    Notebook.contextmenu = $("#notebookList li a").contextmenu(t),
    Notebook.contextmenuSearch = $("#notebookListForSearch li a").contextmenu(N),
    $("#addNotebookPlus").click(function(o) {
        o.stopPropagation(),
        Notebook.addNotebook()
    }),
    $("#notebookList").on("click", ".notebook-setting",
    function(o) {
        o.preventDefault(),
        o.stopPropagation();
        var e = $(this).parent();
        Notebook.contextmenu.showMenu(o, e)
    }),
    $("#notebookListForSearch").on("click", ".notebook-setting",
    function(o) {
        o.preventDefault(),
        o.stopPropagation();
        var e = $(this).parent();
        Notebook.contextmenuSearch.showMenu(o, e)
    })
});

// share note触发
function addShareNoteOrNotebook(e) {
    console.log(e);
    var t = "#tr" + e,
    shareId = Share.dialogNoteOrNotebookId, // 要share的note或notebook的ID
    emailAddress = isEmailFromInput(t + " #friendsEmail", "#shareMsg", getMsg("friendEmailMissing")); // input emial address
    if (emailAddress) {
        var shareOption = $(t + ' input[name="perm' + e + '"]:checked').val() || 0; //1代表可写，a为0代表只读
        var n = shareOption;
        var s = "/share/addShareNote";
        var shareData = {
            NoteId: shareId,
            Email: emailAddress, 
            Perm: shareOption
        };
//        console.log("a is: " + a);
//        console.log("email is: " + emailAddress);
        console.log("share id is " + shareId);
        console.log("senderUserId is " + UserId); 

        hideAlert("#shareMsg");
        if(!Share.dialogIsNote) { // 如果share的是notebook
            var shareData = { // 如果share的是notebook
                SenderUserId: UserId,
                NotebookId: shareId,
                Email: emailAddress, // recevier email address
                Perm: shareOption
            };
            var stringifiedJson = JSON.stringify(shareData);
            var url = baseUrl + "share/addShareNotebook";
             $.ajax({
                type: 'POST', 
                url: url,
                data: stringifiedJson,
                contentType: "text/plain",
                success: function (data) {
                    var res = jQuery.parseJSON(data);
                    if (res.status == "success") { // 如果成功
                        console.log("success");
                        var e = {}
                        e.id = "test";
                        var a = tt("<td>?</td>", "#");
                        a += tt("<td>?</td>", emailAddress),
                        a += tt('<td><a href="#" noteOrNotebookId="?" toUserId="?" class="btn btn-warning delete-share">' + getMsg("delete") + "</a></td>", shareId, e.Id),
                        $(t).html(a);
                        showAlert("#shareMsg", getMsg("ShareSuccess"), "success");
                    } else { // 如果失败
                        showAlert("#shareMsg", res.msg, "danger");
                    }
                },
                error: function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                    $('#lblResponse').html(getMsg("ServerCrashes"));
                }
            });
        }
        else { // share的是note
            console.log("share note");
            var shareData = { // 如果share的是note
                SenderUserId: UserId,
                NoteId: shareId,
                Email: emailAddress,
                Perm: shareOption
            };
            var stringifiedJson = JSON.stringify(shareData);
            var url = baseUrl + "share/addShareNote";
             $.ajax({
                type: 'POST', 
                url: url,
                data: stringifiedJson,
                contentType: "text/plain",
                success: function (data) {
                    var res = jQuery.parseJSON(data);
                    if (res.status == "success") { // 如果成功
                        console.log("success");
                        var ToUserId = res.ToUserId;
//                        var thisShareNoteDefault = shareNotebookDefault[ToUserId];
                        if( shareNotebookDefault[ToUserId] == undefined) {
                            shareNotebookDefault[ToUserId] = [];
                        }
                        var isSharedAlready = 0;
                        for(var i in shareNotebookDefault[ToUserId]) {
                            var curShareNoteData = shareNotebookDefault[ToUserId][i];
                            if(curShareNoteData.NoteId == shareData.NoteId) {
                                showAlert("#shareMsg", getMsg("DoubleShared"), "danger");
                                isSharedAlready = 1;
                                break;
                            }
                        }
                        if(!isSharedAlready) {
                            shareNotebookDefault[ToUserId].push(shareData);
                            var e = {}
                            e.id = "test";
                            var a = tt("");
                            a += tt("<td>?</td>", emailAddress),
                            //a += tt('<td><a href="#" noteOrNotebookId="?" perm="?" toUserId="?" title="' + getMsg("clickToChangePermission") + '" class="btn btn-default change-perm">?</a></td>', shareId, n, e.Id, n && "0" != n ? getMsg("writable") : getMsg("readOnly")),
                            a += tt('<td colspan = "2" id = "cancelbuttontd"><a href="#" noteOrNotebookId="?" id = "cancelbutton" toUserId="?" class="btn btn-warning delete-share"><i class="fa fa-user-times" aria-hidden="true"></i> Cancel</a></td>"', shareId, e.Id),
                            $(t).html(a);
                            showAlert("#shareMsg", getMsg("ShareSuccess"), "success");
                        }
                    } else { // 如果失败
//                        var s = UrlPrefix + "/register?iu=" + UserInfo.Username;
//                        showAlert("#shareMsg", getMsg("friendNotExits", [getMsg("app"), '<input style="background: none;border: 1px solid #ccc;width: 300px;padding: 3px;border-radius: 3px;outline: none;" onclick="$(this).focus().select()" type="text" value="' + s + '" />']) + "</a> <br /> " + getMsg("sendInviteEmailToYourFriend") + ', <a href="#" onclick="sendRegisterEmail(\'' + emailAddress + "')\">" + getMsg("send"), "warning")
                        showAlert("#shareMsg", res.msg, "danger");
                    }
                },
                error: function (xhr, status, error) {
                    console.log('Error: ' + error.message);
                    showAlert("#shareMsg", getMsg("ServerCrashes"), "danger");
                }
            });
            
            
        }
    }
}
        
//        post(s, i,
//        function(e) { // callback
//            alert("here!");
//            console.log("e is: " + e);
//        
//            var e = e[emailAddress];
//            if (e) if (e.Ok) { // 如果成功
//                var a = tt("<td>?</td>", "#");
//                a += tt("<td>?</td>", emailAddress),
//                a += tt('<td><a href="#" noteOrNotebookId="?" perm="?" toUserId="?" title="' + getMsg("clickToChangePermission") + '" class="btn btn-default change-perm">?</a></td>', o, n, e.Id, n && "0" != n ? getMsg("writable") : getMsg("readOnly")),
//                a += tt('<td><a href="#" noteOrNotebookId="?" toUserId="?" class="btn btn-warning delete-share">' + getMsg("delete") + "</a></td>", o, e.Id),
//                $(t).html(a)
//            } else { // 如果失败
//                var s = UrlPrefix + "/register?iu=" + UserInfo.Username;
//                showAlert("#shareMsg", getMsg("friendNotExits", [getMsg("app"), '<input style="background: none;border: 1px solid #ccc;width: 300px;padding: 3px;border-radius: 3px;outline: none;" onclick="$(this).focus().select()" type="text" value="' + s + '" />']) + "</a> <br /> " + getMsg("sendInviteEmailToYourFriend") + ', <a href="#" onclick="sendRegisterEmail(\'' + r + "')\">" + getMsg("send"), "warning")
//            }
//        },
//        t + " .btn-success")
//    }
        
function sendRegisterEmail(e) {
    showDialog2("#sendRegisterEmailDialog", {
        postShow: function() {
            $("#emailContent").val(getMsg("inviteEmailBody", [UserInfo.Username, getMsg("app")])),
            setTimeout(function() {
                $("#emailContent").focus()
            },
            500),
            $("#toEmail").val(e)
        }
    })
}
function deleteShareNoteOrNotebook(e) {
    $("#tr" + e).remove()
}
Share.defaultNotebookId = "share0",
Share.defaultNotebookTitle = getMsg("defaultShare"),
Share.sharedUserInfos = {},
Share.userNavs = {},
Share.notebookCache = {},
Share.cache = {}, // share的note
Share.dialogIsNote = !1,
Share.setCache = function(e) {
    e && e.NoteId && (Share.cache[e.NoteId] = e)
},
Share.getNote = function(t) {
    var e = this;
    return e.cache[t]
},
Share.getNotebooksForNew = function(e, t) {
    for (var o = this,
    r = "",
    a = t.length,
    n = 0; a > n; ++n) {
        var s = t[n];
        s.IsShared = !0,
        s.UserId = e,
        o.notebookCache[s.NotebookId] = s;
        // Notebook.cache[s.NotebookId] = s;
        var i = "",
        d = !1;
        if (!isEmpty(s.Subs)) {
            log(11),
            log(s.Subs);
            var d = o.getNotebooksForNew(e, s.Subs);
            d && (i = "dropdown-submenu")
        }
        var h = "";
        if (s.Perm) {
            var h = tt('<li role="presentation" class="clearfix ?" userId="?" notebookId="?"><div class="new-note-left pull-left" title="为该笔记本新建笔记" href="#">?</div><div title="为该笔记本新建markdown笔记" class="new-note-right pull-left">M</div>', i, e, s.NotebookId, s.Title);
            d && (h += "<ul class='dropdown-menu'>", h += d, h += "</ul>"),
            h += "</li>"
        }
        r += h
    }
    return r
},
Share.trees = {},
    
// render分享的笔记本
// e: shareUserInfos
// t: shareNotebooks
Share.renderShareNotebooks = function(e, t) {
    console.log("before");
    console.log(Notebook.cache);
//    alert("renderShareNotebooks");
    function o(e) {}
    function r() {
        var e = $(this).attr("notebookId");
        return ! Share.isDefaultNotebookId(e)
    }
    var a = Share;
    if (!isEmpty(e)) { 
        (!t || "object" != typeof t || t.length < 0) && (t = {});
//        alert("in");              
        var n = $("#shareNotebooks");

        // 将笔记本添加进shareNotebooks里
        for (var s in e) {
            var i = e[s], // 每个sharedUser
            d = t[i.UserId] || []; // 数组，属于该sharedUser的shared笔记本（不包含default notebook）
            var userNotebooks = [{ // 将default share notebook添加进每个里面
                NotebookId: a.defaultNotebookId,
                Title: Share.defaultNotebookTitle
            }].concat(d);
            a.notebookCache[a.defaultNotebookId] = userNotebooks[0];
            var h = i.Username || i.Email; // 当前share user的用户名或邮箱地址
            i.Username = h,
            Share.sharedUserInfos[i.UserId] = i;
            var l = i.UserId,
            c = tt('<li class="each-user"><div class="friend-header" fromUserId="?"><i class="fa fa-angle-down"></i><span>?</span> <span class="fa notebook-setting" title="setting"></span> </div>', i.UserId, h),
            N = "friendContainer_" + l,
            u = '<ul class="friend-notebooks ztree" id="' + N + '" fromUserId="' + l + '"></ul>';
//            alert("inserted");
            n.append(c + u + "</li>"), // 添加进ul中
            a.trees[l] = $.fn.notebookZTree.init($("#" + N), Notebook.getTreeSetting(!0, !0), userNotebooks),
            a.userNavs[l] = {
                forNew: a.getNotebooksForNew(l, d)
            },
            log(a.userNavs);
            console.log(Notebook.cache);
        }
        $(".friend-notebooks").hover(function() {
            $(this).hasClass("showIcon") || $(this).addClass("showIcon")
        },
        function() {
            $(this).removeClass("showIcon")
        }),
        $(".friend-header i").click(function() {
            var e = $(this),
            t = $(this).parent().next();
            t.is(":hidden") ? (t.slideDown("fast"), e.removeClass("fa-angle-right fa-angle-down").addClass("fa-angle-down")) : (t.slideUp("fast"), e.removeClass("fa-angle-right fa-angle-down").addClass("fa-angle-right"))
        });
        var f = {
            width: 180,
            items: [{
                text: getMsg("deleteSharedNotebook"),
                icon: "",
                faIcon: "fa-trash-o",
                action: Share.deleteShareNotebook
            }],
            onShow: o,
            onContextMenu: r,
            parent: "#shareNotebooks",
            children: ".notebook-item"
        },
        b = $("#shareNotebooks").contextmenu(f),
        k = {
            width: 180,
            items: [{
                text: "Delete shared user",
                icon: "",
                faIcon: "fa-trash-o",
                action: Share.deleteUserShareNoteAndNotebook
            }],
            parent: "#shareNotebooks",
            children: ".friend-header"
        },
        g = $("#shareNotebooks").contextmenu(k);
        $(".friend-header").on("click", ".notebook-setting",
        function(e) {
            e.preventDefault(),
            e.stopPropagation();
            var t = $(this).parent();
            g.showMenu(e, t)
        }),
        $("#shareNotebooks .notebook-item").on("click", ".notebook-setting",
        function(e) {
            e.preventDefault(),
            e.stopPropagation();
            var t = $(this).parent();
            b.showMenu(e, t)
        })
    }
},
    
Share.isDefaultNotebookId = function(e) {
    return Share.defaultNotebookId == e
},
Share.toggleToSharedNav = function(e, t) {
    $("#curNotebookForListNote").html(Share.notebookCache[t].Title + "(" + Share.sharedUserInfos[e].Username + ")");
    var o = Share.userNavs[e].forNew;
    if (o) {
        $("#notebookNavForNewSharedNote").html(o);
        var r = "",
        a = "";
        if (Share.notebookCache[t].Perm) r = t,
        a = Share.notebookCache[t].Title;
        else {
            var n = $("#notebookNavForNewSharedNote li").eq(0);
            r = n.attr("notebookId"),
            a = n.find(".new-note-left").text()
        }
        $("#curNotebookForNewSharedNote").html(a + "(" + Share.sharedUserInfos[e].Username + ")"),
        $("#curNotebookForNewSharedNote").attr("notebookId", r),
        $("#curNotebookForNewSharedNote").attr("userId", e),
        $("#newSharedNote").show(),
        $("#newMyNote").hide()
    } else $("#newMyNote").show(),
    $("#newSharedNote").hide();
    $("#tagSearch").hide()
},
    
// 点击share里notebook时触发
Share.firstRenderShareNote = function(e, t, o) {
   // alert("firstRenderShareNote activated");
    $("#myShareNotebooks .folderHeader").trigger("click"),
    Notebook.expandNotebookTo(t, e),
    Share.changeNotebook(e, t,
    function(e) {
        Note.renderNotes(e),
        Note.changeNoteForPjax(o, !1, !1)
    })
},

// 从服务器shared notebook！
// e是目标notebook的userId
// t是目标notebook的notebookId
Share.changeNotebook = function(e, t, o) {
    var r = this;
    Notebook.curNotebookId = t;
    var a = $(tt('#friendContainer_? a[notebookId="?"]', e, t));
    0 == a.length ? (Notebook.selectNotebook($(tt('#friendContainer_? a[notebookId="?"]', e, r.defaultNotebookId))), t = r.defaultNotebookId) : Notebook.selectNotebook(a),
    Share.toggleToSharedNav(e, t),
    Note.curChangedSaveIt(),
    Note.clearAll();
    
//    var data = {
//        "UserId": e
//    };
//    var UserId = e;
    
//    var stringifiedJson = JSON.stringify(data);
    var url = baseUrl + 'share/listShareNotes';
    // var notebookId = 
    $.ajax({
        type: 'GET',
        url: url,
        data: "UserId=" + e + "&NotebookId=" + t + "&CurUserId=" + UserId,
        contentType: "text/plain",
        success: function (data) {
            var res = jQuery.parseJSON(data);
//            alert(res.msg);
            if(res.status == "fail") {
                bootbox.alert(res.msg, function() {
                });
            } 
            else {
                console.log(res);
            
                o ? o(e) : (Note.renderNotes(res, !1, !0), isEmpty(res) || Note.changeNoteForPjax(res[0].NoteId, !0, !1))
            }
        },
        error: function (xhr, status, error) {
            bootbox.alert(getMsg("ServerCrashes"), function() {
            });
        }
    });
    
    
//    var n = "/share/listShareNotes",
//    s = {
//        userId: e
//    };
//    Share.isDefaultNotebookId(t) || (s.notebookId = t),
//    ajaxGet(n, s, // 如果目标notebook不是default，s.notebookId则为目标notebookId，否则为空
//    function(e) { //e是传回的notebook
//        s.notebookId,
//        o ? o(e) : (Note.renderNotes(e, !1, !0), isEmpty(e) || Note.changeNoteForPjax(e[0].NoteId, !0, !1))
//    })
},
    
Share.hasUpdatePerm = function(e) {
    var t = Share.cache[e];
    return t || (t = Note.getNote(e)),
    t && t.Perm ? !0 : !1
},
    
//删除分享的notebook
Share.deleteShareNotebook = function(e) {
    var thisShareNotebookId = $(e).attr("notebookId");
    var thisFromUserId = $(e).closest(".friend-notebooks").attr("fromUserId");
    
    var thisUserShareNotebooks = shareNotebooks[thisFromUserId];
    var deleteIndex = -1;
    for(var i in thisUserShareNotebooks) {
        var curNotebook = thisUserShareNotebooks[i];
        if(curNotebook.NotebookId == thisShareNotebookId) {
            deleteIndex = i;
            break;
        }
    }
    var thisShareNotebook = {};
    if(deleteIndex >= 0) {
        thisShareNotebook = thisUserShareNotebooks[deleteIndex];
        if(thisShareNotebook) {
            var thisShareNotebookTitle = thisShareNotebook.Title;
            bootbox.confirm("Please confirm to delete this share notebook: " + thisShareNotebookTitle, function(result) {
                if(result) {
                    $(e).parent().remove();
                    thisUserShareNotebooks.splice(deleteIndex, 1);
                    shareNotebooks[thisFromUserId] = thisUserShareNotebooks;
                }
            }); 
        }      
    }
},
    
Share.deleteShareNote = function(e) {
    var t = $(e).attr("noteId"),
    o = $(e).attr("fromUserId");
    ajaxGet("/share/DeleteShareNoteBySharedUser", {
        noteId: t,
        fromUserId: o
    },
    function(t) {
        t && $(e).remove()
    })
},
    
// delete the shared user
Share.deleteUserShareNoteAndNotebook = function(e) {
    var thisFromUserId = $(e).attr("fromUserId");
    for(var i in sharedUserInfos) {
        if(sharedUserInfos[i].UserId == thisFromUserId) {
            bootbox.confirm("Please confirm to delete the share user: " + sharedUserInfos[i].Username, function(result) {
                if(result) {
                    $(e).parent().remove(); // remove it from the ztree
                    sharedUserInfos.splice(i,1); // remove the share user
                    
                    // remove the notebooks belong to this share user
                    delete shareNotebooks[thisFromUserId];
                }
            });
            break;
        }
    }    
},
    
Share.changeNotebookForNewNote = function(e) {
//    alert("changeNotebookForNewNote");
    Notebook.selectNotebook($(tt('#shareNotebooks [notebookId="?"]', e)));
    var t = Share.notebookCache[e].UserId;
    Share.toggleToSharedNav(t, e);
    var o = "/share/listShareNotes",
    r = {
        userId: t,
        notebookId: e
    };
    ajaxGet(o, r,
    function(e) {
        Note.renderNotes(e, !0, !0)
    })
},
    
Share.deleteSharedNote = function(e, t) {
    Note.deleteNote(e, t, !0)
},
Share.copySharedNote = function(e, t) {
    Note.copyNote(e, t, !0)
},
Share.contextmenu = null,
Share.initContextmenu = function(e) {
    function t(e) {
        var t = $(this).attr("noteId"),
        o = Note.getNote(t),
        r = [];
        (Note.inBatch || !o) &&
//        !o && // Note.inBatch always is false
            r.push("delete"),
        !o || o.Perm && o.CreatedUserId == UserInfo.UserId || r.push("delete"),
        e.applyrule({
            name: "target...",
            disable: !0,
            items: r
        })
    }
    Share.contextmenu && Share.contextmenu.destroy();
    var o = {
        width: 180,
        items: [{
            text: getMsg("copyToMyNotebook"),
            alias: "copy",
            faIcon: "fa-copy",
            type: "group",
            width: 180,
            items: e
        },
        {
            type: "splitLine"
        },
        {
            text: getMsg("delete"),
            alias: "delete",
            icon: "",
            faIcon: "fa-trash-o",
            action: Share.deleteSharedNote
        }],
        onShow: t,
        parent: "#noteItemList",
        children: ".item-shared"
    };
    Share.contextmenu = $("#noteItemList .item-shared").contextmenu(o)
},

$(function() {
    $("#noteItemList").on("click", ".item-shared .item-setting",
    function(e) {
        e.preventDefault(),
        e.stopPropagation();
        var t = $(this).parent();
        Share.contextmenu.showMenu(e, t)
    }),
    $("#newSharedNoteBtn").click(function() {
        var e = $("#curNotebookForNewSharedNote").attr("notebookId"),
        t = $("#curNotebookForNewSharedNote").attr("userId");
        Note.newNote(e, !0, t)
    }),
    $("#newShareNoteMarkdownBtn").click(function() {
        var e = $("#curNotebookForNewSharedNote").attr("notebookId"),
        t = $("#curNotebookForNewSharedNote").attr("userId");
        Note.newNote(e, !0, t, !0)
    }),
    $("#notebookNavForNewSharedNote").on("click", "li div",
    function() {
        var e = $(this).parent().attr("notebookId"),
        t = $(this).parent().attr("userId");
        "M" == $(this).text() ? Note.newNote(e, !0, t, !0) : Note.newNote(e, !0, t)
    }),
    $("#leanoteDialogRemote").on("click", ".change-perm",
    function() {
        var e = this,
        t = $(this).attr("perm"),
        o = $(this).attr("noteOrNotebookId"),
        r = $(this).attr("toUserId"),
        a = getMsg("writable"),
        n = "1";
        "1" == t && (a = getMsg("readOnly"), n = "0");
        var s = "/share/updateShareNotebookPerm",
        i = {
            perm: n,
            toUserId: r
        };
        Share.dialogIsNote ? (s = "share/updateShareNotePerm", i.noteId = o) : i.notebookId = o,
        ajaxGet(s, i,
        function(t) {
            t && ($(e).html(a), $(e).attr("perm", n))
        })
    }),
    $("#leanoteDialogRemote").on("click", ".delete-share",
    function() {
        var e = this,
        t = $(this).attr("noteOrNotebookId"),
        o = $(this).attr("toUserId"),
        r = "/share/deleteShareNotebook",
        a = {
            toUserId: o
        };
        Share.dialogIsNote ? (r = "share/deleteShareNote", a.noteId = t) : a.notebookId = t,
        ajaxGet(r, a,
        function(t) {
            t && $(e).parent().parent().remove()
        })
    });
    var e = 1;
    
    // share note配置
    $("#leanoteDialogRemote").on("click", "#addShareNotebookBtn",
    function() {
        e++;
        var t = '<tr id="tr' + e + '"><td><input id="friendsEmail" type="text" class="form-control" placeholder="Enter Account Name"/></td>';
//        t += '<td><label for="readPerm' + e + '"><input type="radio" name="perm' + e + '" checked="checked" value="0" id="readPerm' + e + '"> ' + getMsg("readOnly") + "</label>",
//        t += ' <label for="writePerm' + e + '"><input type="radio" name="perm' + e + '" value="1" id="writePerm' + e + '"> ' + getMsg("writable") + "</label></td>",
        t += ' <td id = "sharebuttontd"><button id = "sharebutton" class="btn btn-success" onclick="addShareNoteOrNotebook(' + e + ')"><i class="fa fa-share" aria-hidden="true"></i>  ' + getMsg("share") + "</button></td>",
        t += ' <td><button id = "deletebutton" class="btn btn-warning" onclick="deleteShareNoteOrNotebook(' + e + ')"><i class="fa fa-trash" aria-hidden="true"></i>  ' + getMsg("delete") + "</button>",
        t += "</td></tr>",
        $("#shareNotebookTable tbody").prepend(t),
        $("#tr" + e + " #friendsEmail").focus()
    }),
    $("#registerEmailBtn").click(function() {
        var e = $("#emailContent").val(),
        t = $("#toEmail").val();
        return e ? void post("/user/sendRegisterEmail", {
            content: e,
            toEmail: t
        },
        function(e) {
            showAlert("#registerEmailMsg", getMsg("sendSuccess"), "success"),
            hideDialog2("#sendRegisterEmailDialog", 1e3)
        },
        this) : void showAlert("#registerEmailMsg", getMsg("emailBodyRequired"), "danger")
    }),
    
    // 给groupinfo里的分享button注册事件
    $("#groupInfo").on("click", ".btn-share-or-not", function() {
        var $t = $(this);
        var $ptd = $t.closest("td");
        var $ptr = $t.closest("tr");
        var hasShared = $ptr.data('uid'); // 如果已分享，uid不为空；
        hasShared = 0; // 暂时全设为false
        var groupId = $ptr.data('id');
        var shareData = {
            GroupId: groupId,
            SenderUserId: UserId,
        };
        var url = "";

        if(!hasShared) {
            var perm = $ptr.find("input:checked").val(); // get the permission
            shareData.Perm = perm;
            
            if(Share.dialogIsNote) { // 如果是share note
                shareData.NoteId = Share.dialogNoteOrNotebookId;
                url = "share/addGroupShareNote";
            } else {
                shareData.NotebookId = Share.dialogNoteOrNotebookId;
                url = "share/addGroupShareNotebook";
            }
        } else {
            if(Share.dialogIsNote) {
                shareData.NoteId = Share.dialogNoteOrNotebookId;
                url = "/share/deleteShareNoteGroup";
            } else {
                shareData.NotebookId = Share.dialogNoteOrNotebookId;
                url = "/share/deleteShareNotebookGroup";
            }
        }


        url = baseUrl + url;
        var stringifiedJson = JSON.stringify(shareData);
        $.ajax({
            type: 'POST', 
            url: url,
            data: stringifiedJson,
            contentType: "text/plain",
            success: function (data) {
                var res = jQuery.parseJSON(data);
                if (res.status == "success") { // 如果成功
                    console.log("success");
//                    console.log(res.ToUserIds);
                    for(var i in res.ToUserIds) {
                        if(Share.dialogIsNote) {
                            var ToUserId = res.ToUserIds[i];
    //                        var thisShareNoteDefault = shareNotebookDefault[ToUserId];


                            if( shareNotebookDefault[ToUserId] == undefined) {
                                shareNotebookDefault[ToUserId] = [];
                            }
                            var isSharedAlready = 0;
                            for(var i in shareNotebookDefault[ToUserId]) {
                                var curShareNoteData = shareNotebookDefault[ToUserId][i];
                                if(curShareNoteData.NoteId == shareData.NoteId) {
                                    isSharedAlready = 1;
                                    break;
                                }
                            }
                            if(!isSharedAlready) {
                                showAlert("#shareMsg", "Sorry! This note has already been shared to the same user", "danger");
                                shareNotebookDefault[ToUserId].push(shareData);
                            }
                            showAlert("#shareMsg", getMsg("ShareSuccess"), "success");
                        }
                    }
                    
                    if(!hasShared) {
                        var text = '<button id = "successbtn" class="btn btn-success btn-share-or-not"><i class="fa fa-trash" aria-hidden="true"></i> Delete </button>';
                        $ptr.data('uid', 'xxxxxx');
                    } else {
                        var text = '<button class="btn btn-default btn-share-or-not"> Not shared </button>';
                        $ptr.data('uid', '');
                    }
                    $ptd.html(text);
                } 
                else {
                    showAlert("#shareMsg", getMsg("ShareFail"), "danger");
                }
            },
            error: function (xhr, status, error) {
                console.log('Error: ' + error.message);
                showAlert("#shareMsg", getMsg("ServerCrashes"), "danger");
//                $('#lblResponse').html(getMsg("ServerCrashes"));
            }
        });
//        ajaxPost(url, data, function(re) {
//            if(reIsOk(re)) {
//                if(!hasShared) {
//                    var text = '<button class="btn btn-success btn-share-or-not">已分享</button>';
//                    $ptr.data('uid', 'xxxxxx');
//                } else {
//                    var text = '<button class="btn btn-default btn-share-or-not">未分享</button>';
//                    $ptr.data('uid', '');
//                }
//                $ptd.html(text);
//            }
//        });
    });
});

//console.log(tinymce.activeEditor.getContent());

//transform objects to an array
function transform(obj){
    var arr = [];
    for(var item in obj){
        arr.push(obj[item]);
    }
    return arr;
}

// save before quitting
function saveIntoLocal() {
    // 放进一个大变量的方法
    var newAllAppData = {};
    newAllAppData.UserInfo = UserInfo;
    newAllAppData.notebooks = transform(Notebook.cache);
    newAllAppData.shareNotebooks = shareNotebooks;
    newAllAppData.sharedUserInfos = sharedUserInfos;
    newAllAppData.notes = transform(Note.cache);
    newAllAppData.latestNotes = transform(Note.cache);
    newAllAppData.tagsJson = clone(Tag.tags);
    newAllAppData.shareNotebookDefault = shareNotebookDefault;

//    trackingLog.add(TrackLogbook);    
    newAllAppData.trackingLog = trackingLog;
    newAllAppData.group = group;
    
    localforage.setItem("allAppData", newAllAppData, function(err, value) {
        console.log("newAllAppData saved");
    });
    
    // 最开始的方法
//    localforage.setItem("UserInfo", UserInfo, function(err, value) {
//        console.log("UserInfo saved");
//    });
//    
////    delete Notebook.cache[0];
////    delete Notebook.cache[-1];
//    localforage.setItem("notebooks", transform(Notebook.cache), function(err, value) {
//        notebooks = value;
//        console.log("notebooks saved");
//    });
//    
////    localforage.setItem("shareNotebooks", shareNotebooks, function(err, value) {
////        console.log("shareNotebooks saved");
////    });
////    
////    localforage.setItem("sharedUserInfos", sharedUserInfos, function(err, value) {
////        console.log("sharedUserInfos saved");
////    });
//
//    localforage.setItem("curNoteId", Note.curNoteId, function(err, value) {
//        console.log("curNoteId saved");
//    });
//
//    localforage.setItem("curNotebookId", Notebook.curNotebookId, function(err, value) {
//        console.log("curNotebookId saved");
//    });
//
////    localforage.setItem("curSharedNoteNotebookId", curSharedNoteNotebookId, function(err, value) {
////        console.log("curSharedNoteNotebookId saved");
////    });
//
////    localforage.setItem("curSharedUserId", curSharedUserId, function(err, value) {
////        console.log("curSharedUserId saved");
////    });
//    
//    localforage.setItem("latestNotes", transform(Note.cache), function(err, value) {
//        latestNotes = value;
//        console.log("latestNotes saved");
//    });
//    
//    localforage.setItem("notes", transform(Note.cache), function(err, value) {
//        notes = value;
//        console.log("notes saved");
//    });
//    
//    localforage.setItem("noteContentJson", noteContentJson, function(err, value) {
//        console.log("noteContentJson saved");
//    });
//
//    localforage.setItem("tagsJson", tagsJson, function(err, value) {
//        console.log("tagsJson saved");
//    });
}

// when refreshing and logging out
window.onbeforeunload = onbeforeunload_handler;

function onbeforeunload_handler(){

    saveIntoLocal(); // save locally
    Server.uploadToServer(); // save to server
    
    // for nw.js
    // if (process && process.versions['node-webkit']) {
    //     var win = require('nw.gui').Window.get();
    //     win.on('close',function() {
    //         if (window.onbeforeunload) {
    //             saveIntoLocal();
    //             Server.uploadToServer();
    //             var msg = window.onbeforeunload();
    //             if (msg) {
    //                 if (!confirm(msg)) {
    //                    return false;
    //                 }
    //             }
    //             win.close(true);
    //         }
    //     });
    // }
    // else {
    //     saveIntoLocal();
    //     Server.uploadToServer();
    //     var warning = "quit?";
    //     return warning;
    // }
}

// 深度clone
function clone(obj) {
	var o,i,j,k;
	if(typeof(obj)!="object" || obj===null)return obj;
	if(obj instanceof(Array))
	{
		o=[];
		i=0;j=obj.length;
		for(;i<j;i++)
		{
			if(typeof(obj[i])=="object" && obj[i]!=null)
			{
				o[i]=arguments.callee(obj[i]);
			}
			else
			{
				o[i]=obj[i];
			}
		}
	}
	else
	{
		o={};
		for(i in obj)
		{
			if(typeof(obj[i])=="object" && obj[i]!=null)
			{
				o[i]=arguments.callee(obj[i]);
			}
			else
			{
				o[i]=obj[i];
			}
		}
	}
 
	return o;
}

// function onunload_handler(){
//    saveIntoLocal();
//    Server.uploadToServer();
//    var warning="welcome";
//    alert(warning);

//    if (process && process.versions['node-webkit']) {
//      var win = require('nw.gui').Window.get();
//      win.on('close',function() {
//         if (window.onbeforeunload) {
//             saveIntoLocal();
//             var msg = window.onbeforeunload();
//             if (msg) {
//                 if (!confirm(msg)) {
//                    return false;
//                 }
//             }
//             win.close(true);
//         }
//      });
//    }
// }


 function listGroupInfo(o) {
//     $("#groupInfoTable").empty(); // empty the dialog first
//    
//     for(var i in group) {     
// //        dom element example:
// //        <tr data-id="56fccc7aab64415150000de4" data-uid="56d53e56ab64417fb1001e21">
// //            <td>
// //                mk
// //            </td>
// //            <td>
// //                <label><input type="radio" name="perm_56fccc7aab64415150000de4" checked="checked" value="0" class="group-perm"> Read only</label> 
// //                <label><input type="radio" name="perm_56fccc7aab64415150000de4" value="1" class="group-perm"> Writable</label>
// //            </td>
// //            <td>
// //                <button class="btn btn-default btn-share-or-not">Not shared</button>
// //            </td>
// //        </tr>
//         var curGroup = group[i];
//         var newGroupDom = '<tr data-id="' + curGroup.GroupId + '"' + ' data-uid="">';
//         newGroupDom += "<td>" + curGroup.GroupName + "</td>";
//         newGroupDom += "<td>" + '<label><input type="radio" name="perm_' + curGroup.GroupId + '" checked="checked" value="0" class="group-perm"><i class="fa fa-eye" aria-hidden="true"></i> Read Only </label>';
//         newGroupDom += '<label><input type="radio" name="perm_' + curGroup.GroupId + '" value="1" class="group-perm"><i class="fa fa-pencil" aria-hidden="true"></i> Read and Write</label> </td>';
//         newGroupDom += '<td> <button id = "notsharebtn" class="btn btn-default btn-share-or-not"><i class="fa fa-share" aria-hidden="true"></i> Share</button> </td>';
//         newGroupDom += "</tr>";
//         $("#groupInfoTable").append(newGroupDom);
//     }
//    
//    
     showGroupDialogRemote("", { // display dialog
 //        notebookId: notebookId
     });
 }

function showNoteInfo() {
    $("#noteInfo").empty;
    
    var noteInfo = ["<table>", "<tr><th>" + getMsg("Create Time") + '</th><td id="noteInfoCreatedTime"></td></tr>', "<tr><th>" + getMsg("Update Time") + '</th><td id="noteInfoUpdatedTime"></td></tr>', '<tr class="post-url-tr">', "<th>" + getMsg("Post Url") + "</th>", "<td>", '<div class="post-url-wrap">', '<span class="post-url-base">http://blog.leanote.com/life/post/</span><span><span class="post-url-text">life-life-life-a-leanote</span>', '<input type="text" class="form-control">', "</span>", ' <a class="post-url-pencil" title="' + getMsg("update") + '"><i class="fa fa-pencil"></i></a>', "</div>", "</td>", "</tr>", "</table>"].join("")
    $("#groupInfoTable").append(noteInfo);
}