import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, History, X, Loader2, Check, Leaf, AlertTriangle, CheckCircle } from "lucide-react"
import { diseaseDetectionService, type DetectionResponse, type HistoryItem } from "../services/api"

const DiseaseDetection = () => {
  const [activeTab, setActiveTab] = useState("upload")
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<DetectionResponse | null>(null)
  const [historyData, setHistoryData] = useState<HistoryItem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Manual history loading function
  const loadHistory = async () => {
    setIsLoadingHistory(true)
    try {
      const response = await diseaseDetectionService.getDetectionHistory(1, 10)
      if (response.success) {
        setHistoryData(response.history)
      } else {
        setError(response.error || "Error loading history")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Error loading history")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.")
      return
    }

    // Check file size (max 16MB to match backend)
    if (file.size > 16 * 1024 * 1024) {
      setError("File is too large. Maximum size: 16MB")
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const uploadFile = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadResult(null)
    setError(null)

    try {
      const result = await diseaseDetectionService.detectDisease(selectedFile)

      if (result.success) {
        setUploadResult(result)
        setActiveTab("predictions") // Switch to predictions tab
      } else {
        setError(result.error || "Error during analysis")
      }
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Error analyzing the image")
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setUploadResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateMaroc = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-MA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "faible":
      case "low":
        return "bg-green-100 text-green-800"
      case "moyenne":
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "élevée":
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case "faible":
      case "low":
        return "Low"
      case "moyenne":
      case "medium":
        return "Medium"
      case "élevée":
      case "high":
        return "High"
      default:
        return urgency
    }
  }

  const getUrgencyIcon = (diseaseName: string, urgency: string) => {
    if (diseaseName.toLowerCase().includes("healthy")) {
      return "bg-green-100 text-green-800"
    }
    return getUrgencyColor(urgency)
  }

  const renderUpload = () => (
      <div>
        <h2 className="text-lg font-semibold mb-2">Upload Plant Image</h2>
        <p className="text-sm text-gray-500 mb-6">
          Upload an image of your plant to detect diseases and get treatment recommendations.
        </p>

        {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
        )}

        {!selectedFile ? (
            <div
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <Upload className={`w-12 h-12 mb-4 ${dragActive ? "text-green-500" : "text-gray-400"}`} />
                <p className="text-xl font-medium text-gray-700 mb-2">Drag & drop plant image</p>
                <p className="text-sm text-gray-500 mb-4">
                  Upload an image of your plant to detect diseases and get treatment recommendations. Supported formats:
                  PNG, JPG, JPEG, GIF, BMP, TIFF.
                </p>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  Select Image
                </button>
              </div>
            </div>
        ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full max-w-md mx-auto rounded-lg shadow-md"
                />
                <button
                    onClick={clearFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Selected file: {selectedFile.name}</p>

                <div className="space-x-4">
                  <button
                      onClick={uploadFile}
                      disabled={isUploading}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 inline-flex"
                  >
                    {isUploading && <Loader2 className="animate-spin" size={16} />}
                    {isUploading ? "Analyzing..." : "Analyze Image"}
                  </button>

                  <button
                      onClick={clearFile}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
      </div>
  )

  const renderPredictions = () => (
      <div className="space-y-6">
        {uploadResult && uploadResult.success ? (
            <>
              {/* Diagnostic Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Diagnosis</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {Math.round(uploadResult.detection.confidence_score * 100)}% confidence
              </span>
                </div>

                <div className="flex items-start space-x-4">
                  {previewUrl && (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Analyzed plant"
                            className="w-full h-full object-cover"
                        />
                      </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{uploadResult.detection.disease_name}</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Plant:</span> {uploadResult.detection.plant_type}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Date:</span> {formatDate(uploadResult.detection.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment Recommendations Section */}
              {uploadResult.recommendation && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Treatment Recommendations</h2>
                      <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(uploadResult.recommendation.urgency_level)}`}
                      >
                  {getUrgencyLabel(uploadResult.recommendation.urgency_level)}
                </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-100">
                          <h4 className="font-medium text-gray-900 mb-2">Treatment type</h4>
                          <p className="text-gray-700">{uploadResult.recommendation.treatment_type}</p>
                        </div>

                        {uploadResult.recommendation.description && (
                            <div className="bg-white p-4 rounded-lg border border-gray-100">
                              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                              <p className="text-gray-700">{uploadResult.recommendation.description}</p>
                            </div>
                        )}

                        {uploadResult.recommendation.application_method && (
                            <div className="bg-white p-4 rounded-lg border border-gray-100">
                              <h4 className="font-medium text-gray-900 mb-2">Application method</h4>
                              <p className="text-gray-700">{uploadResult.recommendation.application_method}</p>
                            </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {uploadResult.recommendation.recovery_time && (
                            <div className="bg-white p-4 rounded-lg border border-gray-100">
                              <h4 className="font-medium text-gray-900 mb-2">Recovery time</h4>
                              <p className="text-gray-700">{uploadResult.recommendation.recovery_time}</p>
                            </div>
                        )}

                        {uploadResult.recommendation.products.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-100">
                              <h4 className="font-medium text-gray-900 mb-3">Recommended products</h4>
                              <div className="space-y-2">
                                {uploadResult.recommendation.products.map((product, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                      <span className="text-gray-700">{product}</span>
                                    </div>
                                ))}
                              </div>
                            </div>
                        )}

                        {uploadResult.recommendation.prevention_tips.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-100">
                              <h4 className="font-medium text-gray-900 mb-3">Prevention tips</h4>
                              <div className="space-y-2">
                                {uploadResult.recommendation.prevention_tips.map((tip, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                      <Leaf className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700">{tip}</span>
                                    </div>
                                ))}
                              </div>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              )}
            </>
        ) : (
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <div className="text-center text-gray-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent analysis results. Upload an image to get started.</p>
              </div>
            </div>
        )}
      </div>
  )

  const renderHistory = () => (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Detection History</h2>
            <button
                onClick={loadHistory}
                disabled={isLoadingHistory}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoadingHistory && <Loader2 className="animate-spin" size={16} />}
              {isLoadingHistory ? "Loading..." : "Load History"}
            </button>
          </div>

          {isLoadingHistory ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Loading history...</p>
              </div>
          ) : historyData.length > 0 ? (
              <div className="space-y-4">
                {historyData.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                      <div className="flex items-center space-x-4">
                        {item.disease_name.toLowerCase().includes("healthy") ||
                        item.disease_name.toLowerCase().includes("sain") ? (
                            <CheckCircle className="text-green-500" size={20} />
                        ) : item.recommendation?.urgency_level?.toLowerCase() === "high" ||
                        item.recommendation?.urgency_level?.toLowerCase() === "élevée" ? (
                            <AlertTriangle className="text-red-500" size={20} />
                        ) : (
                            <CheckCircle className="text-green-500" size={20} />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{item.plant_type}</h3>
                          <p className="text-sm text-gray-500">{item.disease_name}</p>
                          <p className="text-xs text-gray-400">Confidence: {Math.round(item.confidence_score * 100)}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatDateMaroc(item.created_at)}</p>
                        {item.recommendation && (
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${getUrgencyIcon(item.disease_name, item.recommendation?.urgency_level)}`}
                            >
                       {getUrgencyLabel(item.recommendation.urgency_level)}</span>
                        )}
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <div className="text-center text-gray-500 py-8">
                <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No detection history available. Click "Load History" to fetch your analysis history.</p>
              </div>
          )}
        </div>
      </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return renderUpload()
      case "predictions":
        return renderPredictions()
      case "history":
        return renderHistory()
      default:
        return renderUpload()
    }
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Plant Disease Detection</h1>
          <p className="text-gray-600">Upload plant images to detect diseases and get treatment recommendations.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 px-4" aria-label="Tabs">
              {[
                { name: "Image Upload", icon: <Upload size={18} />, id: "upload" },
                { name: "AI Predictions", icon: <FileText size={18} />, id: "predictions" },
                { name: "Detection History", icon: <History size={18} />, id: "history" },
              ].map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-4 text-sm font-medium border-b-2 flex items-center space-x-2 ${
                          activeTab === tab.id
                              ? "border-green-500 text-green-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
              ))}
            </nav>
          </div>

          <div className="p-6">{renderContent()}</div>
        </div>
      </div>
  )
}

export default DiseaseDetection