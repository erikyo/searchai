import {useEffect, useState} from 'react'
import './style/App.css'
import {Upload} from "./components/fileinput.tsx";
import {parseFileData} from "./ml/utils.ts";
import { useRegisterSW } from 'virtual:pwa-register/react'
import { pwaInfo } from 'virtual:pwa-info'

console.log(pwaInfo)

function App() {
  const [predictions, setPredictions] = useState([])
  const [words, setWords] = useState([])
  const [status, setStatus] = useState('ready')
  const [SW, setSW] = useState(null) as ServiceWorkerRegistration

  useRegisterSW(
    {
      onRegisteredSW(swUrl, registration) {
        console.log('SW Registered: ', swUrl)
        if (registration?.active)
          setSW(registration.active)
      },
      onRegisterError(error) {
        console.log('SW registration error: ', error)
      },
    }
  )


// Function to call the worker
  function handlePrediction(value, words) {
    SW.postMessage({type: "predict", value, words})
  }

  function updateWorkerModel(words) {
    SW.postMessage({type: "init", words})
  }

  useEffect(() => {
    if(SW) SW.onmessage( async (event) => {
      const { type, results } = event.data
      if (type === "predict") {
        setPredictions(results)
      }
      if (type === "init") {
        setWords(results)
        updateWorkerModel(results)
        setStatus('ready')
      }
    })
  }, [SW])

  // @ts-ignore
  return (
    <div className={' container my-12 flex flex-col w-9/12 content-center justify-center mx-auto'}>
      <div className={'h-56 w-4/12 mx-auto'}>
        <div className={' text-center'}>
          <h1 className={"text-5xl font-bold "}>Search autocomplete</h1>
          <p>Upload a text file to predict the next word</p>
        </div>
        <div className="relative p-2 mt-4 border border-gray-200 rounded-lg w-100">
          <input
            type="text"
            className="rounded-md p-3 w-full"
            placeholder="Search..."
            onChange={async (event) => {
              if (words.length <= 2) {
                alert('No dataset')
                return
              }
              setStatus('🟡 initializing...')
              // Note: Not passing the `model` to the handler anymore
              handlePrediction(event.target.value, words);
            }}
          />

          <button type="submit" className="absolute right-6 top-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
          </button>

        </div>

        {predictions ? predictions.map((prediction) => <div className={'relative p-2 bg-gray-100 rounded-b-lg w-full'} style={{transition: 'opacity 0.5s', opacity: trainStatus === 'none' ? 0 : 1}}>
          <div id="pred_labels" className={'rounded-md p-3 bg-gray-100 w-full'}> {prediction.word} (score: {prediction.score.toFixed(2)})</div>
        </div>) : null}

      </div>

      <button className={'w-4/12 button button--primary border border-gray-200 text-gray-900 rounded py-2 px-4 mx-auto'}>
        <span style={{display: status}} id="status" aria-hidden="true"></span>
        {status}
      </button>

      <div className={'flex w-full gap-2 content-center justify-center'} >
        <div className={'flex flex-col w-4/12'}>
          <h5 className={'text-2xl font-bold mt-4'}>Upload Dataset</h5>
          <div>
            <Upload uploadCallback={async (words: string[]) => {
              setStatus('🔝 upload complete')
              updateWorkerModel(words)
            }}/>
            <label id="file_name">Supported format: csv, tsv, txt.</label>
          </div>
        </div>

        <div className={'flex flex-col w-4/12 gap-2'}>
          <h5 className={'text-2xl font-bold mt-4'}>User Dataset</h5>
          <textarea id="user_data" className={"p-4 rounded-2xl bg-white border-2 border-gray-200"} rows={10}/>
          <button className={'button button--primary bg-blue-700 text-white rounded py-2 px-4 m-2'} onClick={() => {
            const data = document.getElementById('user_data') as HTMLTextAreaElement
            updateWorkerModel(parseFileData(data.value))
            setStatus('Custom dataset loaded')
          }}>
            Parse custom dataset
          </button>
        </div>

        <div className={'flex flex-col w-4/12 gap-2'}>
          <h5 className={'text-2xl font-bold mt-4'}>Parsed Dataset</h5>
          <textarea id="parsed_data" className={"p-4 rounded-2xl"} rows={10} style={{display: 'block'}} disabled
                    value={JSON.stringify(words, null, 2) ?? 'no data'}
          />
        </div>
      </div>

    </div>
  )
}

export default App
