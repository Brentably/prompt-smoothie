import { useState } from "react"

function ColumnModal({setShowModal, addColumn} : {setShowModal: any, addColumn: any}){

    const [columnName, setColumnName] = useState('')

    const handleSubmit = (e: any) => {
        e.preventDefault()
        addColumn(columnName)
        setShowModal(false)
    }

return(
<div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
              <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">Add Column</h2>
                <button
                  className="text-gray-500 hover:text-gray-400 focus:outline-none"
                  onClick={(e) => setShowModal(false)}
                >
                  <svg
                    className="h-6 w-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 12l5.147-5.146a.5.5 0 1 0-.708-.708L12 11.293 6.854 6.146a.5.5 0 1 0-.708.708L11.293 12l-5.147 5.146a.5.5 0 0 0 .708.708L12 12.707l5.146 5.147a.5.5 0 0 0 .708-.708L12.707 12z"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <label>Column Name</label>
                <input onChange={(e) => {setColumnName(e?.target.value)}} className='border-2 border-gray-300 rounded-md p-2 w-full' />
                <button className='bg-green-500 p-2 rounded-md mt-2' onClick={handleSubmit}>Add Column</button>
              </div>
            </div>
          </div>
        </div>
)

}

export default ColumnModal