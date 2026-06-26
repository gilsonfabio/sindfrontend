"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import api from "@/server/api";

interface SignInAdmClientProps {
  cmpId: string;
}

export default function SignInAdmClient({ cmpId }: SignInAdmClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cmpId) return setError("ID da venda não informado!");

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.get(`signInCnc/${email}/${password}`);
      const idUsuario = response.data.cnvId;

      await api.put(`cncCompra/${cmpId}`, { cmpIdCanc: idUsuario });

      setSuccess("Compra excluída com sucesso!");
      setTimeout(() => router.back(), 1500);
    } catch (err) {
      console.error(err);
      setError("Falha no login ou exclusão da compra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 relative">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Autenticação Administrador(a)
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Para cancelar venda você precisa ser administrador do Convênio
        </p>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            <FaExclamationCircle /> {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            <FaCheckCircle /> {success}
          </div>
        )}

        <form onSubmit={sendLogin} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-300
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500"}`}
          >
            {loading ? "Processando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={() => alert("Funcionalidade de alterar senha")}
          >
            Esqueceu a senha / Alterar senha
          </button>
        </div>
      </div>
    </div>
  );
}
