"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Menubar from "@/components/Menubar";
import Footer from "@/components/Footer";

import api from "@/server/api";

import {
  Plus,
  Receipt,
  CalendarClock,
  ShoppingCart,
  User,
  CreditCard,
  BadgeDollarSign,
  TrendingUp,
  LogOut,
} from "lucide-react";

interface VendasProps {
  cmpId: number;
  cmpEmissao: string;
  cmpHorEmissao: string;
  cmpConvenio: number;
  cmpQtdParcela: number;
  cmpVlrCompra: number;
  cmpServidor: number;
  cmpCodSeguranca: string;
  cmpStatus: string;
  usrNome: string;
}

const Dashboard = () => {
  const router = useRouter();

  const [vendas, setVendas] = useState<VendasProps[]>([]);
  const [auxInicial, setAuxInicial] = useState("");
  const [auxFinal, setAuxFinal] = useState("");

  const [idCnv, setIdVenda] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem("id");
    const storedName = sessionStorage.getItem("name");

    // Não autenticado
    if (!storedId || !storedName) {
      router.push("/");
      return;
    }

    setIdVenda(storedId);
    setName(storedName);

    api.get(`/cmpConvenio/${storedId}`)
      .then((response) => {
        setVendas(response.data);
      })
      .catch(() => {
        router.push("/");
      });
  }, [router]);
    
  function handleLogout() {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("name");
    router.push("/");
  }
   
  function formatDate(date: string) {
    return (
      date.substring(6, 10) + "-" +
      date.substring(3, 5) + "-" +
      date.substring(0, 2)
    );
  }

  function handleNewSale() {
    if (!idCnv || !name) return;

    router.push("/NewSale");
  }

  function handleEmissao() {
    if (!idCnv) return;

    router.push(
      `/RelEmiCnv?id=${encodeURIComponent(
        idCnv
      )}&datIni=${encodeURIComponent(
        formatDate(auxInicial)
      )}&datFin=${encodeURIComponent(formatDate(auxFinal))}`
    );
  }

  function handleVencto() {
    if (!idCnv) return;

    router.push(
      `/RelVctCnv?id=${encodeURIComponent(
        idCnv
      )}&datIni=${encodeURIComponent(
        formatDate(auxInicial)
      )}&datFin=${encodeURIComponent(formatDate(auxFinal))}`
    );
  }

  const totalVendas = vendas.reduce(
    (total, item) => total + Number(item.cmpVlrCompra),
    0
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
          <Menubar />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 transition-all duration-300 px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-red-600/20"
          >
            <LogOut className="w-5 h-5" />
              Sair
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* HERO */}
        <div className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-8 md:p-12 mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
                <TrendingUp className="w-4 h-4" />
                Painel Administrativo
              </span>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Dashboard do Convênio
              </h1>

              <p className="text-zinc-400 text-lg mt-6 max-w-2xl">
                Gerencie vendas, relatórios e acompanhe todas as
                movimentações do convênio em tempo real.
              </p>

              <div className="mt-8">
                <button
                  onClick={handleNewSale}
                  className="flex items-center gap-3 bg-green-600 hover:bg-green-500 transition-all duration-300 px-8 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-green-600/20"
                >
                  <Plus className="w-6 h-6" />
                  Nova Venda
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 gap-4 min-w-[320px]">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingCart className="text-green-500 w-7 h-7" />

                  <span className="text-zinc-400">
                    Total de Vendas
                  </span>
                </div>

                <h2 className="text-4xl font-bold">
                  {vendas.length}
                </h2>
              </div>

              <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BadgeDollarSign className="text-green-500 w-7 h-7" />

                  <span className="text-zinc-400">
                    Valor Movimentado
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-green-500">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalVendas)}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* REPORTS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* EMISSAO */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Receipt className="text-green-500 w-7 h-7" />

              <h2 className="text-2xl font-bold">
                Relatório por Emissão
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Data Inicial (dd/mm/aaaa)"
                value={auxInicial}
                onChange={(e) => setAuxInicial(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-2xl px-4 py-4 text-white outline-none focus:border-green-500 transition"
              />

              <input
                type="text"
                placeholder="Data Final (dd/mm/aaaa)"
                value={auxFinal}
                onChange={(e) => setAuxFinal(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-2xl px-4 py-4 text-white outline-none focus:border-green-500 transition"
              />

              <button
                onClick={handleEmissao}
                className="w-full bg-green-600 hover:bg-green-500 transition-all duration-300 rounded-2xl py-4 font-bold text-lg shadow-lg shadow-green-600/20"
              >
                Gerar Relatório
              </button>
            </div>
          </div>

          {/* VENCIMENTO */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <CalendarClock className="text-green-500 w-7 h-7" />

              <h2 className="text-2xl font-bold">
                Relatório por Vencimento
              </h2>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Data Inicial (dd/mm/aaaa)"
                value={auxInicial}
                onChange={(e) => setAuxInicial(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-2xl px-4 py-4 text-white outline-none focus:border-green-500 transition"
              />

              <input
                type="text"
                placeholder="Data Final (dd/mm/aaaa)"
                value={auxFinal}
                onChange={(e) => setAuxFinal(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-2xl px-4 py-4 text-white outline-none focus:border-green-500 transition"
              />

              <button
                onClick={handleVencto}
                className="w-full bg-green-600 hover:bg-green-500 transition-all duration-300 rounded-2xl py-4 font-bold text-lg shadow-lg shadow-green-600/20"
              >
                Gerar Relatório
              </button>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Vendas do Dia
            </h2>

            <p className="text-zinc-400 mt-2">
              Últimas movimentações realizadas
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <CreditCard className="text-green-500" />

              <div>
                <p className="text-sm text-zinc-500">
                  Convênio
                </p>

                <p className="font-semibold">
                  {name || "Não informado"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SALES */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {vendas.map((row) => (
            <Link
              key={row.cmpId}
              href={`/VdaDetalhes/${row.cmpId}`}
              className="group bg-zinc-900 border border-zinc-800 hover:border-green-500 rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="bg-green-500/10 p-4 rounded-2xl">
                  <ShoppingCart className="text-green-500 w-7 h-7" />
                </div>

                <span className="text-xs text-zinc-500">
                  #{row.cmpId}
                </span>
              </div>

              <div>
                <p className="text-zinc-500 text-sm mb-1">
                  Cliente
                </p>

                <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition">
                  {row.usrNome}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black rounded-2xl p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-sm">
                    Data
                  </p>

                  <p className="font-semibold mt-1">
                    {Intl.DateTimeFormat("pt-BR", {
                      timeZone: "UTC",
                    }).format(Date.parse(row.cmpEmissao))}
                  </p>
                </div>

                <div className="bg-black rounded-2xl p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-sm">
                    Hora
                  </p>

                  <p className="font-semibold mt-1">
                    {row.cmpHorEmissao}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-800">
                <div>
                  <p className="text-zinc-500 text-sm">
                    Parcelas
                  </p>

                  <p className="font-bold text-lg">
                    {row.cmpQtdParcela}x
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-zinc-500 text-sm">
                    Valor
                  </p>

                  <p className="font-bold text-2xl text-green-500">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(row.cmpVlrCompra)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;