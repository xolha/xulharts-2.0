"use client"

import { motion } from "framer-motion"

export default function InfoSection() {
  const fadeDown = {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.0 }
  }

  return (
    <motion.div
      initial={fadeDown.initial}
      whileInView={fadeDown.animate}
      transition={fadeDown.transition}
      viewport={{ once: true }}
      className="p-8"
    >
      <hr className="pb-3" />
      <div className="flex flex-col gap-3 justify-center items-center">
        <h1 className="font-inria text-white text-2xl">INFORMAÇÕES</h1>
        <h1 className="font-inria text-white">
          <span className="font-bold">PAGAMENTO:</span> Pix ou depósito
          bancário, sendo que 50% do valor deverá ser efetuado antes do envio do
          rascunho e os outros 50% antes da arte final. Cartão de crédito será
          cobrado 100% do valor antes do envio do rascunho mais a taxa da
          maquininha;
        </h1>
        <h1 className="font-inria text-white">
          <span className="font-bold">PRAZOS:</span> variam de acordo com o
          pedido do cliente;
        </h1>
        <h1 className="font-inria text-white">
          <span className="font-bold">PERSONAGENS ADICIONAIS:</span> ombro/ícone
          + R$25,00; quadril + R$40,00; corpo todo + R$65,00; chibi R$45,00;
        </h1>
        <h1 className="font-inria text-white">
          <span className="font-bold">Cenários:</span> preço pode variar de
          acordo com a complexidadde do desenho;
        </h1>
        <h1 className="font-inria text-white">
          <span className="font-bold">OBS.:</span> os preços dos chibis e de
          corpo podem variar caso o pedido do cliente seja algo mais complexo;
        </h1>
      </div>
    </motion.div>
  )
}
