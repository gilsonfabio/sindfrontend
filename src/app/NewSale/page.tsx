"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ShoppingCart,
  Loader2,
  ShieldCheck,
  Moon,
  Sun,
  ArrowLeft,
} from "lucide-react";

import api from "@/server/api";

const NewSale = () => {
  const router = useRouter();

  const [cartao, setCartao] = useState("");
  const [idCnv, setIdCnv] = useState<string | null>(null);
  const [nomConvenio, setNomConvenio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // DARK MODE
  const [darkMode, setDarkMode] = useState(false);

  // Captura parâmetros da sessão
  useEffect(() => {
    const storedId = sessionStorage.getItem("id");
    const storedName = sessionStorage.getItem("name");

    // Não autenticado
    if (!storedId || !storedName) {
      router.push("/");
      return;
    }

    setIdCnv(storedId);
    setNomConvenio(storedName);
  }, [router]);

  // Novo lançamento
  const newLancamento = useCallback(async () => {
    if (!idCnv || !nomConvenio) {
      alert("Parâmetros inválidos.");
      return;
    }

    if (!cartao.trim()) {
      alert("Informe o número do cartão.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(`verifUser/${cartao}`);

      if (response.data.length === 0) {
        await api.get(`gerSaldo/${cartao}`);
      }

      sessionStorage.setItem(
        "saleData",
        JSON.stringify({
          convenio: idCnv,
          nomFantasia: nomConvenio,
          nroCartao: cartao,
        })
      );

      router.push("/CnfLancamento");
    } catch (error) {
      console.error(error);
      alert("Falha ao buscar informações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [cartao, idCnv, nomConvenio, router]);

  // Loading
  if (!idCnv || !nomConvenio) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center px-4 ${
          darkMode ? "bg-black" : "bg-slate-100"
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-lg ${
            darkMode ? "bg-slate-900" : "bg-white"
          }`}
        >
          <Loader2 className="h-5 w-5 animate-spin text-green-600" />

          <span
            className={`text-sm font-medium ${
              darkMode ? "text-white" : "text-slate-700"
            }`}
          >
            Carregando informações...
          </span>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`min-h-screen px-3 py-4 transition-all duration-300 sm:px-4 sm:py-8 lg:px-6 lg:py-10 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 via-black to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-white to-green-50"
      }`}
    >
      {/* TOPO BOTÕES */}
<div className="mx-auto mb-4 flex max-w-5xl items-center justify-between">
  
  {/* BOTÃO VOLTAR */}
  <button
    onClick={() => router.back()}
    className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-md transition-all ${
      darkMode
        ? "bg-slate-800 text-white hover:bg-slate-700"
        : "bg-white text-slate-700 hover:bg-slate-100"
    }`}
  >
    <ArrowLeft className="h-4 w-4" />
    Voltar
  </button>

  {/* BOTÃO DARK MODE */}
  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-md transition-all ${
      darkMode
        ? "bg-slate-800 text-white hover:bg-slate-700"
        : "bg-white text-slate-700 hover:bg-slate-100"
    }`}
  >
    {darkMode ? (
      <>
        <Sun className="h-4 w-4" />
        Claro
      </>
    ) : (
      <>
        <Moon className="h-4 w-4" />
        Escuro
      </>
    )}
  </button>
</div>

      <div className="mx-auto flex max-w-5xl items-center justify-center">
        {/* CARD PRINCIPAL */}
        <div
          className={`grid w-full overflow-hidden rounded-[28px] shadow-2xl transition-all duration-300 lg:grid-cols-2 ${
            darkMode ? "bg-slate-900" : "bg-white"
          }`}
        >
          {/* MOBILE HEADER */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white lg:hidden">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <ShoppingCart className="h-7 w-7" />
              </div>

              <h1 className="text-2xl font-bold leading-tight">
                Lançamento
                <br />
                de Venda
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-green-100">
                Realize vendas de forma rápida, moderna e segura.
              </p>

              <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-green-100">
                  Convênio
                </p>

                <h2 className="mt-1 break-words text-base font-semibold">
                  {nomConvenio}
                </h2>
              </div>
            </div>
          </div>

          {/* DESKTOP LEFT */}
          <div className="hidden flex-col justify-between bg-gradient-to-br from-green-600 to-emerald-700 p-10 text-white lg:flex">
            <div>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <ShoppingCart className="h-8 w-8" />
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Lançamento de Venda
              </h1>

              <p className="mt-5 text-base leading-relaxed text-green-100">
                Realize lançamentos de vendas com rapidez, segurança e uma
                experiência moderna para o usuário.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm text-green-100">Convênio</p>

              <h2 className="mt-1 break-words text-xl font-semibold">
                {nomConvenio}
              </h2>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">
              {/* HEADER */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 sm:h-16 sm:w-16">
                  <CreditCard className="h-7 w-7 text-green-700 sm:h-8 sm:w-8" />
                </div>

                <h2
                  className={`text-2xl font-bold sm:text-3xl ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  Nova Venda
                </h2>

                <p
                  className={`mt-2 text-sm leading-relaxed sm:text-base ${
                    darkMode ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  Informe o número do cartão do servidor para continuar.
                </p>
              </div>

              {/* FORM */}
              <form
                className="space-y-5 sm:space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  newLancamento();
                }}
              >
                {/* INPUT */}
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${
                      darkMode ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    Número do Cartão
                  </label>

                  <div className="relative">
                    <CreditCard
                      className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${
                        darkMode ? "text-slate-500" : "text-slate-400"
                      }`}
                    />

                    <input
                      type="text"
                      placeholder="Digite o número do cartão"
                      value={cartao}
                      onChange={(e) => setCartao(e.target.value)}
                      className={`w-full rounded-2xl py-3 pl-12 pr-4 text-sm shadow-sm outline-none transition-all duration-200 sm:text-base ${
                        darkMode
                          ? "border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-900"
                          : "border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                      }`}
                    />
                  </div>
                </div>

                {/* INFO MOBILE */}
                <div
                  className={`rounded-2xl p-4 lg:hidden ${
                    darkMode
                      ? "border border-green-900 bg-green-950/30"
                      : "border border-green-100 bg-green-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-green-700" />

                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Ambiente Seguro
                      </p>

                      <p
                        className={`mt-1 text-xs leading-relaxed ${
                          darkMode ? "text-green-200" : "text-green-700"
                        }`}
                      >
                        Seus dados são protegidos durante toda a operação.
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTÃO */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Lançar Venda
                    </>
                  )}
                </button>
              </form>

              {/* FOOTER */}
              <div
                className={`mt-6 rounded-2xl p-4 text-center ${
                  darkMode ? "bg-slate-800" : "bg-slate-50"
                }`}
              >
                <p
                  className={`text-xs leading-relaxed ${
                    darkMode ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  Sistema seguro para gerenciamento e lançamento de vendas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewSale;