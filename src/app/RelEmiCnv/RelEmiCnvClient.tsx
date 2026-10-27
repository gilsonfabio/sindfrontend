"use client";

import React, { useState, useEffect } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  TDocumentDefinitions,
  Content,
  DynamicContent,
  TableCell,
} from "pdfmake/interfaces";

import moment from "moment";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useRouter } from "next/navigation";
import api from "@/server/api";
import Menubar from "@/components/Menubar";

interface VendasProps {
  cmpId: number;
  cmpEmissao: string;
  usrNome: string;
  cmpQtdParcela: number;
  cmpVlrCompra: number;
  cnvNomFantasia: string;
}

interface RelEmiCnvClientProps {
  datIni: string;
  datFin: string;
  cnvId: string;
}

interface ChartData {
  date: string;
  total: number;
}

type PdfCell = TableCell;

(pdfMake as unknown as { vfs: typeof pdfFonts.vfs }).vfs = pdfFonts.vfs;

const RelEmiCnvClient = ({ datIni, datFin, cnvId }: RelEmiCnvClientProps) => {
  const router = useRouter();
  const [vendas, setVendas] = useState<VendasProps[]>([]);
  const [dtInicio, setDtInicio] = useState("");
  const [dtFinal, setDtFinal] = useState("");
  const [cnvNomFantasia, setCnvNomFantasia] = useState("");
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const formato = (date: string) => moment(date).utc(true).locale("pt-br").format("DD-MM-YYYY");
    setDtInicio(formato(datIni));
    setDtFinal(formato(datFin));

    api.get<VendasProps[]>(`pdfEmiCmpCnv/${datIni}/${datFin}/${cnvId}`)
      .then(resp => {
        setVendas(resp.data);
        if (resp.data.length > 0) setCnvNomFantasia(resp.data[0].cnvNomFantasia);

        // Agrupa vendas por data
        const grouped: Record<string, number> = {};
        resp.data.forEach(v => {
          const date = moment(v.cmpEmissao).utc().format("DD/MM");
          grouped[date] = (grouped[date] || 0) + v.cmpVlrCompra;
        });

        setChartData(Object.entries(grouped).map(([date, total]) => ({ date, total })));
      })
      .catch(console.error);
  }, [datIni, datFin, cnvId]);

  const totCompras = vendas.reduce((acc, v) => acc + v.cmpVlrCompra, 0);

  const handleBackDashboard = () => router.push("/Dashboard");

  const generatePdf = () => {
    const formatCurrency = (value: number) =>
      Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

    const reportTitle: Content[] = [
      { text: `Relatório de Vendas por Emissão período de: ${dtInicio} a ${dtFinal}`, fontSize: 15, bold: true, margin: [15, 20, 0, 45] }
    ];

    const subTitle: Content[] = [
      { text: `Convênio: ${cnvNomFantasia}`, fontSize: 10, bold: true, margin: [0, 5, 0, 5] }
    ];

    const tableBody: TableCell[][] = [
      [
        { text: "ID", style: "tableHeader", fontSize: 10 },
        { text: "EMISSÃO", style: "tableHeader", fontSize: 10 },
        { text: "NOME SERVIDOR(A)", style: "tableHeader", fontSize: 10 },
        { text: "PLANO", style: "tableHeader", fontSize: 10 },
        { text: "VLR. DA VENDA", style: "tableHeader", fontSize: 10 },
      ],
      ...vendas.map((v): TableCell[] => [
        {
          text: v.cmpId.toString(),
          fontSize: 9,
          margin: [0, 2, 0, 2],
        },
        {
          text: moment(v.cmpEmissao).utc().locale("pt-br").format("DD-MM-YYYY"),
          fontSize: 9,
          margin: [0, 2, 0, 2],
        },
        {
          text: v.usrNome,
          fontSize: 9,
          margin: [0, 2, 0, 2],
        },
        {
          text: v.cmpQtdParcela.toString(),
          fontSize: 9,
          margin: [0, 2, 0, 2],
        },
        {
          text: formatCurrency(v.cmpVlrCompra),
          fontSize: 9,
          alignment: "right",
          margin: [0, 2, 0, 2],
        },
      ]),
    ];
    
    const details: Content[] = [
      { table: { headerRows: 1, widths: [70, 70, 200, 50, 80], body: tableBody }, layout: "headerLineOnly" }
    ];

    const footer: DynamicContent = (currentPage, pageCount) => [
      {
        columns: [
          { text: `Total de Vendas..............${formatCurrency(totCompras)}`, alignment: "left", fontSize: 10, margin: [10, 0, 0, 0] },
          { text: `Página: ${currentPage} / ${pageCount}`, alignment: "right", fontSize: 10, margin: [0, 0, 20, 0] }
        ]
      }
    ];

    const docDefinition: TDocumentDefinitions = {
      pageSize: "A4",
      pageMargins: [15, 50, 15, 40],
      header: reportTitle,
      content: [...subTitle, ...details],
      footer
    };

    pdfMake.createPdf(docDefinition).open();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Menubar />
      <div className="flex justify-center items-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-10">
          <div className="flex justify-start mb-4">
            <button onClick={handleBackDashboard} className="flex items-center gap-2 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition">
              Dashboard
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Painel Administrativo - Relatório PDF</h2>
          <p className="text-gray-600 mb-8 text-center">Visualize o resumo do relatório, gráfico de vendas e gere o PDF.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-100 rounded-xl p-6 shadow hover:shadow-md transition">
              <p className="text-gray-500 text-sm">Período</p>
              <p className="text-gray-800 font-semibold mt-2">{dtInicio} → {dtFinal}</p>
            </div>
            <div className="bg-green-100 rounded-xl p-6 shadow hover:shadow-md transition">
              <p className="text-gray-500 text-sm">Total de Vendas</p>
              <p className="text-gray-800 font-semibold mt-2">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totCompras)}</p>
            </div>
            <div className="bg-yellow-100 rounded-xl p-6 shadow hover:shadow-md transition">
              <p className="text-gray-500 text-sm">Quantidade de Registros</p>
              <p className="text-gray-800 font-semibold mt-2">{vendas.length}</p>
            </div>
          </div>

          <div className="w-full h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => {
                    const numero = Number(value ?? 0);
                    return Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(numero);
                  }}
                />
                <Bar dataKey="total" fill="#4F46E5" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center">
            <button onClick={generatePdf} className="flex items-center justify-center gap-3 w-full md:w-1/3 py-3 bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold rounded-lg shadow-lg hover:from-green-400 hover:to-blue-500 transition duration-300 ease-in-out">
              Emitir PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelEmiCnvClient;
