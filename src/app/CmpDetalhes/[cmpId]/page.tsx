"use client";

import React, { useEffect, useState } from "react";
import api from "@/server/api";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import Menubar from "@/components/Menubar";
import Footer from "@/components/Footer";

import moment from "moment";

import {
  ShoppingBag,
  CalendarDays,
  Clock3,
  CreditCard,
  Receipt,
  BadgeCheck,
  ArrowLeft,
  Wallet,
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
  cnvNomFantasia: string;
}

interface ParcelasProps {
  parId: number;
  parIdCompra: number;
  parNroParcela: number;
  parVctParcela: string;
  parVlrParcela: number;
  parStaParcela: string;
}

const CmpDetalhes = () => {
  const [vendas, setVendas] = useState<VendasProps[]>([]);
  const [parcelas, setParcelas] = useState<ParcelasProps[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();

  const cmpId = params?.cmpId;

  useEffect(() => {
    if (!cmpId) return;

    async function loadData() {
      try {
        const [compraResponse, parcelaResponse] = await Promise.all([
          api.get(`/dadCompra/${cmpId}`),
          api.get(`/parCompra/${cmpId}`),
        ]);

        setVendas(compraResponse.data);
        setParcelas(parcelaResponse.data);
      } catch (error) {
        alert("Erro ao carregar os dados da compra.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [cmpId]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
          <Menubar />

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-all duration-300 px-5 py-3 rounded-2xl font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* TITLE */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-500/10 p-4 rounded-3xl">
              <ShoppingBag className="text-green-500 w-8 h-8" />
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Detalhes da Compra
              </h1>

              <p className="text-zinc-400 mt-2">
                Visualize informações completas da compra #{cmpId}
              </p>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-10 text-center">
            <p className="text-zinc-400 text-lg">
              Carregando dados da compra...
            </p>
          </div>
        )}

        {/* DADOS COMPRA */}
        {!loading &&
          vendas.map((item) => (
            <div
              key={item.cmpId}
              className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-8 md:p-10 mb-10"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  {/* LEFT */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <BadgeCheck className="text-green-500 w-7 h-7" />

                      <span className="px-4 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm">
                        Compra Aprovada
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                      {item.cnvNomFantasia}
                    </h2>

                    <div className="space-y-3 text-zinc-400">
                      <p>
                        <span className="text-white font-semibold">
                          Servidor:
                        </span>{" "}
                        {item.usrNome}
                      </p>

                      <p>
                        <span className="text-white font-semibold">
                          Código Compra:
                        </span>{" "}
                        #{item.cmpId}
                      </p>

                      <p>
                        <span className="text-white font-semibold">
                          Status:
                        </span>{" "}
                        {item.cmpStatus}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="w-full lg:w-[360px]">
                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Wallet className="text-green-500 w-8 h-8" />

                        <span className="text-zinc-400">
                          Valor da Compra
                        </span>
                      </div>

                      <h2 className="text-5xl font-bold text-green-500">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.cmpVlrCompra)}
                      </h2>

                      <div className="mt-6 border-t border-zinc-800 pt-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500">
                            Parcelamento
                          </span>

                          <span className="font-bold text-white">
                            {item.cmpQtdParcela}x
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500">
                            Convênio
                          </span>

                          <span className="font-bold text-white">
                            {item.cnvNomFantasia}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INFO CARDS */}
                <div className="grid md:grid-cols-3 gap-6 mt-10">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CalendarDays className="text-green-500" />

                      <span className="text-zinc-400">
                        Data da Compra
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold">
                      {moment(item.cmpEmissao).format("DD/MM/YYYY")}
                    </h3>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock3 className="text-green-500" />

                      <span className="text-zinc-400">
                        Hora da Compra
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold">
                      {moment(
                        item.cmpHorEmissao,
                        "HH:mm:ss"
                      ).format("HH:mm")}
                    </h3>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="text-green-500" />

                      <span className="text-zinc-400">
                        Parcelamento
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold">
                      {item.cmpQtdParcela}x
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* TITLE PARCELAS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Parcelas da Compra
            </h2>

            <p className="text-zinc-400 mt-2">
              Histórico completo das parcelas
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <Receipt className="text-green-500" />

              <div>
                <p className="text-sm text-zinc-500">
                  Total Parcelas
                </p>

                <p className="font-semibold">
                  {parcelas.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PARCELAS */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {parcelas.map((item) => (
            <div
              key={item.parNroParcela}
              className="group bg-zinc-900 border border-zinc-800 hover:border-green-500 rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="bg-green-500/10 p-4 rounded-2xl">
                  <Receipt className="text-green-500 w-7 h-7" />
                </div>

                <span className="text-xs text-zinc-500">
                  Parcela #{item.parNroParcela}
                </span>
              </div>

              <div>
                <p className="text-zinc-500 text-sm mb-1">
                  Status
                </p>

                <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition">
                  {item.parStaParcela}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black rounded-2xl p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-sm">
                    Vencimento
                  </p>

                  <p className="font-semibold mt-1">
                    {moment(item.parVctParcela).format(
                      "DD/MM/YYYY"
                    )}
                  </p>
                </div>

                <div className="bg-black rounded-2xl p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-sm">
                    Parcela
                  </p>

                  <p className="font-semibold mt-1">
                    {item.parNroParcela}x
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-800">
                <div>
                  <p className="text-zinc-500 text-sm">
                    Compra
                  </p>

                  <p className="font-bold text-lg">
                    #{item.parIdCompra}
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
                    }).format(item.parVlrParcela)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {!loading && parcelas.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] p-10 text-center mt-8">
            <p className="text-zinc-400 text-lg">
              Nenhuma parcela encontrada.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CmpDetalhes;