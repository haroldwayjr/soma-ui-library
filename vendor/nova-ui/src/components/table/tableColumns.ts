export type TableColumn =
  | {
      fr: number
      min: number
    }
  | {
      width: number
    }

const tableTrack = (column: TableColumn): string => {
  if ('width' in column) {
    return `minmax(${String(column.width)}px, ${String(column.width)}px)`
  }

  return `minmax(${String(column.min)}px, ${String(column.fr)}fr)`
}

export const tableTemplate = (columns: readonly TableColumn[]): string =>
  columns.map(tableTrack).join(' ')
