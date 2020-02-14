import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'
import * as chroma from 'chroma-js'

interface Data {
  colors: string
  count: string
  localStyles: string
  name: string | undefined
  errors: {
    colors?: string
    count?: string
    localStyles?: string
    name?: string | undefined
  }
}

const App = () => {
  const [data, setData] = React.useState<Data>({
    colors: '',
    count: '5',
    localStyles: 'no',
    name: '',
    errors: {}
  })
  const [withLocalStyles, setWithLocalStyles] = React.useState(false)
  const [generalError, setGeneralError] = React.useState<string>('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value })
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget
    if (value === 'css' || value === 'regular') setWithLocalStyles(true)
    else setWithLocalStyles(false)
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value })
  }

  const onCreate = ({ close }: { close: boolean }) => {
    // Validate
    let errorsObj: any = {}
    if (!data.colors.length) errorsObj.colors = "Can't be empty"
    if (!data.count.length) errorsObj.count = "Can't be empty"
    else if (isNaN(parseInt(data.count))) errorsObj.count = 'Not a number!'
    if (data.localStyles !== 'no' && !data.name.length) {
      errorsObj.name = "Can't be empty"
    }
    if (Object.keys(errorsObj).length) {
      return setData({ ...data, errors: errorsObj })
    }
    setData({ ...data, errors: {} })
    // Everything is nice and clean here
    try {
      const scale = chroma
        .scale(data.colors.split(',').map(c => c.trim()))
        .colors(parseInt(data.count))
      let colors = []
      for (let i = 0; i < parseInt(data.count); i++) {
        colors.push(chroma(scale[i]).gl())
      }
      setGeneralError('')
      parent.postMessage(
        {
          pluginMessage: {
            type: 'create-scale',
            colors,
            localStyles: data.localStyles,
            name: data.name,
            close
          }
        },
        '*'
      )
    } catch (error) {
      setGeneralError(error.message)
    }
  }

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
  }

  return (
    <div>
      <div className="logo" />
      <h2>Chroma Scales</h2>
      {generalError && <p className="general-error">{generalError}</p>}
      <div className="input-container">
        <label htmlFor="colors">Colors (separated by commas)</label>
        <input
          name="colors"
          id="colors"
          type="text"
          value={data.colors}
          onChange={handleChange}
          maxLength={1000}
        />
        {data.errors.colors && (
          <div className="error">{data.errors.colors}</div>
        )}
      </div>
      <div className="input-container">
        <label htmlFor="count">Number of colors</label>
        <input
          name="count"
          id="count"
          type="number"
          value={data.count}
          onChange={handleChange}
        />
        {data.errors.count && <div className="error">{data.errors.count}</div>}
      </div>
      <div className="input-container">
        <label htmlFor="count">Save to local styles</label>
        <select
          name="localStyles"
          id="localStyles"
          value={data.localStyles}
          onChange={handleSelectChange}
        >
          <option value="no" defaultChecked>
            No
          </option>
          <option value="css">Yes, as CSS Props (--grey-1)</option>
          <option value="regular">Yes please, regular (grey-1)</option>
        </select>
        {data.errors.localStyles && (
          <div className="error">{data.errors.localStyles}</div>
        )}
      </div>
      <div className="input-container">
        <label htmlFor="colors">Name (for local styles)</label>
        <input
          name="name"
          id="name"
          type="text"
          value={data.name}
          onChange={handleChange}
          maxLength={100}
          disabled={!withLocalStyles}
        />
        {data.errors.name && <div className="error">{data.errors.name}</div>}
      </div>
      <button className="create" onClick={() => onCreate({ close: true })}>
        Create and close
      </button>
      <button onClick={() => onCreate({ close: false })}>Create</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react-page'))
