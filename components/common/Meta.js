import getConfig from "next/config";
import Head from "next/head";
import PropTypes from "prop-types";

const { publicRuntimeConfig } = getConfig();

const schema = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "@id": "OnlineStore",
  address: "423 Knapp St Fremont, OH 43420 USA",
  description:
    "Quickly create custom car air fresheners for promotional items or event gifts. Lowest price and fastest shipping and handling from Make My Freshener.",
  email: "support@makemyfreshener.com",
  foundingDate: "2015-01-01",
  image:
    "https://uploads-ssl.webflow.com/654bae99e49b051031a7588e/65ca75213923367b1ec893fe_Open%20Graph%20Image%20-%20Make%20My%20Freshener.jpg",
  logo: "https://uploads-ssl.webflow.com/654bae99e49b051031a7588e/65ca85269d96c6fd81dd8443_Make My Freshener Logo White BG.svg",
  keywords: [
    "custom car air fresheners",
    "custom car air freshener",
    "custom air fresheners",
    "custom air freshener",
    "personalized air fresheners",
    "personalized air freshener",
    "car fresheners",
    "car freshener",
    "air fresheners",
    "air freshener",
  ],
  location: "USA",
  name: "Make My Freshener",
  sameAs: [
    "https://www.instagram.com/makemyfreshener",
    "https://www.facebook.com/getmakemyfreshener",
    "https://www.tiktok.com/@makemyfreshener",
    "https://twitter.com/makemyfreshener",
    "https://www.linkedin.com/company/makemyfreshener",
    "https://pinterest.com/makemyfreshener",
  ],
  url: "https://www.makemyfreshener.com",
};

const schemaRating = {
  "@context": "https://schema.org",
  "@type": "Product",
  image:
    "https://uploads-ssl.webflow.com/654bae99e49b051031a7588e/65ca75213923367b1ec893fe_Open%20Graph%20Image%20-%20Make%20My%20Freshener.jpg",
  name: "Custom Air Fresheners",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    bestRating: "5",
    worstRating: "0",
    reviewCount: 4700,
  },
};

const Meta = ({ title, description, canonicalLink, noindex = false }) => {
  const isStaging =
    publicRuntimeConfig.apiBaseUrl.includes("staging") &&
    process.env.NODE_ENV !== "development";

  return (
    <Head>
      <title>{title}</title>
      {noindex && <meta name="robots" content="noindex" />}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@makemyfreshener" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Make My Freshener" />
      <meta property="og:url" content={canonicalLink} />
      <meta
        property="og:image"
        content="https://uploads-ssl.webflow.com/654bae99e49b051031a7588e/65ca75213923367b1ec893fe_Open%20Graph%20Image%20-%20Make%20My%20Freshener.jpg"
      />
      <link
        rel="shortcut icon"
        type="image/png"
        href="https://flower-manufacturing.s3.amazonaws.com/stores/MakeLogo.png"
      />
      <link
        rel="apple-touch-icon"
        type="image/png"
        href="/static/img/favicons/apple-icon.png"
      ></link>
      {canonicalLink && <link rel="canonical" href={canonicalLink}></link>}
      {isStaging ? (
        <script
          id="googletagmanager-gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=1VKXr3C11Rm7JFMLIYk6Yw&gtm_preview=env-124&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}')`,
          }}
        ></script>
      ) : (
        <script
          id="googletagmanager-gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){
            w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://load.ss.makemyfreshener.com/jswbtyqf.js?st='+i+dl;
            f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID.slice(
              4
            )}');`,
          }}
        ></script>
      )}

      <script
        type="application/ld+json"
        class="schemantra"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      ></script>
      <script
        type="application/ld+json"
        class="schemantra"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaRating),
        }}
      ></script>
    </Head>
  );
};

Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonicalLink: PropTypes.string,
};

Meta.defaultProps = {
  title: "Custom Air Fresheners",
  description:
    "Quickly create custom car air fresheners for promotional items or event gifts. Lowest prices and fastest shipping and handling from Make My Freshener.",
};

export default Meta;
