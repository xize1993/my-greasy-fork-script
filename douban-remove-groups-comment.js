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
    topicAdminOpts.append('<span class="fleft" style="color:#ff0000;font-weight:bold;"><a id="auto-del">删除当页评论</a></span>')
    $('#auto-del').click(async e => {
        e.stopImmediatePropagation()
        if (confirm('确定删除当前页面所有回复吗？')) {
            await delPageComment(e)
            topicAdminOpts.append(`<div>执行完毕，5秒后将刷新页面。</div>`)
            setTimeout(e => location.reload(), 5000)
        }
    })
}

async function delPageComment(e) {
    let topicReply = $('.topic-reply li')
    for (let i = 0; i < topicReply.length; i++) {
        await delComment(i, topicReply[i])
    }
}

function delComment(i, e) {
    return new Promise(function (resolve, reject) {
      let cid = $(e).data('cid')
      $.post(`/j/group/topic/${tid}/remove_comment`, {
          ck: ck,
          cid: cid
        }, function(){
          let content = $(e).find(".reply-content").html()
          topicAdminOpts.append(`<div>成功删除第${i+1}条评论：${content.substring(0, 20)}...</div>`)
          resolve()
      })
    });
}
