"use client";

import React, { useState, useEffect } from "react";
import api from "@/server/api";

const TotConvenios = () => {
  const [totConv, setTotConv] = useState<number>(0);

  useEffect(() => {
    async function loadTotal() {
      try {
        const response = await api.get("/totConv");

        setTotConv(response.data.totalConvenios);

      } catch (error) {
        console.error("Erro ao buscar total de convênios", error);
      }
    }

    loadTotal();
  }, []);

  return (
    <span className="text-green-500 font-bold text-xl">
      +{totConv}
    </span>
  );
};

export default TotConvenios;