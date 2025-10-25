// 'use client';

// import { FileText, AlertCircle, CheckCircle, MapPin } from 'lucide-react';

// /**
//  * ChatMessage Component
//  * Displays individual chat messages with support for user/AI messages,
//  * reports, property data, and error states
//  */
// export default function ChatMessage({ message, onViewReport, selectedProperty }) {
//   const {
//     id,
//     text,
//     isUser,
//     timestamp,
//     isError,
//     hasReport,
//     reportData,
//     propertyData
//   } = message;

//   // Format timestamp
//   const formatTime = (date) => {
//     if (!date) return '';
//     const messageDate = new Date(date);
//     return messageDate.toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   // Get message background color
//   const getMessageBgColor = () => {
//     if (isUser) return 'bg-[#2D5F3F] text-white';
//     if (isError) return 'bg-red-50 text-red-900 border border-red-200';
//     return 'bg-gray-100 text-gray-900';
//   };

//   // Get message alignment
//   const getAlignment = () => isUser ? 'justify-end' : 'justify-start';

//   return (
//     <div className={`flex ${getAlignment()} animate-fadeIn`}>
//       <div className={`max-w-2xl px-4 py-3 rounded-lg shadow-sm ${getMessageBgColor()}`}>
        
//         {/* Message Text */}
//         <div className="text-sm whitespace-pre-line leading-relaxed">
//           {text}
//         </div>

//         {/* Property Info Badge (if included) */}
//         {propertyData && !isUser && (
//           <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-md border border-white border-opacity-30">
//             <div className="flex items-start gap-2">
//               <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
//               <div className="text-xs">
//                 <p className="font-semibold">{propertyData.name}</p>
//                 <p className="opacity-80 mt-0.5">{propertyData.address}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Report Summary (if generated) */}
//         {reportData && hasReport && !isUser && (
//           <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-md border border-white border-opacity-30">
//             <div className="flex items-center gap-2 mb-2">
//               <CheckCircle className="w-4 h-4" />
//               <span className="text-xs font-semibold">Report Generated</span>
//             </div>
            
//             <div className="grid grid-cols-2 gap-2 text-xs">
//               <div>
//                 <p className="opacity-70">Overall Score</p>
//                 <p className="font-bold text-base">{reportData.overall_score}%</p>
//               </div>
//               <div>
//                 <p className="opacity-70">Risk Level</p>
//                 <p className="font-bold text-base">
//                   {reportData.overall_score < 30 ? 'Low' : 
//                    reportData.overall_score < 60 ? 'Medium' : 'High'}
//                 </p>
//               </div>
//             </div>

//             {reportData.flood_score && (
//               <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
//                 <div className="bg-[#5DABBC] bg-opacity-30 p-2 rounded">
//                   <p className="opacity-70">Flood</p>
//                   <p className="font-bold">{reportData.flood_score}</p>
//                 </div>
//                 <div className="bg-[#FFB84D] bg-opacity-30 p-2 rounded">
//                   <p className="opacity-70">Heat</p>
//                   <p className="font-bold">{reportData.heat_score}</p>
//                 </div>
//                 <div className="bg-[#7BC96F] bg-opacity-30 p-2 rounded">
//                   <p className="opacity-70">Drainage</p>
//                   <p className="font-bold">{reportData.drainage_score}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Error Icon */}
//         {isError && (
//           <div className="flex items-center gap-2 mt-2 text-xs">
//             <AlertCircle className="w-4 h-4" />
//             <span className="font-medium">Error processing request</span>
//           </div>
//         )}

//         {/* Timestamp */}
//         <div className="flex items-center justify-between mt-3 pt-2 border-t border-current border-opacity-20">
//           <p className="text-xs opacity-70">
//             {formatTime(timestamp)}
//           </p>

//           {/* View Report Link */}
//           {hasReport && selectedProperty && (
//             <button
//               onClick={() => onViewReport?.(selectedProperty.id)}
//               className="text-xs font-medium underline hover:no-underline flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
//             >
//               <FileText className="w-3 h-3" />
//               View Full Report
//             </button>
//           )}
//         </div>

//         {/* User Indicator */}
//         {!isUser && (
//           <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
//             <div className="w-2 h-2 bg-current rounded-full"></div>
//             <span>ClimaScan AI</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /**
//  * LoadingMessage Component
//  * Shows typing indicator while AI is processing
//  */
// export function LoadingMessage() {
//   return (
//     <div className="flex justify-start">
//       <div className="bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
//         <div className="flex items-center gap-2">
//           <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//           <div 
//             className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
//             style={{ animationDelay: '0.2s' }}
//           ></div>
//           <div 
//             className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
//             style={{ animationDelay: '0.4s' }}
//           ></div>
//         </div>
//         <p className="text-xs text-gray-500 mt-2">AI is thinking...</p>
//       </div>
//     </div>
//   );
// }

// /**
//  * WelcomeMessage Component
//  * Initial greeting message
//  */
// export function WelcomeMessage() {
//   return (
//     <div className="flex justify-center py-8">
//       <div className="max-w-md text-center">
//         <div className="w-16 h-16 bg-gradient-to-br from-[#5DABBC] to-[#2D5F3F] rounded-full flex items-center justify-center mx-auto mb-4">
//           <span className="text-2xl">🌍</span>
//         </div>
//         <h3 className="text-xl font-bold text-gray-800 mb-2">
//           Welcome to ClimaScan AI
//         </h3>
//         <p className="text-sm text-gray-600 leading-relaxed">
//           I can help you analyze climate risks for your properties. 
//           Select a property from the sidebar and ask me about flood risks, 
//           heat stress, drainage issues, or request a detailed climate report.
//         </p>
        
//         <div className="mt-6 space-y-2 text-left bg-gray-50 p-4 rounded-lg">
//           <p className="text-xs font-semibold text-gray-700 mb-2">Try asking:</p>
//           <div className="space-y-1.5">
//             <div className="text-xs text-gray-600 flex items-start gap-2">
//               <span className="text-[#2D5F3F]">•</span>
//               <span>"What's the flood risk for this property?"</span>
//             </div>
//             <div className="text-xs text-gray-600 flex items-start gap-2">
//               <span className="text-[#2D5F3F]">•</span>
//               <span>"How does heat stress affect this location?"</span>
//             </div>
//             <div className="text-xs text-gray-600 flex items-start gap-2">
//               <span className="text-[#2D5F3F]">•</span>
//               <span>"Generate a full climate risk report"</span>
//             </div>
//             <div className="text-xs text-gray-600 flex items-start gap-2">
//               <span className="text-[#2D5F3F]">•</span>
//               <span>"What are the recommended mitigation actions?"</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /**
//  * EmptyState Component
//  * Shows when no property is selected
//  */
// export function EmptyState() {
//   return (
//     <div className="flex items-center justify-center h-full">
//       <div className="text-center max-w-sm px-6">
//         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <MapPin className="w-10 h-10 text-gray-400" />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">
//           No Property Selected
//         </h3>
//         <p className="text-sm text-gray-500">
//           Please select a property from the sidebar to start analyzing climate risks 
//           and chatting with ClimaScan AI.
//         </p>
//       </div>
//     </div>
//   );
// }
