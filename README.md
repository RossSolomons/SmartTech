# SmartTech Landing Page

A modern, responsive landing page for SmartTech - a student-led tech startup offering professional services.

## Services Offered

- **CV Creation** - Professional, ATS-friendly resumes
- **Cover Letters** - Compelling cover letters tailored to specific jobs
- **LinkedIn Setup** - Complete profile optimization and networking strategies
- **Email Signatures** - Professional email signatures for brand consistency
- **Business Cards** - Modern, eye-catching business card designs
- **Flyers & Marketing** - Creative promotional materials
- **Phone Support** - Technical support for smartphones
- **Laptop Support** - Comprehensive laptop technical assistance

## Features

- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Modern, professional UI with smooth animations
- 📧 Contact form with service selection
- 🚀 Fast loading and optimized performance
- ♿ Accessible design following best practices
- 🔧 Easy to modify and extend
- 💬 **Interactive service modals** with custom questionnaires
- 📋 **Service-specific forms** that collect relevant information
- ✨ **Smooth animations** and professional user experience

## File Structure

```
SmartTech/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Getting Started

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **Local development**: Use a local server for the best experience:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

## Customization Guide

### Adding New Services

1. **HTML**: Add a new service card in the services section:
```html
<div class="service-card">
    <div class="service-icon">
        <i class="fas fa-your-icon"></i>
    </div>
    <h3>Service Name</h3>
    <p>Service description...</p>
    <ul class="service-features">
        <li>Feature 1</li>
        <li>Feature 2</li>
        <li>Feature 3</li>
    </ul>
</div>
```

2. **Contact Form**: Add the new service to the dropdown:
```html
<option value="new-service">New Service</option>
```

### Changing Colors

Main colors are defined in CSS variables. Update these in `styles.css`:
- Primary blue: `#2563eb`
- Dark text: `#1e293b`
- Light text: `#64748b`
- Background: `#f8fafc`

### Adding Sections

1. Add new section HTML after existing sections
2. Update navigation menu with new link
3. Add corresponding styles in CSS
4. Update JavaScript for smooth scrolling

### Contact Information

Update contact details in the contact section:
- Email: Change `hello@smarttech.com`
- Phone: Change `+1 (555) 123-4567`
- Hours: Modify business hours

### Customizing Service Modal Questions

Each service has its own set of relevant questions. To modify them:

1. **Edit questions**: In `script.js`, find the `getServiceData()` method
2. **Question types available**:
   - `text` - Single line text input
   - `textarea` - Multi-line text input
   - `select` - Dropdown selection
   - `checkbox` - Multiple choice checkboxes

3. **Example question structure**:
```javascript
{
    text: 'Your question text',
    type: 'select', // or 'text', 'textarea', 'checkbox'
    required: true, // optional, makes field required
    placeholder: 'Placeholder text', // for text/textarea
    options: [ // for select/checkbox types
        { value: 'option1', text: 'Display Text 1' },
        { value: 'option2', text: 'Display Text 2' }
    ]
}
```

4. **Adding new services**:
   - Add service data to `serviceConfigs` object
   - Create corresponding service card in HTML
   - Questions will automatically generate in modal

### Modal Customization

**Styling**: Modify modal appearance in `styles.css`:
- `.modal` - Overall modal backdrop
- `.modal-content` - Modal window
- `.modal-header` - Header with title and close button
- `.service-questions` - Questions container
- `.checkbox-item` - Checkbox styling

**Behavior**: Customize in `script.js`:
- `openModal()` - Modal opening logic
- `generateQuestions()` - Dynamic form generation
- `submitForm()` - Form submission handling

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance

- Optimized images and fonts
- Minimal JavaScript
- CSS animations for smooth interactions
- Lazy loading ready

## Future Enhancements

The codebase is prepared for:
- 🔍 Search functionality for services
- 💬 Testimonials carousel
- 📊 Analytics integration
- 🛒 E-commerce integration
- 📝 Blog section
- 👥 Team member profiles
- 📈 Portfolio showcase

## Deployment

### GitHub Pages
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select source branch
4. Your site will be available at `https://yourusername.github.io/smarttech`

### Netlify
1. Drag and drop the folder to Netlify
2. Or connect your GitHub repository
3. Automatic deployments on every push

### Other Platforms
Works with any static hosting service:
- Vercel
- Firebase Hosting
- AWS S3
- Digital Ocean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different devices
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, contact us through:
- Email: hello@smarttech.com
- Phone: +1 (555) 123-4567

---

Built with ❤️ by the SmartTech team
