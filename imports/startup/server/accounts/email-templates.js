import { Accounts } from 'meteor/accounts-base';

const name = "ÞVertApp";
const email = "support@soladi.net";
const from = "ÞVert Application <support@soladi.net>";
const emailTemplates = Accounts.emailTemplates;

emailTemplates.siteName = name;
emailTemplates.from = from;

function greet(welcomeMsg) {
  return function(user, url) {
    var greeting = (user.profile && user.profile.name) ?
          ("Hola " + user.profile.name.first + ",") : "Hola,";
    const urlWithoutHash = url.replace('#/', '');
    return `${greeting}
    ${welcomeMsg}, da click al link de abajo:
    \n\n${urlWithoutHash}\n\n
    Gracias.
    `;
  };
}

emailTemplates.resetPassword = {
  subject() {
    return `[${name}] Restablecer contraseña`;
  },
  text(user, url) {
    const userEmail = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');

    return `Un restablecimiento de contraseña ha sido solicitado para la cuenta relacionada con esta
    dirección (${userEmail}). Para restablecer tu contraseña, da clic al siguiente link:
    \n\n${urlWithoutHash}\n\n Si no solicitaste el restablecimiento, favor de ignorar este email.
    Si crees que algo esta mal, favor de contactar al equipo de soporte: ${email}.`;
  },
};

emailTemplates.verifyEmail = {
  subject(user) {
    return "Verificar dirección de correo en " + emailTemplates.siteName;
  },
  text: greet("Para empezar a utilizar el servicio")
}
