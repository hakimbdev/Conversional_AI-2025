"use client";

import React, { useEffect, useState } from "react";

// ElevenLabs
import { useConversation } from "@11labs/react";

// UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

const VoiceChat = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const conversation = useConversation({
    apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setErrorMessage("");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
    },
    onMessage: (message) => {
      console.log("Received message:", message);
    },
    onError: (error: string | Error) => {
      const errorMessage = typeof error === "string" ? error : error.message;
      setErrorMessage(errorMessage);
      console.error("Error:", errorMessage);
    },
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    // Request microphone permission on component mount
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        setErrorMessage("Microphone access denied");
        console.error("Error accessing microphone:", error);
      }
    };

    requestMicPermission();
  }, []);

  const handleStartConversation = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
        throw new Error("ElevenLabs API key is not configured");
      }
      if (!process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID) {
        throw new Error("ElevenLabs Agent ID is not configured");
      }

      const conversationId = await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
      });
      console.log("Started conversation:", conversationId);
      setErrorMessage("");
    } catch (error: any) {
      const errorMsg = error.message || "Failed to start conversation";
      setErrorMessage(errorMsg);
      console.error("Error starting conversation:", error);
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      setErrorMessage("Failed to end conversation");
      console.error("Error ending conversation:", error);
    }
  };

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch (error) {
      setErrorMessage("Failed to change volume");
      console.error("Error changing volume:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-gray-900/50 border-gray-800">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Voice Chat
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              disabled={status !== "connected"}
              className="hover:bg-gray-800 border-gray-700"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-gray-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center">
            {status === "connected" ? (
              <Button
                variant="destructive"
                onClick={handleEndConversation}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 backdrop-blur-sm transition-all duration-300"
              >
                <MicOff className="mr-2 h-5 w-5" />
                End Conversation
              </Button>
            ) : (
              <Button
                onClick={handleStartConversation}
                disabled={!hasPermission}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 backdrop-blur-sm transition-all duration-300 disabled:opacity-50"
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Conversation
              </Button>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur" />
            <div className="relative backdrop-blur-sm bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              {/* Status messages */}
              <div className="text-center space-y-2">
                {status === "connected" && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-green-400 font-medium">
                      {isSpeaking ? "Agent is speaking..." : "Listening..."}
                    </p>
                  </div>
                )}
                {errorMessage && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <p className="text-red-400">{errorMessage}</p>
                  </div>
                )}
                {!hasPermission && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <p className="text-yellow-400">
                      Please allow microphone access to use voice chat
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceChat;
