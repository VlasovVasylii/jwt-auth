const nodemailer = require("nodemailer");

const COMPANY_NAME = "JWT Auth";
const SUPPORT_EMAIL = "support@example.com";
const LOGO_URL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMwMDdiZmYiLz4KPHBhdGggZD0iTTMyIDQyQzM3LjUyMiA0MiA0MiAzNy41MjIgNDIgMzJDMzIgMjYuNDc4IDI2LjQ3OCAyMiAzMiAyMkwzMiA0MloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

    async sendActivationMail(to, link) {
        try {
            await this.transporter.sendMail({
                from: `${COMPANY_NAME} <${process.env.SMTP_USER}>`,
                to,
                subject: `Активация аккаунта на ${COMPANY_NAME}`,
                text: `Здравствуйте!\n\nВы зарегистрировались на ${COMPANY_NAME}. Для активации аккаунта перейдите по ссылке: ${link}\n\nЕсли вы не регистрировались, просто проигнорируйте это письмо.\n\nС уважением, команда ${COMPANY_NAME}`,
                html: `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9f9f9;padding:32px 0;">
  <tr>
    <td align="center">
      <table width="480" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:8px;padding:32px;">
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <img src="${LOGO_URL}" width="64" height="64" alt="Logo" style="display:block;margin-bottom:8px;">
            <h2 style="color:#2c3e50;font-family:Arial,sans-serif;margin:0;">${COMPANY_NAME}</h2>
          </td>
        </tr>
        <tr>
          <td style="color:#2c3e50;font-family:Arial,sans-serif;">
            <h3 style="margin:0 0 16px 0;">Активация аккаунта</h3>
            <p style="margin:0 0 16px 0;">Здравствуйте!</p>
            <p style="margin:0 0 24px 0;">Вы зарегистрировались на <b>${COMPANY_NAME}</b>. Для активации аккаунта нажмите на кнопку ниже:</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="${link}" style="background:#007bff;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">Активировать аккаунт</a>
            </div>
            <p style="font-size:13px;color:#888;margin:24px 0 0 0;">Если кнопка не работает, скопируйте и вставьте ссылку в браузер:<br>
              <a href="${link}" style="color:#007bff;">${link}</a>
            </p>
            <hr style="margin:24px 0;">
            <p style="font-size:12px;color:#888;margin:0;">Если вы не регистрировались, просто проигнорируйте это письмо.<br>
              По всем вопросам пишите: <a href="mailto:${SUPPORT_EMAIL}" style="color:#007bff;">${SUPPORT_EMAIL}</a>
            </p>
            <p style="font-size:11px;color:#aaa;margin:24px 0 0 0;">ООО «JWT Auth», г. Москва, ул. Примерная, д. 1<br>+7 (495) 123-45-67, <a href="https://jwt-auth.example.com" style="color:#007bff;">jwt-auth.example.com</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
            });
            console.log(`[MAIL] Activation mail sent to ${to}`);
        } catch (err) {
            console.error(`[MAIL][ERROR] Activation mail to ${to}:`, err);
        }
    }

    async sendResetPasswordMail(to, link) {
        try {
            await this.transporter.sendMail({
                from: `${COMPANY_NAME} <${process.env.SMTP_USER}>`,
                to,
                subject: `Сброс пароля на ${COMPANY_NAME}`,
                text: `Здравствуйте!\n\nВы запросили сброс пароля на ${COMPANY_NAME}. Для смены пароля перейдите по ссылке: ${link}\n\nЕсли вы не запрашивали сброс пароля, просто проигнорируйте это письмо.\n\nС уважением, команда ${COMPANY_NAME}`,
                html: `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9f9f9;padding:32px 0;">
  <tr>
    <td align="center">
      <table width="480" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:8px;padding:32px;">
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <img src="${LOGO_URL}" width="64" height="64" alt="Logo" style="display:block;margin-bottom:8px;">
            <h2 style="color:#2c3e50;font-family:Arial,sans-serif;margin:0;">${COMPANY_NAME}</h2>
          </td>
        </tr>
        <tr>
          <td style="color:#2c3e50;font-family:Arial,sans-serif;">
            <h3 style="margin:0 0 16px 0;">Сброс пароля</h3>
            <p style="margin:0 0 16px 0;">Здравствуйте!</p>
            <p style="margin:0 0 24px 0;">Вы запросили сброс пароля на <b>${COMPANY_NAME}</b>. Для смены пароля нажмите на кнопку ниже:</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="${link}" style="background:#dc3545;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">Сменить пароль</a>
            </div>
            <p style="font-size:13px;color:#888;margin:24px 0 0 0;">Если кнопка не работает, скопируйте и вставьте ссылку в браузер:<br>
              <a href="${link}" style="color:#007bff;">${link}</a>
            </p>
            <hr style="margin:24px 0;">
            <p style="font-size:12px;color:#888;margin:0;">Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.<br>
              По всем вопросам пишите: <a href="mailto:${SUPPORT_EMAIL}" style="color:#007bff;">${SUPPORT_EMAIL}</a>
            </p>
            <p style="font-size:11px;color:#aaa;margin:24px 0 0 0;">ООО «JWT Auth», г. Москва, ул. Примерная, д. 1<br>+7 (495) 123-45-67, <a href="https://jwt-auth.example.com" style="color:#007bff;">jwt-auth.example.com</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
            });
            console.log(`[MAIL] Reset password mail sent to ${to}`);
        } catch (err) {
            console.error(`[MAIL][ERROR] Reset password mail to ${to}:`, err);
        }
    }

    async send2FALoginMail(to, link) {
        try {
            await this.transporter.sendMail({
                from: `${COMPANY_NAME} <${process.env.SMTP_USER}>`,
                to,
                subject: `Подтверждение входа в аккаунт на ${COMPANY_NAME}`,
                text: `Здравствуйте!\n\nВы пытаетесь войти в свой аккаунт на ${COMPANY_NAME}. Для подтверждения входа перейдите по ссылке: ${link}\n\nЕсли это были не вы, просто проигнорируйте это письмо.\n\nС уважением, команда ${COMPANY_NAME}`,
                html: `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9f9f9;padding:32px 0;">
  <tr>
    <td align="center">
      <table width="480" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:8px;padding:32px;">
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <img src="${LOGO_URL}" width="64" height="64" alt="Logo" style="display:block;margin-bottom:8px;">
            <h2 style="color:#2c3e50;font-family:Arial,sans-serif;margin:0;">${COMPANY_NAME}</h2>
          </td>
        </tr>
        <tr>
          <td style="color:#2c3e50;font-family:Arial,sans-serif;">
            <h3 style="margin:0 0 16px 0;">Подтверждение входа</h3>
            <p style="margin:0 0 16px 0;">Здравствуйте!</p>
            <p style="margin:0 0 24px 0;">Вы пытаетесь войти в свой аккаунт на <b>${COMPANY_NAME}</b>. Для подтверждения входа нажмите на кнопку ниже:</p>
            <div style="text-align:center;margin:24px 0;">
              <a href="${link}" style="background:#28a745;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block;">Подтвердить вход</a>
            </div>
            <p style="font-size:13px;color:#888;margin:24px 0 0 0;">Если кнопка не работает, скопируйте и вставьте ссылку в браузер:<br>
              <a href="${link}" style="color:#007bff;">${link}</a>
            </p>
            <hr style="margin:24px 0;">
            <p style="font-size:12px;color:#888;margin:0;">Если это были не вы, просто проигнорируйте это письмо.<br>
              По всем вопросам пишите: <a href="mailto:${SUPPORT_EMAIL}" style="color:#007bff;">${SUPPORT_EMAIL}</a>
            </p>
            <p style="font-size:11px;color:#aaa;margin:24px 0 0 0;">ООО «JWT Auth», г. Москва, ул. Примерная, д. 1<br>+7 (495) 123-45-67, <a href="https://jwt-auth.example.com" style="color:#007bff;">jwt-auth.example.com</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
            });
            console.log(`[MAIL] 2FA login mail sent to ${to}`);
        } catch (err) {
            console.error(`[MAIL][ERROR] 2FA login mail to ${to}:`, err);
        }
    }
}

module.exports = new MailService();