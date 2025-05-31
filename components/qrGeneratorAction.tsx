import type { DocumentActionProps } from 'sanity';
import { DocumentActionComponent } from 'sanity';
import { useDocumentOperation } from 'sanity';
import { Button } from '@sanity/ui';
import { useState } from 'react';

const GenerateQrCodeAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { patch, publish } = useDocumentOperation(props.id, 'qr_code');
  const [isLoading, setIsLoading] = useState(false);
  const doc = props.draft || props.published;
  const slug = doc?.slug?.current || doc?.qr_slug_url || 'unknown';
  console.log('DEBUG – Cały dokument:', doc);
  console.log('DEBUG – Slug z dokumentu:', slug);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const QRCode = (await import('qrcode')).default;
      const url = `https://qr.dlabliskich.pl/qr/${slug ?? 'unknown'}`;
      console.log('Generowany URL do QR:', url);
      const qrSvg = await QRCode.toString(url, { type: 'svg' });

      const response = await fetch('/static/logo.svg');
      let logoSvg = await response.text();

      logoSvg = logoSvg
        .replace(/<\?xml[^>]*?>/g, '')
        .replace(/<!DOCTYPE[^>]*?>/g, '')
        .replace(/<svg[^>]*?>/g, '')
        .replace(/<\/svg>/g, '');

      const finalSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="260">
          <g transform="translate(0, 0)">
            ${qrSvg}
          </g>
          <g transform="translate(25, 230) scale(0.3)">
            ${logoSvg}
          </g>
        </svg>
      `;

      patch.execute([{ set: { svg: finalSvg.trim() } }]);
      publish.execute();
      props.onComplete();
    } catch (err) {
      console.error('QR generation failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    label: isLoading ? 'Generuję...' : 'Generuj kod QR',
    onHandle: handleClick,
    disabled: isLoading,
  };
};

export default GenerateQrCodeAction;
