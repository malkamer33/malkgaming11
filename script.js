// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Create custom cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorTrail);
    
    // Cursor style toggle (PlayStation vs Mouse)
    let isMouseStyle = false;
    
    // Toggle cursor style with spacebar
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            isMouseStyle = !isMouseStyle;
            
            if (isMouseStyle) {
                cursor.classList.add('mouse-style');
                cursorTrail.classList.add('mouse-style');
                console.log('%cتم التبديل إلى شكل الماوس الحقيقي 🖱️', 'color: #4ecdc4; font-size: 14px;');
            } else {
                cursor.classList.remove('mouse-style');
                cursorTrail.classList.remove('mouse-style');
                console.log('%cتم التبديل إلى شكل يد البلايستيشن 🎮', 'color: #ff6b6b; font-size: 14px;');
            }
        }
    });
    
    // Custom cursor functionality with natural speed
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        // Natural cursor movement (more responsive)
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        
        // Natural trail movement (slightly slower)
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        
        // Position cursor based on style
        if (isMouseStyle) {
            cursor.style.left = cursorX - 12 + 'px';
            cursor.style.top = cursorY - 12 + 'px';
            
            cursorTrail.style.left = trailX - 6 + 'px';
            cursorTrail.style.top = trailY - 6 + 'px';
        } else {
            cursor.style.left = cursorX - 16 + 'px';
            cursor.style.top = cursorY - 16 + 'px';
            
            cursorTrail.style.left = trailX - 8 + 'px';
            cursorTrail.style.top = trailY - 8 + 'px';
        }
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Cursor effects for interactive elements
    const interactiveElements = document.querySelectorAll('.social-card, .config-card, .info-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (isMouseStyle) {
                cursor.style.transform = 'scale(1.3)';
                cursorTrail.style.transform = 'scale(1.2)';
            } else {
                cursor.style.transform = 'scale(1.5) rotate(15deg)';
                cursorTrail.style.transform = 'scale(1.3)';
            }
            cursor.style.filter = 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.8))';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.style.transform = 'scale(1)';
            cursorTrail.style.transform = 'scale(1)';
            cursor.style.filter = 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.8))';
        });
    });
    
    // Social Media Cards Click Handler
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        card.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url) {
                // Add click animation with cursor effect
                this.style.transform = 'scale(0.95) translateY(-15px) perspective(1000px) rotateX(10deg)';
                cursor.style.transform = 'scale(0.5)';
                
                // Add click sound effect (optional)
                createClickSound();
                
                setTimeout(() => {
                    this.style.transform = 'translateY(-20px) scale(1.05) perspective(1000px) rotateX(5deg)';
                    cursor.style.transform = isMouseStyle ? 'scale(1.3)' : 'scale(1.5) rotate(15deg)';
                    window.open(url, '_blank');
                }, 150);
                
                setTimeout(() => {
                    cursor.style.transform = 'scale(1)';
                }, 300);
            }
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // Add floating animation
            this.style.animation = 'cardFloat 2s ease-in-out infinite';
            
            // Add 3D tilt effect
            this.addEventListener('mousemove', handleCardTilt);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            this.style.animation = 'none';
            this.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)';
            this.removeEventListener('mousemove', handleCardTilt);
        });
    });
    
    // 3D tilt effect for cards
    function handleCardTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `translateY(-20px) scale(1.05) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // Create click sound effect
    function createClickSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    // Add floating animation for cards
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardFloat {
            0%, 100% { transform: translateY(-20px) scale(1.05) perspective(1000px) rotateX(5deg); }
            50% { transform: translateY(-25px) scale(1.05) perspective(1000px) rotateX(8deg); }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes glowPulse {
            0%, 100% { 
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.2);
            }
            50% { 
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 255, 255, 0.4);
            }
        }
        
        @keyframes neonGlow {
            0%, 100% { 
                text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
            }
            50% { 
                text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
            }
        }
        
        @keyframes sparkle {
            0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1) rotate(180deg); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Enhanced parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.particles');
        const speed = scrolled * 0.3;
        
        if (parallax) {
            parallax.style.transform = `translateY(${speed}px) rotate(${scrolled * 0.01}deg)`;
        }
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                
                // Add glow effect when card comes into view
                if (entry.target.classList.contains('social-card') || entry.target.classList.contains('config-card')) {
                    entry.target.style.animation = 'glowPulse 4s ease-in-out infinite';
                }
                
                // Add sparkle effect
                createSparkles(entry.target);
            }
        });
    }, observerOptions);
    
    // Create sparkle effect
    function createSparkles(element) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.position = 'absolute';
                sparkle.style.width = '4px';
                sparkle.style.height = '4px';
                sparkle.style.background = 'radial-gradient(circle, #fff, transparent)';
                sparkle.style.borderRadius = '50%';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '10';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.animation = 'sparkle 1s ease-out forwards';
                
                element.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1000);
            }, i * 200);
        }
    }
    
    // Observe all cards for animation
    document.querySelectorAll('.social-card, .config-card, .info-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) scale(0.9)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(card);
    });
    
    // Config cards enhanced hover effects
    const configCards = document.querySelectorAll('.config-card');
    
    configCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Enhanced glowing effect
            this.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(0, 212, 255, 0.4), inset 0 0 30px rgba(0, 212, 255, 0.1)';
            this.style.borderColor = 'rgba(0, 212, 255, 0.7)';
            
            // Add pulse effect to price
            const price = this.querySelector('.price');
            if (price) {
                price.style.animation = 'neonGlow 2s ease-in-out infinite';
            }
            
            // Add 3D tilt effect
            this.addEventListener('mousemove', handleCardTilt);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.6), 0 0 50px rgba(0, 212, 255, 0.4), inset 0 0 30px rgba(0, 212, 255, 0.1)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            
            // Remove pulse effect
            const price = this.querySelector('.price');
            if (price) {
                price.style.animation = 'none';
            }
            
            this.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)';
            this.removeEventListener('mousemove', handleCardTilt);
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-15px) scale(0.98) perspective(1000px) rotateX(10deg)';
            cursor.style.transform = 'scale(0.5)';
            
            // Add click sound
            createClickSound();
            
            setTimeout(() => {
                this.style.transform = 'translateY(-25px) scale(1.03) perspective(1000px) rotateX(8deg)';
                cursor.style.transform = isMouseStyle ? 'scale(1.3)' : 'scale(1.5) rotate(15deg)';
            }, 150);
            
            setTimeout(() => {
                cursor.style.transform = 'scale(1)';
            }, 300);
        });
    });
    
    // Enhanced typing effect to the name
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        nameElement.textContent = '';
        nameElement.setAttribute('data-text', originalText);
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                nameElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 120);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
    
    // Enhanced floating particles effect
    function createParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        particle.style.position = 'fixed';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random color with more variety
        const colors = [
            'rgba(0, 212, 255, 0.8)',
            'rgba(255, 107, 107, 0.8)',
            'rgba(78, 205, 196, 0.8)',
            'rgba(255, 217, 61, 0.8)',
            'rgba(255, 119, 198, 0.8)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '0';
        particle.style.filter = 'blur(1px)';
        particle.style.boxShadow = '0 0 10px currentColor';
        
        // Random position
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle with more complex path
        const animation = particle.animate([
            { 
                transform: 'translateY(0px) translateX(0px) scale(0)',
                opacity: 0
            },
            { 
                transform: `translateY(-${window.innerHeight * 0.2}px) translateX(${Math.random() * 100 - 50}px) scale(1)`,
                opacity: 1
            },
            { 
                transform: `translateY(-${window.innerHeight * 0.6}px) translateX(${Math.random() * 100 - 50}px) scale(0.8)`,
                opacity: 0.8
            },
            { 
                transform: `translateY(-${window.innerHeight + 100}px) translateX(${Math.random() * 100 - 50}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: Math.random() * 5000 + 4000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => {
            particle.remove();
        };
    }
    
    // Create particles periodically
    setInterval(createParticle, 150);
    
    // Enhanced ripple effect to cards
    function createRipple(event) {
        const card = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        ripple.style.pointerEvents = 'none';
        
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }
    
    // Add ripple effect to all cards
    document.querySelectorAll('.social-card, .config-card').forEach(card => {
        card.addEventListener('click', createRipple);
    });
    
    // Enhanced loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or reset animations
            document.querySelectorAll('.social-card, .config-card').forEach(card => {
                card.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0deg) rotateY(0deg)';
                card.style.animation = 'none';
            });
        }
    });
    
    // Enhanced touch support for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            // Add swipe feedback
            const cards = document.querySelectorAll('.social-card, .config-card');
            cards.forEach(card => {
                card.style.transform = diff > 0 ? 'translateY(-15px) scale(1.02) perspective(1000px) rotateX(5deg)' : 'translateY(15px) scale(0.98) perspective(1000px) rotateX(-5deg)';
                setTimeout(() => {
                    card.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0deg)';
                }, 400);
            });
        }
    }
    
    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateScroll() {
        // Scroll-based animations can be added here
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    });
    
    // Add console welcome message
    console.log('%cمرحباً بك في صفحة MalakGaming - PC WeCode! 🚀', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
    console.log('%cتم تطوير هذه الصفحة بأحدث تقنيات الويب', 'color: #4ecdc4; font-size: 14px;');
    console.log('%cالماوس المخصص مفعل! 🎯', 'color: #ff6b6b; font-size: 16px;');
    console.log('%cاضغط SPACE للتبديل بين شكل الماوس 🎮/🖱️', 'color: #ffd93d; font-size: 14px;');
    console.log('%cتأثيرات 3D وحركات متقدمة مفعلة! ✨', 'color: #ff6b6b; font-size: 14px;');
}); 