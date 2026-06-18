import { useState } from 'react'
import './App.css'

interface TripRequest {
  budget: string
  duration: string
  interests: string
  starting_location: string
  travel_scope: string
  popularity: string
}

type TripResult = Record<string, unknown>

const emptyForm: TripRequest = {
  budget: '',
  duration: '',
  interests: '',
  starting_location: '',
  travel_scope: '',
  popularity: '',
}

function App() {
  const [form, setForm] = useState<TripRequest>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TripResult | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setFetchError(null)
    try {
      const res = await fetch('https://travel-agent-production-b572.up.railway.app/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setFetchError('Could not reach the server. Make sure the FastAPI backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <header>
        <h1>Trip Planner</h1>
        <p>Answer a few questions and we'll find your perfect destination.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="budget">What is your budget level?</label>
          <select id="budget" name="budget" value={form.budget} onChange={handleChange} required>
            <option value="">Select budget</option>
            <option value="budget">Budget</option>
            <option value="mid-range">Mid-range</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="duration">How long is your trip?</label>
          <input
            id="duration"
            name="duration"
            type="text"
            placeholder="e.g. 1 week, 10 days"
            value={form.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="interests">What are your travel interests?</label>
          <input
            id="interests"
            name="interests"
            type="text"
            placeholder="e.g. beaches, history, food"
            value={form.interests}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="starting_location">Where are you starting from?</label>
          <input
            id="starting_location"
            name="starting_location"
            type="text"
            placeholder="e.g. Berlin, Munich"
            value={form.starting_location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="travel_scope">Stay in your country or travel abroad?</label>
          <select id="travel_scope" name="travel_scope" value={form.travel_scope} onChange={handleChange} required>
            <option value="">Select preference</option>
            <option value="stay in country">Stay in country</option>
            <option value="go abroad">Go abroad</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="popularity">How popular should the destination be?</label>
          <select id="popularity" name="popularity" value={form.popularity} onChange={handleChange} required>
            <option value="">Select popularity</option>
            <option value="tourist hotspot">Tourist hotspot</option>
            <option value="moderate">Moderate</option>
            <option value="off the beaten path">Off the beaten path</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Planning your trip…' : 'Plan my trip →'}
        </button>
      </form>

      {fetchError && <div className="banner error">{fetchError}</div>}

      {result && (
        <section className="result">
          <h2>Your Recommendation</h2>
          {result.error ? (
            <>
              <div className="banner error">{String(result.error)}</div>
              {result.raw_output && <pre>{String(result.raw_output)}</pre>}
            </>
          ) : (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </section>
      )}
    </main>
  )
}

export default App
