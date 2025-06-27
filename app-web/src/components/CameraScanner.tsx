import { useRef, useCallback, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/library'

interface CameraScannerProps {
  onScan: (result: string) => void
  isActive: boolean
}

const getFormatName = (format: BarcodeFormat): string => {
  switch(format) {
    case BarcodeFormat.AZTEC: return 'AZTEC'
    case BarcodeFormat.CODABAR: return 'CODABAR'
    case BarcodeFormat.CODE_39: return 'CODE_39'
    case BarcodeFormat.CODE_93: return 'CODE_93'
    case BarcodeFormat.CODE_128: return 'CODE_128'
    case BarcodeFormat.DATA_MATRIX: return 'DATA_MATRIX'
    case BarcodeFormat.EAN_8: return 'EAN_8'
    case BarcodeFormat.EAN_13: return 'EAN_13'
    case BarcodeFormat.ITF: return 'ITF'
    case BarcodeFormat.MAXICODE: return 'MAXICODE'
    case BarcodeFormat.PDF_417: return 'PDF_417'
    case BarcodeFormat.QR_CODE: return 'QR_CODE'
    case BarcodeFormat.RSS_14: return 'RSS_14'
    case BarcodeFormat.RSS_EXPANDED: return 'RSS_EXPANDED'
    case BarcodeFormat.UPC_A: return 'UPC_A'
    case BarcodeFormat.UPC_E: return 'UPC_E'
    case BarcodeFormat.UPC_EAN_EXTENSION: return 'UPC_EAN_EXTENSION'
    default: return `Unknown (${format})`
  }
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
    // Don't specify hints to let it detect all formats
    codeReaderRef.current = new BrowserMultiFormatReader()
    console.log('ZXing reader initialized for all barcode formats')
    
    // Log supported formats
    console.log('Barcode formats:', {
      EAN_13: BarcodeFormat.EAN_13,
      EAN_8: BarcodeFormat.EAN_8,
      CODE_128: BarcodeFormat.CODE_128,
      CODE_39: BarcodeFormat.CODE_39,
      UPC_A: BarcodeFormat.UPC_A,
      UPC_E: BarcodeFormat.UPC_E
    })
    
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

  const scanBarcode = useCallback(async () => {
    if (!webcamRef.current || !codeReaderRef.current || !scanningRef.current) {
      console.log('Scanning cancelled: missing refs or not scanning')
      return
    }

    try {
      const imageSrc = webcamRef.current.getScreenshot()
      if (!imageSrc) {
        console.log('No image source from webcam')
        return
      }

      console.log('Processing image for barcode detection...')

      // Create an image element to decode
      const img = new Image()
      img.src = imageSrc
      
      img.onload = async () => {
        try {
          console.log('Image loaded, attempting barcode decode...')
          const result = await codeReaderRef.current!.decodeFromImage(img)
          if (result) {
            const formatName = getFormatName(result.getBarcodeFormat())
            console.log('Barcode detected:', result.getText(), 'Format:', formatName, `(${result.getBarcodeFormat()})`)
            onScan(result.getText())
            // Stop scanning
            scanningRef.current = false
            setIsScanning(false)
          }
        } catch (err) {
          console.log('No barcode found in this frame:', err instanceof Error ? err.message : 'Unknown error')
        }
        
        // Continue scanning if still active
        if (scanningRef.current) {
          setTimeout(() => scanBarcode(), 250) // Slower scanning for better detection
        }
      }
      
      img.onerror = () => {
        console.error('Failed to load image for barcode scanning')
      }
    } catch (err) {
      console.error('Scanning error:', err)
    }
  }, [onScan])

  // Start/stop scanning based on isActive prop
  useEffect(() => {
    console.log('Scanner isActive changed:', isActive, 'scanningRef:', scanningRef.current)
    
    if (isActive && !scanningRef.current) {
      console.log('Starting automatic scan in 2 seconds...')
      // Add a delay to ensure camera is ready
      const timer = setTimeout(() => {
        console.log('Timer fired, checking if still active and camera ready...')
        if (isActive && !scanningRef.current && webcamRef.current && codeReaderRef.current) {
          console.log('Starting scanning from useEffect')
          scanningRef.current = true
          setIsScanning(true)
          scanBarcode()
        } else {
          console.log('Cannot start scanning:', {
            isActive,
            scanningRefCurrent: scanningRef.current,
            webcamReady: !!webcamRef.current,
            codeReaderReady: !!codeReaderRef.current
          })
        }
      }, 2000) // Increased delay to 2 seconds
      
      return () => {
        console.log('Clearing timer')
        clearTimeout(timer)
      }
    } else if (!isActive && scanningRef.current) {
      console.log('Stopping scanner because not active')
      scanningRef.current = false
      setIsScanning(false)
    }
  }, [isActive, scanBarcode])


  const startScanning = () => {
    console.log('Manual start scanning...')
    scanningRef.current = true
    setIsScanning(true)
    scanBarcode()
  }

  const videoConstraints: MediaStreamConstraints['video'] = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: 'environment',
    ...(selectedDeviceId && { deviceId: selectedDeviceId })
  }

  if (error) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => {
            console.log('Retrying camera access...')
            setError('')
            // Force component remount by changing key would be ideal, but let's try clearing error first
            window.location.reload()
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry Camera Access
        </button>
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
          onUserMedia={() => {
            console.log('Camera access granted')
            setError('') // Clear any previous errors
          }}
          onUserMediaError={(err) => {
            const errorMsg = 'Camera access denied: ' + (typeof err === 'string' ? err : err.message)
            console.error('Camera error:', err)
            setError(errorMsg)
            
            // Suggest solutions based on error type
            if (errorMsg.includes('Failed to allocate videosource')) {
              setError('Camera is in use by another application. Please close other apps using the camera and refresh the page.')
            } else if (errorMsg.includes('Permission denied')) {
              setError('Camera permission denied. Please allow camera access and refresh the page.')
            } else {
              setError(errorMsg)
            }
          }}
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
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
        <p>Tips for EAN13 barcodes:</p>
        <ul className="list-disc list-inside">
          <li>Hold the barcode steady and flat</li>
          <li>Ensure good lighting (avoid shadows)</li>
          <li>Fill most of the blue frame with the barcode</li>
          <li>Try different distances (10-20cm)</li>
        </ul>
      </div>
      
      {/* Temporary debug button */}
      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={() => {
            console.log('Manual scan triggered - isActive:', isActive, 'isScanning:', isScanning)
            console.log('webcamRef.current:', !!webcamRef.current)
            console.log('codeReaderRef.current:', !!codeReaderRef.current)
            console.log('scanningRef.current:', scanningRef.current)
            scanBarcode()
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Debug Manual Scan
        </button>
        <button
          type="button"
          onClick={() => {
            console.log('Force start scanning')
            startScanning()
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Force Start
        </button>
      </div>
    </div>
  )
}