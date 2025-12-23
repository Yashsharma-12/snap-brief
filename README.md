SnapBrief — Smart AI Summarizer
SnapBrief is a high-performance document intelligence platform that conquers information overload. Built with Next.js 15 and Google Gemini 2.5, it allows users to transform dense text, PDFs, and Word documents into instant, actionable intelligence.
Link: https://snapbrief-phi.vercel.app/

🚀 Features
Multi-Format Support: Seamlessly extract text from PDFs, DOCX files, and raw text inputs.

Three Summarization Modes: Choose between "Short" (concise paragraph), "Bullets" (key highlights), or "Formal" (professional brief).

AI-Powered Precision: Driven by the Gemini 2.5 Flash model for high-speed, context-aware summaries.

Persistent Activity History: Track and copy your last 10 summaries using browser LocalStorage.

Responsive Bento Design: A modern, mobile-friendly interface built with Tailwind CSS.

🛠️ Tech Stack
Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS.

AI Integration: Vercel AI SDK, Google Generative AI.

Parsing Libraries: PDF.js (for PDF extraction), Mammoth.js (for DOCX extraction).

Icons: Lucide React.

Deployment: Vercel.

⚙️ Installation & Setup
Clone the repository:

Bash

git clone https://github.com/Yashsharma-12/snap-brief.git
cd snap-brief
Install dependencies:

Bash

npm install
Set up Environment Variables: Create a .env.local file in the root directory and add your Gemini API key:

Code snippet

GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
Run the development server:

Bash

npm run dev
Open http://localhost:3000 to view the app.

🛡️ Security & Privacy
SnapBrief processes document extraction entirely on the client side. Your files are never uploaded to a server; only the extracted text is sent to the Gemini API via a secure, encrypted server-side route to ensure your API keys remain private.
