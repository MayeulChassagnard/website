import React, { useState } from 'react'
import getStripe from '../../utils/stripejs'

const cardStyles = {
  margin: '2rem auto',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'flex-start',
  padding: '1rem',
  marginBottom: '1rem',
  boxShadow: '5px 5px 25px 0 rgba(46,61,73,.2)',
  color: '#000',
  backgroundColor: '#fff',
  borderRadius: '6px',
  maxWidth: '300px',
}
const buttonStyles = {
  display: 'block',
  fontSize: '13px',
  textAlign: 'center',
  color: '#000',
  padding: '12px',
  boxShadow: '2px 5px 10px rgba(0,0,0,.1)',
  backgroundColor: 'rgb(255, 178, 56)',
  borderRadius: '6px',
  letterSpacing: '1.5px',
}

const buttonDisabledStyles = {
  opacity: '0.5',
  cursor: 'not-allowed',
}

const formatPrice = (amount, currency) => {
  let price = (amount / 100).toFixed(2)
  let numberFormat = new Intl.NumberFormat(['fr-FR'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(price)
}

const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)

    const price = new FormData(event.target).get('priceSelect')
    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      mode: price.recurring === null ? 'payment' : 'subscription',
      lineItems: [{ price, quantity: 1 }],
      successUrl: `${window.location.origin}/success/`,
      cancelUrl: `${window.location.origin}/`,
    })

    if (error) {
      console.warn('Error:', error)
      setLoading(false)
    }
  }

  return (
    <div style={cardStyles}>
      <form onSubmit={handleSubmit}>
        <fieldset style={{ border: 'none' }}>
          <legend>
            <img src={product.images}></img>
            <h5>{product.name}</h5>
          </legend>
          <label>
            Price{' '}
            <select name="priceSelect">
              {product.prices.map(price => (
                <option key={price.id} value={price.id}>
                  {formatPrice(price.unit_amount, price.currency) + (price.recurring === null ? "" :  "/" + price.recurring.interval )}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
        <button
          disabled={loading}
          style={
            loading
              ? { ...buttonStyles, ...buttonDisabledStyles }
              : buttonStyles
          }
        >
          Offer me a Coffee =)
        </button>
      </form>
    </div>
  )
}

export default ProductCard
