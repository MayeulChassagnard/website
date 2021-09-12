import React, { useState } from 'react'
import getStripe from '../utils/stripejs'
import { Buttons } from '../components/Utils'

const Checkout = () => {
  const [loading, setLoading] = useState(false)

  const redirectToCheckout = async event => {
    event.preventDefault()
    setLoading(true)

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: [{ price: process.env.GATSBY_BUTTON_PRICE_ID, quantity: 1 }],
      successUrl: `${window.location.origin}/success/`,
      cancelUrl: `${window.location.origin}/`,
    })

    if (error) {
      console.warn('Error:', error)
      setLoading(false)
    }
  }

  return (
    <Buttons>
      <section>
        <a className="button" color="" disabled={loading} onClick={redirectToCheckout}>
            Offer me a Coffee =)
        </a>
      </section>
    </Buttons>
    
  )
}

export default Checkout