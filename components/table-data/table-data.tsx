import * as React from "react"
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { SlidersHorizontal, X, Search, InboxIcon, Eraser } from "lucide-react"

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

  actionsKey?: string
  actionsWidthClassName?: string

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

function Columns<TData>(_props: TableDataColumnsProps<TData>) { return null }
; (Columns as any).__TABLEDATA_TYPE = TABLEDATA_COLUMNS
Columns.displayName = TABLEDATA_COLUMNS

function Column<TData>(_props: TableDataColumnProps<TData>) { return null }
; (Column as any).__TABLEDATA_TYPE = TABLEDATA_COLUMN
Column.displayName = TABLEDATA_COLUMN

function Tabs<TData>(_props: TableDataTabsProps<TData>) { return null }
; (Tabs as any).__TABLEDATA_TYPE = TABLEDATA_TABS
Tabs.displayName = TABLEDATA_TABS

function Tab<TData>(_props: TableDataTabProps<TData>) { return null }
; (Tab as any).__TABLEDATA_TYPE = TABLEDATA_TAB
Tab.displayName = TABLEDATA_TAB

function Filters<TData>(_props: TableDataFiltersProps<TData>) { return null }
; (Filters as any).__TABLEDATA_TYPE = TABLEDATA_FILTERS
Filters.displayName = TABLEDATA_FILTERS

function Filter<TData>(_props: TableDataFilterProps<TData>) { return null }
; (Filter as any).__TABLEDATA_TYPE = TABLEDATA_FILTER
Filter.displayName = TABLEDATA_FILTER

/** ===================== HELPERS ===================== */

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
        case Condition.EQUAL: return v === target
        case Condition.NOT_EQUAL: return v !== target
        case Condition.GREATER_THAN: return Number(v) > Number(target)
        case Condition.GREATER_OR_EQUAL: return Number(v) >= Number(target)
        case Condition.LESS_THAN: return Number(v) < Number(target)
        case Condition.LESS_OR_EQUAL: return Number(v) <= Number(target)
        case Condition.LIKE: return String(v ?? "").toLowerCase().includes(String(target ?? "").toLowerCase())
        case Condition.STARTS_WITH: return String(v ?? "").toLowerCase().startsWith(String(target ?? "").toLowerCase())
        case Condition.ENDS_WITH: return String(v ?? "").toLowerCase().endsWith(String(target ?? "").toLowerCase())
        case Condition.IN: return Array.isArray(target) ? target.includes(v) : true
        default: return true
      }
    })
  } catch {
    return rows
  }
}

function buildServerParams(filters: FilterItem[]) {
  const params = new URLSearchParams()
  for (const f of filters) params.append("f", `${f.field}|${f.condition}|${f.value}`)
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

  // ── Tabs state ──
  const tabsProps = tabsExtracted?.tabsNode?.props
  const controlledKey = tabKey ?? tabsProps?.activeKey
  const controlledChange = onTabKeyChange ?? tabsProps?.onActiveKeyChange
  const firstTabKey = tabsExtracted?.keys[0]
  const computedDefault = defaultTabKey ?? tabsProps?.defaultKey ?? firstTabKey

  const [internalKey, setInternalKey] = React.useState<string | undefined>(undefined)
  React.useEffect(() => {
    if (internalKey === undefined && firstTabKey) setInternalKey(firstTabKey)
  }, [firstTabKey, internalKey])

  const activeKey = controlledKey ?? internalKey ?? computedDefault

  const setKey = React.useCallback((k: string) => {
    controlledChange?.(k)
    if (controlledKey === undefined) setInternalKey(k)
  }, [controlledChange, controlledKey])

  // ── Filter state ──
  const filtersTitle = filtersExtracted?.filtersNode?.props?.title ?? "Filtros"
  const [openFilters, setOpenFilters] = React.useState(false)

  const initialFilterValues = React.useMemo(() => {
    const map: Record<string, string> = {}
    if (filtersExtracted) {
      for (const f of filtersExtracted.filters)
        map[String(f.props.name)] = f.props.defaultValue ?? ""
    }
    return map
  }, [filtersExtracted])

  const [filterValues, setFilterValues] = React.useState<Record<string, string>>(initialFilterValues)
  // NÃO tem useEffect que reseta filterValues ao re-render do pai —
  // isso causava reset dos filtros aplicados toda vez que o pai re-renderizava.

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

  // Estado separado: só muda quando o usuário clica "Aplicar" ou "Limpar".
  // NÃO é derivado de filterValues para evitar reset por re-render do pai.
  const [appliedFilterCount, setAppliedFilterCount] = React.useState(0)

  const applyServerFilters = React.useCallback(() => {
    if (!onServerFilterChange) { setOpenFilters(false); return }
    onServerFilterChange({ filters: serverFilters, params: buildServerParams(serverFilters) })
    setAppliedFilterCount(serverFilters.length)
    setOpenFilters(false)
  }, [onServerFilterChange, serverFilters])

  const clearServerFilters = React.useCallback(() => {
    setFilterValues(initialFilterValues)
    setAppliedFilterCount(0)
    onServerFilterChange?.({ filters: [], params: new URLSearchParams() })
    setOpenFilters(false)
  }, [initialFilterValues, onServerFilterChange])

  // ── Client-side tab filtering ──
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

  // Tab counts with cache
  const tabCountsCache = React.useRef<Record<string, number>>({})
  const tabCounts = React.useMemo(() => {
    if (!tabsExtracted) return {}
    const counts: Record<string, number> = {}
    tabsExtracted.tabs.forEach((t, i) => {
      const key = tabsExtracted.keys[i]
      const filtered = applyTabFilter(data, t.props)
      counts[key] = data.length > 0 || tabCountsCache.current[key] === undefined
        ? filtered.length
        : tabCountsCache.current[key] ?? 0
    })
    if (data.length > 0) tabCountsCache.current = counts
    return counts
  }, [data, tabsExtracted])

  if (columnNodes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Nenhuma coluna configurada. Use{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{`<TableData.Columns>`}</code>.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 min-h-0">

      {/* ── Toolbar ── */}
      {(tabsExtracted || filtersExtracted) && (
        <div className="flex items-center justify-between gap-3">

          {/*
           * TABS — implementado com <button> nativo em vez de shadcn <Tabs>.
           * O componente shadcn sobrescreve text-color via data-[state=active]:text-foreground
           * em seus estilos base, causando o texto invisível no tema escuro/claro.
           * Aqui controlamos 100% das classes sem interferência externa.
           */}
          {tabsExtracted ? (
            <div
              role="tablist"
              className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1"
            >
              {tabsExtracted.tabs.map((t, i) => {
                const key = tabsExtracted.keys[i]
                const count = tabCounts[key] ?? 0
                const isActive = activeKey === key

                return (
                  <button
                    key={key}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => setKey(key)}
                    className={[
                      // base
                      "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium",
                      "transition-all duration-150 select-none outline-none",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      // estado
                      isActive
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/60",
                    ].join(" ")}
                  >
                    <span>{t.props.label}</span>
                    <span
                      className={[
                        "inline-flex h-5 min-w-[20px] items-center justify-center",
                        "rounded-sm px-1.5 text-[11px] font-semibold tabular-nums",
                        "transition-colors duration-150",
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                          : "bg-border/80 text-muted-foreground",
                      ].join(" ")}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div />
          )}

          {/* Botão filtros + limpar */}
          {filtersExtracted && (
            <div className="flex items-center gap-2">
              {/* Filtros — sempre visível */}
              <Dialog open={openFilters} onOpenChange={setOpenFilters}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={[
                      "relative h-9 gap-2 rounded-lg text-sm font-medium transition-all",
                      appliedFilterCount > 0
                        ? "border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950/40"
                        : "text-foreground border-gray-300 dark:border-gray-600 hover:bg-accent",
                    ].join(" ")}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filtros
                    {appliedFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-background dark:bg-blue-500">
                        {appliedFilterCount}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden rounded-xl">
                  <DialogHeader className="border-b border-border px-6 py-4">
                    <DialogTitle className="text-base font-semibold">{filtersTitle}</DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col gap-4 px-6 py-5">
                    {filtersExtracted.filters.map((f) => {
                      const field = String(f.props.name)
                      return (
                        <div key={field} className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {f.props.label}
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                              value={filterValues[field] ?? ""}
                              placeholder={f.props.placeholder ?? `Filtrar por ${f.props.label.toLowerCase()}...`}
                              className="pl-9 h-9 text-sm rounded-lg"
                              onChange={(e) =>
                                setFilterValues((prev) => ({ ...prev, [field]: e.target.value }))
                              }
                              onKeyDown={(e) => e.key === "Enter" && applyServerFilters()}
                            />
                            {filterValues[field] && (
                              <button
                                type="button"
                                onClick={() => setFilterValues((prev) => ({ ...prev, [field]: "" }))}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <DialogFooter className="border-t border-border px-6 py-4 gap-2 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearServerFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Limpar filtros
                    </Button>
                    <Button
                      size="sm"
                      onClick={applyServerFilters}
                      className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      Aplicar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Limpar — só aparece com filtros aplicados, fica à direita */}
              {appliedFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={clearServerFilters}
                  className="h-9 gap-1.5 rounded-lg border-dashed border-gray-400 dark:border-gray-500 bg-transparent text-sm font-medium text-foreground hover:text-destructive hover:border-destructive/60 transition-all"
                >
                  <Eraser className="h-3.5 w-3.5" />
                  Limpar
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Scroll vertical interno + SEM scroll horizontal */}
      <div
        className={`min-h-0 overflow-y-auto overflow-x-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600 ${maxHeightClassName}`}
      >
        <Table className="w-full table-fixed rounded-lg bg-gray-300 dark:bg-gray-700">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className=" rounded-lg !bg-gray-300 dark:!bg-gray-700 ">
              {columnNodes.map((col) => {
                const isAcoes = col.props.name === (actionsKey as any)
                return (
                  <TableHead
                    key={col.props.name}
                    className={[
                      "h-10 bg-muted/50 text-[11px] font-semibold uppercase tracking-wider",
                      "text-muted-foreground first:pl-4 last:pr-4",
                      isAcoes ? `${actionsWidthClassName} text-right` : "text-left",
                    ].join(" ")}
                  >
                    <div className="truncate">{col.props.label}</div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={columnNodes.length} className="h-36 p-0">
                  <div className="flex flex-col items-center justify-center gap-2.5 h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <InboxIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">{emptyText}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-border/50 transition-colors duration-100 hover:bg-muted/40 last:border-0"
                >
                  {columnNodes.map((col) => {
                    const key = col.props.name
                    const value = row.getValue(key)
                    const custom = col.props.render
                    const isAcoes = key === (actionsKey as any)

                    return (
                      <TableCell
                        key={key}
                        className={[
                          "py-3 text-sm first:pl-4 last:pr-4",
                          isAcoes ? `${actionsWidthClassName} whitespace-nowrap` : "",
                        ].join(" ")}
                      >
                        {isAcoes ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {custom ? custom(value, row.original) : value != null ? String(value) : null}
                          </div>
                        ) : (
                          <div className="truncate text-foreground">
                            {custom
                              ? custom(value, row.original)
                              : value != null
                                ? String(value)
                                : <span className="text-muted-foreground/40">—</span>}
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

      {/* ── Footer: contagem ── */}
      {rows.length > 0 && (
        <div className="flex items-center justify-end pr-0.5">
          <span className="text-xs text-muted-foreground tabular-nums">
            {rows.length} {rows.length === 1 ? "registro" : "registros"}
          </span>
        </div>
      )}
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