"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import api from "@/server/api";

const SignInServ = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const admEmail = process.env.NEXT_PUBLIC_ADMIN_USER;
  const admPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  async function sendLogin(e: React.FormEvent) {
    e.preventDefault();

    try {

      // LOGIN ADMIN
      if (email === admEmail && password === admPassword) {

        sessionStorage.setItem("usrId", "999999");
        sessionStorage.setItem("usrNome", "Administrador");
        sessionStorage.setItem("usrCartao", "1111222233334444");

        router.push("/Dashserv");

        return;
      }

      // LOGIN API
      const response = await api.post("signInSrv", {
        email,
        password,
      });

      if (response.data.forceRelogin) {
        alert(response.data.message);
        return;
      }

      const idUsuario = response.data.user.usrId;
      const nomUsuario = response.data.user.usrNome;
      const nrocartao = response.data.user.usrCartao;

      // SALVA SESSÃO
      sessionStorage.setItem("usrId", idUsuario.toString());
      sessionStorage.setItem("usrNome", nomUsuario);
      sessionStorage.setItem("usrCartao", nrocartao);

      // REDIRECIONA SEM URL PARAMS
      router.push("/Dashserv");

    } catch (err: any) {

      console.log(err.response?.data);

      alert("Falha no login servidor(a)!");

    }
  }

  return (
    <section className="flex items-center justify-center h-full gradient-form bg-gray-200 md:h-screen">
      <div className="container py-12 px-6 h-full">
        <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
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
                      Por favor, sindicalize-se se você não tiver uma conta
                    </p>

                    <div className="mb-4">
                      <input
                        type="email"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal 
                          text-gray-700 bg-white border border-gray-300 rounded 
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="Informe seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <input
                        type="password"
                        className="form-control block w-full px-3 py-1.5 text-base font-normal 
                          text-gray-700 bg-white border border-gray-300 rounded 
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="Senha"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="text-center pt-1 mb-12 pb-1">
                      <button
                        className="bg-green-600 inline-block px-6 py-2.5 text-white 
                          font-medium text-xs leading-tight uppercase rounded shadow-md 
                          hover:bg-green-700 hover:shadow-lg focus:shadow-lg 
                          focus:outline-none focus:ring-0 active:shadow-lg 
                          transition duration-150 ease-in-out w-full mb-3"
                        type="submit"
                      >
                        Entrar
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-6">
                      <p className="mb-0 mr-2">Esqueceu sua senha?</p>
                      <Link
                        href="/ForgotPassword"
                        className="inline-block px-6 py-2 border-2 border-green-600 
                          text-green-600 font-medium text-xs leading-tight uppercase 
                          rounded hover:bg-black hover:bg-opacity-5 
                          focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
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
    </section>
  );
};

export default SignInServ;
