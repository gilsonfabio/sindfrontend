"use client";

import React, { useState, useEffect } from "react";
import api from "@/server/api";

const TotConvenios = () => {
  const [totConv, setTotConv] = useState<number>(0);

  useEffect(() => {
    let ativo = true;

    async function loadTotal() {
      try {
        const response = await api.get("/totConv");

        if (!ativo) return;

        const dados = response.data;

        // Aceita: { totalConvenios: 100 }, { total: 100 } ou 100
        const total =
          typeof dados === "number"
            ? dados
            : Number(dados?.totalConvenios ?? dados?.total ?? 0);

        if (Number.isFinite(total)) {
          setTotConv(total);
        } else {
          console.error(
            "Formato inválido na resposta de /totConv:",
            dados
          );
        }
      } catch (error) {
        console.error("Erro ao buscar total de convênios:", error);
      }
    }

    loadTotal();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <span className="text-green-500 font-bold text-xl">
      +{totConv.toLocaleString("pt-BR")}
    </span>
  );
};

export default TotConvenios;