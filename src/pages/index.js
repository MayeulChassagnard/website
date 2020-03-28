import React from 'react'
import { graphql } from 'gatsby'
import { Wrapper, Content, ContentMiddle, ContentBottom } from '../components/Utils'
import List from '../components/contentList'
import SEO from '../components/SEO'
import Arrow from '../components/Arrow'
import { FiInstagram, FiYoutube, FiCamera } from 'react-icons/fi'


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
        <ContentMiddle id="youtube">
          <section>
            <a href="https://www.youtube.com/playlist?list=PLF4JkPm1waWLrslI1A7uTNCuaKcGYhUIg"><h3><FiYoutube />{' '}</h3></a>
            <div className="iframe-container" >
              <iframe width="300" height="200" src="https://www.youtube.com/embed?max-results=1&controls=0&showinfo=0&rel=0&listType=user_uploads&list=jizukrist&autoplay=1" frameborder="0" allowFullScreen="true"></iframe>
            </div>
          </section>
          {/* <Arrow anchor="/#instagram" /> */}
        </ContentMiddle>
        <ContentMiddle id="instagram">
          <section>
            <a href="https://instagram.com/mayeulchassagnard"><h3><FiInstagram />{' '}</h3></a>
            <div className="iframe-container" >
              <iframe src="https://www.instagram.com/p/B6OWhDGoR41/embed/captioned" width="320" height="540" frameborder="0" scrolling="no" allowTransparency="true"></iframe>
            </div>
          </section>
          {/* <Arrow anchor="/#flickr" /> */}
        </ContentMiddle>
        <ContentMiddle id="flickr">
          <section>
          <a href="https://www.flickr.com/photos/mayeulchassagnard/"><h3><FiCamera />{' '}</h3></a>
            <div className="iframe-container" >
            <a data-flickr-embed="true" data-context="true" data-header="true" href="https://www.flickr.com/photos/mayeulchassagnard/49249942532/" title="People Shooting by mayeulchassagnard, on Flickr"><img src="https://live.staticflickr.com/65535/49249942532_b709c9aa9a_b.jpg" width="100%" alt="PeopleShooting"></img></a><script async src="https://embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
            </div>
          </section>
          {/* <Arrow anchor="/#galleries" /> */}
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
    }
  }
`

export default Index
