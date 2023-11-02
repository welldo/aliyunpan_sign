"use strict"

/*---------------依赖-----------------*/
const nodeMailer = require('nodemailer');
const axios = require('axios');
/*---------------配置-----------------*/
const config = {
    "StrUrl": "https://hq.sinajs.cn/list=sh600728,sh600446,sz002796,sh688165,sh688277,sh688165,sz300036,sz301025",
    "Referer": "https://finance.sina.com.cn",
    "subject": "",
     "mailbody": "",
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
const getTodayCheckStatus = async () => {
    const {Referer, StrUrl} = config;
    let {data} = await axios({url: StrUrl, method: 'get', headers: {Referer: Referer} });
    if (data.err_no) {
        await sendEmailFromQQ('查询：失败',  JSON.stringify(data)  );        
    }
    let  {stocks}  = JSON.stringify(data)
     
        await sendEmailFromQQ('查询：成功',  data );   
     console.log( data);
 

  return {error: data.err_no !== 0, isCheck: data.data}
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
    getTodayCheckStatus();
     //sendEmailFromQQ(subject, mailbody);
 