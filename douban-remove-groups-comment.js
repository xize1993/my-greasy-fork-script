// ==UserScript==
// @name         豆瓣小组自动删除回复
// @namespace    https://github.com/zhaozecheng/my-greasy-fork-script
// @version      0.1
// @description  自动删除回复
// @author       zhaozecheng
// @match        *://www.douban.com/group/topic/*
//@grant none
// ==/UserScript==
const topicOpt = $('.topic-opt')
const topicAdminOpts = $('.topic-admin-opts')
const tid = location.href.match(/topic\/(\d+)\//)[1]
const ck = get_cookie("ck")

if (topicAdminOpts.children().length > 0) {
    topicAdminOpts.append('<span class="fleft"><a id="auto-del">删除当页评论</a></span>')
} else {
     $('.report').append('<span class="" style="color:#c6c6c6;"><span class="lnk-opt-line""> | </span><a id="auto-del">删评</a></span>')
}

$('#auto-del').click(async e => {
        e.stopImmediatePropagation()
        if (confirm('确定删除当前页面所有回复吗？')) {
            await delPageComment(e)
            topicAdminOpts.append(`<div>执行完毕</div>`)
        }
});

async function delPageComment(e) {
    $('.topic-reply li:contains(删除)').trigger( "mouseover" ); // 使用豆瓣自带脚本，移除无权限删除的回复
    let topicReply = $('.topic-reply li:contains(删除)')
    for (let i = 0; i < topicReply.length; i++) {
        await delComment(i, topicReply[i])
    }
}

function delComment(i, e) {
    return new Promise(function (resolve, reject) {
      let cid = $(e).data('cid')
      $.post(`/group/topic/${tid}/remove_comment?cid=${cid}`, {
          ck: ck,
          cid: cid,
          reason: 0,
          other: '',
          submit: '确定'
        }, function(){
          let content = $(e).find(".reply-content").html()
          topicAdminOpts.append(`<div>成功删除第${i+1}条评论：${content.substring(0, 20)}...</div>`)
          resolve()
      })
    });
}


