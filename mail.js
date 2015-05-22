var Imap = require('imap')
var inspect = require('util').inspect
var MailParser = require("mailparser").MailParser

var imap = new Imap({
    user: 'acsabsolutecomfort@yahoo.com',
    password: 'Acscomfort2014',
    host: 'imap.mail.yahoo.com',
    port: 993,
    tls: true
});

var mailParser = new MailParser({ streamAttachments : true });
var emailBuffer = '';

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
    openInbox(function(err, box) {
        if (err) throw err;
        var n = box.messages.total;
        var f = imap.seq.fetch(n + ':' + n, {
            bodies: ''
        });
        f.on('message', function(msg, seqno) {
            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
                console.log(prefix + 'Body');
                var buffer = '';
                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end' , function()
                {
                    emailBuffer = buffer;
                });
            });
            
            msg.once('end', function() {
                console.log(prefix + 'Finished');
                // parse the email
                mailParser.write(emailBuffer);
                mailParser.end();
            });
        });
        f.once('error', function(err) {
            console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
            console.log('Done fetching all messages!');
            imap.end();
        });
    });
});

mailParser.on('end', function (mail)
{
    console.log(mail.text);    
});

imap.once('error', function(err) {
    console.log(err);
});

imap.once('end', function() {
    console.log('Connection ended');
});

imap.connect();