import { Dispatch, SetStateAction } from "react"

export type TableRowProps = {
  example: string,
  expectedResult: boolean,
  returnedResult: boolean | null
}

// export const Cell = (props: React.PropsWithChildren<{ data: TableRowProps[], setData?: Dispatch<SetStateAction<TableRowProps[]>>, contentEditable?: boolean, row: number }>) => {
//   const { data, setData } = props
//   function handleCellChange(r: number, type: "example" | "expectedResult", newVal: string) {
//     console.log(newVal)
//     if (r < 0 || r > data.length) throw new Error()
//     if (!setData) return
//     // if is expectedVal row
//     if (type === "expectedResult") {
//       if (newVal.toLowerCase() !== "false" || newVal.toLowerCase() !== "true") throw new Error('not false or true in expected value')
//       setData(pD => {
//         let data = pD
//         data[r].expectedResult = Boolean(newVal)
//         return data
//       })

//     }
//     // else
//     setData(pD => {
//       let data = pD
//       data[r].example = newVal
//       return data
//     })

//     // if(column == 1) data[r].expectedResult = 

//   }
//   return <div contentEditable={props.contentEditable ?? false} className="min-w-[200px] border border-black" onChange={(e) => handleCellChange(props.row, "example", e.currentTarget.innerText)}>{props.children}</div>
// }

export const Table = ({ data, setData }: { data: TableRowProps[], setData: Dispatch<SetStateAction<TableRowProps[]>> }) => {
  // if (typeof window !== 'undefined') return null
  function handleCellChange(r: number, type: "example" | "expectedResult", newVal: string) {
    console.log(newVal)
    if (r < 0 || r > data.length) throw new Error()
    if (!setData) return
    // if is expectedVal row
    if (type === "expectedResult") {
      if (newVal.toLowerCase() !== "false" || newVal.toLowerCase() !== "true") throw new Error('not false or true in expected value')
      setData(pD => {
        let data = pD
        data[r].expectedResult = Boolean(newVal)
        return data
      })

    }
    // else
    setData(pD => {
      let data = pD
      data[r].example = newVal
      return data
    })

    // if(column == 1) data[r].expectedResult = 

  }
  function addNewRow() {
    setData(pD => [...pD, { example: 'e', expectedResult: false, returnedResult: null }])
  }


  return (
    <div className="bg-slate-200 flex flex-col p-1 px-3">
      <div className="flex flex-row justify-between w-full items-stretch">
        <div className='w-[200px] flex-grow-[3]'>
          Example
        </div>
        <div className='w-[200px] flex-grow-[1]'>
          Expected Result
        </div>
        <div className='w-[200px] flex-grow-[1]'>
          Returned Result
        </div>
      </div>
      <div className="flex flex-col justify-stretch items-stretch">
        {data.map((tr, i) => (
          <div key={i} className="flex flex-row justify-stretch items-stretch">
            <div
              contentEditable={true}
              onChange={(e) => handleCellChange(i, "example", e.currentTarget.innerText)}
              className="focus:outline-none focus:ring-0 p-1 w-[200px] border border-black flex-grow-[3]">
              {tr.example}
            </div>
            <div
              contentEditable={true}
              onChange={(e) => handleCellChange(i, "expectedResult", e.currentTarget.innerText)}
              className="focus:outline-none focus:ring-0 p-1 w-[200px] border-t border-b border-black  grow-[1]">
              {String(tr.expectedResult)}
            </div>
            <div 
            className="focus:outline-none focus:ring-0 p-1 w-[200px] border border-t border-r border-b border-black  grow-[1]">
              {tr.returnedResult}
            </div>
          </div>
        ))}
      </div>
      <button onClick={addNewRow}>add new row</button>
    </div>
  )
}