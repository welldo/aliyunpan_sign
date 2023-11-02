"use strict"

/*---------------依赖-----------------*/
const nodeMailer = require('nodemailer');
const axios = require('axios');

/*---------------配置-----------------*/
const config = {
    "baseUrl": "https://api.juejin.cn",
    "apiUrl": {
        "getTodayStatus": "/growth_api/v1/get_today_status",
        "checkIn": "/growth_api/v1/check_in",
        "getLotteryConfig": "/growth_api/v1/lottery_config/get",
        "drawLottery": "/growth_api/v1/lottery/draw"
    },
    "cookie": "_tea_utm_cache_2608=undefined; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227203539951215314436%2522%252C%2522user_unique_id%2522%253A%25227203539951215314436%2522%252C%2522timestamp%2522%253A1677204857191%257D; odin_tt=9a2c913bbac1317f4aab737cebe531a7c3c8a1de6e9655d18ed78c97439ae165cdae3448735f8c4ddd23235e0db28cd27f6e7515c3103cf8ebc8077bd34ecc76; sid_guard=e466fa81b759d51eab4d0010fdfa6943%7C1679017419%7C31536000%7CSat%2C+16-Mar-2024+01%3A43%3A39+GMT; uid_tt=a83bd7de23bbb152c019bb10dea9d7b8; uid_tt_ss=a83bd7de23bbb152c019bb10dea9d7b8; sid_tt=e466fa81b759d51eab4d0010fdfa6943; sessionid=e466fa81b759d51eab4d0010fdfa6943; sessionid_ss=e466fa81b759d51eab4d0010fdfa6943; sid_ucp_v1=1.0.0-KGE0N2QzZGNiMTVmMzRjNGEyZjRjMmRmMDZlYzc3YmIxYjlkZWRkMzMKFgjeluDik8ykAxDLi8-gBhiwFDgIQAsaAmxmIiBlNDY2ZmE4MWI3NTlkNTFlYWI0ZDAwMTBmZGZhNjk0Mw; ssid_ucp_v1=1.0.0-KGE0N2QzZGNiMTVmMzRjNGEyZjRjMmRmMDZlYzc3YmIxYjlkZWRkMzMKFgjeluDik8ykAxDLi8-gBhiwFDgIQAsaAmxmIiBlNDY2ZmE4MWI3NTlkNTFlYWI0ZDAwMTBmZGZhNjk0Mw; store-region=cn-fj; store-region-src=uid; n_mh=E_gp0bW97tdfi5d743MsUfGXy0QdTVH4880z80zABn8; passport_csrf_token=8c0022431bcbfe79fb8d44e3b8b11d07; passport_csrf_token_default=8c0022431bcbfe79fb8d44e3b8b11d07; _ga=GA1.2.1762933377.1688346756; _gid=GA1.2.690476013.1688346756; _ga_S695FMNGPJ=GS1.2.1688346756.1.0.1688346756.60.0.0; passport_csrf_token_wap_state=2d3840173gASoVCgoVPZIGU0NjZmYTgxYjc1OWQ1MWVhYjRkMDAxMGZkZmE2OTQzoU6-aHR0cHM6Ly9qdWVqaW4uY24vb2F1dGgtcmVzdWx0oVYBoUkAoUQAoUHRCjChTdEKMKFIqWp1ZWppbi5jbqFSBKJQTNEE_KZBQ1RJT06goUzZJ2h0dHBzOi8vanVlamluLmNuL3VzZXIvc2V0dGluZ3MvYWNjb3VudKFU2SAwNmM5YjU2OGFlOGFlOTY5OTUwZGNmZWNjZjAwZmUzOKFXAKFGAKJTQQChVcM%253D; csrf_session_id=a0afae798f3be61e5dfdf38cf128be2f; msToken=WOW8gBUG0JXAVtepJMuoqpjgDFO5nIi9Nc6cN3wIz1EjuUBmLEFtJSnjEvm-oAaIqcQ0-D85QLgE99SLHTRd1qObmooAUmoYULfG8qYNaNSzglxUrg7uTzYYZ7tNlg==",
    "email": {
        "qq": {
            "user": "welldo@foxmail.com",
            "from": "welldo@foxmail.com",
            "to": "welldo@88.com",
            "pass": "emfwqlzsoohfbgee"
        }
    }
}

/*---------------掘金-----------------*/

// 签到
const checkIn = async () => {
    let {error, isCheck} = await getTodayCheckStatus();
    if (error) return console.log('查询签到失败');
    if (isCheck) return console.log('今日已参与签到');
    const {cookie, baseUrl, apiUrl} = config;
    let {data} = await axios({url: baseUrl + apiUrl.checkIn, method: 'post', headers: {Cookie: cookie}});
    if (data.err_no) {
        console.log('签到失败');
        await sendEmailFromQQ('今日掘金签到：失败', JSON.stringify(data));
    } else {
        console.log(`签到成功！当前积分：${data.data.sum_point}`);
        await sendEmailFromQQ('今日掘金签到：成功', JSON.stringify(data));
    }
}

// 查询今日是否已经签到
const getTodayCheckStatus = async () => {
    const {cookie, baseUrl, apiUrl} = config;
    let {data} = await axios({url: baseUrl + apiUrl.getTodayStatus, method: 'get', headers: {Cookie: cookie}});
    if (data.err_no) {
        await sendEmailFromQQ('今日掘金签到查询：失败', JSON.stringify(data));
    }
    return {error: data.err_no !== 0, isCheck: data.data}
}

// 抽奖
const draw = async () => {
    let {error, isDraw} = await getTodayDrawStatus();
    if (error) return console.log('查询抽奖次数失败');
    if (isDraw) return console.log('今日已无免费抽奖次数');
    const {cookie, baseUrl, apiUrl} = config;
    let {data} = await axios({url: baseUrl + apiUrl.drawLottery, method: 'post', headers: {Cookie: cookie}});
    if (data.err_no) return console.log('免费抽奖失败');
    console.log(`恭喜抽到：${data.data.lottery_name}`);
    console.log('结束');
}

// 获取今天免费抽奖的次数
const getTodayDrawStatus = async () => {
    const {cookie, baseUrl, apiUrl} = config;
    let {data} = await axios({url: baseUrl + apiUrl.getLotteryConfig, method: 'get', headers: {Cookie: cookie}});
    if (data.err_no) {
        return {error: true, isDraw: false}
    } else {
        return {error: false, isDraw: data.data.free_count === 0}
    }
}

/*---------------邮件-----------------*/

// 通过qq邮箱发送
const sendEmailFromQQ = async (subject, html) => {
    let cfg = config.email.qq;
    if (!cfg || !cfg.user || !cfg.pass) return;
    const transporter = nodeMailer.createTransport({service: 'qq', auth: {user: cfg.user, pass: cfg.pass}});
    transporter.sendMail({
        from: cfg.from,
        to: cfg.to,
        subject: subject,
        html: html
    }, (err) => {
        if (err) return console.log(`发送邮件失败：${err}`, true);
        console.log('发送邮件成功')
    })
}

exports.juejin = async (event, context) => {
    console.log('开始');
    await checkIn();
    await draw();
    console.log('结束');
};

 console.log('开始');
    checkIn();
     draw();
     sendEmailFromQQ('今日掘金签到查询：失败', '<div data-v-c96157ca="" class="rule">首次成功发布 400 字以上文章</div>');
 