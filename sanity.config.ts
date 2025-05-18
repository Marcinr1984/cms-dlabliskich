import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'cms-dlabliskich',

  projectId: '6qwm6uei',
  dataset: 'dlabliskich',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
