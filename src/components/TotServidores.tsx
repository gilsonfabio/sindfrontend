"use client";

import React, { useState, useEffect } from "react";
import api from "@/server/api";

const TotServidores = () => {
  const [totServ, setTotServ] = useState<number>(0);

  useEffect(() => {
    let ativo = true;

    async function loadTotal() {
      try {
        const response = await api.get("/totServ");

        if (!ativo) return;

        // Aceita respostas como:
        // { totalServidores: 5000 }
        // { total: 5000 }
        // 5000
        const dados = response.data;

        const total =
          typeof dados === "number"
            ? dados
            : Number(dados?.totalServidores ?? dados?.total ?? 0);

        if (Number.isFinite(total)) {
          setTotServ(total);
        } else {
          console.error("Formato inválido na resposta de /totServ:", dados);
        }
      } catch (error) {
        console.error("Erro ao buscar total de servidores:", error);
      }
    }

    loadTotal();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <span className="text-green-500 font-bold text-xl">
      +{totServ.toLocaleString("pt-BR")}
    </span>
  );
};

export default TotServidores;