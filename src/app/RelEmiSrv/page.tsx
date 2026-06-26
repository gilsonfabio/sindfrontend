"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import {
  TDocumentDefinitions,
  Content,
  DynamicContent,
} from "pdfmake/interfaces";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "@/server/api";
import Menubar from "@/components/Menubar";

(pdfMake as unknown as { vfs: typeof pdfFonts.vfs }).vfs =
  pdfFonts.vfs;

interface ComprasProps {
  cmpId: number;
  cmpEmissao: string;
  usrNome: string;
  cmpQtdParcela: number;
  cmpVlrCompra: number;
  cnvNomFantasia: string;
}

interface ChartData {
  date: string;
  total: number;
}

type PdfCell = {
  text: string;
  fontSize?: number;
  margin?: number[];
  alignment?: "left" | "right" | "center";
  bold?: boolean;
  style?: string;
};

export default function RelEmiSrv() {
  const router = useRouter();

  const [compras, setCompras] = useState<ComprasProps[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const [datIni, setDatIni] = useState("");
  const [datFin, setDatFin] = useState("");
  const [srvId, setSrvId] = useState("");

  const [nomeServidor, setNomeServidor] = useState("");

  useEffect(() => {
    const dtIni = sessionStorage.getItem("datIni") || "";
    const dtFin = sessionStorage.getItem("datFin") || "";
    const servidor = sessionStorage.getItem("idSrv") || "";

    setDatIni(dtIni);
    setDatFin(dtFin);
    setSrvId(servidor);

    if (!dtIni || !dtFin || !servidor) {
      return;
    }

    async function loadRelatorio() {
      try {
        const response = await api.get<ComprasProps[]>(
          `pdfEmiCmpSrv/${dtIni}/${dtFin}/${servidor}`
        );

        setCompras(response.data);

        if (response.data.length > 0) {
          setNomeServidor(response.data[0].usrNome);
        }

        const grouped: Record<string, number> = {};

        response.data.forEach((item) => {
          const date = moment(item.cmpEmissao)
            .utc()
            .format("DD/MM");

          grouped[date] =
            (grouped[date] || 0) + item.cmpVlrCompra;
        });

        setChartData(
          Object.entries(grouped).map(([date, total]) => ({
            date,
            total,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    }

    loadRelatorio();
  }, []);

  const totalCompras = compras.reduce(
    (acc, item) => acc + item.cmpVlrCompra,
    0
  );

  function generatePdf() {
    const formatCurrency = (value: number) =>
      Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

    const reportTitle: Content[] = [
      {
        text: "Relatório de Compras por Servidor",
        fontSize: 16,
        bold: true,
        margin: [15, 20, 0, 10],
      },
      {
        text: `Período: ${datIni} até ${datFin}`,
        fontSize: 10,
        margin: [15, 0, 0, 20],
      },
    ];

    const subTitle: Content[] = [
      {
        text: `Servidor(a): ${nomeServidor}`,
        fontSize: 10,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    ];

    const tableBody: PdfCell[][] = [
      [
        {
          text: "ID",
          style: "tableHeader",
          fontSize: 10,
        },
        {
          text: "EMISSÃO",
          style: "tableHeader",
          fontSize: 10,
        },
        {
          text: "CONVÊNIO",
          style: "tableHeader",
          fontSize: 10,
        },
        {
          text: "PARCELAS",
          style: "tableHeader",
          fontSize: 10,
        },
        {
          text: "VALOR",
          style: "tableHeader",
          fontSize: 10,
        },
      ],

      ...compras.map((item) => [
        {
          text: item.cmpId.toString(),
          fontSize: 9,
          margin: [0, 2, 0, 2],
        },
        {
          text: moment(item.cmpEmissao)
            .utc()
            .format("DD-MM-YYYY"),
          fontSize: 9,
          margin: [0, 2, 0, 2],
        },
        {
          text: item.cnvNomFantasia,
          fontSize: 9,
          margin: [0, 2, 0, 2],
        },
        {
          text: item.cmpQtdParcela.toString(),
          fontSize: 9,
          alignment: "center" as const,
          margin: [0, 2, 0, 2],
        },
        {
          text: formatCurrency(item.cmpVlrCompra),
          fontSize: 9,
          alignment: "right" as const,
          margin: [0, 2, 0, 2],
        },
      ]),
    ];

    const details: Content[] = [
      {
        table: {
          headerRows: 1,
          widths: [50, 90, 220, 70, 80],
          body: tableBody,
        },
        layout: "headerLineOnly",
      },
    ];

    const footer: DynamicContent = (
      currentPage,
      pageCount
    ) => [
      {
        columns: [
          {
            text: `Total Geral: ${formatCurrency(
              totalCompras
            )}`,
            alignment: "left",
            fontSize: 10,
            margin: [10, 0, 0, 0],
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: "right",
            fontSize: 10,
            margin: [0, 0, 20, 0],
          },
        ],
      },
    ];

    const docDefinition: TDocumentDefinitions = {
      pageSize: "A4",
      pageMargins: [15, 60, 15, 40],

      header: reportTitle,

      content: [...subTitle, ...details],

      footer,

      styles: {
        tableHeader: {
          bold: true,
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Menubar />

      <div className="flex justify-center items-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl p-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Relatório de Compras
            </h1>

            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Voltar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-100 rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">
                Período
              </p>

              <p className="font-semibold text-gray-800 mt-2">
                {datIni} → {datFin}
              </p>
            </div>

            <div className="bg-green-100 rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">
                Total Compras
              </p>

              <p className="font-semibold text-gray-800 mt-2">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalCompras)}
              </p>
            </div>

            <div className="bg-yellow-100 rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">
                Registros
              </p>

              <p className="font-semibold text-gray-800 mt-2">
                {compras.length}
              </p>
            </div>
          </div>

          <div className="w-full h-72 mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip
                  formatter={(value: number) =>
                    Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(value)
                  }
                />

                <Bar
                  dataKey="total"
                  fill="#2563EB"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center">
            <button
              onClick={generatePdf}
              className="w-full md:w-80 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold shadow-lg hover:scale-105 transition"
            >
              Emitir PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}