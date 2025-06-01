import VoiceComponent from "@/components/VoiceComponent";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-[100px] animate-pulse delay-700" />
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center max-w-2xl relative">
        <div className="w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-block">
              <small className="text-sm text-gray-400 bg-gray-800/50 px-4 py-1.5 rounded-full backdrop-blur-sm border border-gray-800/50">
                Built by iOrbit Tech Solutions Lab
              </small>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 px-4">
              Realtime iOrbit Agent
            </h1>
            <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base px-4">
              Experience natural conversations with our AI-powered voice assistant
            </p>
          </div>

          {/* Voice Component */}
          <div className="px-4">
            <VoiceComponent />
          </div>

          {/* Footer */}
          <div className="text-center">
            <small className="text-xs text-gray-400 bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm inline-block">
              This app requires microphone access to work
            </small>
          </div>
        </div>
      </div>
    </main>
  );
}
