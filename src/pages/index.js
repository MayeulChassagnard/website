import React from 'react'
import { graphql } from 'gatsby'
import { Wrapper, Content, ContentMiddle, ContentBottom } from '../components/Utils'
import List from '../components/contentList'
import SEO from '../components/SEO'
import Arrow from '../components/Arrow'
import Checkout from '../components/checkout'
import { FiInstagram, FiYoutube, FiCamera } from 'react-icons/fi'
import Products from '../components/Products/Products'


const Index = ({ data }) => {
  const home = data.contentfulHome
  const contentfulGalleries = data.allContentfulExtendedGallery.edges
  
  return (
    <>
      <SEO image={home.shareImage} />
      <Wrapper>
        <Content>
          <section>
            <h2>{home.headline}</h2>
            <article
              dangerouslySetInnerHTML={{
                __html: home.body.childMarkdownRemark.html,
              }}
            />
            <p className="small">
              <a href="https://www.flickr.com/photos/mayeulchassagnard/"><FiCamera />{' '}</a>
              &nbsp;&nbsp;&nbsp;
              <a href="https://instagram.com/mayeulchassagnard"><FiInstagram />{' '}</a>
              &nbsp;&nbsp;&nbsp;
              <a href="https://www.youtube.com/playlist?list=PLF4JkPm1waWLrslI1A7uTNCuaKcGYhUIg"><FiYoutube />{' '}</a>
            </p>
            <Arrow anchor="/#youtube" />
          </section>
        </Content>
        <ContentMiddle id="youtube" >
            <a href="https://www.youtube.com/playlist?list=PLF4JkPm1waWLrslI1A7uTNCuaKcGYhUIg"><h3><FiYoutube />{' '}</h3></a>
            <div className="video-container" >
              <iframe src={home.youtubeLink} width="1100" height="537" frameborder="0" scrolling="no" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" ></iframe>
            </div>
        </ContentMiddle>
        <ContentMiddle id="instagram">
            <a href="https://instagram.com/mayeulchassagnard"><h3><FiInstagram />{' '}</h3></a>
            <iframe src={home.instagramLink} width="320" height="540" frameborder="0" scrolling="no" allowTransparency="true"></iframe>
        </ContentMiddle>
        <ContentMiddle id="flickr">
          <a href="https://www.flickr.com/photos/mayeulchassagnard/"><h3><FiCamera />{' '}</h3></a>
          <div className="video-container" >
            <iframe src={home.flickrLink} scrolling="no" frameborder="0" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"><p><a  href="https://www.compareboilercover.co.uk">the website for cheaper boiler care comparison</a></p><small>Powered by <a href="https://flickrembed.com">flickr embed</a>.</small></iframe>
          </div>
        </ContentMiddle>
        <ContentBottom className="galleries">
          <h3>{'Galleries'}</h3>
          <section id="galleries">
            {contentfulGalleries.map(({ node: gallery }) => (
              <List
                galleryList
                key={gallery.id}
                slug={gallery.slug}
                image={gallery.heroImage}
                title={gallery.title}
                date={gallery.publishDate}
                excerpt={gallery.body}
              />
            ))}
          </section>
        </ContentBottom>

        <section id="buy">
          {/* <Checkout /> */}
          <Products />
        </section>

      </Wrapper>
    </>
  )
}

export const query = graphql`
  query Index {
    allContentfulExtendedGallery(
      limit: 1000
      sort: { fields: [publishDate], order: DESC }
    ) {
      edges {
        node {
          title
          id
          slug
          publishDate(formatString: "DD MMM YYYY h:mm a")
          heroImage {
            title
            fluid(quality: 50) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
          body {
            childMarkdownRemark {
              excerpt(pruneLength: 140, format: HTML)
            }
          }
        }
      }
    }
    contentfulHome {
      title
      id
      headline
      heroImage {
        title
        fluid(maxWidth: 1600, quality: 50) {
          ...GatsbyContentfulFluid_withWebp
        }
      }
      shareImage {
        ogimg: resize(width: 1200, quality: 50) {
          src
          width
          height
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
      youtubeLink
      instagramLink
      flickrLink
      flickrStaticImg
    }
  }
`

export default Index
