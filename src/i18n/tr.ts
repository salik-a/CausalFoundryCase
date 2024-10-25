import { Translations } from "./en"

const tr: Translations = {
  common: {
    ok: "Tamam",
    cancel: "İptal",
    back: "Geri",
  },
  welcomeScreen: {
    postscript:
      "psst — Muhtemelen uygulamanız böyle görünmüyor. (Eğer tasarımcınız size bu ekranları verdiyse, o zaman yayınlayabilirsiniz!)",
    readyForLaunch: "Uygulamanız neredeyse yayına hazır!",
    exciting: "(ohh, bu çok heyecan verici!)",
  },
  errorScreen: {
    title: "Bir şeyler ters gitti!",
    friendlySubtitle:
      "Bu, üretim ortamında bir hata meydana geldiğinde kullanıcılarınızın göreceği ekrandır. Bu mesajı (`app/i18n/en.ts` içinde bulunur) ve muhtemelen düzeni (`app/screens/ErrorScreen` içinde) özelleştirmek isteyeceksiniz. Bunu tamamen kaldırmak isterseniz, `app/app.tsx` dosyasındaki <ErrorBoundary> bileşenini kontrol edin.",
    reset: "UYGULAMAYI SIFIRLA",
  },
  emptyStateComponent: {
    generic: {
      heading: "Çok boş... çok üzücü",
      content:
        "Henüz veri bulunamadı. Yenilemek veya uygulamayı yeniden yüklemek için butona tıklamayı deneyin.",
      button: "Tekrar deneyelim",
    },
  },
  tabBarNavigator: {
    welcome: "Hoşgeldin",
    menu: "Menü",
    counter: "Counter",
  },
}

export default tr
