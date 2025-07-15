// Service Modal System
class ServiceModal {
    constructor() {
        this.modal = document.getElementById('serviceModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.serviceQuestions = document.getElementById('serviceQuestions');
        this.serviceForm = document.getElementById('serviceForm');
        this.closeBtn = document.querySelector('.close');
        this.cancelBtn = document.getElementById('cancelBtn');
        
        this.currentService = null;
        this.init();
    }

    init() {
        // Add click listeners to service buttons
        document.querySelectorAll('.service-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const serviceCard = e.target.closest('.service-card');
                const serviceType = serviceCard.dataset.service;
                this.openModal(serviceType);
            });
        });

        // Add click listeners to service cards (entire card clickable)
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', () => {
                const serviceType = card.dataset.service;
                this.openModal(serviceType);
            });
        });

        // Modal close events
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });

        // Form submission
        this.serviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
    }

    openModal(serviceType) {
        this.currentService = serviceType;
        const serviceData = this.getServiceData(serviceType);
        
        this.modalTitle.textContent = serviceData.title;
        this.generateQuestions(serviceData.questions);
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = this.serviceForm.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.serviceForm.reset();
        this.serviceQuestions.innerHTML = '';
    }

    generateQuestions(questions) {
        this.serviceQuestions.innerHTML = '<h4>Service-Specific Questions</h4>';
        
        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-group';
            
            const label = document.createElement('label');
            label.textContent = question.text + (question.required ? ' *' : '');
            label.setAttribute('for', `question_${index}`);
            questionDiv.appendChild(label);

            let input;
            
            switch (question.type) {
                case 'text':
                    input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = question.placeholder || '';
                    if (question.required) input.required = true;
                    break;
                    
                case 'textarea':
                    input = document.createElement('textarea');
                    input.rows = 3;
                    input.placeholder = question.placeholder || '';
                    if (question.required) input.required = true;
                    break;
                    
                case 'select':
                    input = document.createElement('select');
                    if (question.required) input.required = true;
                    
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Please select...';
                    input.appendChild(defaultOption);
                    
                    question.options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.value;
                        optionElement.textContent = option.text;
                        input.appendChild(optionElement);
                    });
                    break;
                    
                case 'checkbox':
                    const checkboxContainer = document.createElement('div');
                    checkboxContainer.className = 'checkbox-group';
                    
                    question.options.forEach((option, optIndex) => {
                        const checkboxItem = document.createElement('div');
                        checkboxItem.className = 'checkbox-item';
                        
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = `question_${index}_${optIndex}`;
                        checkbox.name = `question_${index}`;
                        checkbox.value = option.value;
                        
                        const checkboxLabel = document.createElement('label');
                        checkboxLabel.textContent = option.text;
                        checkboxLabel.setAttribute('for', checkbox.id);
                        
                        checkboxItem.appendChild(checkbox);
                        checkboxItem.appendChild(checkboxLabel);
                        checkboxContainer.appendChild(checkboxItem);
                        
                        // Add visual feedback for checkboxes
                        checkbox.addEventListener('change', () => {
                            if (checkbox.checked) {
                                checkboxItem.classList.add('checked');
                            } else {
                                checkboxItem.classList.remove('checked');
                            }
                        });
                    });
                    
                    questionDiv.appendChild(checkboxContainer);
                    this.serviceQuestions.appendChild(questionDiv);
                    return; // Skip the regular input append
            }
            
            if (input) {
                input.id = `question_${index}`;
                input.name = `question_${index}`;
                questionDiv.appendChild(input);
            }
            
            this.serviceQuestions.appendChild(questionDiv);
        });
    }

    submitForm() {
        const formData = new FormData(this.serviceForm);
        const data = {
            service: this.currentService,
            responses: {},
            clientInfo: {}
        };

        // Collect client information
        data.clientInfo.name = formData.get('clientName');
        data.clientInfo.email = formData.get('clientEmail');
        data.clientInfo.phone = formData.get('clientPhone');
        data.clientInfo.timeline = formData.get('timeline');
        data.clientInfo.budget = formData.get('budget');
        data.clientInfo.additionalInfo = formData.get('additionalInfo');

        // Collect service-specific responses
        const serviceData = this.getServiceData(this.currentService);
        serviceData.questions.forEach((question, index) => {
            if (question.type === 'checkbox') {
                const checkboxes = this.serviceForm.querySelectorAll(`input[name="question_${index}"]:checked`);
                data.responses[`question_${index}`] = Array.from(checkboxes).map(cb => cb.value);
            } else {
                data.responses[`question_${index}`] = formData.get(`question_${index}`);
            }
        });

        // In a real application, send this data to your server
        console.log('Form submission data:', data);
        
        // Show success message
        alert(`Thank you for your ${this.getServiceData(this.currentService).title} request! We'll get back to you within 24 hours with a detailed quote.`);
        
        this.closeModal();
    }

    getServiceData(serviceType) {
        const serviceConfigs = {
            'cv-creation': {
                title: 'CV Creation Service',
                questions: [
                    {
                        text: 'What industry/field are you targeting?',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'tech', text: 'Technology/IT' },
                            { value: 'finance', text: 'Finance/Banking' },
                            { value: 'healthcare', text: 'Healthcare' },
                            { value: 'education', text: 'Education' },
                            { value: 'marketing', text: 'Marketing/Sales' },
                            { value: 'engineering', text: 'Engineering' },
                            { value: 'creative', text: 'Creative/Design' },
                            { value: 'other', text: 'Other' }
                        ]
                    },
                    {
                        text: 'Current career level',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'student', text: 'Student/Recent Graduate' },
                            { value: 'entry', text: 'Entry Level (0-2 years)' },
                            { value: 'mid', text: 'Mid Level (3-7 years)' },
                            { value: 'senior', text: 'Senior Level (8+ years)' },
                            { value: 'executive', text: 'Executive/Leadership' }
                        ]
                    },
                    {
                        text: 'Do you have an existing CV/Resume?',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'none', text: 'No, starting from scratch' },
                            { value: 'outdated', text: 'Yes, but it needs major updates' },
                            { value: 'recent', text: 'Yes, just needs minor tweaks' }
                        ]
                    },
                    {
                        text: 'Special requirements',
                        type: 'checkbox',
                        options: [
                            { value: 'ats', text: 'ATS-optimized formatting' },
                            { value: 'creative', text: 'Creative/visual design' },
                            { value: 'academic', text: 'Academic format' },
                            { value: 'international', text: 'International format' },
                            { value: 'portfolio', text: 'Include portfolio section' }
                        ]
                    },
                    {
                        text: 'Tell us about your key achievements or experiences',
                        type: 'textarea',
                        placeholder: 'Briefly describe your main accomplishments, skills, or experiences you want highlighted...',
                        required: true
                    }
                ]
            },
            'cover-letters': {
                title: 'Cover Letter Writing Service',
                questions: [
                    {
                        text: 'Do you have a specific job posting in mind?',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'specific', text: 'Yes, for a specific job application' },
                            { value: 'general', text: 'No, I need a general template' },
                            { value: 'multiple', text: 'Multiple positions in same field' }
                        ]
                    },
                    {
                        text: 'Company name (if specific)',
                        type: 'text',
                        placeholder: 'Enter company name if applying to specific job'
                    },
                    {
                        text: 'Job title/position',
                        type: 'text',
                        placeholder: 'e.g., Software Developer, Marketing Manager',
                        required: true
                    },
                    {
                        text: 'What makes you interested in this role/company?',
                        type: 'textarea',
                        placeholder: 'Share your motivation and what attracts you to this opportunity...',
                        required: true
                    },
                    {
                        text: 'Key skills/experiences to highlight',
                        type: 'textarea',
                        placeholder: 'What specific skills or experiences make you a great fit for this role?',
                        required: true
                    },
                    {
                        text: 'Cover letter style preference',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'professional', text: 'Professional/Formal' },
                            { value: 'conversational', text: 'Conversational/Friendly' },
                            { value: 'creative', text: 'Creative/Unique' },
                            { value: 'technical', text: 'Technical/Detailed' }
                        ]
                    }
                ]
            },
            'linkedin-setup': {
                title: 'LinkedIn Profile Setup',
                questions: [
                    {
                        text: 'Do you have an existing LinkedIn profile?',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'none', text: 'No, need to create from scratch' },
                            { value: 'basic', text: 'Yes, but very basic/incomplete' },
                            { value: 'existing', text: 'Yes, but needs optimization' }
                        ]
                    },
                    {
                        text: 'Primary goal for LinkedIn',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'job-search', text: 'Job searching' },
                            { value: 'networking', text: 'Professional networking' },
                            { value: 'business', text: 'Business development' },
                            { value: 'thought-leadership', text: 'Thought leadership' },
                            { value: 'recruitment', text: 'Recruiting talent' }
                        ]
                    },
                    {
                        text: 'Services needed',
                        type: 'checkbox',
                        options: [
                            { value: 'headline', text: 'Professional headline optimization' },
                            { value: 'summary', text: 'About section writing' },
                            { value: 'experience', text: 'Experience section optimization' },
                            { value: 'skills', text: 'Skills and endorsements setup' },
                            { value: 'photo', text: 'Profile photo guidance' },
                            { value: 'strategy', text: 'Content and networking strategy' }
                        ]
                    },
                    {
                        text: 'Target audience/industry',
                        type: 'text',
                        placeholder: 'Who do you want to connect with? (e.g., HR managers, tech leaders, etc.)',
                        required: true
                    },
                    {
                        text: 'Current professional summary or bio',
                        type: 'textarea',
                        placeholder: 'Share your current bio or how you would describe your professional background...'
                    }
                ]
            },
            'email-signatures': {
                title: 'Email Signature Design',
                questions: [
                    {
                        text: 'Email signature purpose',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'personal', text: 'Personal/Professional use' },
                            { value: 'business', text: 'Business/Company use' },
                            { value: 'freelance', text: 'Freelance/Consultant' },
                            { value: 'student', text: 'Student/Academic' }
                        ]
                    },
                    {
                        text: 'Information to include',
                        type: 'checkbox',
                        options: [
                            { value: 'name', text: 'Full name' },
                            { value: 'title', text: 'Job title/position' },
                            { value: 'company', text: 'Company name' },
                            { value: 'phone', text: 'Phone number' },
                            { value: 'website', text: 'Website URL' },
                            { value: 'social', text: 'Social media links' },
                            { value: 'address', text: 'Business address' },
                            { value: 'logo', text: 'Company/personal logo' }
                        ]
                    },
                    {
                        text: 'Design style preference',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'minimal', text: 'Minimal/Clean' },
                            { value: 'modern', text: 'Modern/Colorful' },
                            { value: 'professional', text: 'Traditional/Professional' },
                            { value: 'creative', text: 'Creative/Unique' }
                        ]
                    },
                    {
                        text: 'Brand colors (if any)',
                        type: 'text',
                        placeholder: 'Hex codes or color names (e.g., #1a73e8, blue)'
                    },
                    {
                        text: 'Special requirements',
                        type: 'textarea',
                        placeholder: 'Any specific requirements or elements you want included?'
                    }
                ]
            },
            'business-cards': {
                title: 'Business Card Design',
                questions: [
                    {
                        text: 'Business card purpose',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'professional', text: 'Professional networking' },
                            { value: 'business', text: 'Business promotion' },
                            { value: 'personal', text: 'Personal branding' },
                            { value: 'event', text: 'Event/Conference use' },
                            { value: 'student', text: 'Student networking' }
                        ]
                    },
                    {
                        text: 'Information to include',
                        type: 'checkbox',
                        options: [
                            { value: 'name', text: 'Name' },
                            { value: 'title', text: 'Job title/position' },
                            { value: 'company', text: 'Company name' },
                            { value: 'phone', text: 'Phone number' },
                            { value: 'email', text: 'Email address' },
                            { value: 'website', text: 'Website' },
                            { value: 'social', text: 'Social media' },
                            { value: 'address', text: 'Address' },
                            { value: 'logo', text: 'Logo/branding' }
                        ]
                    },
                    {
                        text: 'Design style preference',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'minimalist', text: 'Minimalist/Clean' },
                            { value: 'modern', text: 'Modern/Trendy' },
                            { value: 'classic', text: 'Classic/Traditional' },
                            { value: 'creative', text: 'Creative/Artistic' },
                            { value: 'luxury', text: 'Luxury/Premium' }
                        ]
                    },
                    {
                        text: 'Preferred colors/theme',
                        type: 'text',
                        placeholder: 'Describe your color preferences or brand colors'
                    },
                    {
                        text: 'Quantity needed',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'design-only', text: 'Design file only' },
                            { value: '100', text: '100 cards' },
                            { value: '250', text: '250 cards' },
                            { value: '500', text: '500 cards' },
                            { value: '1000', text: '1000+ cards' }
                        ]
                    }
                ]
            },
            'flyers-marketing': {
                title: 'Flyers & Marketing Materials',
                questions: [
                    {
                        text: 'Type of material needed',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'flyer', text: 'Event flyer' },
                            { value: 'poster', text: 'Poster' },
                            { value: 'brochure', text: 'Brochure/Pamphlet' },
                            { value: 'banner', text: 'Banner/Sign' },
                            { value: 'social', text: 'Social media graphics' },
                            { value: 'presentation', text: 'Presentation slides' }
                        ]
                    },
                    {
                        text: 'Purpose/Event type',
                        type: 'text',
                        placeholder: 'e.g., University event, business promotion, workshop, etc.',
                        required: true
                    },
                    {
                        text: 'Key information to include',
                        type: 'textarea',
                        placeholder: 'Event details, dates, contact info, key messages, etc.',
                        required: true
                    },
                    {
                        text: 'Design style preference',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'professional', text: 'Professional/Corporate' },
                            { value: 'fun', text: 'Fun/Casual' },
                            { value: 'academic', text: 'Academic/Educational' },
                            { value: 'creative', text: 'Creative/Artistic' },
                            { value: 'minimal', text: 'Minimal/Clean' }
                        ]
                    },
                    {
                        text: 'Dimensions/Format',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'a4', text: 'A4 (8.5" x 11")' },
                            { value: 'a5', text: 'A5 (5.8" x 8.3")' },
                            { value: 'letter', text: 'Letter size' },
                            { value: 'square', text: 'Square format' },
                            { value: 'social-media', text: 'Social media sizes' },
                            { value: 'custom', text: 'Custom size' }
                        ]
                    },
                    {
                        text: 'Additional requirements',
                        type: 'textarea',
                        placeholder: 'Specific colors, fonts, images, or other requirements...'
                    }
                ]
            },
            'phone-support': {
                title: 'Phone Technical Support',
                questions: [
                    {
                        text: 'Phone brand and model',
                        type: 'text',
                        placeholder: 'e.g., iPhone 14, Samsung Galaxy S23, Google Pixel 7',
                        required: true
                    },
                    {
                        text: 'Operating system version (if known)',
                        type: 'text',
                        placeholder: 'e.g., iOS 16, Android 13'
                    },
                    {
                        text: 'Type of issue/support needed',
                        type: 'checkbox',
                        options: [
                            { value: 'setup', text: 'Initial setup/activation' },
                            { value: 'apps', text: 'App installation/issues' },
                            { value: 'email', text: 'Email setup' },
                            { value: 'wifi', text: 'WiFi/connectivity issues' },
                            { value: 'storage', text: 'Storage/memory problems' },
                            { value: 'backup', text: 'Backup and sync' },
                            { value: 'security', text: 'Security/privacy settings' },
                            { value: 'performance', text: 'Performance optimization' },
                            { value: 'transfer', text: 'Data transfer' },
                            { value: 'other', text: 'Other issues' }
                        ]
                    },
                    {
                        text: 'Describe the problem in detail',
                        type: 'textarea',
                        placeholder: 'Please describe what issues you are experiencing...',
                        required: true
                    },
                    {
                        text: 'Preferred support method',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'remote', text: 'Remote support (screen sharing)' },
                            { value: 'phone', text: 'Phone call guidance' },
                            { value: 'inperson', text: 'In-person support' },
                            { value: 'email', text: 'Email instructions' }
                        ]
                    },
                    {
                        text: 'Urgency level',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'low', text: 'Low - Can wait a few days' },
                            { value: 'medium', text: 'Medium - Within 24 hours' },
                            { value: 'high', text: 'High - Same day' },
                            { value: 'urgent', text: 'Urgent - ASAP' }
                        ]
                    }
                ]
            },
            'laptop-support': {
                title: 'Laptop Technical Support',
                questions: [
                    {
                        text: 'Laptop brand and model',
                        type: 'text',
                        placeholder: 'e.g., MacBook Air M2, Dell XPS 13, HP Pavilion',
                        required: true
                    },
                    {
                        text: 'Operating system',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'windows11', text: 'Windows 11' },
                            { value: 'windows10', text: 'Windows 10' },
                            { value: 'macos', text: 'macOS' },
                            { value: 'linux', text: 'Linux' },
                            { value: 'chromeos', text: 'Chrome OS' },
                            { value: 'unknown', text: 'Not sure' }
                        ]
                    },
                    {
                        text: 'Type of support needed',
                        type: 'checkbox',
                        options: [
                            { value: 'setup', text: 'Initial setup/configuration' },
                            { value: 'software', text: 'Software installation' },
                            { value: 'performance', text: 'Performance optimization' },
                            { value: 'virus', text: 'Virus/malware removal' },
                            { value: 'updates', text: 'System updates' },
                            { value: 'backup', text: 'Data backup setup' },
                            { value: 'network', text: 'Network/WiFi issues' },
                            { value: 'email', text: 'Email setup' },
                            { value: 'printing', text: 'Printer setup' },
                            { value: 'recovery', text: 'Data recovery' },
                            { value: 'training', text: 'General training/tutorials' }
                        ]
                    },
                    {
                        text: 'Describe the issue or requirements',
                        type: 'textarea',
                        placeholder: 'Please describe what you need help with in detail...',
                        required: true
                    },
                    {
                        text: 'Preferred support method',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'remote', text: 'Remote support (screen sharing)' },
                            { value: 'inperson', text: 'In-person support' },
                            { value: 'phone', text: 'Phone guidance' },
                            { value: 'email', text: 'Email instructions' }
                        ]
                    },
                    {
                        text: 'Experience level',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'beginner', text: 'Beginner - Need step-by-step help' },
                            { value: 'intermediate', text: 'Intermediate - Comfortable with basics' },
                            { value: 'advanced', text: 'Advanced - Just need technical guidance' }
                        ]
                    },
                    {
                        text: 'Urgency level',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'low', text: 'Low - Can wait a few days' },
                            { value: 'medium', text: 'Medium - Within 24 hours' },
                            { value: 'high', text: 'High - Same day' },
                            { value: 'urgent', text: 'Urgent - ASAP' }
                        ]
                    }
                ]
            }
        };

        return serviceConfigs[serviceType] || { title: 'Service Request', questions: [] };
    }
}

// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const service = this.querySelector('select').value;
    const message = this.querySelector('textarea').value;
    
    // Basic validation
    if (!name || !email || !service || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show success message (in a real app, you'd send this to a server)
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    
    // Reset form
    this.reset();
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.service-card, .about-text, .about-image, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    const speed = 200; // Animation speed

    counters.forEach(counter => {
        const target = parseInt(counter.innerText.replace('+', ''));
        let count = 0;
        const increment = target / speed;

        const updateCount = () => {
            if (count < target) {
                count += increment;
                if (counter.innerText.includes('+')) {
                    counter.innerText = Math.ceil(count) + '+';
                } else {
                    counter.innerText = Math.ceil(count);
                }
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = counter.innerText; // Keep original format
            }
        };

        updateCount();
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below if you want the typing effect
        // typeWriter(heroTitle, originalText, 80);
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (heroGraphic) {
        heroGraphic.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add search functionality (for future use)
function initializeSearch() {
    const searchInput = document.getElementById('search');
    const services = document.querySelectorAll('.service-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            services.forEach(service => {
                const title = service.querySelector('h3').textContent.toLowerCase();
                const description = service.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    service.style.display = 'block';
                } else {
                    service.style.display = 'none';
                }
            });
        });
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);

// Add testimonials carousel (for future expansion)
class TestimonialCarousel {
    constructor(selector) {
        this.carousel = document.querySelector(selector);
        this.slides = [];
        this.currentSlide = 0;
        this.init();
    }
    
    init() {
        if (!this.carousel) return;
        
        this.slides = this.carousel.querySelectorAll('.testimonial-slide');
        this.createNavigation();
        this.showSlide(0);
        this.startAutoplay();
    }
    
    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'testimonial-nav';
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'nav-dot';
            dot.addEventListener('click', () => this.showSlide(index));
            nav.appendChild(dot);
        });
        
        this.carousel.appendChild(nav);
    }
    
    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        const dots = this.carousel.querySelectorAll('.nav-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }
    
    startAutoplay() {
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
}

// Initialize service modal system
document.addEventListener('DOMContentLoaded', () => {
    new ServiceModal();
    
    // Initialize testimonial carousel if it exists
    new TestimonialCarousel('.testimonials-carousel');
});
