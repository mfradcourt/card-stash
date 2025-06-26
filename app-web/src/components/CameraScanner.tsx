import { useRef, useCallback, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { BrowserMultiFormatReader } from '@zxing/library'

interface CameraScannerProps {
  onScan: (result: string) => void
  isActive: boolean
}

export function CameraScanner({ onScan, isActive }: CameraScannerProps) {
  const webcamRef = useRef<Webcam>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [isScanning, setIsScanning] = useState(false)
  const scanningRef = useRef(false)
  const [error, setError] = useState<string>('')

  // Initialize code reader
  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader()
    
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset()
      }
    }
  }, [])

  // Handle devices enumeration
  const handleDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
    const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput')
    setDevices(videoDevices)
    
    // Prefer back camera
    const backCamera = videoDevices.find(device => 
      device.label.toLowerCase().includes('back') || 
      device.label.toLowerCase().includes('rear') ||
      device.label.toLowerCase().includes('environment')
    )
    
    if (backCamera) {
      setSelectedDeviceId(backCamera.deviceId)
    } else if (videoDevices.length > 0) {
      setSelectedDeviceId(videoDevices[0].deviceId)
    }
  }, [])

  // Enumerate devices when component mounts
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices).catch(err => {
      setError('Failed to enumerate devices: ' + err.message)
    })
  }, [handleDevices])

  // Start/stop scanning based on isActive prop
  useEffect(() => {
    if (isActive && !scanningRef.current) {
      startScanning()
    } else if (!isActive && scanningRef.current) {
      stopScanning()
    }
  }, [isActive])

  const startScanning = () => {
    scanningRef.current = true
    setIsScanning(true)
    scanBarcode()
  }

  const stopScanning = () => {
    scanningRef.current = false
    setIsScanning(false)
  }

  const scanBarcode = async () => {
    if (!webcamRef.current || !codeReaderRef.current || !scanningRef.current) return

    try {
      const imageSrc = webcamRef.current.getScreenshot()
      if (!imageSrc) return

      // Create an image element to decode
      const img = new Image()
      img.src = imageSrc
      
      img.onload = async () => {
        try {
          const result = await codeReaderRef.current!.decodeFromImage(img)
          if (result) {
            onScan(result.getText())
            stopScanning()
          }
        } catch (err) {
          // No barcode found, continue scanning
        }
        
        // Continue scanning if still active
        if (scanningRef.current) {
          setTimeout(scanBarcode, 100)
        }
      }
    } catch (err) {
      console.error('Scanning error:', err)
    }
  }

  const videoConstraints: MediaStreamConstraints['video'] = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'environment',
    ...(selectedDeviceId && { deviceId: selectedDeviceId })
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Camera selector */}
      {devices.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Camera:
          </label>
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${devices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Camera preview */}
      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMediaError={(err) => setError('Camera access denied: ' + (typeof err === 'string' ? err : err.message))}
          className="w-full rounded-lg"
          mirrored={false}
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-blue-500 rounded-lg">
            {isScanning && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-blue-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {isScanning ? 'Scanning for barcodes...' : 'Position barcode within the frame'}
      </p>
    </div>
  )
}