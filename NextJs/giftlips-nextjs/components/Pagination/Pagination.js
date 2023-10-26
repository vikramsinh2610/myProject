import React from 'react'

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

  const pageNumbers = [...Array(nPages + 1).keys()].slice(1)
  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1)
  }
  return (
    <nav>
      <ul className="pagination justify-content-end">
        <li className="page-item page-item-actionBtn">
          <a className="page-link text-darkGreen" onClick={prevPage} href="#">
            Previous
          </a>
        </li>
        {pageNumbers.map((pgNumber) => (
          <li key={pgNumber} className={`page-item ${currentPage == pgNumber ? 'active' : ''} `}>
            <a
              onClick={() => setCurrentPage(pgNumber)}
              className={`page-link text-darkGreen ${
                currentPage == pgNumber ? 'text-white bg-darkGreen border-darkGreen' : ''
              } `}
              href="#"
            >
              {pgNumber}
            </a>
          </li>
        ))}
        <li className="page-item page-item-actionBtn">
          <a className="page-link text-darkGreen" onClick={nextPage} href="#">
            Next
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
