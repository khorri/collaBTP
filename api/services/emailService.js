var nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'mail.rcomaroc.com',
    port: 587,
    tls: {
        rejectUnauthorized:false
    },
    auth: {
        user: 'no-reply@rcomaroc.com',
        pass: 'NXhivdRUv?5t'
    },
    secure: false,
    ignoreTLS: true,
    socketTimeout: 60 * 1000,
    debug : true

}));

var email = require('emailjs');
var server  = email.server.connect({
    user:    "no-reply@rcomaroc.com",
    password:"NXhivdRUv?5t",
    host:    "mail.rcomaroc.com",
    port: 587,
    ssl:     false
});

module.exports = {
    sendEmail: function (from, to, subject, text, html, attachments, callback) {
        var mailOptions = {
            from: 'no-reply@rcomaroc.com',
            to: to,
            subject: subject,
            text: text,
            html: html,
            attachments: attachments
        };

        transporter.sendMail(mailOptions, function (error, info) {

            callback(error, info);
        });
    },
    send : function(data,callback){
        var attachment = [{data:data.html || '', alternative:true}];
        attachment = attachment.concat(data.attachment);
        var message = {
            text:    data.text || '',
            from:    'no-reply@rcomaroc.com',
            to:      data.to,
            subject: data.subject,
            attachment:attachment

        };

// send the message and get a callback with an error or details of the message that was sent
        server.send(message, function(err, message) {
            callback(err,message); });

    }

};