import React, { useEffect, useRef } from 'react'

const AsciinemaEmbed = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://asciinema.org/a/D2kzPI97gWP65U6RFxJ8VYS7H.js'
    script.async = true
    script.id = 'asciicast-D2kzPI97gWP65U6RFxJ8VYS7H'

    const container = containerRef.current

    if (container) {
      container.appendChild(script)
    }

    return () => {
      if (container) {
        container.removeChild(script)
      }
    }
  }, [])

  return (
    <div ref={containerRef} style={{ width: '700px', height: '480px' }}></div>
  )
}

export default AsciinemaEmbed
