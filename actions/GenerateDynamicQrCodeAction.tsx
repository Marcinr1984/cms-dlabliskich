import { DocumentActionComponent } from 'sanity';
import { useDocumentOperation } from 'sanity';
import { useState } from 'react';

const GenerateDynamicQrCodeAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, 'qr_code');
  const [isLoading, setIsLoading] = useState(false);
  const activePageId = props?.document?.activePage;

  const handleClick = async () => {
    if (!activePageId) {
      alert('Brak aktywnej strony pamięci!');
      return;
    }

    setIsLoading(true);
    try {
      const QRCode = (await import('qrcode')).default;
      const url = `https://qr.dlabliskich.pl/memorial/${activePageId}`;
      const qrSvg = await QRCode.toString(url, { type: 'svg', margin: 0 });

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
    label: isLoading ? 'Generuję...' : 'Generuj dynamiczny kod QR',
    onHandle: handleClick,
    disabled: isLoading,
  };
};

export default GenerateDynamicQrCodeAction;
