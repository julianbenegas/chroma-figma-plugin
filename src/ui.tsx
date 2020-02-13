import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'
import * as chroma from 'chroma-js'

declare function require(path: string): any

const App = () => {
  const [data, setData] = React.useState({ colors: '', count: '5' })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value })
  }

  const onCreate = () => {
    const scale = chroma
      .scale(data.colors.split(',').map(c => c.trim()))
      .colors(parseInt(data.count))
    let colors = []
    for (let i = 0; i < parseInt(data.count); i++) {
      colors.push(chroma(scale[i]).gl())
    }
    parent.postMessage({ pluginMessage: { type: 'create-scale', colors } }, '*')
  }

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }

  return (
    <div>
      <img src={require('./logo.svg')} />
      <h2>Rectangle Creator</h2>
      <p>
        Comma separated colors:{' '}
        <input
          name="colors"
          type="text"
          value={data.colors}
          onChange={handleChange}
        />
      </p>
      <p>
        Count: <input name="count" value={data.count} onChange={handleChange} />
      </p>
      <button id="create" onClick={onCreate}>
        Create
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react-page'))
