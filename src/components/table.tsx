// import { Dispatch, SetStateAction, useEffect } from "react"

export type TableRowProps = {
  input: string,
  expectedResult: string,
  result: string,
  passFail?: boolean
}

// // export const Cell = (props: React.PropsWithChildren<{ data: TableRowProps[], setData?: Dispatch<SetStateAction<TableRowProps[]>>, contentEditable?: boolean, row: number }>) => {
// //   const { data, setData } = props
// //   function handleCellChange(r: number, type: "example" | "expectedResult", newVal: string) {
// //     console.log(newVal)
// //     if (r < 0 || r > data.length) throw new Error()
// //     if (!setData) return
// //     // if is expectedVal row
// //     if (type === "expectedResult") {
// //       if (newVal.toLowerCase() !== "false" || newVal.toLowerCase() !== "true") throw new Error('not false or true in expected value')
// //       setData(pD => {
// //         let data = pD
// //         data[r].expectedResult = Boolean(newVal)
// //         return data
// //       })

// //     }
// //     // else
// //     setData(pD => {
// //       let data = pD
// //       data[r].example = newVal
// //       return data
// //     })

// //     // if(column == 1) data[r].expectedResult = 

// //   }
// //   return <div contentEditable={props.contentEditable ?? false} className="min-w-[200px] border border-black" onChange={(e) => handleCellChange(props.row, "example", e.currentTarget.innerText)}>{props.children}</div>
// // }

// export const Table = ({ data, setData }: { data: TableRowProps[], setData: Dispatch<SetStateAction<TableRowProps[]>> }) => {
//   // if (typeof window !== 'undefined') return null
//   function handleCellChange(r: number, type: "example" | "expectedResult", newVal: string) {
//     console.log('hCC called')
//     console.log(newVal)
//     if (r < 0 || r > data.length) throw new Error()
//     if (!setData) return
//     // if is expectedVal row
//     if (type === "expectedResult") {
//       console.log('2nd col')
//       // if (newVal.toLowerCase() !== "false" || newVal.toLowerCase() !== "true") throw new Error('not false or true in expected value')
//       setData(pD => {
//         let data = pD
//         data[r].expectedResult = Boolean(newVal)
//         return data
//       })

//     }
//     // else
//     setData(pD => {
//       console.log('1st col')
//       let data = pD
//       console.log(data)
//       console.log(r)
//       console.log(data[r])
//       console.log(newVal)
//       data[r].input = newVal
//       console.log(data)
//       return data
//     })

//     // if(column == 1) data[r].expectedResult = 

//   }
//   function addNewRow() {
//     setData(pD => [...pD, { input: '', expectedResult: false, result: null }])
//   }
//   function deleteRow() {
//     setData(pD => pD.slice(0, -1))
//   }

//   useEffect(() => console.log(data), [data])


//   return (
//     <div className="bg-slate-200 flex flex-col p-1 px-3">
//       <div className="flex flex-row justify-between w-full items-stretch">
//         <div className='w-[200px] flex-grow-[3]'>
//           Example
//         </div>
//         <div className='w-[200px] flex-grow-[1]'>
//           Expected Result
//         </div>
//         <div className='w-[200px] flex-grow-[1]'>
//           Returned Result
//         </div>
//       </div>
//       <div className="flex flex-col justify-stretch items-stretch">
//         {data.map((tr, i) => (
//           <div key={i} className="flex flex-row justify-stretch items-stretch">
//             <input
              
//               onChange={(e) => handleCellChange(i, "example", e.target.value)}
//               className="block focus:outline-none focus:ring-0 p-1 w-[200px] border border-black flex-grow-[3]"
//               value={tr.example}
//               />
//             <input
//               onChange={(e) => handleCellChange(i, "expectedResult", e.target.value)}
//               className="block focus:outline-none focus:ring-0 p-1 w-[200px] border-t border-b border-black  grow-[1]"
//               value={String(tr.expectedResult)}>
//             </input>
//             <div
//               className={`focus:outline-none focus:ring-0 p-1 w-[200px] border border-t border-r border-b border-black  grow-[1] ${tr.passFail !== undefined ? tr.passFail ? 'bg-green-400' : 'bg-red-400' : ''}`}>
//               {tr.returnedResult !== null ? String(tr.returnedResult) : null}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex flex-row justify-items-end items-end self-end">

//         <button onClick={deleteRow} className="border border-black rounded-sm p-2">delete row -</button>
//         <button onClick={addNewRow} className="border border-black rounded-sm p-2">add row +</button>
//       </div>
//     </div>
//   )
// }