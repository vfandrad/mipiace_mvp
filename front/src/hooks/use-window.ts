import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

/**
 * Hook que monitora a URL para um parâmetro específico e gerencia o estado de um dialog.
 * Se o parâmetro estiver presente (com ou sem valor), ele abre o dialog.
 */
export function useWindow(paramName: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [paramValue, setParamValue] = useState<string | null>(null);

  // Sincroniza o estado com os parâmetros de busca da URL
  useEffect(() => {
    if (searchParams.has(paramName)) {
      setParamValue(searchParams.get(paramName));
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setParamValue(null);
    }
  }, [searchParams, paramName]);

  /**
   * Fecha o dialog e remove o parâmetro da URL
   */
  const close = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(paramName);
    setSearchParams(newParams, { replace: true });
    setIsOpen(false);
  }, [searchParams, paramName, setSearchParams]);

  /**
   * Executa uma ação passada por parâmetro e fecha o dialog.
   * Isso permite definir o que será executado no momento do clique no botão de confirmação.
   */
  const confirm = useCallback(
    (action: (value: string | null) => void) => {
      action(paramValue);
      close();
    },
    [paramValue, close],
  );

  return {
    /** Se o dialog deve estar aberto */
    isOpen,
    /** O valor do parâmetro na URL, se houver */
    paramValue,
    /**
     * Função para confirmar a ação.
     * Recebe um callback com o que deve ser executado ao clicar.
     */
    confirm,
    /** Função para fechar/cancelar o dialog sem executar ação */
    close,
    /** Setter direto para o estado de abertura, útil para o onOpenChange do Dialog */
    setIsOpen: (open: boolean) => {
      if (!open) close();
    },
  };
}
