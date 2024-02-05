import "bootstrap/dist/css/bootstrap.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { CookiesProvider } from "react-cookie";
import "react-datepicker/dist/react-datepicker.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavigationLoader from "shared/loader/navigationLoader";
import { store } from "shared/redux/store";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/cropper.css";
import "../styles/globals.css";
import "../styles/swiper.css";
import "../styles/slick.css";
import { resetLoginUser } from "shared/redux/reducers/loginSlice";
import { resetCart } from "shared/redux/reducers/cartSlice";
import { toastMessage } from "shared/components/common/toast";

function MyApp({ Component, pageProps }: AppProps) {
  if (pageProps.errorStatus === 401) {
    const { login } = store.getState().root;
    if (login?.token) {
      store.dispatch(resetLoginUser());
      store.dispatch(resetCart());
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      window.location.reload();
      toastMessage("error", "Your session expired. Please login again");
    }
  }

  return (
    <Provider store={store}>
      <CookiesProvider>
        <Head>
          <meta
            property="og:title"
            content="Discover the World of Stories with - AlifLaila App"
          />
          <meta
            property="og:description"
            content="A Premium Urdu Digital Library for Readers of All Ages!"
          />
          <meta
            property="og:image"
            content="https://aliflaila.app/logo-aliflaila-app.webp"
          />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-BW96BD6SP2"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-BW96BD6SP2');
                  `,
            }}
          ></script>
          <title>AlifLaila</title>
        </Head>
        <NavigationLoader />

        <Component {...pageProps} />
      </CookiesProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
}

export default MyApp;
