
type PaginationParams = {
  currentPage: number
  totalData: number
  pageSize: number
  nextFn?: () => void
  prevFn?: () => void
}

const Pagination = (props: PaginationParams) => {
  return (
    <>
    <div className="mb-2">
      <p>Showing {(props.pageSize * (props.currentPage - 1)) + 1} to {(props.currentPage * props.pageSize) > props.totalData ? props.totalData : props.pageSize * props.currentPage} of {props.totalData} Entries</p>
    </div>
    <div className="flex">
      <div>
        <button 
          className="bg-primary text-white px-4 py-2 rounded-md mr-1"
          onClick={() => {props.prevFn && props.prevFn()}}
        >
          Previous
        </button>
      </div>
      <div>
        <button 
          className="bg-primary text-white px-4 py-2 rounded-md mr-1"
          onClick={() => {props.nextFn && props.nextFn()}}
        >
          Next
        </button>
      </div>
    </div>
    </>
  )
}

export default Pagination