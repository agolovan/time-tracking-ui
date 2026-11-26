import { useState } from 'react'

function MainNavigation() {
  const [result, setResult] = useState<unknown>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState('')

  const runEndpoint = async (name: string, url: string) => {
    setLoading(name)
    setError('')
    setResult(null)

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      const data = contentType?.includes('application/json')
        ? await response.json()
        : await response.text()

      setResult(data)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to call the endpoint',
      )
    } finally {
      setLoading('')
    }
  }

  return (
    <section className="navigation-panel">
      <nav className="navigation" aria-label="Main navigation">
        <button
          type="button"
          className="nav-button"
          disabled={loading !== ''}
          onClick={() => runEndpoint('Departments', '/api/Departments')}
        >
          {loading === 'Departments' ? 'Loading...' : 'Departments'}
        </button>
        <button
          type="button"
          className="nav-button"
          disabled={loading !== ''}
          onClick={() => runEndpoint('Time Entries', '/api/timeentries')}
        >
          {loading === 'Time Entries' ? 'Loading...' : 'Time Entries'}
        </button>
      </nav>

      {error && <p className="endpoint-error" role="alert">{error}</p>}
      {result !== null && (
        <pre className="endpoint-result" aria-live="polite">
          {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  )
}

export default MainNavigation
