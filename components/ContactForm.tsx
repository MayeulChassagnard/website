'use client'

import { useState, type FormEvent } from 'react'

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

const FIELD =
  'w-full border-0 border-b border-line bg-transparent px-0 py-4 text-bone placeholder:text-bone-faint outline-none transition-colors duration-500 focus:border-bone'

/**
 * Netlify Forms detection is build-time and static-HTML based: it scans the
 * prerendered markup for data-netlify="true" plus the hidden form-name input.
 * Both must survive into the shipped HTML (so this page must stay statically
 * prerendered, no force-dynamic), and the submit must remain a plain fetch
 * POST: routing it through a Next Route Handler would hand the request to
 * Next's server instead of letting Netlify's own forms backend intercept it.
 */
export default function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      await fetch('/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...values }),
      })
      setStatus('success')
      setValues({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border-t border-line pt-10">
        <p className="d-md text-bone">Message reçu.</p>
        <p className="body-copy mt-3">Je reviens vers vous rapidement.</p>
      </div>
    )
  }

  return (
    <form
      name="contact"
      onSubmit={handleSubmit}
      data-netlify="true"
      data-netlify-honeypot="bot"
      className="flex flex-col gap-8"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Ne pas remplir : <input name="bot" onChange={handleChange} />
        </label>
      </p>

      <input
        name="name"
        type="text"
        placeholder="Nom"
        value={values.name}
        onChange={handleChange}
        required
        className={FIELD}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
        required
        className={FIELD}
      />
      <textarea
        name="message"
        placeholder="Le projet"
        value={values.message}
        onChange={handleChange}
        required
        rows={6}
        className={`${FIELD} resize-y`}
      />

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="label mt-4 self-start border-b border-bone-faint pb-2 text-bone transition-colors duration-500 hover:border-bone disabled:opacity-40"
      >
        {status === 'submitting' ? 'Envoi' : 'Envoyer'}
      </button>

      {status === 'error' && (
        <p className="body-copy text-sm">
          Une erreur est survenue. Écrivez directement à hello@mayeulchassagnard.com.
        </p>
      )}
    </form>
  )
}
