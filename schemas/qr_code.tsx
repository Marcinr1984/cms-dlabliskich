import { defineField, defineType } from 'sanity'
import React from 'react'

export default defineType({
  name: 'qr_code',
  title: 'Kod QR',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Unikalny identyfikator (slug)',
      type: 'slug',
      options: { source: 'slug', maxLength: 96 },
    }),
    defineField({
      name: 'svg',
      title: 'Kod QR (SVG)',
      type: 'text',
      readOnly: true,
      components: {
        input: (props) => {
          if (!props.value) return null

          const downloadSvg = () => {
            const blob = new Blob([props.value], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${props?.document?.slug?.current || 'qr-code'}.svg`
            a.click()
            URL.revokeObjectURL(url)
          }

          return (
            <div>
              {/* Podgląd SVG */}
              <div
                dangerouslySetInnerHTML={{ __html: props.value }}
                style={{
                  width: '200px',
                  height: 'auto',
                  background: '#fff',
                  padding: '1rem',
                  display: 'inline-block',
                  borderRadius: '8px',
                }}
              />
              {/* Przycisk pobierania */}
              <button
                type="button"
                onClick={downloadSvg}
                style={{
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Pobierz kod QR
              </button>
              {/* Pole tekstowe z kodem SVG */}
              <textarea
                value={props.value}
                readOnly
                style={{
                  width: '100%',
                  height: '120px',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                }}
              />
            </div>
          )
        },
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['generated', 'ready', 'printed', 'archived'],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'dataDruku',
      title: 'Data druku',
      type: 'datetime',
    }),
  ],
})
