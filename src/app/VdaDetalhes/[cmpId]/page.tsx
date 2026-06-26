"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/server/api";
import Menubar from "@/components/Menubar";
import { useParams } from "next/navigation";

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

interface ParcelasProps {
  parId: number;
  parIdCompra: number;
  parNroParcela: number;
  parVctParcela: string;
  parVlrParcela: number;
  parStaParcela: string;
}

const VdaDetalhes = () => {
  const [vendas, setVendas] = useState<VendasProps[]>([]);
  const [parcelas, setParcelas] = useState<ParcelasProps[]>([]);
  const [email, setEmail] = useState("gilsonfabio@gmail.com");

  const searchParams = useSearchParams();
  
  const params = useParams();
  const cmpId = params.cmpId;

  // Carregar dados da API
  useEffect(() => {
    const loadData = async () => {
      if (!cmpId) return; // se ainda não tiver id, não faz nada

      try {
        const [vendasRes, parcelasRes] = await Promise.all([
          api.get(`/dadCompra/${cmpId}`),
          api.get(`/parCompra/${cmpId}`),
        ]);

        setVendas(vendasRes.data);
        setParcelas(parcelasRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Não foi possível carregar os dados da venda.");
      }
    };

    loadData();
  }, [cmpId]);

  const handleSendEmail = async () => {
    try {
      await api.get(`/envEmail/${email}`);
      alert("Email enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      alert("Falha ao enviar email.");
    }
  };

  if (!cmpId) return <div>Carregando...</div>; // loading enquanto não tem cmpId

  return (
    <div className="w-screen h-screen bg-white">
      <Menubar />
      <div className="ml-2 mr-2 md:ml-36 md:mr-36">
        {/* Header */}
        <div className="flex flex-row justify-between items-center border-b-2 border-gray-300">
          <span className="text-md md:text-2xl font-bold text-green-600 mt-6 h-10">
            Dados da Venda: {cmpId}
          </span>

          <Link
            href={`/SignInAdm/${cmpId}`}
            className="flex flex-row items-center justify-center text-green-600 hover:text-white hover:bg-green-600 text-[10px] md:text-[14px] border border-green-600 rounded-full w-24 h-8 md:w-40 md:h-10"
          >
            Excluir Venda
          </Link>

          <button
            onClick={handleSendEmail}
            className="flex flex-row items-center justify-center text-green-600 hover:text-white hover:bg-green-600 text-[10px] md:text-[14px] border border-green-600 rounded-full w-24 h-8 md:w-40 md:h-10"
          >
            Email Venda
          </button>
        </div>

        {/* Vendas */}
        <div className="flex flex-col w-full h-full text-black mt-5">
          <div className="grid grid-cols-1 gap-1 md:grid-cols-3 md:gap-4 mb-5 ml-1 px-0 py-0">
            {vendas.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#d7dddc]/20 rounded overflow-hidden shadow-lg mb-1 hover:bg-[#b5b9b9]/40"
              >
                <div className="flex flex-row items-start justify-between px-2">
                  <div className="flex flex-col items-start px-2 py-2">
                    <span className="text-[12px] font-bold">Nome Cliente</span>
                    <div className="text-[16px] text-green-500 font-bold mb-0">
                      {item.usrNome}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-start justify-between px-2 py-0">
                  <div className="flex flex-col items-start px-2 py-1">
                    <span className="text-[12px] font-bold">Dt. Venda</span>
                    <div className="text-[12px] mb-0">
                      {Intl.DateTimeFormat("pt-BR", {
                        timeZone: "UTC",
                      }).format(Date.parse(item.cmpEmissao))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start px-2 py-1">
                    <span className="text-[12px] font-bold">Hr. Venda</span>
                    <div className="text-[12px] mb-0">{item.cmpHorEmissao}</div>
                  </div>
                </div>
                <div className="flex flex-row items-start justify-between px-2">
                  <div className="flex flex-col items-start px-2">
                    <span className="text-[12px] font-bold">Nº Parcelas</span>
                    <div className="text-[12px] mb-0">{item.cmpQtdParcela}</div>
                  </div>
                  <div className="flex flex-col items-start px-2">
                    <span className="text-[12px] font-bold">Vlr Venda</span>
                    <div className="text-[12px] mb-0">{item.cmpVlrCompra}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parcelas */}
        <div className="flex flex-row justify-between items-center border-b-2 border-gray-300">
          <span className="text-md md:text-2xl font-bold text-green-600 mt-6 h-10">
            Parcelas:
          </span>
        </div>

        <div className="flex flex-col w-full h-full text-black mt-5">
          <div className="grid grid-cols-1 gap-1 md:grid-cols-5 md:gap-4 mb-5 ml-1 px-0 py-0">
            {parcelas.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#d7dddc]/20 rounded overflow-hidden shadow-lg mb-1 hover:bg-[#b5b9b9]/40"
              >
                <div className="flex flex-row items-start justify-between px-2">
                  <div className="flex flex-col items-start px-2 py-2">
                    <div className="text-[16px] text-green-500 font-bold mb-0">
                      {item.parNroParcela}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-start justify-between px-2 py-0">
                  <div className="flex flex-col items-start px-2 py-1">
                    <span className="text-[12px] font-bold">Dt. Vencto</span>
                    <div className="text-[12px] mb-0">
                      {Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
                        Date.parse(item.parVctParcela)
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start px-2 py-1">
                    <span className="text-[12px] font-bold">Vlr. Parcela</span>
                    <div className="text-[12px] mb-0">{item.parVlrParcela}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VdaDetalhes;
