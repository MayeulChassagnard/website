import React from 'react'
import { graphql } from 'gatsby'
import { Wrapper, Content, ContentBottom } from '../components/Utils'
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
            <Arrow anchor="/#bottom" />
          </section>
        </Content>
        <ContentBottom className="galleries">
          <section id="bottom">
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
