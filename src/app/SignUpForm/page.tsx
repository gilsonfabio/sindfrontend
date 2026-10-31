
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/server/api";
import Link from "next/link";

const SignUpForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const admEmail = process.env.NEXT_PUBLIC_ADMIN_USER || "";
  const admPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

  async function sendLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      // Login administrador
      if (email === admEmail && password === admPassword) {
        sessionStorage.setItem("id", "999999");
        sessionStorage.setItem("name", "Administrador");

        router.push("/Dashboard");
        return;
      }

      // Login pela API
      const response = await api.post("loginCnv", {
        email,
        password,
      });

      const data = response.data;

      // Backend informou que os dados foram atualizados.
      // Nesse caso, encerra o fluxo e solicita novo login.
      if (data.atualizado === true) {
        alert("Dados atualizados com sucesso. Faça login novamente.");

        // Limpa os dados da sessão.
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("name");

        // Limpa os campos.
        setEmail("");
        setPassword("");

        // Retorna à página de login.
        router.replace("/");

        return;
      }

      // Recupera os dados do convênio.
      const { cnvId, cnvNomFantasia } = data;

      // Validação dos dados retornados.
      if (cnvId == null || !cnvNomFantasia) {
        throw new Error("Dados do convênio não retornados pela API.");
      }

      // Salva sessão.
      sessionStorage.setItem("id", cnvId.toString());
      sessionStorage.setItem("name", cnvNomFantasia);

      // Redireciona para o Dashboard.
      router.push("/Dashboard");

    } catch (err: unknown) {
      let message = "Erro desconhecido";

      if (typeof err === "object" && err !== null && "response" in err) {
        const error = err as any;

        message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          message;

      } else if (err instanceof Error) {
        message = err.message;
      }

      alert(`Falha no login: ${message}`);

    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center h-full gradient-form bg-gray-200 md:h-screen">
      <div className="container py-12 px-6 h-full">
        <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
          <div>
            <div className="block bg-white shadow-lg rounded-lg">
              <div className="lg:flex lg:flex-wrap g-0">
                <div className="px-4 md:px-0">
                  <div className="md:p-12 md:mx-6">

                    <div className="text-center">
                      <h4 className="text-xl font-semibold mt-1 mb-12 pb-1">
                        Faça sua Autenticação no CaldasCard
                      </h4>
                    </div>

                    <form onSubmit={sendLogin}>

                      <p className="mb-4">
                        Por favor, inscreva-se se você não tiver uma conta
                      </p>

                      <div className="mb-4">
                        <input
                          type="email"
                          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          placeholder="Informe seu email"
                          name="userEmail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="mb-4">
                        <input
                          type="password"
                          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                          placeholder="Senha"
                          autoComplete="current-password"
                          name="pin"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="text-center pt-1 mb-12 pb-1">
                        <button
                          className={`bg-green inline-block px-6 py-2.5 text-black font-medium text-xs leading-tight uppercase rounded shadow-md transition duration-150 ease-in-out w-full mb-3 ${
                            loading
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-white hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                          }`}
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Aguarde..." : "Entrar"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pb-6">
                        <p className="mb-0 mr-2">
                          Esqueceu sua senha?
                        </p>

                        <Link
                          href="/ForgotPassword"
                          className="inline-block px-6 py-2 border-2 border-green-600 text-green-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                        >
                          Alterar Senha
                        </Link>
                      </div>

                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;
