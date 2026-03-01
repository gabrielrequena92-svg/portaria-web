'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
}

export function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        const mouse = { x: -1000, y: -1000 }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }

        const handleMouseLeave = () => {
            mouse.x = -1000
            mouse.y = -1000
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseout', handleMouseLeave)

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        const initParticles = () => {
            particles = []
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000) // Densidade
            for (let i = 0; i < numberOfParticles; i++) {
                const x = Math.random() * canvas.width
                const y = Math.random() * canvas.height
                particles.push({
                    x,
                    y,
                    size: Math.random() * 2 + 0.5, // 0.5 a 2.5px
                    speedX: (Math.random() - 0.5) * 0.8,
                    speedY: (Math.random() - 0.5) * 0.8,
                    opacity: Math.random() * 0.5 + 0.2, // Um pouco mais visível para o tema claro
                })
            }
        }

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach((p, index) => {
                // Movimentação natural
                p.x += p.speedX
                p.y += p.speedY

                // Loop nas bordas
                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                // Interação com o mouse (Atração magnética e teia)
                const dxMouse = p.x - mouse.x
                const dyMouse = p.y - mouse.y
                const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
                const mouseRadius = 180

                if (distanceMouse < mouseRadius) {
                    // Conecta a partícula ao mouse
                    ctx.beginPath()
                    ctx.strokeStyle = `rgba(16, 185, 129, ${0.4 * (1 - distanceMouse / mouseRadius)})` // Emerald
                    ctx.lineWidth = 1
                    ctx.moveTo(p.x, p.y)
                    ctx.lineTo(mouse.x, mouse.y)
                    ctx.stroke()

                    // Efeito de sucção leve em direção ao mouse
                    // Para não juntar tudo num ponto, a atração diminui com a proximidade
                    const forceDirectionX = dxMouse / distanceMouse
                    const forceDirectionY = dyMouse / distanceMouse
                    const force = (mouseRadius - distanceMouse) / mouseRadius

                    p.x -= forceDirectionX * force * 1.5
                    p.y -= forceDirectionY * force * 1.5
                }

                // Desenhar ponto (Partícula verde)
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`
                ctx.fill()

                // Conectar partículas próximas (efeito constelação)
                for (let j = index; j < particles.length; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - distance / 100)})` // Linha emerald bem fraca
                        ctx.lineWidth = 0.5
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.stroke()
                    }
                }
            })

            animationFrameId = requestAnimationFrame(drawParticles)
        }

        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)
        drawParticles()

        // Para evitar scroll desnecessário, deixamos absolute mas fixo no container pai, 
        // ou fixed no viewport todo (z-[-1]).
        return () => {
            window.removeEventListener('resize', resizeCanvas)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseout', handleMouseLeave)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    )
}
