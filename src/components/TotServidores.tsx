"use client";

import React, { useState, useEffect } from "react";
import api from "@/server/api";

const TotServidores = () => {
  const [totServ, setTotServ] = useState<number>(0);

  useEffect(() => {
    async function loadTotal() {
      try {
        const response = await api.get("/totServ");

        // Caso a API retorne:
        // { total: 5000 }
        setTotServ(response.data.totalServidores);

        // Se retornar apenas número:
        // setTotServ(response.data);
      } catch (error) {
        console.error("Erro ao buscar total de servidores", error);
      }
    }

    loadTotal();
  }, []);

  return (
    <span className="text-green-500 font-bold text-xl">
      +{totServ}
    </span>
  );
};

export default TotServidores;