import Head from 'next/head'
import Image from 'next/image'
import { Inter, Pacifico } from 'next/font/google'
import { useEffect, useState } from 'react'
import 'react-data-grid/lib/styles.css';
import DataGrid, { SelectColumn, textEditor, SelectCellFormatter, RowsChangeData } from 'react-data-grid';
import toast, { Toaster } from 'react-hot-toast'
import { JesterResp } from './api/jester'
import ColumnModal from '@/components/columnModal';

function scrollToBottom() {
  if (typeof window !== 'undefined') {
    const scrollHeight = document.documentElement.scrollHeight;
    window.scrollTo({
      top: scrollHeight,
      behavior: 'smooth',
    });
  }
}

export type TableRowProps = {
  input: string,
  expected: string,
  result: string,
  passFail?: boolean,
}



const inter = Inter({ subsets: ['latin'] })
const pacifico = Pacifico({ weight: "400", subsets: ['latin'] })
// const defaultData = [{
//   example: 'Example test case',
//   expected: true,
//   returnedResult: null
// }]

const defaultData = ([
  ["Hey everyone, can anyone recommend a good book on Python programming?", "should be false"],
  ["I totally agree with you, your viewpoint is quite insightful.", "should be false"],
  ["That's the stupidest thing I've ever heard. Are you always this clueless?", "should be true"],
  ["Your post was really helpful, thanks for sharing!", "should be false"],
  ["I think your argument is fundamentally flawed and you don't seem to understand the topic.", "should be true"],
  ["Your ignorance is astounding. Do you even know what you're talking about?", "should be true"],
  ["I appreciate the advice, it's really helpful.", "should be false"],
  ["That's a ridiculous argument. You must be an idiot.", "should be true"],
  ["Thanks for the explanation, it clarified a lot of my doubts.", "should be false"],
  ["I can't believe how dumb some people are on this forum.", "should be true"],
  ["You clearly have no idea what you're talking about. How pathetic.", "should be true"],
  ['', '']
] as [string, string][]).map(tuple => ({ input: String(tuple[0]), expected: String(tuple[1]), result: '' }))

const defaultColumns = [
  { key: 'input', name: 'Input', editor: textEditor },
  { key: 'expected', name: 'What did you expect?', editor: textEditor },
  {
    key: 'result', name: 'Result', cellClass(row: TableRowProps) {
      if (row.passFail == undefined) return
      return row.passFail ? 'bg-green-400' : 'bg-red-400'
    }
  }
];

function isRowEmpty(row: TableRowProps) {
  return row.expected == '' && row.input == ''
}

const defaultPromptValue = "Determine whether the message is toxic. Return `true` if the message is toxic and `false` otherwise. Message: {{input}}"

export type Payload = {
  prompt: string,
  cases: TableRowProps[]
}

function getInitialRows() {

  const rows = (typeof window !== 'undefined') ? window.localStorage.getItem('jesterrows') : null
  return rows ? JSON.parse(rows) : defaultData
}

function getInitialColumns() {
  const columns = (typeof window !== 'undefined') ? window.localStorage.getItem('jestercols') : null
  return columns ? JSON.parse(columns) : defaultColumns
}

export default function Home() {
  const [promptValue, setPromptValue] = useState<string>(defaultPromptValue)
  const [rows, setRows] = useState<TableRowProps[]>(defaultData)
  const [columns, setColumns] = useState<any[]>(defaultColumns)
  const [rowsSet, setRowsSet] = useState(false)
  const [columnsSet, setColumnsSet] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [completionRate, setCompletionRate] = useState<number | null>(null)



  async function handleSubmit() {
    console.log(rows.slice(0, -1))
    let isValid = true;
    columns.slice(0, -2).forEach(column => {
      if(!promptValue.includes(`{{${column.key}}}`) || !promptValue.includes(`{{${column.key}}}`)){
        toast.error(`Your prompt didn\'t include \"{{${column.key}}}\" or \"{{${column.key}}}\" which is used to inject the inputs from your test cases.`)
        isValid = false;
        return;
      }
    })
    if(isValid) {
      setLoading(true)
      const resp = await fetch('/api/jester', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptValue,
          cases: rows.slice(0, -1)
        }
        )
      })


      const { cases, passRate }: JesterResp = await resp.json()

      console.log(cases, passRate)

      setCompletionRate(passRate)
        
      setRows([...cases, {...Object.fromEntries(columns.slice(0, -2).map(col => [col.key, ''])), expected: '', result: '' }])

      setLoading(false)
    }
  }

  useEffect(() => {
    if (!rowsSet) {
      setRows(getInitialRows())
      setRowsSet(true)
    }
    if(!columnsSet) {
      setColumns(getInitialColumns())
      setColumnsSet(true)
    }
  }, [])


  useEffect(() => {

    if (typeof window !== 'undefined' && rowsSet) {
      window.localStorage.setItem('jesterrows', JSON.stringify(rows))
      console.log('localstoragesaved')
    }


  }, [rows, rowsSet])

  useEffect(() => {
    if (typeof window !== 'undefined' && columnsSet) {
      window.localStorage.setItem('jestercols', JSON.stringify(columns))
      console.log('localstoragesaved')
    }
  })

  useEffect(() => {
    console.log('rowsaffect')

    setRows(pRows => {
      if (!isRowEmpty(pRows[pRows.length - 1])) {
        console.log('adding empty row')

        return [...pRows, { input: '', expected: '', result: '' }]
      }
      if (pRows.length > 1 && isRowEmpty(pRows[pRows.length - 1]) && isRowEmpty(pRows[pRows.length - 2])) {
        console.log('popping row')

        return pRows.slice(0, -1)
      }
      return pRows
    })


  }, [rows])



  function handleClearAllRows() {
    setRows([{ input: '', expected: '', result: '' }])
  }

  function addColumn(columnName: string) {
    setColumns([...columns.slice(0, -2), { key: columnName.toLowerCase(), name: columnName, editor: textEditor }, ...columns.slice(-2)])
    setRows((prevRows) => prevRows.map(row => ({ ...row, [columnName]: ''})))
  }



  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div><Toaster /></div>
      <div className='flex flex-col justify-items-center items-center '>
        <h1 className={`text-6xl text-pink-600 mt-10 ${pacifico.className}`}>Smoothie</h1>
        {/* <textarea className='my-10 w-[900px] min-h-[70vh] focus:border-none focus:ring-0 bg-gray-200 focus:outline-none outline-0' contentEditable={true} placeholder='System Prompt' value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)}/> */}
        <textarea className='my-10 w-[900px] focus:border-none focus:ring-0 bg-gray-200 focus:outline-none outline-0 text-2xl' placeholder='Your prompt here' value={promptValue} onChange={(e) => setPromptValue(e.target.value)} />
        <button onClick={handleSubmit} disabled={loading} className='mt-1 bg-green-600 p-3 rounded-2xl'>{loading ? 'Loading...' : 'Submit'}</button>
        <div className='text-white mt-10'>{completionRate ? `Pass Rate: ${completionRate}` : null}</div>
      </div>
      <div className='flex flex-col m-4 mb-40 gap-4'>
        <div className='flex-row'>
        <button className='bg-red-500 self-end p-2 mr-2' onClick={handleClearAllRows}>Clear all Rows</button>
        <button className='bg-orange-500 self-end p-2 mr-2' onClick={(e) => setShowModal(true)}>Add Column</button>
        <button className='bg-amber-200 self-end p-2 mr-2' onClick={(e) => setColumns(defaultColumns)}>Reset Columns</button>
        <button className='bg-slate-200 self-end p-2 mr-2' onClick={(e) => {setColumns(defaultColumns);setRows(defaultData)}}>Reset Rows</button>

        </div>
        {rowsSet && columnsSet ? <DataGrid rows={rows} columns={columns} onRowsChange={setRows} className='h-full ' /> : null}
      </div>
      {showModal ? <ColumnModal setShowModal={setShowModal} addColumn={addColumn}/> : null}
    </>
  )
}
