"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { fornecedorApi } from "@/services/fornecedor/fornecedor.api";
import type { Fornecedor } from "@/services/fornecedor/fornecedor.schemas";
import { toast } from "@/components/ui/sonner";

type FornecedorFieldProps = {
  value?: number;
  onChange: (value?: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  initialLabel?: string;
};

export function FornecedorField({
  value,
  onChange,
  placeholder = "Pesquisar fornecedor",
  disabled,
  className,
  initialLabel,
}: FornecedorFieldProps) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Fornecedor[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fornecedorApi.list({ ativo: true });
      setData(res);
    } catch (err) {
      setIsError(true);
      toast.error("Erro ao carregar fornecedores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open && data.length === 0) {
      loadData();
    }
  }, [open, data.length, loadData]);

  const options = React.useMemo(() => data ?? [], [data]);
  const deferredQuery = React.useDeferredValue(query);
  const selectedLabel = React.useMemo(
    () => options.find((p) => p.id === value)?.nome,
    [options, value]
  );
  
  const displayLabel = selectedLabel ?? initialLabel;
  
  const filtered = React.useMemo(() => {
    if (!open) return options;
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return options;
    return options.filter((p) => p.nome.toLowerCase().includes(q));
  }, [deferredQuery, open, options]);

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full h-9 px-3 bg-background border border-input rounded-md text-left",
              "flex items-center justify-between",
              "focus-visible:border-ring focus-visible:ring-ring/50 outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                "truncate",
                !displayLabel && "text-muted-foreground"
              )}
            >
              {displayLabel ?? "Selecione um fornecedor"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-2"
          align="start"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="h-10 text-sm mb-2"
            disabled={disabled || isLoading}
          />
          <div
            className="max-h-64 overflow-y-auto overscroll-contain touch-pan-y space-y-1"
            onWheel={(e) => e.stopPropagation()}
          >
            {isLoading && (
              <div className="space-y-2 p-1">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-2/3" />
              </div>
            )}
            {!isLoading && !isError && filtered.length === 0 && (
              <div className="text-sm text-muted-foreground p-3">
                Nenhum fornecedor encontrado.
              </div>
            )}
            {!isLoading &&
              !isError &&
              filtered.map((p) => {
                const selected = value === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onChange(p.id);
                      setOpen(false);
                    }}
                    disabled={disabled}
                    className={cn(
                      "w-full flex items-center justify-between py-2.5 px-3 rounded-md text-left text-sm transition-colors",
                      "hover:bg-muted",
                      selected
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    )}
                  >
                    <span className="truncate">{p.nome}</span>
                    {selected && (
                      <CheckCircle className="h-4 w-4 text-accent-foreground" />
                    )}
                  </button>
                );
              })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
