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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Voice Chat
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              disabled={status !== "connected"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-center">
            {status === "connected" ? (
              <Button
                variant="destructive"
                onClick={handleEndConversation}
                className="w-full"
              >
                <MicOff className="mr-2 h-4 w-4" />
                End Conversation
              </Button>
            ) : (
              <Button
                onClick={handleStartConversation}
                disabled={!hasPermission}
                className="w-full"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Conversation
              </Button>
            )}
          </div>

          <div className="text-center text-sm">
            {status === "connected" && (
              <p className="text-green-600">
                {isSpeaking ? "Agent is speaking..." : "Listening..."}
              </p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {!hasPermission && (
              <p className="text-yellow-600">
                Please allow microphone access to use voice chat
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceChat;
