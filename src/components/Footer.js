import React from 'react'
import { Link } from 'gatsby'
import { Wrapper, Content } from './Utils'
import { FiTwitter, FiInstagram, FiYoutube, FiCamera, FiGithub, FiLinkedin } from 'react-icons/fi'

const Footer = props => {
  return (
    <Wrapper>
      <Content className="footer">
        <section>
          <h2>-</h2>
          <p>
            <Link to="/">Home</Link>&nbsp;&nbsp;&nbsp;
            <Link to="https://mayeulchassagnard.pixieset.com/">Collections</Link>&nbsp;&nbsp;&nbsp;
            <Link to="/blog">Blog</Link>&nbsp;&nbsp;&nbsp;
            <Link to="/contact">Contact</Link>
          </p>
          <p className="small">
            @mayeulchassagnard
          </p>
          <p className="small">
            <a href="https://www.flickr.com/photos/mayeulchassagnard/"><FiCamera />{' '}</a>
            &nbsp;&nbsp;&nbsp;
            <a href="https://instagram.com/mayeulchassagnard"><FiInstagram />{' '}</a>
            &nbsp;&nbsp;&nbsp;
            <a href="https://www.youtube.com/channel/UC7jFlzmU5oltkxkj_11TrnA"><FiYoutube />{' '}</a>
            &nbsp;&nbsp;&nbsp;
            <a href="https://github.com/MayeulChassagnard/"><FiGithub />{' '}</a>
            &nbsp;&nbsp;&nbsp;
            <a href="https://www.linkedin.com/in/mayeulchassagnard/"><FiLinkedin />{' '}</a>
          </p>
          <p>
            <a
              href="https://www.contentful.com/"
              rel="nofollow noopener noreferrer"
              target="_blank"
              alt="Powered by Contentful"
            >
              <picture>
                <source
                  srcSet="https://images.ctfassets.net/fo9twyrwpveg/7F5pMEOhJ6Y2WukCa2cYws/398e290725ef2d3b3f0f5a73ae8401d6/PoweredByContentful_DarkBackground.svg"
                  media="(prefers-color-scheme: dark)"
                />
                <img
                  src="https://images.ctfassets.net/fo9twyrwpveg/44baP9Gtm8qE2Umm8CQwQk/c43325463d1cb5db2ef97fca0788ea55/PoweredByContentful_LightBackground.svg"
                  rel="contentful"
                  style={{ width: '100px' }}
                  alt="Powered by Contentful"
                />
              </picture>
            </a>
            &nbsp;&nbsp;&nbsp;
            <a
              href="https://www.netlify.com"
              rel="nofollow noopener noreferrer"
              target="_blank"
              alt="Netlify"
            >
              <picture>
                <source
                  srcSet="https://www.netlify.com/v3/img/components/full-logo-dark.svg"
                  media="(prefers-color-scheme: dark)"
                />
                <img
                  src="https://www.netlify.com/v3/img/components/full-logo-light.svg"
                  rel="netlify"
                  style={{ width: '100px' }}
                  alt="Netlify"
                />
              </picture>
            </a>
            &nbsp;&nbsp;&nbsp;
            <a href="https://www.stripe.com">
              <picture>
                  <source
                    srcSet="/share/powered_by_stripe.svg"
                    media="(prefers-color-scheme: dark)"
                  />
                  <img
                    src="/share/powered_by_stripe.svg"
                    rel="contentful"
                    style={{ width: '100px' }}
                    alt="Payments powered by Stripe"
                  />
                </picture>
            </a>
          </p>
          <p>Based on   
            <a
              href="https://github.com/iammatthias/.com"
              rel="nofollow noopener noreferrer"
              target="_blank"
              alt="iammatthias"
            >
              &nbsp;
              @iammatthias
              &nbsp;
            </a>template
          </p>
          <p className="small">© 2019 Mayeul Chassagnard. All rights reserved.</p>
          <p className="small">Thank you for watching ♡</p>
        </section>
      </Content>
    </Wrapper>
  )
}

export default Footer
