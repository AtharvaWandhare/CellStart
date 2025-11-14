# NAD+ Transformation Timeline Carousel

## Overview
A premium, fully responsive carousel timeline showcasing the NAD+ transformation journey. Features large, engaging cards with peek effect, progressive line animation, swipe navigation, clickable dots, and intuitive button controls. Fully customizable through the theme editor.

## Files Created
1. **Section File**: `sections/nad-transformation-timeline.liquid`
2. **Stylesheet**: `assets/nad-transformation-timeline-carousel.css`
3. **Backup**: `sections/nad-transformation-timeline-old.liquid` (previous grid version)

## Features

### ✨ Premium Carousel Design
- **Full-Width Cards**: Each card takes ~75-85% of viewport with next card peeking
- **Progressive Timeline**: Line fills from gray to colored gradient as you navigate
- **Multiple Navigation Methods**:
  - Left/Right arrow buttons
  - Clickable timeline dots
  - Swipe/touch gestures
  - Direct scroll
  - Keyboard (arrow keys)
- **Active State**: Current card scales up and gets full opacity
- **Smooth Transitions**: Elegant animations between states

### 🎨 Enhanced Visual Design
- **Larger Images**: Up to 800px width, better visibility
- **Bigger Text**: 
  - Period: 16-18px uppercase
  - Title: 22-34px bold
  - Description: 16-18px with improved line height
- **Premium Cards**: Rounded corners, gradient top border, shadow depth
- **Animated Dots**: Pulsing effect on active milestone

### 📱 Fully Responsive
- **Desktop (990px+)**: Cards at 75% width, large images (36rem max height)
- **Tablet (750-989px)**: Cards at 82% width, medium images (32rem)
- **Mobile (<750px)**: Cards at 85% width, optimized images (28rem)

### 🎯 Interactive Features
- **Navigation Buttons**: Positioned on left/right, disabled at endpoints
- **Clickable Timeline Dots**: Jump to any milestone instantly
- **Swipe Support**: Touch-friendly drag navigation
- **Scroll Sync**: Auto-updates progress as you scroll
- **Keyboard Accessible**: Arrow keys navigate milestones

### 🎨 Theme Editor Customization
All content is editable through Shopify's theme editor:

#### Section Settings
- **Heading**: Main section title
- **Heading Size**: Small (h2), Medium (h1), Large (h0)
- **Subheading**: Supporting description text
- **Color Scheme**: Integrates with Dawn theme color schemes
- **Padding**: Top and bottom padding controls (0-100px)

#### Block Settings (Timeline Milestones)
- **Time Period**: e.g., "Within Days", "Within Weeks"
- **Title**: Milestone headline
- **Description**: Rich text editor for detailed content
- **Icon**: Custom SVG icon code

## How to Use

### Adding to Product Page
1. Go to Shopify Admin → Online Store → Themes
2. Click "Customize" on your Dawn theme
3. Navigate to a product page
4. Click "Add section"
5. Select "NAD+ Timeline"
6. The section comes pre-loaded with 4 milestones

### Customizing Content
1. Click on the section to open settings
2. Edit heading, subheading, and padding
3. Click on individual milestone blocks to edit:
   - Change time period labels
   - Update titles and descriptions
   - Customize icons (paste SVG code)
4. Add or remove milestone blocks as needed
5. Reorder blocks by dragging

### Reordering Milestones
- Simply drag and drop timeline milestone blocks in the theme editor
- The visual timeline automatically adjusts

## Pre-loaded Content

The section includes 4 default milestones:

1. **Within Days** - Energy Foundation
   - Initial cellular NAD+ availability boost

2. **Within Weeks** - Noticeable Changes
   - Reduced fatigue, improved stamina & focus

3. **Within Months** - Enhanced Vitality
   - Increased endurance, skin health support

4. **1 Year and Beyond** - Long-Term Benefits
   - Sustained protection against oxidative stress

## Styling Details

### Brand Integration
Uses existing brand CSS variables from `globals.css`:
- `--font-family-heading` (Cabin)
- `--font-family-body` (Source Sans 3)
- `--font-family-marketing` (Poppins)
- `--color-primary` (#0258A6)
- `--color-secondary` (#2872B4)
- `--color-heading` (#002f5c)
- `--color-body-text` (#0057a6)

### Key Animations
- **Fade In Up**: Milestones appear with upward motion
- **Pulse Effect**: Continuous pulsing on timeline markers
- **Progress Line**: Animated timeline fill on page load
- **Hover Effects**: Cards lift and glow on interaction

### Accessibility Features
- Semantic HTML structure
- ARIA-friendly markup via Shopify attributes
- Reduced motion support for users with motion sensitivity
- High contrast mode compatibility
- Keyboard navigation friendly
- Screen reader optimized

## Customization Tips

### Changing Colors
Edit CSS variables in `nad-transformation-timeline.css`:
```css
.nad-marker-dot {
  background: linear-gradient(135deg, 
    var(--color-primary, #0258A6) 0%, 
    var(--color-secondary, #2872B4) 100%);
}
```

### Adjusting Timing
Modify animation durations in CSS:
```css
animation: fadeInUp 0.8s ease-out backwards;
```

### Icon Resources
Get free SVG icons from:
- [Heroicons](https://heroicons.com/)
- [Feather Icons](https://feathericons.com/)
- [Phosphor Icons](https://phosphoricons.com/)

Simply copy the SVG code and paste into the Icon field.

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Fully optimized

## Performance
- **Lightweight CSS**: ~500 lines of optimized code
- **No JavaScript**: Pure CSS animations
- **Lazy Loading**: Compatible with Shopify's lazy loading
- **Print Optimized**: Includes print-specific styles

## Troubleshooting

### Timeline line not showing on mobile
This is intentional - the line is hidden on mobile for better readability.

### Animations not working
Check if user has "Reduce Motion" enabled in accessibility settings. The section respects this preference.

### Icons not displaying
Ensure SVG code is complete and properly formatted. Test SVG in a validator first.

### Content not centered
Check if theme has conflicting CSS. May need to adjust `.page-width` container.

## Future Enhancements
Consider adding:
- Image support for milestones
- Video embeds
- Counter animations for statistics
- Alternative vertical layout option
- Dark mode toggle

## Support
For issues or questions, refer to:
- Shopify Dawn Theme Documentation
- Liquid Template Documentation
- CSS Custom Properties Guide

---

**Version**: 1.0  
**Compatible With**: Shopify Dawn Theme  
**Last Updated**: November 2025
