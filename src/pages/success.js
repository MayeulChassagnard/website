import React from 'react'
import { graphql, Link } from 'gatsby'

import { Wrapper, Content, Buttons } from '../components/Utils'
import SEO from '../components/SEO'

const successPage = ({ data }) => {
  const home = data.contentfulHome

  return (
  <>
  <SEO title="Payment Success" image={home.shareImage} />
    <Wrapper>
      <Buttons>
        <section>
          <h1>success !</h1>
        </section>
      </Buttons>
      <Buttons>
        <Link className="button" to="/#buy" >Shop again</Link>
      </Buttons>
    </Wrapper>
  </>
  )
}

export const query = graphql`
  query successPage {
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

export default successPage