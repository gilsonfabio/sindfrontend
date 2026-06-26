import Footer from "../components/Footer";
import Menubar from "../components/Menubar";
import TotServidores from "@/components/TotServidores";
import TotConvenios from "@/components/TotConvenios";

import Link from "next/link";
import {
  ShieldCheck,
  Users,
  CreditCard,
  Building2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Menubar />

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-black" />

        <div className="relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-2 rounded-full border border-green-500 text-green-400 text-sm mb-6">
            Sistema Inteligente de Convênios
          </span>

          <h1 className="text-4xl md:text-7xl font-bold leading-tight">
            Associação Cultural, Esportiva e Social
            <span className="block text-green-500 mt-4">
              dos Servidores Públicos Municipais de Caldas Novas
            </span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl mt-8 max-w-3xl mx-auto leading-relaxed">
            Plataforma moderna para gerenciamento de convênios,
            servidores, benefícios e administração completa da associação.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">
            <Link href="/SignUpForm"
              className="px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-500 transition-all duration-300 text-white font-semibold shadow-lg shadow-green-600/20">
              Login Convênio
            </Link>

            <Link href="/SignInServ"
              className="px-8 py-4 rounded-2xl border border-green-600 hover:bg-green-600/10 transition-all duration-300 text-green-400 font-semibold">
              Login Servidor
            </Link>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition-all duration-300">
            <ShieldCheck className="text-green-500 w-12 h-12 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">
              Segurança
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Sistema protegido com autenticação segura e gerenciamento
              completo de acessos.
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition-all duration-300">
            <Users className="text-green-500 w-12 h-12 mb-6" />

            <h2 className="text-2xl font-semibold mb-4">
              Servidores
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              Controle total de usuários, convênios e informações dos
              servidores municipais.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition-all duration-300">
            <CreditCard className="text-green-500 w-12 h-12 mb-6" />

            <h2 className="text-2xl font-semibold mb-4">
              Convênios
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              Gestão eficiente de benefícios, cartões e serviços
              conveniados.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-green-500 transition-all duration-300">
            <Building2 className="text-green-500 w-12 h-12 mb-6" />

            <h2 className="text-2xl font-semibold mb-4">
              Administração
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              Painel administrativo moderno para controle completo da
              associação.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-green-500 font-semibold uppercase tracking-widest">
                Plataforma Completa
              </span>

              <h2 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
                Tecnologia moderna para administração eficiente
              </h2>

              <p className="text-zinc-400 mt-6 text-lg leading-relaxed">
                Centralize informações, automatize processos e tenha mais
                controle administrativo com uma interface moderna e intuitiva.
              </p>
            </div>

            <div className="bg-black border border-zinc-800 rounded-3xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <span className="text-zinc-400">Servidores Ativos</span>
                  <span className="text-green-500 font-bold text-xl">
                    <TotServidores />
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <span className="text-zinc-400">Convênios</span>
                  <span className="text-green-500 font-bold text-xl">
                    <TotConvenios />
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <span className="text-zinc-400">Atendimentos</span>
                  <span className="text-green-500 font-bold text-xl">
                    24h
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Segurança</span>
                  <span className="text-green-500 font-bold text-xl">
                    SSL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}