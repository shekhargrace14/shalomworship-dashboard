'use client';

import { Field, FieldLabel } from '@/components/ui/field';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;

  totalPages: number;
};

export function PaginationIconsOnly({ page, setPage, limit, setLimit, totalPages }: Props) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* ROWS PER PAGE */}

      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>

        <Select
          value={String(limit)}
          onValueChange={(value) => {
            setLimit(Number(value));

            // RESET PAGE
            setPage(1);
          }}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>

          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>

              <SelectItem value="25">25</SelectItem>

              <SelectItem value="50">50</SelectItem>

              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
