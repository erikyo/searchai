import {ChangeEvent, useState} from 'react'
import './style/App.css'
import {aiTrain, aiPredict} from "./ml/process.ts";
import {showVisor} from "./ml/utils.ts";
import {MAXLEN,  EPOCHS, BATCHSIZE} from "./const.ts";
import * as tf from "@tensorflow/tfjs";
import {Upload} from "./components/fileinput.tsx";

function App() {
  const [prediction, setPrediction] = useState('')
  const [maxLength, setMaxLength] = useState(MAXLEN)
  const [batchSizeValue, setBatchSizeValue] = useState(BATCHSIZE)
  const [epochsValue, setEpochsValue] = useState(EPOCHS)
  const [words, setWords] = useState([])
  const [model, setModel] = useState(tf.sequential())
  const [status, setStatus] = useState('ready')
  const [trainStatus, setTrainStatus] = useState('none')

  // @ts-ignore
  // @ts-ignore
  return (
    <div className={'container mx-auto my-12'}>
      <div>
        <h1 className={"text-5xl font-bold "}>Search autocomplete</h1>
        <p>Upload a text file to predict the next word</p>
      </div>
      <div>
        <div className={'h-32 w-full'}>

          <div className="relative p-2 mt-4 border border-gray-200 rounded-lg w-full">
            <input
              type="text"
              className="rounded-md p-3 w-full"
              placeholder="Search..."
              maxLength={maxLength}
              onChange={(event) => {
                if (words.length <= 2) {
                  alert('No dataset')
                  return
                } else {
                  setStatus('🟡 initializing...')
                }
                const prediction = aiPredict(event.target.value, model)
                if (prediction.length > 2) {
                  setPrediction(prediction.join(""))
                  setTrainStatus('block')
                  setStatus('🟢 ready')
                } else {
                  setPrediction('')
                  setTrainStatus('🔴 none')
                }
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

          <div className={'relative p-2 bg-gray-100 rounded-b-lg w-full'} style={{transition: 'opacity 0.5s', opacity: trainStatus === 'none' ? 0 : 1 }}>
            <input type="text" id="pred_labels" className={'rounded-md p-3 bg-gray-100 w-full'} value={prediction} readOnly={true}/>
          </div>

        </div>
      </div>

      <div className={'flex flex-col w-100 gap-2'}>
        <h5 className={'text-2xl font-bold mt-4'}>Upload Dataset</h5>
        <div>
          <Upload setWords={setWords} uploadCallback={() => {
            setStatus('🔝 upload complete')
          }}/>
          <label id="file_name">Supported format: csv, tsv, txt.</label>
        </div>
        <button className={'button button--primary bg-blue-700 text-white rounded py-2 px-4 m-2'} hidden={words.length < 1} value="Train" onClick={async () => {
          setStatus('🕜 training...')
          await aiTrain(words, model, setModel)
        }}>
          Train
        </button>
      </div>

      <button className={'button button--primary border border-gray-200 text-gray-900 rounded w-full py-2 px-4 m-2'} onClick={() => showVisor()}>
        <span style={{display: status}} id="status" aria-hidden="true"></span>
        {status}
      </button>

      <div className={'flex flex-col w-100 gap-2'}>
        <h5 className={'text-2xl font-bold mt-4'}>Parsed Dataset</h5>
        <textarea id="parsed_data" className={"p-4 rounded-2xl"} rows={20} style={{display: 'block'}} disabled
                  value={JSON.stringify(words, null, 2) ?? 'no data'}
        />
      </div>

      <div>
        <h5 className={'text-2xl font-bold mt-4'}>Training Parameters</h5>
        <div>
          <div>
            <label>Max word length</label>
            <input
              type="text"
              id="max_len"
              min={1}
              value={maxLength}
              className={'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'}
              onChange={(el: ChangeEvent<HTMLInputElement>) =>
                // @ts-ignore
                setMaxLength(el.target.value)
              }
            />
          </div>
          <div>
            <label>Epochs</label>
            <input
              type="number"
              value={epochsValue}
              id="epochs"
              className={'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'}
              onChange={(el: ChangeEvent<HTMLInputElement>) =>
                // @ts-ignore
                setEpochsValue(el.target.value)
              }
              min={1}
            />
          </div>
          <div>
            <label>Batch Size</label>
            <input type="number"
                   value={batchSizeValue}
                   id="batch_size"
                   min={1}
                   className={'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'}
                    // @ts-ignore
                   onChange={(el: ChangeEvent<HTMLInputElement>) => setBatchSizeValue(el.target.value)}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default App