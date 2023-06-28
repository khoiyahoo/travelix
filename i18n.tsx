import i18n from "i18next";
import commonEn from "./translations/en/common.json";
import commonVi from "./translations/vi/common.json";

const ISSERVER = typeof window === "undefined";

(async () => {
  let lang = "vi"
  if (!ISSERVER) {
    lang = localStorage.getItem('lang') || 'vi'
  }

  i18n
    .init({
      interpolation: { escapeValue: false },
      lng: lang,
      resources: {
        en: {
          common: commonEn,
        },
        vi: {
          common: commonVi,
        },
      },
    })
    .catch((e) => {
      console.log(e);
    });
})();

export default i18n;
