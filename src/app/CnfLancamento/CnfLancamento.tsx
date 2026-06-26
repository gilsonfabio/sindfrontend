"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  Loader2,
  User2,
  BadgeDollarSign,
  CalendarDays,
  LockKeyhole,
  ShoppingBag,
  Moon,
  Sun,
  ArrowLeft,
} from "lucide-react";

import api from "@/server/api";

interface UserProps {
  usrId: number;
  usrNome: string;
  usrMatricula: number;
  usrMes: number;
  usrAno: number;
  usrVlrDisponivel: number;
  usrStatus: string;
  tipId: number;
  tipDescricao: string;
  tipParcelas: number;
}

const CnfLancamento = () => {
  const router = useRouter();

  const [idCrt, setIdCrt] = useState("");
  const [cnvId, setCnvId] = useState("");
  const [nomFantasia, setNomFantasia] = useState("");

  const [password, setPassword] = useState("");
  const [vlrCompra, setVlrCompra] = useState("");
  const [qtdParcelas, setQtdParcelas] = useState("");

  const [user, setUser] = useState<UserProps | null>(null);

  const [servidor, setServidor] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [statusUsr, setStatusUsr] = useState("");
  const [maxParc, setMaxParc] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  // DARK MODE
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saleData = sessionStorage.getItem("saleData");

    if (!saleData) {
      router.push("/");
      return;
    }

    const parsedData = JSON.parse(saleData);

    setIdCrt(parsedData.nroCartao);
    setCnvId(parsedData.convenio);
    setNomFantasia(parsedData.nomFantasia);
  }, [router]);

  // =========================
  // Buscar dados
  // =========================
  useEffect(() => {
    async function loadData() {
      try {
        if (!idCrt) return;

        const response = await api.get(`findUser/${idCrt}`);

        const userData = response.data[0];

        setUser(userData);
        setServidor(userData.usrId);
        setSaldo(userData.usrVlrDisponivel);
        setStatusUsr(userData.usrStatus);

        if (cnvId) {
          const parcelas = await api.get(`maxParcelas/${cnvId}`);

          setMaxParc(parcelas.data[0].cnvQtdParc);
        }
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar informações.");
      } finally {
        setLoadingPage(false);
      }
    }

    loadData();
  }, [idCrt, cnvId]);

  // =========================
  // Valor da parcela
  // =========================
  const valorParcela = useMemo(() => {
    if (!vlrCompra || !qtdParcelas) return 0;

    return parseFloat(vlrCompra) / parseInt(qtdParcelas);
  }, [vlrCompra, qtdParcelas]);

  // =========================
  // Confirmar venda
  // =========================
  const handleCnfLanc = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        setLoading(true);

        if (!idCrt) {
          alert("Cartão inválido.");
          return;
        }

        await api.post("loginUsr", {
          idCrt,
          password,
        });

        if (saldo < valorParcela) {
          alert(
            `Saldo insuficiente.\nValor da parcela: ${valorParcela.toFixed(2)}`
          );
          return;
        }

        if (statusUsr !== "A") {
          alert("Usuário bloqueado/inativo.");
          return;
        }

        if (Number(qtdParcelas) > maxParc) {
          alert("Quantidade de parcelas excedida.");
          return;
        }

        const data = new Date();

        const dataString = data.toISOString().split("T")[0];
        const horaString = data.toTimeString().split(" ")[0];

        const codSeguranca = `${data.getFullYear()}${cnvId}${data.getMinutes()}${data.getSeconds()}`;

        await api.post("newcompra", {
          cmpEmissao: dataString,
          cmpHorEmissao: horaString,
          cmpConvenio: cnvId,
          cmpQtdParcela: Number(qtdParcelas),
          cmpVlrCompra: Number(vlrCompra),
          cmpServidor: servidor,
          cmpCodSeguranca: codSeguranca,
          cmpStatus: "A",
          cmpCartao: idCrt,
        });

        sessionStorage.removeItem("saleData");

        alert("Compra cadastrada com sucesso!");

        router.push(`/Dashboard?id=${cnvId}`);
      } catch (error) {
        console.error(error);
        alert("Falha na confirmação da compra.");
      } finally {
        setLoading(false);
      }
    },
    [
      cnvId,
      idCrt,
      maxParc,
      password,
      qtdParcelas,
      router,
      saldo,
      servidor,
      statusUsr,
      valorParcela,
      vlrCompra,
    ]
  );

  // =========================
  // Loading page
  // =========================
  if (loadingPage) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          darkMode ? "bg-black" : "bg-slate-100"
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl px-6 py-4 shadow-xl ${
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
      className={`min-h-screen p-3 transition-all duration-300 sm:p-4 md:p-8 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 via-black to-slate-900"
          : "bg-gradient-to-br from-slate-100 via-white to-green-50"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* TOPO AÇÕES */}
        <div className="mb-5 flex items-center justify-between gap-3">
          {/* VOLTAR */}
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
          {/* DARK MODE */}
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
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <h1
            className={`text-2xl font-bold sm:text-3xl md:text-4xl ${
              darkMode ? "text-white" : "text-slate-800"
            }`}
          >
            Confirmação de Venda
          </h1>

          <p
            className={`mt-2 text-sm sm:text-base ${
              darkMode ? "text-slate-300" : "text-slate-500"
            }`}
          >
            Valide os dados do servidor e confirme a transação.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          {/* CARD SERVIDOR */}
          <div
            className={`rounded-3xl p-4 shadow-xl backdrop-blur-sm sm:p-6 md:p-8 ${
              darkMode
                ? "border border-slate-800 bg-slate-900/90"
                : "border border-white/60 bg-white/90"
            }`}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 sm:h-14 sm:w-14">
                <User2 className="h-6 w-6 text-green-700" />
              </div>

              <div className="min-w-0">
                <h2
                  className={`truncate text-xl font-bold sm:text-2xl ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  Dados do Servidor
                </h2>

                <p
                  className={`text-xs sm:text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Informações do titular do cartão
                </p>
              </div>
            </div>

            {user && (
              <div className="space-y-4">
                {/* NOME */}
                <div
                  className={`rounded-2xl p-4 ${
                    darkMode ? "bg-slate-800" : "bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-wide ${
                      darkMode ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    Nome
                  </p>

                  <h3
                    className={`mt-1 break-words text-base font-semibold sm:text-lg ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {user.usrNome}
                  </h3>
                </div>

                {/* GRID INFO */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    className={`rounded-2xl p-4 ${
                      darkMode ? "bg-slate-800" : "bg-slate-50"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-500" />

                      <span
                        className={`text-xs sm:text-sm ${
                          darkMode ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        Matrícula
                      </span>
                    </div>

                    <p
                      className={`break-all font-semibold ${
                        darkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {user.usrMatricula}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl p-4 ${
                      darkMode ? "bg-slate-800" : "bg-slate-50"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-slate-500" />

                      <span
                        className={`text-xs sm:text-sm ${
                          darkMode ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        Status
                      </span>
                    </div>

                    <p
                      className={`font-semibold ${
                        user.usrStatus === "A"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {user.usrStatus === "A" ? "ATIVO" : "BLOQUEADO"}
                    </p>
                  </div>
                </div>

                {/* SALDO */}
                <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-700 p-5 text-white shadow-lg">
                  <div className="flex items-start gap-3">
                    <Wallet className="mt-1 h-6 w-6 sm:h-7 sm:w-7" />

                    <div className="min-w-0">
                      <p className="text-xs text-green-100 sm:text-sm">
                        Saldo Disponível
                      </p>

                      <h2 className="break-words text-2xl font-bold sm:text-3xl">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(user.usrVlrDisponivel)}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FORM */}
          <div
            className={`rounded-3xl p-4 shadow-xl backdrop-blur-sm sm:p-6 md:p-8 ${
              darkMode
                ? "border border-slate-800 bg-slate-900/90"
                : "border border-white/60 bg-white/90"
            }`}
          >
            <div className="mb-6">
              <h2
                className={`text-xl font-bold sm:text-2xl ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                Confirmar Compra
              </h2>

              <p
                className={`mt-1 text-xs sm:text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Preencha os dados abaixo para concluir a venda.
              </p>
            </div>

            <form onSubmit={handleCnfLanc} className="space-y-5">
              {/* VALOR */}
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    darkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  Valor da Compra
                </label>

                <input
                  type="number"
                  placeholder="0,00"
                  value={vlrCompra}
                  onChange={(e) => setVlrCompra(e.target.value)}
                  disabled={loading}
                  className={`w-full rounded-2xl px-4 py-3 text-sm shadow-sm outline-none transition-all sm:text-base ${
                    darkMode
                      ? "border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-900"
                      : "border border-slate-200 bg-slate-50 text-slate-800 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  }`}
                />
              </div>

              {/* PARCELAS */}
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    darkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  Parcelamento
                </label>

                <select
                  value={qtdParcelas}
                  onChange={(e) => setQtdParcelas(e.target.value)}
                  disabled={loading}
                  className={`w-full rounded-2xl px-4 py-3 text-sm shadow-sm outline-none transition-all sm:text-base ${
                    darkMode
                      ? "border border-slate-700 bg-slate-800 text-white focus:border-green-500 focus:ring-4 focus:ring-green-900"
                      : "border border-slate-200 bg-slate-50 text-slate-800 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  }`}
                >
                  <option value="">Selecione as parcelas</option>

                  {Array.from({ length: maxParc }, (_, i) => i + 1).map(
                    (num) => (
                      <option key={num} value={num}>
                        {num === 1 ? "À Vista" : `${num}x Parcelas`}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* SENHA */}
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${
                    darkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  Senha do Cartão
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className={`w-full rounded-2xl py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition-all sm:text-base ${
                      darkMode
                        ? "border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-900"
                        : "border border-slate-200 bg-slate-50 text-slate-800 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    }`}
                  />
                </div>
              </div>

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Confirmar Compra
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CnfLancamento;