import { Head, Html, Main, NextScript } from "next/document";
export default function Document() {
  // const {theme} = store.getState().root;
  return (
    <Html>
      <Head>
        <script
          src="https://code.jquery.com/jquery-3.6.4.slim.min.js"
          integrity="sha256-a2yjHM4jnF9f54xUQakjZGaqYs/V1CYvWpoqZzC2/Bw="
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
          integrity="sha512-bPs7Ae6pVvhOSiIcyUClR7/q2OAsRiovw4vAkX+zJbw3ShAeeqezq50RIIcIURq7Oa20rW2n2q+fyXBNcU9lrw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
