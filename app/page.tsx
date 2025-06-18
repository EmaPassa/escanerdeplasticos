import type { Metadata } from "next"
import PlasticScannerClient from "./PlasticScannerClient"

export const metadata: Metadata = {
  title: "Escáner de Plásticos E.E.S.T. n°6 Lomas de Zamora",
  description:
    "Aplicación para escanear códigos de reciclaje de plásticos y conocer sus características - E.E.S.T. N°6 Lomas de Zamora",
}

export default function PlasticScanner() {
  return <PlasticScannerClient />
}
