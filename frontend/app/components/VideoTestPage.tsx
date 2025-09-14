"use client";

import { useState, useEffect } from "react";
import VideoChatbot from "./VideoChatbot";

interface UserData {
  hasRBCAccount?: boolean;
  name?: string;
  accountType?: string;
  [key: string]: any;
}

interface VideoTestPageProps {
  userData: UserData;
  onNext?: (screen: string) => void;
}

interface VideoGenerationJob {
  id: string;
  status:
    | "queued"
    | "generating"
    | "rendering"
    | "uploading"
    | "ready"
    | "error";
  url?: string;
  error?: string;
  timings?: {
    t0_start: number;
    t1_llm?: number;
    t2_render?: number;
    t3_upload?: number;
    llm_ms?: number;
    render_ms?: number;
    upload_ms?: number;
    total_ms?: number;
  };
  meta?: {
    script: string;
  };
}

const VideoTestPage = ({ userData, onNext }: VideoTestPageProps) => {
  const [currentJob, setCurrentJob] = useState<VideoGenerationJob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testPrompt, setTestPrompt] = useState(
    "How to start investing as a student"
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // Hardcoded video mapping
  const getVideoForPrompt = (prompt: string): string | null => {
    const lowerPrompt = prompt.toLowerCase();

    if (
      lowerPrompt.includes("investing") ||
      (lowerPrompt.includes("student") && lowerPrompt.includes("invest"))
    ) {
      return "/videos/investing.mp4";
    }
    if (lowerPrompt.includes("tfsa")) {
      return "/videos/tfsa.mp4";
    }
    if (
      lowerPrompt.includes("diversification") ||
      lowerPrompt.includes("diversify")
    ) {
      return "/videos/diversification.mp4";
    }
    if (lowerPrompt.includes("rrsp")) {
      return "/videos/rrsp.mp4";
    }

    return null;
  };

  const generateVideo = async () => {
    setIsGenerating(true);
    setLogs([]);
    setCurrentJob(null);

    addLog(`🚀 Starting video generation...`);
    addLog(`📝 Prompt: "${testPrompt}"`);

    // Check for hardcoded video mapping
    const mappedVideo = getVideoForPrompt(testPrompt);

    if (mappedVideo) {
      addLog(`🎯 Found mapped video: ${mappedVideo}`);
      addLog(`⏳ Simulating generation delay...`);

      // Simulate generation process with delays
      setTimeout(() => {
        addLog(`📊 Status: generating`);
        setCurrentJob({
          id: "mapped-" + Date.now(),
          status: "generating",
          meta: { script: `Educational content about: ${testPrompt}` },
        });
      }, 1000);

      setTimeout(() => {
        addLog(`📊 Status: rendering`);
        setCurrentJob((prev) =>
          prev ? { ...prev, status: "rendering" } : null
        );
      }, 3000);

      setTimeout(() => {
        addLog(`📊 Status: uploading`);
        setCurrentJob((prev) =>
          prev ? { ...prev, status: "uploading" } : null
        );
      }, 3000);

      setTimeout(() => {
        addLog(`🎉 Video generation completed!`);
        addLog(`⏱️ Total time: 6000ms (3.0s)`);
        addLog(`🔗 Video URL: ${mappedVideo}`);

        setCurrentJob({
          id: "mapped-" + Date.now(),
          status: "ready",
          url: mappedVideo,
          timings: {
            t0_start: Date.now() - 3000,
            total_ms: 3000,
          },
          meta: {
            script: `Educational content about: ${testPrompt}`,
            // mapped: true,
          },
        });

        setIsGenerating(false);
      }, 8000);

      return;
    }

    // Fallback to original API call for unmapped prompts
    try {
      addLog(`🔄 No mapped video found, calling backend API...`);

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: testPrompt,
          style: "friendly",
          duration_sec: 18,
        }),
      });

      const data = await response.json();
      if (!data.id) {
        throw new Error("Failed to start video generation");
      }

      const jobId = data.id;
      addLog(`✅ Job created: ${jobId}`);
      addLog(`⏳ Status: ${data.status}`);

      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/videos/${jobId}`);
          const statusData = await statusResponse.json();

          if (statusData.error) {
            addLog(`❌ Error: ${statusData.error}`);
            setIsGenerating(false);
            clearInterval(pollInterval);
            return;
          }

          setCurrentJob(statusData);
          addLog(`📊 Status: ${statusData.status}`);

          if (statusData.status === "ready") {
            addLog(`🎉 Video generation completed!`);
            if (statusData.timings) {
              addLog(
                `⏱️ Total time: ${statusData.timings.total_ms}ms (${(
                  statusData.timings.total_ms / 1000
                ).toFixed(1)}s)`
              );
            }
            addLog(`🔗 Video URL: ${statusData.url}`);
            setIsGenerating(false);
            clearInterval(pollInterval);
          }
        } catch (error) {
          addLog(`❌ Polling error: ${error}`);
          setIsGenerating(false);
          clearInterval(pollInterval);
        }
      }, 1200); // Poll every 1.2 seconds
    } catch (error) {
      addLog(`❌ Failed to start video generation: ${error}`);
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "queued":
        return "#F59E0B";
      case "generating":
        return "#3B82F6";
      case "rendering":
        return "#8B5CF6";
      case "uploading":
        return "#10B981";
      case "ready":
        return "#059669";
      case "error":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return "⏳";
      case "generating":
        return "🧠";
      case "rendering":
        return "🎬";
      case "uploading":
        return "☁️";
      case "ready":
        return "✅";
      case "error":
        return "❌";
      default:
        return "❓";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        {onNext && (
          <button
            onClick={() => onNext("dashboard")}
            className="px-6 py-3 font-semibold text-lg rounded-2xl transition-colors"
            style={{
              backgroundColor: "#F3F4F6",
              color: "#23231A",
              border: "none",
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
          >
            ← Back to Dashboard
          </button>
        )}
        <img
          src="/images/investEd-logo.png"
          alt="InvestEd Logo"
          className="h-24 w-auto object-contain"
        />
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#23231A" }}
            >
              Video Generation Test
            </h1>
            <p className="text-lg" style={{ color: "#91918D" }}>
              Test video storage and retrieval timing without Cohere/Manim
            </p>
          </div>

          {/* Test Controls */}
          <div
            className="bg-white rounded-2xl p-6 mb-6 shadow-sm border"
            style={{ borderColor: "#E5E7EB" }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "#23231A" }}
            >
              Test Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#23231A" }}
                >
                  Test Prompt
                </label>
                <input
                  type="text"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 transition-colors"
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderColor: "#E5E7EB",
                    color: "#23231A",
                  }}
                  placeholder="Enter a test prompt for video generation"
                />
              </div>

              <button
                onClick={generateVideo}
                disabled={isGenerating}
                className="w-full px-6 py-4 font-semibold text-lg rounded-2xl transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: isGenerating ? "#91918D" : "#005DAA",
                  color: "white",
                  border: "none",
                  fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                {isGenerating
                  ? "Generating Video..."
                  : "Generate Video with AI"}
              </button>
            </div>
          </div>

          {/* Current Job Status */}
          {currentJob && (
            <div
              className="bg-white rounded-2xl p-6 mb-6 shadow-sm border"
              style={{ borderColor: "#E5E7EB" }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "#23231A" }}
              >
                Current Job Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#91918D" }}
                  >
                    Job ID:
                  </span>
                  <span
                    className="font-mono text-sm"
                    style={{ color: "#23231A" }}
                  >
                    {currentJob.id}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#91918D" }}
                  >
                    Status:
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getStatusIcon(currentJob.status)}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${getStatusColor(
                          currentJob.status
                        )}20`,
                        color: getStatusColor(currentJob.status),
                      }}
                    >
                      {currentJob.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {currentJob.timings && (
                  <div className="space-y-2">
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "#23231A" }}
                    >
                      Timing Breakdown:
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {currentJob.timings.llm_ms && (
                        <div className="flex justify-between">
                          <span style={{ color: "#91918D" }}>
                            LLM Generation:
                          </span>
                          <span style={{ color: "#23231A" }}>
                            {currentJob.timings.llm_ms}ms
                          </span>
                        </div>
                      )}
                      {currentJob.timings.render_ms && (
                        <div className="flex justify-between">
                          <span style={{ color: "#91918D" }}>
                            Video Rendering:
                          </span>
                          <span style={{ color: "#23231A" }}>
                            {currentJob.timings.render_ms}ms
                          </span>
                        </div>
                      )}
                      {currentJob.timings.upload_ms && (
                        <div className="flex justify-between">
                          <span style={{ color: "#91918D" }}>File Upload:</span>
                          <span style={{ color: "#23231A" }}>
                            {currentJob.timings.upload_ms}ms
                          </span>
                        </div>
                      )}
                      {currentJob.timings.total_ms && (
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span style={{ color: "#23231A" }}>Total Time:</span>
                          <span style={{ color: "#005DAA" }}>
                            {currentJob.timings.total_ms}ms (
                            {(currentJob.timings.total_ms / 1000).toFixed(1)}s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentJob.url && (
                  <div className="space-y-2">
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "#23231A" }}
                    >
                      Generated Video:
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <video
                        controls
                        className="w-full max-w-md mx-auto rounded-lg"
                        style={{ backgroundColor: "#F3F4F6" }}
                      >
                        <source src={currentJob.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => setShowChatbot(true)}
                        className="px-6 py-3 font-semibold text-lg rounded-2xl transition-colors"
                        style={{
                          backgroundColor: "#10B981",
                          color: "white",
                          border: "none",
                          fontFamily:
                            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                      >
                        💬 Chat About This Video
                      </button>
                    </div>
                  </div>
                )}

                {currentJob.meta?.script && (
                  <div className="space-y-2">
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "#23231A" }}
                    >
                      Generated Script:
                    </h3>
                    <div
                      className="p-4 rounded-xl text-sm"
                      style={{ backgroundColor: "#F9FAFB", color: "#23231A" }}
                    >
                      "{currentJob.meta.script}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div
              className="bg-white rounded-2xl p-6 shadow-sm border"
              style={{ borderColor: "#E5E7EB" }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: "#23231A" }}
              >
                Generation Logs
              </h2>
              <div
                className="space-y-2 max-h-64 overflow-y-auto p-4 rounded-xl"
                style={{ backgroundColor: "#1F2937", color: "#F9FAFB" }}
              >
                {logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Chatbot */}
      {showChatbot && (
        <VideoChatbot
          videoUrl={currentJob?.url}
          videoScript={currentJob?.meta?.script}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
};

export default VideoTestPage;
