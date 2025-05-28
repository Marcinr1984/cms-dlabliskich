import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemas';
import GenerateQrCodeAction from './components/qrGeneratorAction';

export default defineConfig({
  name: 'default',
  title: 'cms-dlabliskich',
  projectId: '6qwm6uei',
  dataset: 'dlabliskich',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'qr_code') {
        return [...prev, GenerateQrCodeAction];
      }
      return prev;
    },
  },
});
