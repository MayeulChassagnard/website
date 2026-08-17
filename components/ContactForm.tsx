'use client'

import { useState, type FormEvent } from 'react'

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')
}

/**
 * Netlify Forms detection is build-time, static-HTML based: it scans the
 * prerendered markup for data-netlify="true" plus the hidden form-name
 * input. Both must be present in what this page ships as static HTML (no
 * force-dynamic on the page), and the submit must stay a plain fetch POST:
 * routing it through a Next.js Route Handler would hand it to Next's server
 * instead of letting Netlify's own forms backend intercept it.
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
      <div className="border border-line p-10 text-center">
        <p className="font-display text-2xl text-paper">Merci de m&apos;avoir contacté.</p>
        <p className="mt-3 text-paper-dim">Je reviens vers vous rapidement.</p>
      </div>
    )
  }

  return (
    <form
      name="contact"
      onSubmit={handleSubmit}
      data-netlify="true"
      data-netlify-honeypot="bot"
      className="flex flex-col gap-6"
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
        placeholder="Nom complet"
        value={values.name}
        onChange={handleChange}
        required
        className="w-full border-0 border-b border-line bg-transparent px-0 py-4 text-paper placeholder:text-paper-faint outline-none transition-colors focus:border-accent"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
        required
        className="w-full border-0 border-b border-line bg-transparent px-0 py-4 text-paper placeholder:text-paper-faint outline-none transition-colors focus:border-accent"
      />
      <textarea
        name="message"
        placeholder="Message"
        value={values.message}
        onChange={handleChange}
        required
        rows={8}
        className="resize-y w-full border-0 border-b border-line bg-transparent px-0 py-4 text-paper placeholder:text-paper-faint outline-none transition-colors focus:border-accent"
      />

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="eyebrow mt-4 border border-paper-faint px-8 py-4 text-paper transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
      >
        {status === 'submitting' ? 'Envoi...' : 'Envoyer'}
      </button>

      {status === 'error' && (
        <p className="text-red-400">
          Une erreur est survenue, réessayez ou écrivez directement à hello@mayeulchassagnard.com.
        </p>
      )}
    </form>
  )
}
