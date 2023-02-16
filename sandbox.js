const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'brady85@ethereal.email',
        pass: 'U95ACdrQ5mpXA21jQY'
    }
});

async function execute() {
	const sentMail = await transporter.sendMail({
		to: 'brendansirakydeveloper@gmail.com',
		from: 'account@foo.com',
		subject: 'hello subject',
		text: 'hello text'
	});

	console.log({ sentMail })
}

execute()
