const nodemailer = require("nodemailer");


class MailApi {
 init(ipcMain: Electron.IpcMain) {
    ipcMain.handle("sendGmail", async (_event, args) => {
        const result = await this.sendIt(args);
        console.log({result})
        return {ok:true,result}
    });
 }
 
 async sendIt(data: string) {
  const user = process.env.MAILER_EMAIL?process.env.MAILER_EMAIL:'hkbvc1222@gmail.com'
  const clientId = process.env.MAILER_CLIENT_ID?process.env.MAILER_CLIENT_ID:'947174304654-rlv4sr5hma6if80uout3c7fmgloie85n.apps.googleusercontent.com'
  const clientSecret = process.env.MAILER_CLIENT_PWD?process.env.MAILER_CLIENT_PWD:'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'
  const accessToken = process.env.MAILER_ACCTKN?process.env.MAILER_ACCTKN:'ya29.a0AfB_byAh0vtjv3wxoiLOrS4OjVFrXAP91Ovsm9Iq_OmnSUCjOtqsIxjBQ3PSTFOy9471p5tWsp-DD4d0gAphehqX9jsLqNUyJdY3F41hdKX8Dz6p1Fx-R6fnl0pLJ8f6Sf5sqj7IH1WL4uwhM1I5SuR3hWdq-SdkqEXkaCgYKASsSARISFQGOcNnCjaMKwYjrlqpp8MbYgXazbQ0171'
  const refreshToken = process.env.MAILER_REFTKN?process.env.MAILER_REFTKN:'1//04IAs8A1wKG0ACgYIARAAGAQSNwF-L9Ir2e6wu3vYADrEAsulnhXfq7IQgc432-a424F3-ZmfufGdh9wBPTwoh70-mZevcAgoKdU'
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //smpt 전용 gail 주소
    port: 465, // or 587, 465는 SMTP의 대표로쓰이는 포트
    service: "gmail", 
    secure: true, //true인 경우 TLS를 사용, TLS는 이후에 알아보자.
    auth: {
      type: "OAuth2", // TYPE는 당연히 OAuth2
      user,
      clientId,
      clientSecret,
      accessToken,
      refreshToken,
      expires: 1484314697598,
    },
  });

  const mailOptions = {
    from: "sangwon@lsw.kr", 
    to: "hkbvc1222@gmail.com",
    subject: "***[백업 맵데이터]",
    html: `
    [ 맵 데이터 ] 
    <br />
    <p>${data}</p>
    `,
  };

  await transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
        res.status(400).json({
          status: "Failed",
          code: 400,
          message: "메일 전송에 실패",
        });
      } else {
        res.status(200).json({
          status: "Success",
          code: 200,
          message: "메일 전송에 성공",
        });
      }
    })
    transporter.close();
}

}

export default new MailApi()