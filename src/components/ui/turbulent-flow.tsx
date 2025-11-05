'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface TurbulentFlowBackgroundProps {
  children: React.ReactNode
}

export function TurbulentFlowBackground({ children }: TurbulentFlowBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    // Responsive setup
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height)
      const isMobile = width < 768
      renderer.setPixelRatio(
        isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2)
      )
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Vertex Shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `

    // Fragment Shader with Raindrop brand colors
    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_turbulence;
      varying vec2 vUv;

      // Noise functions
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;

        // Raindrop brand color palette (teal/orange focused)
        vec3 color1 = vec3(0.98, 0.45, 0.09); // Orange #f97316
        vec3 color2 = vec3(0.08, 0.72, 0.65); // Teal #14b8a6
        vec3 color3 = vec3(0.4, 0.3, 0.8);    // Purple accent
        vec3 color4 = vec3(0.0, 0.8, 0.9);    // Bright cyan
        vec3 color5 = vec3(1.0, 0.6, 0.2);    // Golden orange

        // Turbulent flow
        float t = u_time * 0.15;
        vec2 q = vec2(
          snoise(p + vec2(t * 0.5, -t * 0.3)),
          snoise(p + vec2(-t * 0.4, t * 0.6))
        );

        vec2 r = vec2(
          snoise(p + 4.0 * q + vec2(1.7 + t * 0.2, 9.2 - t * 0.25)),
          snoise(p + 4.0 * q + vec2(8.3 - t * 0.15, 2.8 + t * 0.3))
        );

        float f = snoise(p + 4.0 * r + u_mouse * 0.5);

        // Enhanced turbulence
        float turbulence = u_turbulence * (0.5 + 0.5 * snoise(p * 2.0 + t));

        // Color mixing with turbulence
        vec3 color = mix(color1, color2, smoothstep(-1.0, 1.0, f + turbulence));
        color = mix(color, color3, smoothstep(-0.5, 0.5, q.x + r.y));
        color = mix(color, color4, smoothstep(-0.3, 0.7, sin(f * 3.14159)));
        color = mix(color, color5, smoothstep(0.0, 1.0, length(q) * 0.5));

        // Add depth and glow
        float glow = smoothstep(0.0, 1.0, 1.0 - length(p) * 0.5);
        color += glow * 0.2 * vec3(0.1, 0.8, 0.9);

        // Vignette for depth
        float vignette = smoothstep(1.5, 0.5, length(p));
        color *= 0.4 + 0.6 * vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `

    // Create material with uniforms
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_turbulence: { value: 0.8 },
      },
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1

      gsap.to(material.uniforms.u_mouse.value, {
        x: mouseX * 0.5,
        y: mouseY * 0.5,
        duration: 1.5,
        ease: 'power2.out',
      })
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Touch interaction for mobile
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      const mouseX = (touch.clientX / window.innerWidth) * 2 - 1
      const mouseY = -(touch.clientY / window.innerHeight) * 2 + 1

      gsap.to(material.uniforms.u_mouse.value, {
        x: mouseX * 0.5,
        y: mouseY * 0.5,
        duration: 1.5,
        ease: 'power2.out',
      })
    }
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    // Animation loop
    const animate = () => {
      material.uniforms.u_time.value += 0.01
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Content overlay */}
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}


