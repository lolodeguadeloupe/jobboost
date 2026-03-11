'use client'
import { useState, useRef } from 'react'
import { Upload, FileText, Sparkles, CheckCircle2, X } from 'lucide-react'

const DEMO_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL',
  'Tailwind CSS', 'REST API', 'Git', 'Docker', 'AWS',
  'GraphQL', 'CI/CD', 'Agile / Scrum',
]

const DEMO_CV = {
  name: 'cv-jean-dupont-2024.pdf',
  size: '234 KB',
  uploadedAt: '10 mars 2024',
}

export default function CVPage() {
  const [dragOver, setDragOver] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) { setFile(f); setUploaded(true) }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) { setFile(f); setUploaded(true) }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mon CV</h1>
        <p className="text-gray-500 mt-1">Uploadez votre CV pour que l'IA puisse analyser vos compétences.</p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 bg-white'
        }`}>
        <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-full ${dragOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Upload className={`w-7 h-7 ${dragOver ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          {uploaded && file ? (
            <>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <CheckCircle2 className="w-5 h-5" /> {file.name}
              </div>
              <p className="text-sm text-gray-400">Cliquez pour changer de fichier</p>
            </>
          ) : (
            <>
              <div>
                <p className="font-semibold text-gray-700">Glissez-déposez votre CV ici</p>
                <p className="text-sm text-gray-400 mt-1">ou cliquez pour choisir un fichier</p>
              </div>
              <p className="text-xs text-gray-400">PDF, DOC, DOCX — max 10 MB</p>
            </>
          )}
        </div>
      </div>

      {/* Current CV demo */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" /> CV actuel
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2.5 rounded-lg">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{DEMO_CV.name}</p>
              <p className="text-xs text-gray-400">{DEMO_CV.size} · Uploadé le {DEMO_CV.uploadedAt}</p>
            </div>
          </div>
          <button className="text-xs text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Skills demo */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" /> Compétences détectées par l'IA
        </h2>
        <p className="text-xs text-gray-400 mb-4">Extraites automatiquement de votre CV.</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_SKILLS.map(skill => (
            <span key={skill}
              className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium border border-blue-100">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
