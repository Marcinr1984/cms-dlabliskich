import { DocumentActionComponent, type DocumentActionProps } from 'sanity'
import { useState } from 'react'
import { Button } from '@sanity/ui'

const SyncQrSlugsAction: DocumentActionComponent = (_props: DocumentActionProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/syncQrSlugs', { method: 'POST' })
      if (!response.ok) throw new Error('Błąd sieci')
      alert('Zsynchronizowano dostępne adresy QR ✅')
    } catch (err) {
      console.error(err)
      alert('Błąd podczas synchronizacji ❌')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    label: isLoading ? 'Synchronizuję...' : 'Synchronizuj adresy QR',
    onHandle: handleClick,
    disabled: isLoading,
  }
}

export default SyncQrSlugsAction