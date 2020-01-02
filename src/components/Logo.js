import React from 'react'
import { Link } from 'gatsby'

import styled from 'styled-components'

const A = styled(Link)`
  padding: 0;
  img {
    width: 3.5em;
  }
`

const Logo = props => {
  return (
    <A to={`/`} className="noUnderline" alt="Mayeul Chassagnard">
      <img
        src="/logos/MC_logo.svg"
        className="logo"
        alt="Mayeul Chassagnard"
        width="3.5em"
        height="auto"
      />
    </A>
  )
}

export default Logo
