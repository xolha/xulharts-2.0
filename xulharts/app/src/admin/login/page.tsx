"use client";

import Image from "next/image";
import { Minha_logo } from "assets";
import Button from "../components/ui/Button";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  return (
    <div className="bg-roxo-escuro min-h-screen flex justify-center items-center">
      <div className="bg-white items-center rounded-3xl p-4 w-120 justify-center">
        <div className="flex justify-center mb-4">
          <Image
            src={Minha_logo}
            alt="Logo xulharts"
            width={60}
            height={60}
          />
        </div>
        <h1 className="text-center text-2xl font-inria font-extrabold">
          Faz login ae
        </h1>

        <form>
          <div className="m-2 flex flex-col gap-2">
            <div className="m-2 flex flex-col gap-1">
              <h1 className="text-[12px] font-inria pb-1">Email</h1>
              <input type="email" className="bg-gray-300 rounded-2xl p-4" />
            </div>

            <div className="m-2 flex flex-col gap-1">
              <h1 className="text-[12px] font-inria pb-1">Senha</h1>
              <input type="password" className="bg-gray-300 rounded-2xl p-4" />
            </div>
          </div>

          <div className="flex justify-center items-center w-full">
            <Button onClick={() => router.push("/admin/home")} >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
