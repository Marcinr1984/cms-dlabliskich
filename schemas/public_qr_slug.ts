import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'public_qr_slug',
  title: 'Dostępne adresy QR',
  type: 'document',
  fields: [
    defineField({
      name: 'qr_slug',
      title: 'Slug',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Link do strony',
      type: 'url',
    }),
    defineField({
      name: 'printed',
      title: 'Czy wydrukowano?',
      type: 'boolean',
    }),
  ],
})