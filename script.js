// Mouse DPI Analyzer JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // DPI Testing Functionality
    let isTestingActive = false;
    let startX = 0;
    let startY = 0;
    let pixelsMoved = 0;
    
    const testArea = document.getElementById('test-area');
    const dpiDisplay = document.getElementById('dpi-value');
    const distanceInput = document.getElementById('distance-input');
    const unitSelect = document.getElementById('unit-select');

    if (testArea && dpiDisplay) {
        // Mouse down - start testing
        testArea.addEventListener('mousedown', function(e) {
            if (isTestingActive) return;
            
            isTestingActive = true;
            startX = e.clientX;
            startY = e.clientY;
            pixelsMoved = 0;
            
            testArea.classList.add('testing');
            testArea.innerHTML = '<p>Move your mouse the specified distance and release</p>';
            
            // Prevent text selection during drag
            e.preventDefault();
            document.body.style.userSelect = 'none';
            
            // Track mouse movement
            document.addEventListener('mousemove', trackMovement);
            document.addEventListener('mouseup', endTest);
        });

        function trackMovement(e) {
            if (!isTestingActive) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            pixelsMoved = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Update display with current pixels moved
            const currentDPI = calculateDPI(pixelsMoved);
            dpiDisplay.textContent = Math.round(currentDPI);
        }

        function endTest() {
            if (!isTestingActive) return;
            
            isTestingActive = false;
            testArea.classList.remove('testing');
            testArea.innerHTML = '<p>Click and drag to measure your mouse DPI</p>';
            
            // Re-enable text selection
            document.body.style.userSelect = '';
            
            // Calculate final DPI
            const finalDPI = calculateDPI(pixelsMoved);
            dpiDisplay.textContent = Math.round(finalDPI);
            
            // Clean up event listeners
            document.removeEventListener('mousemove', trackMovement);
            document.removeEventListener('mouseup', endTest);
            
            // Show result message
            if (finalDPI > 0) {
                setTimeout(() => {
                    alert(`Your mouse DPI is approximately ${Math.round(finalDPI)}. For more accurate results, repeat the test 3-4 times and average the results.`);
                }, 100);
            }
        }

        function calculateDPI(pixels) {
            const distance = parseFloat(distanceInput.value) || 5;
            const unit = unitSelect.value;
            
            // Convert distance to inches
            let distanceInInches;
            switch (unit) {
                case 'cm':
                    distanceInInches = distance / 2.54;
                    break;
                case 'mm':
                    distanceInInches = distance / 25.4;
                    break;
                default: // inches
                    distanceInInches = distance;
            }
            
            if (distanceInInches <= 0) return 0;
            
            return pixels / distanceInInches;
        }

        // CTA button functionality
        const startTestBtns = document.querySelectorAll('#start-test-btn, #footer-test-btn');
        startTestBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                testArea.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    testArea.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        testArea.style.transform = 'scale(1)';
                    }, 200);
                }, 500);
            });
        });
    }

    // FAQ Accordion - Enhanced Implementation
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items first
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    const a = q.nextElementSibling;
                    if (a && a.classList.contains('faq-answer')) {
                        a.classList.remove('active');
                        a.style.maxHeight = '0';
                    }
                }
            });
            
            // Toggle current FAQ item
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                if (answer && answer.classList.contains('faq-answer')) {
                    answer.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            } else {
                this.setAttribute('aria-expanded', 'false');
                if (answer && answer.classList.contains('faq-answer')) {
                    answer.classList.remove('active');
                    answer.style.maxHeight = '0';
                }
            }
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Enhanced Form validation for contact forms
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(form => {
        // Real-time validation on input
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            let firstErrorField = null;
            
            // Clear previous error states
            this.querySelectorAll('.error').forEach(field => {
                field.classList.remove('error');
            });
            
            // Validate all required fields
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                    if (!firstErrorField) {
                        firstErrorField = field;
                    }
                }
            });
            
            if (isValid) {
                // Simulate form submission with better UX
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.6';
                
                setTimeout(() => {
                    showSuccessMessage();
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 1500);
            } else {
                // Focus on first error field
                if (firstErrorField) {
                    firstErrorField.focus();
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                showErrorMessage('Please fill in all required fields correctly.');
            }
        });
    });

    // Field validation function
    function validateField(field) {
        let isValid = true;
        const value = field.value.trim();
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            isValid = false;
        } else {
            // Specific validation by field type
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (value && !emailRegex.test(value)) {
                        field.classList.add('error');
                        isValid = false;
                    }
                    break;
                case 'tel':
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                        field.classList.add('error');
                        isValid = false;
                    }
                    break;
            }
            
            // Remove error class if field is now valid
            if (isValid && field.classList.contains('error')) {
                field.classList.remove('error');
            }
        }
        
        return isValid;
    }

    // Success message function
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="message-content">
                <span class="success-icon">✓</span>
                <span>Thank you for your message! We'll get back to you within 24 hours.</span>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 4000);
    }

    // Error message function
    function showErrorMessage(text) {
        const message = document.createElement('div');
        message.className = 'error-message';
        message.innerHTML = `
            <div class="message-content">
                <span class="error-icon">⚠</span>
                <span>${text}</span>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }

    // Add hover effects and animations
    const featureCards = document.querySelectorAll('.feature-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate cards on scroll
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Blog cards animation
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // Testimonial cards animation
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Add loading animation to DPI display
    function animateDPIDisplay() {
        const dpiValue = document.getElementById('dpi-value');
        if (dpiValue && !isTestingActive) {
            dpiValue.style.transform = 'scale(1.1)';
            setTimeout(() => {
                dpiValue.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // Add subtle animations to enhance user experience
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border: 2px solid #ef4444 !important;
            background-color: #fef2f2 !important;
        }
        
        .feature-card, .blog-card, .testimonial-card {
            transition: opacity 0.6s ease, transform 0.6s ease !important;
        }
        
        #dpi-value {
            transition: transform 0.15s ease;
        }
        
        .test-area {
            transition: all 0.3s ease, transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);

    console.log('MouseDPI Pro initialized successfully!');
});

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat().format(Math.round(num));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}