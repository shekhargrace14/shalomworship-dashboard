import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export default function PaginationComponent({ page, setPage, totalPages, setCurrentPage }: any) {
  return (
    <>
      <Pagination className="mt-8">
        <PaginationContent>
          {/* PREVIOUS */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              onClick={(e) => {
                e.preventDefault();

                if (page > 1) {
                  setPage((prev: any) => prev - 1);
                }
              }}
            />
          </PaginationItem>

          {/* PAGE NUMBERS */}

          {totalPages <= 10 ? (
            // SHOW ALL PAGES
            Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={page === pageNumber}

                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                      setCurrentPage(pageNumber.toString());
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })
          ) : (
            <>
              {/* FIRST PAGE */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* LEFT ELLIPSIS */}
              {page > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* MIDDLE PAGES */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                if (pageNumber !== 1 && pageNumber !== totalPages && pageNumber >= page - 1 && pageNumber <= page + 1) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                return null;
              })}

              {/* RIGHT ELLIPSIS */}
              {page < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* LAST PAGE */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === totalPages}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* NEXT */}
          <PaginationItem>
            <PaginationNext
              href="#"
              className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
              onClick={(e) => {
                e.preventDefault();

                if (page < totalPages) {
                  setPage((prev: any) => prev + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
