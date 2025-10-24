import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: `Hello! I am your AI coding assistant. I can help you with the problem '${problem.title}'. What would you like to know or discuss about it?`}]},
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset,formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        
        const newUserMessage = { role: 'user', parts:[{text: data.message}] };
        setMessages(prev => [...prev, newUserMessage]);
        reset();

        try {
            setIsLoading(true);
            const response = await axiosClient.post("/ai/chat", {
                messages:[...messages, newUserMessage],
                title:problem.title,
                description:problem.description,
                testCases: problem.visibleTestCases,
                startCode:problem.startCode
            });
            setIsLoading(false);
           
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setIsLoading(false);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Error from AI Chatbot"}]
            }]);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                {msg.role === "user" ? <User size={40} /> : <Bot size={40} />}
                            </div>
                        </div>
                        <div className="chat-header">
                            {msg.role === "user" ? "You" : "AI Assistant"}
                        </div>
                        <div className="chat-bubble bg-base-200 text-base-content">
                            <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <Bot size={40} />
                            </div>
                        </div>
                        <div className="chat-header">
                            AI Assistant
                        </div>
                        <div className="chat-bubble">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center gap-2">
                    <input 
                        placeholder="Ask me anything" 
                        className="input input-bordered input-primary flex-1" 
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-square"
                        disabled={errors.message || isLoading}
                    >
                        {isLoading ? <span className="loading loading-spinner"></span> : <Send size={20} />}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;


