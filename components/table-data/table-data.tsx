
import * as React from "react"
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Filter as FilterIcon } from "lucide-react"

import { Tabs as UiTabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Condition } from "./table-conditions"

/** ===================== TYPES ===================== */

export type TableDataColumnProps<TData> = {
  name: keyof TData & string
  label: string
  render?: (value: unknown, row: TData) => React.ReactNode
}

type TableDataColumnsProps<TData> = {
  children:
  | React.ReactElement<TableDataColumnProps<TData>>
  | Array<React.ReactElement<TableDataColumnProps<TData>>>
}

export type TableDataTabProps<TData> = {
  tabKey?: string
  name?: keyof TData & string
  label: string
  condition: Condition
  value?: unknown
}

type TableDataTabsProps<TData> = {
  activeKey?: string
  onActiveKeyChange?: (key: string) => void
  defaultKey?: string
  children:
  | React.ReactElement<TableDataTabProps<TData>>
  | Array<React.ReactElement<TableDataTabProps<TData>>>
}

/** SERVER FILTER: configurado no JSX, renderizado em modal */
export type TableDataFilterProps<TData> = {
  name: keyof TData & string
  label: string
  condition: Condition
  placeholder?: string
  defaultValue?: string
  trim?: boolean
}

type TableDataFiltersProps<TData> = {
  title?: string
  children:
  | React.ReactElement<TableDataFilterProps<TData>>
  | Array<React.ReactElement<TableDataFilterProps<TData>>>
}

export type FilterItem = {
  field: string
  condition: Condition
  value: string
}

export type TableDataProps<TData> = {
  data: TData[]
  emptyText?: string

  tabKey?: string
  onTabKeyChange?: (key: string) => void
  defaultTabKey?: string

  maxHeightClassName?: string

  /** coluna de ações */
  actionsKey?: string
  actionsWidthClassName?: string

  /**
   * Dispara quando o usuário clicar em "Filtrar" no modal.
   * Você recebe URLSearchParams com f= repetido no formato field|COND|value
   */
  onServerFilterChange?: (payload: { filters: FilterItem[]; params: URLSearchParams }) => void

  children: React.ReactNode
}

/** ===================== MARKER COMPONENTS ===================== */

const TABLEDATA_COLUMNS = "TableData.Columns"
const TABLEDATA_COLUMN = "TableData.Column"
const TABLEDATA_TABS = "TableData.Tabs"
const TABLEDATA_TAB = "TableData.Tab"
const TABLEDATA_FILTERS = "TableData.Filters"
const TABLEDATA_FILTER = "TableData.Filter"

function Columns<TData>(_props: TableDataColumnsProps<TData>) {
  return null
}
; (Columns as any).__TABLEDATA_TYPE = TABLEDATA_COLUMNS
Columns.displayName = TABLEDATA_COLUMNS

function Column<TData>(_props: TableDataColumnProps<TData>) {
  return null
}
; (Column as any).__TABLEDATA_TYPE = TABLEDATA_COLUMN
Column.displayName = TABLEDATA_COLUMN

function Tabs<TData>(_props: TableDataTabsProps<TData>) {
  return null
}
; (Tabs as any).__TABLEDATA_TYPE = TABLEDATA_TABS
Tabs.displayName = TABLEDATA_TABS

function Tab<TData>(_props: TableDataTabProps<TData>) {
  return null
}
; (Tab as any).__TABLEDATA_TYPE = TABLEDATA_TAB
Tab.displayName = TABLEDATA_TAB

function Filters<TData>(_props: TableDataFiltersProps<TData>) {
  return null
}
; (Filters as any).__TABLEDATA_TYPE = TABLEDATA_FILTERS
Filters.displayName = TABLEDATA_FILTERS

function Filter<TData>(_props: TableDataFilterProps<TData>) {
  return null
}
; (Filter as any).__TABLEDATA_TYPE = TABLEDATA_FILTER
Filter.displayName = TABLEDATA_FILTER

/** ===================== INTERNAL HELPERS ===================== */

function isMarked(el: unknown, marker: string): el is React.ReactElement {
  return (
    React.isValidElement(el) &&
    typeof el.type !== "string" &&
    (el.type as any).__TABLEDATA_TYPE === marker
  )
}

function getChildren(node: unknown): React.ReactNode | null {
  if (!React.isValidElement(node)) return null
  const props = node.props as { children?: React.ReactNode } | undefined
  return props?.children ?? null
}

function findFirstDeep(children: React.ReactNode, marker: string): React.ReactElement | null {
  const arr = React.Children.toArray(children)
  for (const child of arr) {
    if (isMarked(child, marker)) return child as React.ReactElement
    const nested = getChildren(child)
    if (nested) {
      const found = findFirstDeep(nested, marker)
      if (found) return found
    }
  }
  return null
}

function extractColumnsNode<TData>(children: React.ReactNode) {
  const node = findFirstDeep(children, TABLEDATA_COLUMNS)
  if (!node) return [] as Array<React.ReactElement<TableDataColumnProps<TData>>>

  const colChildren = React.Children.toArray(getChildren(node))
  return colChildren.filter((c) => isMarked(c, TABLEDATA_COLUMN)) as Array<
    React.ReactElement<TableDataColumnProps<TData>>
  >
}

type ExtractedTabs<TData> = {
  tabsNode: React.ReactElement<TableDataTabsProps<TData>>
  tabs: Array<React.ReactElement<TableDataTabProps<TData>>>
  keys: string[]
}

function safeKeyFromTab<TData>(tab: TableDataTabProps<TData>, index: number) {
  if (tab.tabKey) return tab.tabKey
  const n = tab.name ? String(tab.name) : "all"
  const l = tab.label ? String(tab.label) : "tab"
  return `${index}:${n}:${l}`
}

function extractTabsNode<TData>(children: React.ReactNode): ExtractedTabs<TData> | null {
  const node = findFirstDeep(children, TABLEDATA_TABS)
  if (!node) return null

  const tabChildren = React.Children.toArray(getChildren(node))
  const tabs = tabChildren.filter((t) => isMarked(t, TABLEDATA_TAB)) as Array<
    React.ReactElement<TableDataTabProps<TData>>
  >
  if (tabs.length === 0) return null

  const keys = tabs.map((t, i) => safeKeyFromTab(t.props, i))
  return { tabsNode: node as React.ReactElement<TableDataTabsProps<TData>>, tabs, keys }
}

type ExtractedFilters<TData> = {
  filtersNode: React.ReactElement<TableDataFiltersProps<TData>>
  filters: Array<React.ReactElement<TableDataFilterProps<TData>>>
}

function extractFiltersNode<TData>(children: React.ReactNode): ExtractedFilters<TData> | null {
  const node = findFirstDeep(children, TABLEDATA_FILTERS)
  if (!node) return null

  const filterChildren = React.Children.toArray(getChildren(node))
  const filters = filterChildren.filter((t) => isMarked(t, TABLEDATA_FILTER)) as Array<
    React.ReactElement<TableDataFilterProps<TData>>
  >
  if (filters.length === 0) return null

  return { filtersNode: node as React.ReactElement<TableDataFiltersProps<TData>>, filters }
}

function buildColumnDefs<TData>(
  columnNodes: Array<React.ReactElement<TableDataColumnProps<TData>>>
): ColumnDef<TData>[] {
  return columnNodes.map((node) => {
    const { name, label, render } = node.props
    return {
      accessorKey: name,
      header: label,
      cell: (ctx) => {
        const row = ctx.row.original
        const value = ctx.getValue()
        return render ? render(value, row) : value != null ? String(value) : ""
      },
    } satisfies ColumnDef<TData>
  })
}

function applyTabFilter<TData>(rows: TData[], tab: TableDataTabProps<TData>): TData[] {
  try {
    if (!tab || tab.condition === Condition.ALL) return rows
    if (!tab.name) return rows

    const field = tab.name
    const target = tab.value

    return rows.filter((r) => {
      const v = (r as any)?.[field]
      switch (tab.condition) {
        case Condition.EQUAL:
          return v === target
        case Condition.NOT_EQUAL:
          return v !== target
        case Condition.GREATER_THAN:
          return Number(v) > Number(target)
        case Condition.GREATER_OR_EQUAL:
          return Number(v) >= Number(target)
        case Condition.LESS_THAN:
          return Number(v) < Number(target)
        case Condition.LESS_OR_EQUAL:
          return Number(v) <= Number(target)
        case Condition.LIKE:
          return String(v ?? "").toLowerCase().includes(String(target ?? "").toLowerCase())
        case Condition.STARTS_WITH:
          return String(v ?? "").toLowerCase().startsWith(String(target ?? "").toLowerCase())
        case Condition.ENDS_WITH:
          return String(v ?? "").toLowerCase().endsWith(String(target ?? "").toLowerCase())
        case Condition.IN:
          return Array.isArray(target) ? target.includes(v) : true
        default:
          return true
      }
    })
  } catch {
    return rows
  }
}

function buildServerParams(filters: FilterItem[]) {
  const params = new URLSearchParams()
  for (const f of filters) {
    params.append("f", `${f.field}|${f.condition}|${f.value}`)
  }
  return params
}

/** ===================== MAIN COMPONENT ===================== */

function TableDataInner<TData>({
  data,
  emptyText = "Nenhum registro encontrado.",

  tabKey,
  onTabKeyChange,
  defaultTabKey,

  maxHeightClassName = "max-h-[calc(100dvh-240px)]",

  actionsKey = "acoes",
  actionsWidthClassName = "w-[140px]",

  onServerFilterChange,

  children,
}: TableDataProps<TData>) {
  const columnNodes = React.useMemo(() => extractColumnsNode<TData>(children), [children])
  const columns = React.useMemo(() => buildColumnDefs<TData>(columnNodes), [columnNodes])

  const tabsExtracted = React.useMemo(() => extractTabsNode<TData>(children), [children])
  const filtersExtracted = React.useMemo(() => extractFiltersNode<TData>(children), [children])

  // Tabs control
  const tabsProps = tabsExtracted?.tabsNode?.props
  const controlledKey = tabKey ?? tabsProps?.activeKey
  const controlledOnChange = onTabKeyChange ?? tabsProps?.onActiveKeyChange

  const computedDefault =
    defaultTabKey ?? tabsProps?.defaultKey ?? (tabsExtracted ? tabsExtracted.keys[0] : undefined)

  const [internalKey, setInternalKey] = React.useState<string | undefined>(computedDefault)
  const activeKey = controlledKey ?? internalKey

  const setKey = React.useCallback(
    (k: string) => {
      if (controlledOnChange) controlledOnChange(k)
      if (controlledKey === undefined) setInternalKey(k)
    },
    [controlledOnChange, controlledKey]
  )

  // Modal filter state
  const filtersTitle = filtersExtracted?.filtersNode?.props?.title ?? "Filtros"
  const [openFilters, setOpenFilters] = React.useState(false)

  const initialFilterValues = React.useMemo(() => {
    const map: Record<string, string> = {}
    if (filtersExtracted) {
      for (const f of filtersExtracted.filters) {
        map[String(f.props.name)] = f.props.defaultValue ?? ""
      }
    }
    return map
  }, [filtersExtracted])

  const [filterValues, setFilterValues] = React.useState<Record<string, string>>(initialFilterValues)

  React.useEffect(() => {
    setFilterValues(initialFilterValues)
  }, [initialFilterValues])

  const serverFilters: FilterItem[] = React.useMemo(() => {
    if (!filtersExtracted) return []
    return filtersExtracted.filters
      .map((f) => {
        const field = String(f.props.name)
        const raw = filterValues[field] ?? ""
        const value = f.props.trim === false ? raw : raw.trim()
        return { field, condition: f.props.condition, value }
      })
      .filter((f) => f.value.length > 0)
  }, [filtersExtracted, filterValues])

  const applyServerFilters = React.useCallback(() => {
    if (!onServerFilterChange) {
      setOpenFilters(false)
      return
    }
    const params = buildServerParams(serverFilters)
    onServerFilterChange({ filters: serverFilters, params })
    setOpenFilters(false)
  }, [onServerFilterChange, serverFilters])

  const clearServerFilters = React.useCallback(() => {
    setFilterValues(initialFilterValues)
    if (onServerFilterChange) {
      onServerFilterChange({ filters: [], params: new URLSearchParams() })
    }
    setOpenFilters(false)
  }, [initialFilterValues, onServerFilterChange])

  // Client-side tabs (mantém)
  const filteredData = React.useMemo(() => {
    if (!tabsExtracted || !activeKey) return data
    const idx = tabsExtracted.keys.indexOf(activeKey)
    if (idx < 0) return data
    const tab = tabsExtracted.tabs[idx]?.props
    if (!tab) return data
    return applyTabFilter(data, tab)
  }, [data, tabsExtracted, activeKey])

  const table = useReactTable<TData>({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows

  if (columnNodes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhuma coluna configurada. Use <code>{`<TableData.Columns>`}</code>.
      </div>
    )
  }

  const tabCounts = React.useMemo(() => {
    if (!tabsExtracted) return {}
    const counts: Record<string, number> = {}
    tabsExtracted.tabs.forEach((t, i) => {
      const key = tabsExtracted.keys[i]
      const tabDataFiltered = applyTabFilter(data, t.props)
      counts[key] = tabDataFiltered.length
    })
    return counts
  }, [data, tabsExtracted])

  return (
    <div className="flex flex-col gap-4 min-h-0">
      {/* Top bar: botão Filtros (só aparece se existir TableData.Filters) */}
      {filtersExtracted ? (
        <div className="flex items-center justify-end">
          <Dialog open={openFilters} onOpenChange={setOpenFilters}>
            <DialogTrigger asChild>
              <Button variant="secondary" type="button">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>{filtersTitle}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3">
                {filtersExtracted.filters.map((f) => {
                  const field = String(f.props.name)
                  return (
                    <div key={field} className="grid gap-1.5">
                      <div className="text-sm">{f.props.label}</div>
                      <Input
                        value={filterValues[field] ?? ""}
                        placeholder={f.props.placeholder ?? ""}
                        onChange={(e) =>
                          setFilterValues((prev) => ({ ...prev, [field]: e.target.value }))
                        }
                      />
                    </div>
                  )
                })}
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="secondary" type="button" onClick={clearServerFilters}>
                  Limpar
                </Button>
                <Button type="button" onClick={applyServerFilters}>
                  Filtrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}

      {/* Tabs (client-side) */}
      {tabsExtracted ? (
        <UiTabs value={activeKey} defaultValue={computedDefault} onValueChange={setKey}>
          <TabsList className="h-10">
            {tabsExtracted.tabs.map((t, i) => {
              const key = tabsExtracted.keys[i]
              const count = tabCounts[key] ?? 0
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="gap-2 px-4 data-[state=active]:bg-gray-400/70 data-[state=active]:border-border dark:data-[state=active]:bg-input/30 dark:data-[state=active]:border-input"
                >
                  {t.props.label}
                  <span className="flex h-4 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                    {count}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </UiTabs>
      ) : null}

      {/* Scroll vertical interno + SEM scroll horizontal */}
      <div
        className={`min-h-0 overflow-y-auto overflow-x-hidden rounded-md border ${maxHeightClassName}`}
      >
        <Table className="w-full table-fixed">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              {columnNodes.map((col) => {
                const isAcoes = col.props.name === (actionsKey as any)
                return (
                  <TableHead
                    key={col.props.name}
                    className={isAcoes ? `${actionsWidthClassName} whitespace-nowrap pr-4` : ""}
                  >
                    <div className={isAcoes ? "w-full text-right truncate" : "truncate"}>
                      {col.props.label}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnNodes.length}>
                  <div className="truncate">{emptyText}</div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {columnNodes.map((col) => {
                    const key = col.props.name
                    const value = row.getValue(key)
                    const custom = col.props.render
                    const isAcoes = key === (actionsKey as any)

                    return (
                      <TableCell
                        key={key}
                        className={isAcoes ? `${actionsWidthClassName} whitespace-nowrap pr-4` : ""}
                      >
                        {isAcoes ? (
                          <div className="flex items-center justify-end gap-2">
                            {custom ? custom(value, row.original) : value != null ? String(value) : null}
                          </div>
                        ) : (
                          <div className="truncate">
                            {custom ? custom(value, row.original) : value != null ? String(value) : ""}
                          </div>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

/** Compound export */
export const TableData = Object.assign(TableDataInner, {
  Columns,
  Column,
  Tabs,
  Tab,
  Filters,
  Filter,
}) as (<TData>(props: TableDataProps<TData>) => React.ReactElement) & {
  Columns: <TData>(props: TableDataColumnsProps<TData>) => null
  Column: <TData>(props: TableDataColumnProps<TData>) => null
  Tabs: <TData>(props: TableDataTabsProps<TData>) => null
  Tab: <TData>(props: TableDataTabProps<TData>) => null
  Filters: <TData>(props: TableDataFiltersProps<TData>) => null
  Filter: <TData>(props: TableDataFilterProps<TData>) => null
}
