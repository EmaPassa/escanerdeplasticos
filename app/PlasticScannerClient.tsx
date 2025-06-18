"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, Scan, Info, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Base de datos de códigos de reciclaje de plásticos
const plasticDatabase = {
  1: {
    code: 1,
    name: "PET (Polietileno Tereftalato)",
    commonUses: "Botellas de agua, refrescos, envases de comida",
    microwaveSafe: false,
    characteristics: [
      "Transparente y resistente",
      "Reciclable",
      "No reutilizar para alimentos calientes",
      "Puede liberar antimonio con el calor",
    ],
    recycling: "Altamente reciclable",
    safetyNotes: "No calentar en microondas. Evitar exposición al sol prolongada.",
    color: "bg-blue-100 text-blue-800",
  },
  2: {
    code: 2,
    name: "HDPE (Polietileno de Alta Densidad)",
    commonUses: "Botellas de leche, detergente, tupperware",
    microwaveSafe: false,
    characteristics: [
      "Resistente a químicos",
      "Duradero y flexible",
      "Resistente a bajas temperaturas",
      "Opaco o translúcido",
    ],
    recycling: "Fácilmente reciclable",
    safetyNotes: "No apto para microondas. Seguro para almacenar alimentos fríos.",
    color: "bg-green-100 text-green-800",
  },
  3: {
    code: 3,
    name: "PVC (Policloruro de Vinilo)",
    commonUses: "Tuberías, envases de aceite, blísteres",
    microwaveSafe: false,
    characteristics: [
      "Flexible o rígido",
      "Resistente a químicos",
      "Puede contener plastificantes",
      "Difícil de reciclar",
    ],
    recycling: "Reciclaje limitado",
    safetyNotes: "NO usar con alimentos. Puede liberar químicos tóxicos.",
    color: "bg-red-100 text-red-800",
  },
  4: {
    code: 4,
    name: "LDPE (Polietileno de Baja Densidad)",
    commonUses: "Bolsas plásticas, film transparente, tapas flexibles",
    microwaveSafe: false,
    characteristics: ["Flexible y translúcido", "Resistente a ácidos", "Baja resistencia al calor", "Impermeable"],
    recycling: "Reciclable en centros especializados",
    safetyNotes: "No apto para microondas. Puede deformarse con calor.",
    color: "bg-yellow-100 text-yellow-800",
  },
  5: {
    code: 5,
    name: "PP (Polipropileno)",
    commonUses: "Tupperware, tapas, pajitas, envases de yogur",
    microwaveSafe: true,
    characteristics: ["Resistente al calor", "Flexible y duradero", "Resistente a grasas", "Liviano"],
    recycling: "Reciclable",
    safetyNotes: "APTO para microondas. Resistente hasta 120°C.",
    color: "bg-emerald-100 text-emerald-800",
  },
  6: {
    code: 6,
    name: "PS (Poliestireno)",
    commonUses: "Vasos desechables, bandejas de comida, espuma",
    microwaveSafe: false,
    characteristics: ["Liviano y aislante", "Frágil", "Puede ser espumado", "Baja resistencia al calor"],
    recycling: "Difícil de reciclar",
    safetyNotes: "NO usar en microondas. Puede liberar estireno con el calor.",
    color: "bg-orange-100 text-orange-800",
  },
  7: {
    code: 7,
    name: "Otros Plásticos",
    commonUses: "Policarbonato, mezclas, bioplásticos",
    microwaveSafe: null,
    characteristics: [
      "Variedad de propiedades",
      "Puede incluir BPA",
      "Mezclas de diferentes plásticos",
      "Propiedades variables",
    ],
    recycling: "Generalmente no reciclable",
    safetyNotes: "Verificar etiqueta específica. Algunos contienen BPA.",
    color: "bg-purple-100 text-purple-800",
  },
}

export default function PlasticScannerClient() {
  const [selectedPlastic, setSelectedPlastic] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = useCallback(async () => {
    try {
      setShowCamera(true)
      setIsScanning(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsScanning(false)
      setShowCamera(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
    setIsScanning(false)
  }, [])

  const simulateDetection = (code) => {
    setSelectedPlastic(plasticDatabase[code])
    stopCamera()
  }

  const getMicrowaveIcon = (microwaveSafe) => {
    if (microwaveSafe === true) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    } else if (microwaveSafe === false) {
      return <XCircle className="w-5 h-5 text-red-600" />
    } else {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getMicrowaveText = (microwaveSafe) => {
    if (microwaveSafe === true) {
      return "APTO para microondas"
    } else if (microwaveSafe === false) {
      return "NO APTO para microondas"
    } else {
      return "Verificar etiqueta específica"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/logo-eest6.png" alt="Logo E.E.S.T. N°6" className="w-16 h-16 object-contain" />
            <div className="text-left">
              <h2 className="text-lg font-semibold text-gray-800">E.E.S.T. N°6</h2>
              <p className="text-sm text-gray-600">Lomas de Zamora</p>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Escáner de Plásticos</h1>
          <p className="text-gray-600">Escanea códigos de reciclaje para conocer las características de tus envases</p>
        </div>

        {/* Scanner Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              Escáner
            </CardTitle>
            <CardDescription>Usa la cámara para escanear el código de reciclaje del envase</CardDescription>
          </CardHeader>
          <CardContent>
            {!showCamera ? (
              <div className="text-center space-y-4">
                <Button onClick={startCamera} size="lg" className="w-full sm:w-auto">
                  <Camera className="w-5 h-5 mr-2" />
                  Iniciar Cámara
                </Button>
                <div className="text-sm text-gray-500">
                  <p>También puedes probar con estos códigos comunes:</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {Object.keys(plasticDatabase).map((code) => (
                      <Button
                        key={code}
                        variant="outline"
                        size="sm"
                        onClick={() => simulateDetection(Number.parseInt(code))}
                      >
                        Código {code}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-white rounded-lg opacity-50"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={stopCamera} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                  <div className="text-sm text-gray-500 flex-1 text-center pt-2">
                    Enfoca el código de reciclaje en el cuadro
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {selectedPlastic && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Información del Plástico
                  </CardTitle>
                  <CardDescription>Código de reciclaje: {selectedPlastic.code}</CardDescription>
                </div>
                <Badge className={selectedPlastic.color}>Tipo {selectedPlastic.code}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Microwave Safety Alert */}
              <Alert
                className={`border-l-4 ${
                  selectedPlastic.microwaveSafe === true
                    ? "border-l-green-500 bg-green-50"
                    : selectedPlastic.microwaveSafe === false
                      ? "border-l-red-500 bg-red-50"
                      : "border-l-yellow-500 bg-yellow-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {getMicrowaveIcon(selectedPlastic.microwaveSafe)}
                  <AlertDescription className="font-semibold">
                    {getMicrowaveText(selectedPlastic.microwaveSafe)}
                  </AlertDescription>
                </div>
              </Alert>

              {/* Plastic Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{selectedPlastic.name}</h3>
                    <p className="text-gray-600">{selectedPlastic.commonUses}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Características:</h4>
                    <ul className="space-y-1">
                      {selectedPlastic.characteristics.map((char, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Reciclaje:</h4>
                    <p className="text-sm text-gray-600">{selectedPlastic.recycling}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Notas de Seguridad:</h4>
                    <p className="text-sm text-gray-600">{selectedPlastic.safetyNotes}</p>
                  </div>
                </div>
              </div>

              <Button onClick={() => setSelectedPlastic(null)} variant="outline" className="w-full">
                Escanear Otro Envase
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>¿Cómo usar el escáner?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <p>Busca el símbolo de reciclaje en tu envase (triángulo con número)</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <p>Haz clic en "Iniciar Cámara" y enfoca el código</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <p>Obtén información detallada sobre el tipo de plástico y su seguridad</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
