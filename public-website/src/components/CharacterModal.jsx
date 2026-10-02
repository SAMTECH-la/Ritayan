import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Zap, Shield, Sparkles, BookOpen, Sword, Volume2, VolumeX, Flame, Waves } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CharacterModal = ({ character, onClose }) => {
  const canvasRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [soundPlaying, setSoundPlaying] = useState(true);
  const audioCtxRef = useRef(null);
  const { t } = useLanguage();

  if (!character) return null;

  const charName = (character.name || '').toUpperCase();
  const category = character.character_category || 
    (charName.includes('MATSYA') ? 'FISH' :
     charName.includes('VASUKI') ? 'SERPENT' :
     charName.includes('NARASIMHA') ? 'LION' :
     charName.includes('VARAHA') ? 'BOAR' :
     charName.includes('KURMA') ? 'TORTOISE' : 'ROYAL_DEVOTEE');

  // ==========================================
  // WEB AUDIO API REAL-TIME SYNTHESIS
  // ==========================================
  const playCharacterSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const now = ctx.currentTime;

      if (category === 'FISH' || charName.includes('MATSYA')) {
        // MATSYA: Water Bubble Pops & Ocean Wave Splash
        for (let i = 0; i < 6; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + i * 0.12;

          osc.type = 'sine';
          // Pitch pop from low to high creating bubble sound
          osc.frequency.setValueAtTime(300 + i * 50, startTime);
          osc.frequency.exponentialRampToValueAtTime(800 + i * 100, startTime + 0.08);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.1);
        }

        // Sub wave splash noise
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctx.sampleRate * 0.15));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.linearRampToValueAtTime(200, now + 0.5);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
      } else if (category === 'SERPENT' || charName.includes('VASUKI')) {
        // VASUKI: Serpent Hiss & Rattle
        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }

        const hissSource = ctx.createBufferSource();
        hissSource.buffer = buffer;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(3500, now);
        bandpass.Q.setValueAtTime(3.0, now);

        const hissGain = ctx.createGain();
        hissGain.gain.setValueAtTime(0.01, now);
        hissGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
        hissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        hissSource.connect(bandpass);
        bandpass.connect(hissGain);
        hissGain.connect(ctx.destination);
        hissSource.start(now);

        // Low serpent swell
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.4);
        osc.frequency.linearRampToValueAtTime(60, now + 0.7);

        oscGain.gain.setValueAtTime(0.15, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.75);
      } else if (category === 'LION' || charName.includes('NARASIMHA')) {
        // NARASIMHA: Roaring Flame & Lion Roar Frequency Sweep
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';

        // Deep roar frequency pitch drop
        osc1.frequency.setValueAtTime(90, now);
        osc1.frequency.linearRampToValueAtTime(220, now + 0.15);
        osc1.frequency.exponentialRampToValueAtTime(55, now + 0.65);

        osc2.frequency.setValueAtTime(95, now);
        osc2.frequency.linearRampToValueAtTime(230, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(60, now + 0.65);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.7);
        osc2.stop(now + 0.7);
      } else if (category === 'BOAR' || charName.includes('VARAHA')) {
        // VARAHA: Sub-bass Earth Tremor Rumble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.2);
        osc.frequency.linearRampToValueAtTime(35, now + 0.6);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      } else if (category === 'ROYAL_DEVOTEE' || charName.includes('PARIKSHIT')) {
        // KING PARIKSHIT: Resonating Temple Bell Chime & Chant Vibration
        const freqs = [440, 880, 1320]; // Bell harmonics
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          const vol = 0.25 / (idx + 1);
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 - idx * 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.2);
        });
      } else {
        // KURMA / DEFAULT: Ocean Churn Sub-Depth Wave
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(70, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      console.warn('Audio context error:', e);
    }
  };

  useEffect(() => {
    playCharacterSound();
  }, [character]);

  // ==========================================
  // HTML5 CANVAS ANIMATION ENGINE
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const color = character.theme_color || '#F59E0B';

    // 1. MATSYA (Fish & Water Bubbles)
    const fishList = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * width,
      y: (height * 0.3) + Math.random() * (height * 0.5),
      speed: 1.5 + Math.random() * 1.5,
      size: 16 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
      tailAngle: 0
    }));

    const bubbleList = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 50,
      radius: Math.random() * 4 + 1.5,
      vy: Math.random() * 1.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.6 + 0.3
    }));

    // 2. VASUKI (Slithering Small Snakes)
    const snakes = Array.from({ length: 6 }, (_, i) => {
      const segCount = 18;
      const headX = Math.random() * width;
      const headY = Math.random() * height;
      const points = [];
      for (let s = 0; s < segCount; s++) {
        points.push({ x: headX - s * 4, y: headY });
      }
      return {
        points,
        speed: 2 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        turnSpeed: (Math.random() - 0.5) * 0.05,
        color: i % 2 === 0 ? '#14B8A6' : '#10B981',
        tongueOut: 0
      };
    });

    // 3. NARASIMHA (Fiery Mane Sparks & Lion Claw Slashes)
    const fireSparks = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 20,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 4 - 2,
      size: Math.random() * 4 + 1,
      life: Math.random() * 1,
      maxLife: Math.random() * 0.8 + 0.4
    }));

    const slashes = [
      { x1: width * 0.1, y1: height * 0.2, x2: width * 0.6, y2: height * 0.8, progress: 0, delay: 0 },
      { x1: width * 0.3, y1: height * 0.1, x2: width * 0.8, y2: height * 0.7, progress: 0, delay: 15 },
      { x1: width * 0.5, y1: height * 0.2, x2: width * 0.95, y2: height * 0.6, progress: 0, delay: 30 }
    ];

    // 4. VARAHA (Cracking Earth & Bedrock Fragments)
    const earthCracks = Array.from({ length: 8 }, () => ({
      startX: width / 2,
      startY: height / 2,
      endX: Math.random() * width,
      endY: Math.random() * height,
      progress: 0,
      speed: 0.02 + Math.random() * 0.03
    }));

    const soilDebris = Array.from({ length: 40 }, () => ({
      x: width / 2,
      y: height / 2,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      size: Math.random() * 5 + 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.1
    }));

    // 5. KING PARIKSHIT (Golden Lotus Petals & Royal Crown Glow)
    const lotusPetals = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: -Math.random() * height,
      vx: Math.sin(Math.random() * Math.PI) * 1,
      vy: Math.random() * 1.2 + 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      size: 8 + Math.random() * 8,
      color: Math.random() > 0.4 ? '#F472B6' : '#FBBF24'
    }));

    let auraPulse = 0;

    // RENDER LOOP
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      auraPulse += 0.03;

      // ------------------------------------------
      // MATSYA (SWIMMING FISH & RISING WATER BUBBLES)
      // ------------------------------------------
      if (category === 'FISH' || charName.includes('MATSYA')) {
        // Draw rising water bubbles
        bubbleList.forEach(b => {
          b.y -= b.vy;
          b.x += Math.sin(b.y * 0.05) * b.vx;

          if (b.y < -10) {
            b.y = height + 10;
            b.x = Math.random() * width;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.fill();
          ctx.restore();
        });

        // Draw Swimming Golden Fish
        fishList.forEach(f => {
          f.x += f.speed;
          f.phase += 0.08;
          f.y += Math.sin(f.phase) * 0.8;
          f.tailAngle = Math.sin(f.phase * 2) * 0.4;

          if (f.x > width + 40) {
            f.x = -40;
            f.y = (height * 0.2) + Math.random() * (height * 0.6);
          }

          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.fillStyle = '#F59E0B';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#FBBF24';

          // Fish Body
          ctx.beginPath();
          ctx.ellipse(0, 0, f.size, f.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tail Fin
          ctx.save();
          ctx.translate(-f.size * 0.8, 0);
          ctx.rotate(f.tailAngle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-f.size * 0.7, -f.size * 0.4);
          ctx.lineTo(-f.size * 0.7, f.size * 0.4);
          ctx.closePath();
          ctx.fillStyle = '#FDE68A';
          ctx.fill();
          ctx.restore();

          // Horn / Dorsal Fin
          ctx.beginPath();
          ctx.moveTo(0, -f.size * 0.4);
          ctx.lineTo(f.size * 0.3, -f.size * 0.9);
          ctx.lineTo(f.size * 0.5, -f.size * 0.3);
          ctx.fillStyle = '#F59E0B';
          ctx.fill();

          // Eye
          ctx.beginPath();
          ctx.arc(f.size * 0.5, -f.size * 0.1, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#000000';
          ctx.fill();

          ctx.restore();
        });
      }

      // ------------------------------------------
      // VASUKI (ORGANIC SLITHERING SNAKES)
      // ------------------------------------------
      else if (category === 'SERPENT' || charName.includes('VASUKI')) {
        snakes.forEach(snake => {
          snake.angle += (Math.random() - 0.5) * 0.2;
          const head = snake.points[0];
          const newHeadX = head.x + Math.cos(snake.angle) * snake.speed;
          const newHeadY = head.y + Math.sin(snake.angle) * snake.speed;

          // Wrap boundaries
          const boundedX = (newHeadX + width) % width;
          const boundedY = (newHeadY + height) % height;

          snake.points.unshift({ x: boundedX, y: boundedY });
          snake.points.pop();

          // Draw snake body segments
          ctx.save();
          for (let p = snake.points.length - 1; p >= 0; p--) {
            const pt = snake.points[p];
            const radius = (1 - p / snake.points.length) * 5 + 1.5;

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = snake.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#14B8A6';
            ctx.fill();
          }

          // Draw Snake Head & Tongue
          const snakeHead = snake.points[0];
          ctx.beginPath();
          ctx.arc(snakeHead.x, snakeHead.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#2DD4BF';
          ctx.fill();

          // Flicking tongue
          snake.tongueOut = (snake.tongueOut + 0.1) % (Math.PI * 2);
          if (Math.sin(snake.tongueOut) > 0.4) {
            ctx.beginPath();
            ctx.moveTo(snakeHead.x, snakeHead.y);
            const tx = snakeHead.x + Math.cos(snake.angle) * 12;
            const ty = snakeHead.y + Math.sin(snake.angle) * 12;
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = '#EF4444';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // ------------------------------------------
      // NARASIMHA (ROARING SOLAR FLAMES & CLAW SLASHES)
      // ------------------------------------------
      else if (category === 'LION' || charName.includes('NARASIMHA')) {
        // Fire embers rising
        fireSparks.forEach(s => {
          s.x += s.vx;
          s.y += s.vy;
          s.life += 0.02;

          if (s.y < 0 || s.life > s.maxLife) {
            s.y = height + 10;
            s.x = Math.random() * width;
            s.life = 0;
          }

          ctx.save();
          ctx.globalAlpha = 1 - (s.life / s.maxLife);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = s.life > 0.3 ? '#EF4444' : '#F59E0B';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#F59E0B';
          ctx.fill();
          ctx.restore();
        });

        // Lion Claw Slashes
        slashes.forEach(s => {
          if (s.delay > 0) {
            s.delay--;
            return;
          }
          s.progress += 0.05;
          if (s.progress > 1.4) {
            s.progress = 0;
            s.delay = 20;
          }

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(s.x1, s.y1);
          const currentX = s.x1 + (s.x2 - s.x1) * Math.min(s.progress, 1);
          const currentY = s.y1 + (s.y2 - s.y1) * Math.min(s.progress, 1);
          ctx.lineTo(currentX, currentY);
          ctx.strokeStyle = '#FDE68A';
          ctx.lineWidth = 4;
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#EF4444';
          ctx.stroke();
          ctx.restore();
        });
      }

      // ------------------------------------------
      // VARAHA (BEDROCK EARTH CRACKING & SHOCKWAVES)
      // ------------------------------------------
      else if (category === 'BOAR' || charName.includes('VARAHA')) {
        // Cracking earth lines
        earthCracks.forEach(c => {
          c.progress += c.speed;
          if (c.progress > 1) c.progress = 0;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(c.startX, c.startY);
          const currX = c.startX + (c.endX - c.startX) * c.progress;
          const currY = c.startY + (c.endY - c.startY) * c.progress;
          ctx.lineTo(currX, currY);
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#10B981';
          ctx.stroke();
          ctx.restore();
        });

        // Flying soil fragments
        soilDebris.forEach(d => {
          d.x += d.vx;
          d.y += d.vy;
          d.rotation += d.rotSpeed;

          if (d.x < 0 || d.x > width || d.y < 0 || d.y > height) {
            d.x = width / 2;
            d.y = height / 2;
            d.vx = (Math.random() - 0.5) * 6;
            d.vy = (Math.random() - 0.5) * 6;
          }

          ctx.save();
          ctx.translate(d.x, d.y);
          ctx.rotate(d.rotation);
          ctx.fillStyle = '#78350F';
          ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size);
          ctx.restore();
        });
      }

      // ------------------------------------------
      // KING PARIKSHIT (FLOATING LOTUS PETALS & MANTRA AURA)
      // ------------------------------------------
      else if (category === 'ROYAL_DEVOTEE' || charName.includes('PARIKSHIT')) {
        // Radiating aura ring
        const radiusPulse = (Math.sin(auraPulse) + 1) * 30 + 70;
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radiusPulse, 0, Math.PI * 2);
        ctx.strokeStyle = '#A78BFA';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#8B5CF6';
        ctx.stroke();
        ctx.restore();

        // Floating lotus petals
        lotusPetals.forEach(p => {
          p.y += p.vy;
          p.x += Math.sin(p.y * 0.02) * p.vx;
          p.rotation += p.rotSpeed;

          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        });
      }

      // ------------------------------------------
      // KURMA / DEFAULT (COSMIC TURTLE CARAPACE SHIELD)
      // ------------------------------------------
      else {
        const shieldAngle = auraPulse * 0.5;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(shieldAngle);

        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * 60, Math.sin(ang) * 60, 20, 0, Math.PI * 2);
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [character]);

  // Mouse tilt tracking for 3D card response
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: (y / rect.height) * -15, y: (x / rect.width) * 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      
      {/* Background Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Modal Stage */}
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 gap-0 transition-transform duration-200"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          boxShadow: `0 25px 50px -12px ${character.theme_color}40, 0 0 60px ${character.theme_color}25`
        }}
      >
        {/* Controls: Audio Toggle & Close Button */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button 
            onClick={playCharacterSound}
            title="Replay Sound Effect"
            className="w-10 h-10 rounded-full bg-slate-950/80 border border-slate-700 text-amber-400 hover:text-white hover:border-amber-400 flex items-center justify-center transition shadow-xl"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:border-amber-400 flex items-center justify-center transition shadow-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LEFT COLUMN: ANIMATED CANVAS & ARTWORK BACKDROP */}
        <div 
          className="md:col-span-5 relative min-h-[360px] md:min-h-[500px] p-8 flex flex-col justify-between overflow-hidden bg-slate-950"
        >
          {/* Character Artwork Backdrop Image */}
          {(character.avatar_url || character.avatar_image) ? (
            <img 
              src={character.avatar_url || (character.avatar_image?.startsWith('http') ? character.avatar_image : `http://127.0.0.1:8000/uploads/${character.avatar_image}`)}
              alt={character.name}
              className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80"
            />
          ) : (
            <div className="absolute inset-0 z-0" style={{ background: character.bg_gradient }}></div>
          )}

          {/* Dark Overlay Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60 z-0"></div>

          {/* Canvas Elemental Particles */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-90" />

          {/* Top Badges */}
          <div className="relative z-20 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-slate-950/90 border border-amber-400/40 text-amber-400 font-bold text-[10px] uppercase tracking-widest shadow-xl backdrop-blur">
              {character.avatar_type}
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-black/70 px-2.5 py-1 rounded-full border border-slate-700 backdrop-blur">
              {character.yuga}
            </span>
          </div>

          {/* Central Character Title */}
          <div className="relative z-20 my-auto text-center space-y-2 pt-12">
            <h2 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-wider drop-shadow-2xl">
              {character.name}
            </h2>
            <p className="text-xs font-bold text-amber-400 tracking-widest uppercase drop-shadow-md">
              {character.title}
            </p>
          </div>

          {/* Power Level Bar */}
          <div className="relative z-20 bg-slate-950/80 border border-slate-800 p-3 rounded-xl space-y-1.5 backdrop-blur">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {t('powerLevel')}
              </span>
              <span className="text-amber-400">{character.power_level} / 100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: `${character.power_level}%`,
                  backgroundColor: character.theme_color
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LORE DETAILS & FEATURED COMIC CTA */}
        <div className="md:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between bg-slate-900">
          
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                {t('weaponSymbol')}
              </span>
              <div className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Sword className="w-4 h-4 text-amber-400" />
                <span>{character.weapon_symbol}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('overview')}
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {character.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('lore')}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {character.lore_details}
              </p>
            </div>
          </div>

          {/* Direct CTA link to comic */}
          {character.associated_slug && (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">{t('featuredNovel')}</span>
                <span className="text-xs font-bold text-slate-200">Read {character.name}'s Epic Saga</span>
              </div>
              
              <Link 
                to={`/read/${character.associated_slug}`}
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg no-underline flex items-center gap-2 group flex-shrink-0"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('read3D')}</span>
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default CharacterModal;
