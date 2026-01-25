"use client"

import * as React from "react"
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Tabs as UiTabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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

export type TabCondition =
  | "all"
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "in"

export type TableDataTabProps<TData> = {
  /** name = campo do backend */
  name?: keyof TData & string
  /** label = texto mostrado na aba */
  label: string
  /** condition = operador */
  condition: Condition
  /** value = parâmetro do filtro */
  value?: unknown
}

type TableDataTabsProps<TData> = {
  /** Controlado (opcional) */
  activeKey?: string
  onActiveKeyChange?: (key: string) => void
  /** Não-controlado (opcional) */
  defaultKey?: string
  children:
    | React.ReactElement<TableDataTabProps<TData>>
    | Array<React.ReactElement<TableDataTabProps<TData>>>
}

export type TableDataProps<TData> = {
  data: TData[]
  emptyText?: string

  /** Controlar tab por fora (opcional) */
  tabKey?: string
  onTabKeyChange?: (key: string) => void
  defaultTabKey?: string

  children: React.ReactNode
}

/** ===================== MARKER COMPONENTS ===================== */

const TABLEDATA_COLUMNS = "TableData.Columns"
const TABLEDATA_COLUMN = "TableData.Column"
const TABLEDATA_TABS = "TableData.Tabs"
const TABLEDATA_TAB = "TableData.Tab"

function Columns<TData>(_props: TableDataColumnsProps<TData>) {
  return null
}
;(Columns as any).__TABLEDATA_TYPE = TABLEDATA_COLUMNS
Columns.displayName = TABLEDATA_COLUMNS

function Column<TData>(_props: TableDataColumnProps<TData>) {
  return null
}
;(Column as any).__TABLEDATA_TYPE = TABLEDATA_COLUMN
Column.displayName = TABLEDATA_COLUMN

function Tabs<TData>(_props: TableDataTabsProps<TData>) {
  return null
}
;(Tabs as any).__TABLEDATA_TYPE = TABLEDATA_TABS
Tabs.displayName = TABLEDATA_TABS

function Tab<TData>(_props: TableDataTabProps<TData>) {
  return null
}
;(Tab as any).__TABLEDATA_TYPE = TABLEDATA_TAB
Tab.displayName = TABLEDATA_TAB

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
  keys: string[] // key interno por tab
}

function safeKeyFromTab<TData>(tab: TableDataTabProps<TData>, index: number) {
  // Key interna; não tem a ver com o "value" do filtro.
  // Precisa ser estável o suficiente: label + name + index resolve.
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

function applyTabFilter<TData>(
  rows: TData[],
  tab: TableDataTabProps<TData>
): TData[] {
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
          return String(v ?? "").toLowerCase().includes(
            String(target ?? "").toLowerCase()
          )

        case Condition.STARTS_WITH:
          return String(v ?? "").toLowerCase().startsWith(
            String(target ?? "").toLowerCase()
          )

        case Condition.ENDS_WITH:
          return String(v ?? "").toLowerCase().endsWith(
            String(target ?? "").toLowerCase()
          )

        case Condition.IN:
          return Array.isArray(target) ? target.includes(v) : true

        default:
          return true
      }
    })
  } catch {
    // tolerante: qualquer erro => não filtra
    return rows
  }
}

/** ===================== MAIN COMPONENT ===================== */

function TableDataInner<TData>({
  data,
  emptyText = "Nenhum registro encontrado.",

  tabKey,
  onTabKeyChange,
  defaultTabKey,

  children,
}: TableDataProps<TData>) {
  const columnNodes = React.useMemo(() => extractColumnsNode<TData>(children), [children])
  const columns = React.useMemo(() => buildColumnDefs<TData>(columnNodes), [columnNodes])

  const tabsExtracted = React.useMemo(() => extractTabsNode<TData>(children), [children])

  // Controle de tab: prioridade TableData props > Tabs props > interno
  const tabsProps = tabsExtracted?.tabsNode?.props
  const controlledKey = tabKey ?? tabsProps?.activeKey
  const controlledOnChange = onTabKeyChange ?? tabsProps?.onActiveKeyChange

  const computedDefault =
    defaultTabKey ??
    tabsProps?.defaultKey ??
    (tabsExtracted ? tabsExtracted.keys[0] : undefined)

  const [internalKey, setInternalKey] = React.useState<string | undefined>(computedDefault)
  const activeKey = controlledKey ?? internalKey

  const setKey = React.useCallback(
    (k: string) => {
      if (controlledOnChange) controlledOnChange(k)
      if (controlledKey === undefined) setInternalKey(k)
    },
    [controlledOnChange, controlledKey]
  )

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

  return (
    <div className="flex flex-col gap-4">
      {tabsExtracted ? (
        <UiTabs value={activeKey} defaultValue={computedDefault} onValueChange={setKey}>
          <TabsList>
            {tabsExtracted.tabs.map((t, i) => (
              <TabsTrigger key={tabsExtracted.keys[i]} value={tabsExtracted.keys[i]}>
                {t.props.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </UiTabs>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            {columnNodes.map((col) => (
              <TableHead key={col.props.name}>{col.props.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columnNodes.length}>{emptyText}</TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                {columnNodes.map((col) => {
                  const key = col.props.name
                  const value = row.getValue(key)
                  const custom = col.props.render
                  return (
                    <TableCell key={key}>
                      {custom ? custom(value, row.original) : value != null ? String(value) : ""}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

/** Compound export */
export const TableData = Object.assign(TableDataInner, {
  Columns,
  Column,
  Tabs,
  Tab,
}) as (<TData>(props: TableDataProps<TData>) => React.ReactElement) & {
  Columns: <TData>(props: TableDataColumnsProps<TData>) => null
  Column: <TData>(props: TableDataColumnProps<TData>) => null
  Tabs: <TData>(props: TableDataTabsProps<TData>) => null
  Tab: <TData>(props: TableDataTabProps<TData>) => null
}
