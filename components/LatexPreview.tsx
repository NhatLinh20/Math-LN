import React from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface LatexPreviewProps {
  content: string
  className?: string
}

export default function LatexPreview({ content, className = '' }: LatexPreviewProps) {
  if (!content) return null

  // Split content by $$...$$ and $...$
  const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g)

  return (
    <div className={`text-gray-800 leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMath key={index} math={part.slice(2, -2)} />
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMath key={index} math={part.slice(1, -1)} />
        }
        
        // Handle normal text (convert newlines to <br/>)
        return (
          <span key={index}>
            {part.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        )
      })}
    </div>
  )
}
