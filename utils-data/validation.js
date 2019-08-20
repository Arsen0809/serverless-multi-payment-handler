export const regExp = {
  name: /^[a-zA-ZàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð',.\- ]+$/,
  utf8: /^[0-9a-zA-Z_$@$!%*?&.+-/ /]+$/,
  userName:/^[A-Za-z0-9_]{3,30}(?:[_-][A-Za-z0-9]+)*$/,
  companyName: /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '~?!][A-Za-z0-9_.]{2,}[a-zA-Z0-9_ ]*$/,
  phone: /^\d{6,}(?:,(?:\+\d{2})?\d{6,})*$/,
  address: /^.[^&]{2,29}$/,
  social: /(https?:\/\/[^\s]+)/,
  ssn: /^([0-9]){3}(([ ]|[-])?([0-9]){2})(([ ]|[-])?([0-9]){4})?$/,
  custom_domain: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
  zip: {
    US: /^\d{5}(?:[-\s]\d{4})?$/,
    CA: /^\d{5}-\d{4}|\d{5}|[A-Z]\d[A-Z] \d[A-Z]\d$/,
    AU: /^\d{4}(?:[-\s]\d{4})?$/,
    GB: /[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]? [0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}/,
    ALL: /^([a-zA-Z0-9_-]){1,8}$/
  },
  cvc: /^\d{3,4}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@#$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/,
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  bgUpload: /^(([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w].*))+(.jpg|.jpeg)$/
};
