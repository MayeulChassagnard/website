const config = require('./src/utils/siteConfig')
let contentfulConfig

try {
  contentfulConfig = require('./.contentful')
} catch (e) {
  contentfulConfig = {
    production: {
      spaceId: process.env.SPACE_ID,
      accessToken: process.env.ACCESS_TOKEN,
    },
  }
} finally {
  const { spaceId, accessToken } = contentfulConfig.production
  if (!spaceId || !accessToken) {
    throw new Error('Contentful space ID and access token need to be provided.')
  }
}

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    siteUrl: config.siteUrl,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        // Variables in the whitelist will be available to builds as process.env.<NAME>, just
        // like Node processes
        whitelist: ['ENABLE_NETLIFY_AUTH'],
      },
    },
    'gatsby-plugin-flow',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-catch-links',
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-stripe`,
      options: {
        objects: ['Price'],
        secretKey: process.env.STRIPE_SECRET_KEY,
        downloadFiles: false,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 960,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: 'gatsby-remark-images-grid',
          },

          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              showLineNumbers: true,
            },
          },
          {
            resolve: '@raae/gatsby-remark-oembed',
            options: {
              providers: {
                exclude: ['Reddit', 'Flickr', 'Instagram', 'Twitter'],
              },
            },
          },
          'gatsby-remark-responsive-iframe',
        ],
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images-contentful',
            options: {
              maxWidth: 960,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: 'gatsby-remark-emojis',
            options: {
              // Deactivate the plugin globally (default: true)
              active: true,
              // Add a custom css class
              class: 'emoji-icon',
              // Select the size (available size: 16, 24, 32, 64)
              size: 64,
              // Add custom styles
              styles: {
                display: 'inline',
                margin: '0',
                'margin-top': '1px',
                position: 'relative',
                top: '5px',
                width: '25px',
              },
            },
          },
          {
            resolve: 'gatsby-remark-images-grid',
          },

          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              showLineNumbers: true,
            },
          },
          {
            resolve: '@raae/gatsby-remark-oembed',
            options: {
              providers: {
                exclude: ['Reddit', 'Flickr', 'Instagram', 'Twitter'],
              },
            },
          },
          'gatsby-remark-responsive-iframe',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: config.siteTitle,
        short_name: config.shortTitle,
        description: config.siteDescription,
        start_url: '/',
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: 'fullscreen',
        icon: `static${config.siteLogo}`,
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: config.siteUrl,
      },
    },

    {
      resolve: `gatsby-plugin-segment-js`,
      options: {
        prodKey: process.env.SEGMENT,
        devKey: 'h9OTk5FWbRbQadJLqGIAVMYfkIbmNEBE',
        trackPage: true,
      },
    },
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: config.themeColor,
      },
    },
    {
      resolve: 'gatsby-source-contentful',
      options:
        process.env.NODE_ENV === 'development'
          ? contentfulConfig.development
          : contentfulConfig.production,
    },

    {
      resolve: 'gatsby-plugin-robots-txt',
    },

    'gatsby-plugin-catch-links',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-netlify',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          process.env.GOOGLE_GTAG_ID,
          // "GA-TRACKING_ID", // Google Analytics / GA
          // "AW-CONVERSION_ID", // Google Ads / Adwords / AW
          // "DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          optimize_id: "OPT_CONTAINER_ID",
          anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: ["/preview/**", "/do-not-track/me/too/"],
          // Defaults to https://www.googletagmanager.com
          origin: "YOUR_SELF_HOSTED_ORIGIN",
          // Delays processing pageview events on route update (in milliseconds)
          delayOnRouteUpdate: 0,
        },
      },
    },
  ],
}
