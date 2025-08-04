"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import { 
  Menu, 
  X, 
  Plus, 
  Send, 
  ImageIcon, 
  Copy, 
  Check, 
  Trash,
  Building,
  Message,
  User,
  UserCircle,
  Cog
} from "@/lib/icons";

// Lazy load heavy markdown components
const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div className="animate-pulse">Cargando...</div>,
});

const remarkGfm = dynamic(() => import('remark-gfm').then(mod => mod.default), {
  ssr: false,
});

const rehypeHighlight = dynamic(() => import('rehype-highlight').then(mod => mod.default), {
  ssr: false,
});

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  images?: string[];
}

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  _count?: { messages: number };
}

export default function ChatPage() {
  const { data: session } = useSession();
  
  // Estado principal
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar conversaciones al montar
  useEffect(() => {
    loadConversations();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar conversaciones desde la API
  const loadConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Error cargando conversaciones:", error);
    }
  };

  // Crear nueva conversación
  const createNewConversation = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Nueva consulta médica" })
      });
      const data = await response.json();
      
      if (response.ok) {
        const newConversation = { ...data.conversation, messages: [] };
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(data.conversation.id);
        setMessages([]);
        setInput("");
        setSelectedImages([]);
        return data.conversation.id; // Retornar el ID de la conversación creada
      }
    } catch (error) {
      console.error("Error creando conversación:", error);
    }
    return null;
  };

  // Cargar conversación específica
  const loadConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      const data = await response.json();
      
      if (response.ok) {
        setCurrentConversationId(conversationId);
        setMessages(data.conversation.messages.map((msg: { id: string; content: string; role: string; timestamp: string; imageUrls?: string[] }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
        setInput("");
        setSelectedImages([]);
      }
    } catch (error) {
      console.error("Error cargando conversación:", error);
    }
  };

  // Eliminar conversación
  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== conversationId));
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error eliminando conversación:", error);
    }
  };

  // Guardar mensaje del usuario en la DB
  const saveUserMessage = async (conversationId: string, message: Message) => {
    try {
      await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: message.role,
          content: message.content,
          images: message.images || []
        })
      });
    } catch (error) {
      console.error("Error guardando mensaje:", error);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < Math.min(files.length, 3 - selectedImages.length); i++) {
      const base64 = await convertFileToBase64(files[i]);
      newImages.push(base64);
    }
    
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const copyToClipboard = async (text: string, messageIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageIndex(messageIndex);
      setTimeout(() => {
        setCopiedMessageIndex(null);
      }, 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const sendQuickMessage = async (message: string) => {
    if (isLoading) return;
    
    // Crear nueva conversación si no hay una activa
    if (!currentConversationId) {
      await createNewConversation();
      // Esperamos un poco para que se complete la creación
      setTimeout(() => {
        sendMessageWithContent(message);
      }, 100);
      return;
    }
    
    sendMessageWithContent(message);
  };

  const sendMessageWithContent = async (messageContent: string) => {
    if (!currentConversationId) return;
    await sendMessageWithConversationId(messageContent, currentConversationId);
  };

  const sendMessageWithConversationId = async (messageContent: string, conversationId: string) => {
    const userMessage: Message = { 
      role: "user", 
      content: messageContent,
      timestamp: new Date(),
      images: selectedImages
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setIsTyping(true);

    // Guardar mensaje del usuario
    await saveUserMessage(conversationId, userMessage);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ 
            role: m.role, 
            content: m.content,
            ...(m.images && m.images.length > 0 && {
              content: [
                { type: "text", text: m.content },
                ...m.images.map(img => ({
                  type: "image_url",
                  image_url: { url: img }
                }))
              ]
            })
          })),
          conversationId: conversationId
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages([...newMessages, { 
          role: "assistant", 
          content: data.message,
          timestamp: new Date()
        }]);
        // Actualizar título si es el primer mensaje
        updateConversationTitle(conversationId, messageContent);
      } else {
        setMessages([...newMessages, { 
          role: "assistant", 
          content: "Disculpa, estoy experimentando dificultades técnicas. Por favor intenta de nuevo.",
          timestamp: new Date()
        }]);
      }
    } catch {
      setMessages([...newMessages, { 
        role: "assistant", 
        content: "Disculpa, estoy experimentando dificultades técnicas. Por favor intenta de nuevo.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setSelectedImages([]);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && selectedImages.length === 0) || isLoading) return;

    const messageContent = input || "Analiza estas imágenes médicas";
    let conversationId = currentConversationId;

    // Crear nueva conversación si no hay una activa
    if (!conversationId) {
      conversationId = await createNewConversation();
      if (!conversationId) {
        console.error("No se pudo crear la conversación");
        return;
      }
    }

    // Limpiar input inmediatamente para mejor UX
    setInput("");

    // Enviar el mensaje con el ID de conversación correcto
    await sendMessageWithConversationId(messageContent, conversationId);
  };

  // Actualizar título de conversación
  const updateConversationTitle = async (conversationId: string, firstMessage: string) => {
    const shortTitle = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: shortTitle })
      });
      // Recargar conversaciones para reflejar el cambio
      loadConversations();
    } catch (error) {
      console.error("Error actualizando título:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        sidebarOpen 
          ? 'w-80 translate-x-0' 
          : 'w-16 -translate-x-full lg:translate-x-0'
      } fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
        {/* Header del sidebar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="font-semibold text-gray-900 dark:text-white">Conversaciones</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
          {sidebarOpen && (
            <Button
              onClick={createNewConversation}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              + Nueva Consulta
            </Button>
          )}
        </div>

        {/* Lista de conversaciones */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentConversationId === conversation.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600'
                }`}
                onClick={() => loadConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 text-gray-400 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                  >
                    <Trash className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col">
        {/* Header del chat */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Building className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Biotronik IA
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">En línea</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {messages.length > 0 && (
                <Button
                  onClick={() => {
                    setMessages([]);
                    setCurrentConversationId(null);
                  }}
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 mr-2 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva conversación
                </Button>
              )}
              {session && (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Cog className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
              )}
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Estado vacío */}
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl font-bold">B</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Biotronik IA
                </h3>
                <div className="space-y-6">
                  <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">
                    Selecciona una consulta para comenzar:
                  </p>
                  
                  {/* Botones disparadores con animaciones hermosas */}
                  <div className="grid grid-cols-1 gap-4">
                    <Button
                      onClick={() => sendQuickMessage("¿Cuáles son las guías actuales para el manejo de la hipertensión arterial?")}
                      variant="outline"
                      disabled={isLoading}
                      className="quick-button-enter group relative overflow-hidden text-left justify-start h-auto py-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 ease-out hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-shadow duration-300">
                          <span className="text-white text-lg">🫀</span>
                        </div>
                        <div>
                          <p className="font-semibold">Guías de Hipertensión</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Manejo actual de HTA</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                    
                    <Button
                      onClick={() => sendQuickMessage("Explícame la dosificación y contraindicaciones de los betabloqueadores en pacientes con insuficiencia cardíaca")}
                      variant="outline"
                      disabled={isLoading}
                      className="quick-button-enter group relative overflow-hidden text-left justify-start h-auto py-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 ease-out hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-shadow duration-300">
                          <span className="text-white text-lg">💊</span>
                        </div>
                        <div>
                          <p className="font-semibold">Betabloqueadores en IC</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Dosificación y contraindicaciones</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                    
                    <Button
                      onClick={() => sendQuickMessage("¿Qué hallazgos debo buscar en un ECG para detectar signos de isquemia miocárdica?")}
                      variant="outline"
                      disabled={isLoading}
                      className="quick-button-enter group relative overflow-hidden text-left justify-start h-auto py-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 hover:shadow-xl hover:shadow-green-500/25 hover:scale-[1.02] transition-all duration-300 ease-out hover:border-green-300 dark:hover:border-green-600"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-green-500/40 transition-shadow duration-300">
                          <span className="text-white text-lg">📈</span>
                        </div>
                        <div>
                          <p className="font-semibold">Signos de Isquemia en ECG</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Hallazgos electrocardiográficos</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                    
                    <Button
                      onClick={() => sendQuickMessage("Protocolo de evaluación para dolor torácico en urgencias según las guías más recientes")}
                      variant="outline"
                      disabled={isLoading}
                      className="quick-button-enter group relative overflow-hidden text-left justify-start h-auto py-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 hover:shadow-xl hover:shadow-purple-500/25 hover:scale-[1.02] transition-all duration-300 ease-out hover:border-purple-300 dark:hover:border-purple-600"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/40 transition-shadow duration-300">
                          <span className="text-white text-lg">🚨</span>
                        </div>
                        <div>
                          <p className="font-semibold">Protocolo Dolor Torácico</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Evaluación en urgencias</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </div>
                  
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                    Basado en evidencia • Guías AHA/ESC/ACC
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Mensajes */}
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} message-appear`}
              >
                <div className={`max-w-3xl flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} items-end space-x-3`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === "user" ? "ml-3" : "mr-3"}`}>
                    {message.role === "user" ? (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <UserCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Mensaje Container */}
                  <div className="flex flex-col space-y-1 max-w-[85%]">
                    {/* Mensaje */}
                    <div className={`group relative ${message.role === "user" ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"} rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200`}>
                    {/* Imágenes si las hay */}
                    {message.images && message.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {message.images.map((image, imgIndex) => (
                          <Image
                            key={imgIndex}
                            src={image}
                            alt={`Imagen médica ${imgIndex + 1}`}
                            width={300}
                            height={200}
                            className="rounded-lg max-w-full h-auto border border-gray-200 dark:border-gray-600"
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Contenido del mensaje */}
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-white">{children}</h3>,
                          p: ({ children }) => <p className="mb-3 leading-relaxed text-gray-800 dark:text-gray-200">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-3 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="text-gray-800 dark:text-gray-200">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                          code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">{children}</code>,
                          pre: ({ children }) => <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto mb-3">{children}</pre>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="leading-relaxed">{message.content}</p>
                    )}

                    {/* Botón de copiar para mensajes del asistente */}
                    {message.role === "assistant" && (
                      <Button
                        onClick={() => copyToClipboard(message.content, index)}
                        variant="outline"
                        size="sm"
                        className={`absolute -bottom-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 h-8 w-8 border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl hover:scale-105 rounded-full ${
                          copiedMessageIndex === index 
                            ? "bg-green-500 border-green-500 text-white opacity-100" 
                            : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {copiedMessageIndex === index ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`text-xs text-gray-500 dark:text-gray-400 px-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                      {new Date(message.timestamp).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start message-appear">
                <div className="max-w-3xl flex items-end space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg mr-3">
                                            <UserCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Biotronik está escribiendo...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
          {/* Preview de imágenes seleccionadas */}
          {selectedImages.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-700 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-end space-x-3">
            {/* Botón de imagen */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || selectedImages.length >= 3}
              className="shrink-0 p-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="ml-1 text-sm">Imagen</span>
            </Button>
            
            {/* Input principal */}
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedImages.length > 0 ? "Describe las imágenes que quieres analizar..." : "Escribe tu consulta médica..."}
                disabled={isLoading}
                className="resize-none border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 rounded-full px-4 py-3 text-sm"
              />
            </div>
            
            {/* Botón enviar */}
            <Button
              onClick={sendMessage}
              disabled={(!input.trim() && selectedImages.length === 0) || isLoading}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 button-press disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Input file oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>
      </div>
    </div>
  );
}